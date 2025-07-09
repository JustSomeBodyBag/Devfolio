// context/ProjectsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  updated_at: string;
  order?: number;
  screenshot_url?: string | null;
  screenshot_preview_url?: string | null;
};

type ProjectsContextType = {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  refreshProjects: () => Promise<void>;
  reorderProjects: (newOrder: Project[]) => Promise<void>;
  deleteScreenshot: (id: number) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const token = localStorage.getItem("token") || "";

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Project[]>("http://localhost:8000/github/projects", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      // Используем порядок с сервера (без дополнительной сортировки)
      setProjects(response.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = () => fetchProjects();

  const reorderProjects = async (newOrder: Project[]) => {
    setProjects(newOrder);
    try {
      await axios.post(
        "http://localhost:8000/admin/projects/reorder",
        newOrder.map((p) => p.id),
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
    } catch (err: any) {
      setError(err);
      await fetchProjects();
    }
  };

  const deleteScreenshot = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/admin/projects/${id}/screenshot`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      await fetchProjects();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, isLoading, error, refreshProjects, reorderProjects, deleteScreenshot }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
