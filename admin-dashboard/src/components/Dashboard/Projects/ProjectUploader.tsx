import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../../api/axios";

interface Props {
  projectId: number;
  onUploadComplete?: () => void;
}

const ProjectUploader: React.FC<Props> = ({ projectId, onUploadComplete }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      setError(null);

      // Перед загрузкой спрашиваем подтверждение
      const confirmUpload = window.confirm("Вы точно хотите загрузить это изображение?");
      if (!confirmUpload) {
        // Если отмена, сбрасываем превью
        setPreview(null);
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        await api.post(`/admin/projects/${projectId}/upload-screenshot`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onUploadComplete?.();
        // Не закрываем превью автоматически, т.к. пользователь может захотеть его удалить вручную
      } catch (err: any) {
        setError(err.response?.data?.detail || "Ошибка при загрузке файла");
        // Можно оставить превью на случай ошибки, чтобы пользователь увидел что он пытался загрузить
      } finally {
        setUploading(false);
      }
    },
    [projectId, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleClosePreview = () => setPreview(null);

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center relative">
      <div
        {...getRootProps()}
        className={`p-6 cursor-pointer ${isDragActive ? "bg-blue-100" : "bg-white"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Отпустите изображение для загрузки</p>
        ) : (
          <p>Перетащите изображение или нажмите, чтобы выбрать</p>
        )}
      </div>

      {preview && (
  <div className="mt-4 relative inline-block">
    <img
      src={preview}
      alt="Превью загрузки"
      className="rounded shadow object-contain"
      style={{ maxWidth: 680, maxHeight: 400, width: "100%", height: "auto" }}
    />
    <button
      onClick={handleClosePreview}
      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition"
      aria-label="Закрыть превью"
      type="button"
    >
      ×
    </button>
  </div>
)}



      {uploading && <p className="text-blue-600 mt-2">Загрузка...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ProjectUploader;
