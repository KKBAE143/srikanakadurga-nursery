import { useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import type { ImageBlock } from "./types";
import ImageUploader from "../ImageUploader";

interface ImageBlockEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export default function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4">
      {block.url ? (
        <div className="space-y-3">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-[#f8faf7]">
            <img
              src={block.url}
              alt={block.alt || ""}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange({ ...block, url: "" })}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Alt text (for accessibility)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
            />
            <input
              type="text"
              value={block.caption || ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Caption (optional)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
            />
          </div>
        </div>
      ) : showUploader ? (
        <div className="space-y-3">
          <ImageUploader
            value={block.url}
            onChange={(url) => {
              onChange({ ...block, url });
              setShowUploader(false);
            }}
            folder="blog"
            aspectRatio="video"
          />
          <button
            type="button"
            onClick={() => setShowUploader(false)}
            className="text-sm text-[#8F9E8B] hover:text-[#1A1A1A]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="w-full aspect-video border-2 border-dashed border-[#e5ebe3] rounded-lg flex flex-col items-center justify-center gap-2 text-[#8F9E8B] hover:border-[#2F4836] hover:text-[#2F4836] transition-colors"
          >
            <Upload className="w-8 h-8" />
            <span className="text-sm font-medium">Upload Image</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8F9E8B]">or paste URL:</span>
            <input
              type="text"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 text-sm rounded border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
