import React, { useState } from "react";
import ProjectUploader from "./ProjectUploader";
import { useProjects, type Project } from "../../../context/ProjectsContext";

interface ProjectItemProps {
  project: Project;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, dragHandleProps }) => {
  const { deleteScreenshot, refreshProjects } = useProjects();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteScreenshot = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (deleting) return;

    setDeleting(true);
    try {
      await deleteScreenshot(project.id);
      await refreshProjects();
    } catch (err) {
      console.error("Ошибка при удалении скриншота", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="project-item p-5 rounded-lg shadow-lg hover:shadow-2xl bg-white dark:bg-gray-900 transition-shadow duration-300">
      <div className="flex gap-6">
        <img
          src={
            project.screenshot_url
              ? `http://localhost:8000/${project.screenshot_url}`
              : "/default-thumbnail.png"
          }
          alt={`${project.name} thumbnail`}
          className="w-[150px] h-[100px] rounded-lg border border-gray-300 dark:border-gray-700 object-cover shadow-sm"
        />

        <div className="flex flex-col flex-grow">
          <h3
            {...dragHandleProps}
            className="text-2xl font-semibold mb-2 cursor-move select-none text-gray-900 dark:text-gray-100"
            title="Перетащите для сортировки"
          >
            {project.name}
          </h3>

          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-grow">
            {project.description}
          </p>

          {project.screenshot_url && (
            <button
              onClick={handleDeleteScreenshot}
              disabled={deleting}
              onMouseDown={(e) => e.stopPropagation()}
              className={`mt-4 self-start text-sm font-medium underline transition-colors ${
                deleting ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800"
              }`}
              type="button"
            >
              {deleting ? "Удаление..." : "Удалить скриншот"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <ProjectUploader projectId={project.id} onUploadComplete={refreshProjects} />
      </div>
    </div>
  );
};

export default ProjectItem;
