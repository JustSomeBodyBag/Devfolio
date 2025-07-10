import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Project {
  id: number;
  name: string;
  description: string;
  screenshot_url?: string | null;
  thumbnailUrl?: string | null;
  screenshot_preview_url?: string | null;
}


interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  refreshProjects: () => Promise<void>;
  reorderProjects: (newOrder: Project[]) => Promise<void>;
  deleteScreenshot: (projectId: number) => Promise<void>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/github/projects");
      if (!res.ok) throw new Error(`Ошибка загрузки проектов: ${res.statusText}`);

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Неверный формат данных");

      const formatted: Project[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        screenshot_url: item.screenshot_url || null,
        thumbnailUrl: item.screenshot_url || null,
        screenshot_preview_url: null,
      }));

      setProjects(formatted);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reorderProjects = async (newOrder: Project[]) => {
    setProjects(newOrder);
    // TODO: отправить новый порядок на сервер, если нужно
  };

  const deleteScreenshot = async (projectId: number) => {
    const res = await fetch(`http://localhost:8000/github/projects/${projectId}/screenshot`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Ошибка при удалении скриншота");
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        error,
        refreshProjects,
        reorderProjects,
        deleteScreenshot,
        setProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
