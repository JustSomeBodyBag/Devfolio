import { useState, useEffect, useCallback } from "react";
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

const BASE_URL = "http://localhost:8000/admin/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Project[]>(`${BASE_URL}`);
      // Сортируем по order (сначала по order, потом по updated_at)
      const sorted = response.data.sort((a, b) => {
        if (a.order !== b.order) return (a.order ?? 0) - (b.order ?? 0);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      setProjects(sorted);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = () => fetchProjects();

  const reorderProjects = async (newOrder: Project[]) => {
    setProjects(newOrder);
    try {
      await axios.post(
        `${BASE_URL}/reorder`,
        newOrder.map((p) => p.id),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      setError(err);
      await fetchProjects();
      throw err;
    }
  };

  const deleteScreenshot = async (id: number) => {
    await axios.delete(`${BASE_URL}/${id}/screenshot`);
    await fetchProjects();
  };

  return {
    projects,
    isLoading,
    error,
    refreshProjects,
    reorderProjects,
    deleteScreenshot,
  };
}
