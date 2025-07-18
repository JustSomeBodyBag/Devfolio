import React, { useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import type { Project } from "../../../context/ProjectsContext";

interface RawProject {
  id: number;
  name: string;
  description?: string;
  screenshot_url?: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_URL}/github/projects`);
        if (!res.ok) throw new Error(`Ошибка загрузки проектов: ${res.statusText}`);

        const data: RawProject[] = await res.json();
        const formattedProjects: Project[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          screenshot_url: item.screenshot_url || null,
          thumbnailUrl: item.screenshot_url || null,
          screenshot_preview_url: null,
        }));

        setProjects(formattedProjects);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div>Загрузка проектов...</div>;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;

  return <ProjectList projects={projects} />;
};

export default Projects;
