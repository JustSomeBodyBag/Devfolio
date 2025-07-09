import React, { useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage";
import api from "../../../api/axios";

interface UploadScreenshotProps {
  projectId: number;
  onUploadComplete?: () => void;
}

const UploadScreenshot: React.FC<UploadScreenshotProps> = ({ projectId, onUploadComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    setError(null);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped.jpg");

      await api.post(`/admin/projects/${projectId}/upload-screenshot`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadComplete?.();    // <-- ВЫЗОВ ОБНОВЛЕНИЯ СПИСКА
      setImageSrc(null);
    } catch (e: any) {
      setError(e.message || "Ошибка при загрузке");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!imageSrc ? (
        <Dropzone accept={{ "image/*": [] }} onDrop={onDrop} maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="p-10 border-2 border-dashed cursor-pointer text-center"
            >
              <input {...getInputProps()} />
              <p>Перетащите изображение или нажмите для выбора</p>
            </div>
          )}
        </Dropzone>
      ) : (
        <>
          <div className="relative w-full h-[400px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {uploading ? "Загрузка..." : "Загрузить"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default UploadScreenshot;
