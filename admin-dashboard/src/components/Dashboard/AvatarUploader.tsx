import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "../../api/axios";

interface Props {
  initialAvatarUrl?: string;
  onUploadComplete: (avatarUrl: string) => void;
  onUploadError: (message: string) => void;
}

interface UploadAvatarResponse {
  avatar_url: string;
}

const AvatarUploader: React.FC<Props> = ({ initialAvatarUrl, onUploadComplete, onUploadError }) => {
  const [preview, setPreview] = useState<string | null>(initialAvatarUrl || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(initialAvatarUrl || null);
  }, [initialAvatarUrl]);

  useEffect(() => {
    return () => {
      if (preview && preview !== initialAvatarUrl) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, initialAvatarUrl]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onUploadError("");

    if (!window.confirm("Вы точно хотите загрузить этот аватар?")) {
      setPreview(initialAvatarUrl || null);
      URL.revokeObjectURL(objectUrl);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<UploadAvatarResponse>("/homepage/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadComplete(response.data.avatar_url);
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ошибка при загрузке файла";
      onUploadError(message);
      setPreview(initialAvatarUrl || null);
    } finally {
      setUploading(false);
    }
  }, [initialAvatarUrl, onUploadComplete, onUploadError]);

  const removePreview = () => {
    if (!window.confirm("Удалить аватар?")) return;
    setPreview(null);
    onUploadComplete(""); // сообщаем родителю, что аватара нет
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center relative max-w-xs mx-auto">
      <div
        {...getRootProps()}
        className={`p-6 cursor-pointer rounded transition-colors ${
          isDragActive ? "bg-blue-100" : "bg-white"
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {isDragActive ? (
          <p className="text-blue-600 font-semibold">Отпустите изображение для загрузки</p>
        ) : (
          <p className={`${uploading ? "text-gray-400" : "text-gray-700"}`}>
            {uploading ? "Загрузка..." : "Перетащите файл или кликните для выбора аватара"}
          </p>
        )}
      </div>

      {preview ? (
        <div className="mt-4 relative inline-block">
          <img
            src={preview}
            alt="Превью аватара"
            className="rounded-full shadow object-cover"
            style={{ width: 120, height: 120 }}
          />
          {!uploading && (
            <button
              onClick={removePreview}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition"
              aria-label="Удалить аватар"
              type="button"
            >
              ×
            </button>
          )}
          {uploading && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full"
              aria-label="Идет загрузка аватара"
            >
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      ) : (
        uploading && (
          <p className="text-blue-600 mt-2 font-semibold">Загрузка...</p>
        )
      )}
    </div>
  );
};

export default AvatarUploader;
