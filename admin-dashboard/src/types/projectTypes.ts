export interface Project {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string | null;
  screenshot_preview_url?: string | null; // новое поле
}
