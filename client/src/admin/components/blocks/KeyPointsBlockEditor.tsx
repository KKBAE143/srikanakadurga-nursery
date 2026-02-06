import { ListChecks, Plus, Trash2, GripVertical } from "lucide-react";
import type { KeyPointsBlock } from "./types";
import { v4 as uuid } from "uuid";

interface KeyPointsBlockEditorProps {
  block: KeyPointsBlock;
  onChange: (block: KeyPointsBlock) => void;
}

export default function KeyPointsBlockEditor({ block, onChange }: KeyPointsBlockEditorProps) {
  const addPoint = () => {
    onChange({
      ...block,
      points: [
        ...block.points,
        { id: uuid(), title: "", description: "" },
      ],
    });
  };

  const updatePoint = (index: number, field: "title" | "description", value: string) => {
    const newPoints = [...block.points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    onChange({ ...block, points: newPoints });
  };

  const removePoint = (index: number) => {
    onChange({
      ...block,
      points: block.points.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <ListChecks className="w-5 h-5 text-[#2F4836]" />
        <span className="text-sm font-medium text-[#1A1A1A]">Key Points</span>
      </div>

      {/* Section title */}
      <input
        type="text"
        value={block.title || ""}
        onChange={(e) => onChange({ ...block, title: e.target.value })}
        placeholder="Section title (optional, e.g., 'Key Takeaways')"
        className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
      />

      {/* Points list */}
      <div className="space-y-3">
        {block.points.map((point, index) => (
          <div
            key={point.id}
            className="flex gap-2 p-3 bg-[#f8faf7] rounded-lg border border-[#e5ebe3]"
          >
            <div className="flex flex-col items-center gap-1 pt-2">
              <GripVertical className="w-4 h-4 text-[#8F9E8B] cursor-move" />
              <span className="text-xs font-bold text-[#2F4836]">{index + 1}</span>
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={point.title}
                onChange={(e) => updatePoint(index, "title", e.target.value)}
                placeholder="Point title (e.g., 'Low Light Requirements')"
                className="w-full px-3 py-1.5 text-sm font-medium rounded border border-[#e5ebe3] bg-white placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
              />
              <textarea
                value={point.description || ""}
                onChange={(e) => updatePoint(index, "description", e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-3 py-1.5 text-sm rounded border border-[#e5ebe3] bg-white placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => removePoint(index)}
              className="p-1.5 text-[#8F9E8B] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add point button */}
      <button
        type="button"
        onClick={addPoint}
        className="w-full py-2 text-sm text-[#2F4836] border-2 border-dashed border-[#e5ebe3] rounded-lg hover:border-[#2F4836] transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Point
      </button>
    </div>
  );
}
