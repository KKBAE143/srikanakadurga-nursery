import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { IMAGEKIT_CONFIG } from "@/lib/imagekit";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: "square" | "video" | "auto";
  className?: string;
}

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  aspectRatio = "square",
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "min-h-[200px]",
  };

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return;
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Get authentication parameters from server
        const authResponse = await fetch("/api/imagekit-auth");
        if (!authResponse.ok) {
          throw new Error("Failed to get upload authentication");
        }
        const authParams = await authResponse.json();

        // Create form data for upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("publicKey", authParams.publicKey);
        formData.append("signature", authParams.signature);
        formData.append("expire", authParams.expire);
        formData.append("token", authParams.token);
        formData.append("fileName", file.name);
        formData.append("folder", `/${folder}`);

        // Upload to ImageKit
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
        });

        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
        xhr.send(formData);

        const response = await uploadPromise;
        onChange(response.url);
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} bg-[#EAEFE9] rounded-xl overflow-hidden group`}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A1A] hover:bg-gray-100 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`${aspectClasses[aspectRatio]} border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#2F4836] bg-[#EAEFE9]"
              : uploading
              ? "border-[#2F4836] bg-[#f8faf7] cursor-wait"
              : "border-[#e5ebe3] bg-[#f8faf7] hover:border-[#2F4836] hover:bg-[#EAEFE9]"
          }`}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#2F4836] animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-[#2F4836]">Uploading...</p>
              <div className="w-32 h-2 bg-[#e5ebe3] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#2F4836] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[#8F9E8B] mt-1">{progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-[#EAEFE9] rounded-full flex items-center justify-center mb-3">
                {dragOver ? (
                  <Upload className="w-7 h-7 text-[#2F4836]" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-[#2F4836]" />
                )}
              </div>
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                {dragOver ? "Drop image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-[#8F9E8B]">PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
