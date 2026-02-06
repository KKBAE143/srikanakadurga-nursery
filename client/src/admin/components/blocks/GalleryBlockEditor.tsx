import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";
import type { GalleryBlock } from "./types";
import ImageUploader from "../ImageUploader";

interface GalleryBlockEditorProps {
  block: GalleryBlock;
  onChange: (block: GalleryBlock) => void;
}

export default function GalleryBlockEditor({ block, onChange }: GalleryBlockEditorProps) {
  const [addingImage, setAddingImage] = useState(false);

  const addImage = (url: string) => {
    onChange({
      ...block,
      images: [...block.images, { url, alt: "" }],
    });
    setAddingImage(false);
  };

  const removeImage = (index: number) => {
    onChange({
      ...block,
      images: block.images.filter((_, i) => i !== index),
    });
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...block.images];
    newImages[index] = { ...newImages[index], alt };
    onChange({ ...block, images: newImages });
  };

  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-4">
      {/* Column selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-[#8F9E8B]">Columns:</label>
        <div className="flex gap-1">
          {([2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => onChange({ ...block, columns: cols })}
              className={`px-3 py-1 text-sm rounded ${
                block.columns === cols
                  ? "bg-[#2F4836] text-white"
                  : "bg-[#f8faf7] text-[#8F9E8B] hover:bg-[#EAEFE9]"
              }`}
            >
              {cols}
            </button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      <div className={`grid gap-3 ${
        block.columns === 2 ? "grid-cols-2" : block.columns === 3 ? "grid-cols-3" : "grid-cols-4"
      }`}>
        {block.images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-[#f8faf7]">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <input
              type="text"
              value={image.alt}
              onChange={(e) => updateImageAlt(index, e.target.value)}
              placeholder="Alt text"
              className="mt-1 w-full px-2 py-1 text-xs rounded border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
            />
          </div>
        ))}

        {/* Add image button */}
        {addingImage ? (
          <div className="aspect-square">
            <ImageUploader
              value=""
              onChange={addImage}
              folder="blog"
              aspectRatio="square"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingImage(true)}
            className="aspect-square border-2 border-dashed border-[#e5ebe3] rounded-lg flex flex-col items-center justify-center gap-1 text-[#8F9E8B] hover:border-[#2F4836] hover:text-[#2F4836] transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Add Image</span>
          </button>
        )}
      </div>
    </div>
  );
}
