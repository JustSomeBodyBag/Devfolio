import React from "react";
import ProjectItem from "./ProjectItem";
import type { Project } from "../../../context/ProjectsContext";
import { useProjects } from "../../../context/ProjectsContext";
import { useAuth } from "../../../hooks/useAuth";  // Импортируем хук авторизации
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectListProps {
  projects: Project[];
}

interface SortableProjectItemProps {
  projectId: number;
}

const SortableProjectItem: React.FC<SortableProjectItemProps> = ({ projectId }) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: projectId.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <ProjectItem project={project} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const { isLoading, error, refreshProjects, reorderProjects } = useProjects();
  const { getToken } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id.toString() === active.id);
    const newIndex = projects.findIndex((p) => p.id.toString() === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(projects, oldIndex, newIndex);
    await reorderProjects(newOrder);
  };

  const handleFetchGithub = async () => {
    const token = getToken();
    if (!token) {
      alert("Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/github/fetch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      // После успешного обновления проектов обновляем список
      await refreshProjects();
    } catch (e) {
      alert("Ошибка при обновлении данных с GitHub.");
      console.error(e);
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Проекты</h1>
        <button
          onClick={handleFetchGithub}
          disabled={isLoading}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold transition"
          type="button"
        >
          {isLoading ? "Загрузка..." : "Обновить"}
        </button>
      </header>

      {error && (
        <p className="mb-6 p-4 bg-red-100 text-red-700 rounded">{`Ошибка: ${error.message}`}</p>
      )}
      {!isLoading && projects.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400">Проекты не найдены.</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id.toString())} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <SortableProjectItem key={project.id} projectId={project.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default ProjectList;
