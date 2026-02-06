import type { HeadingBlock } from "./types";

interface HeadingBlockEditorProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export default function HeadingBlockEditor({ block, onChange }: HeadingBlockEditorProps) {
  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4">
      <div className="flex gap-3 mb-3">
        <label className="text-sm text-[#8F9E8B]">Level:</label>
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ ...block, level })}
              className={`px-3 py-1 text-sm rounded ${
                block.level === level
                  ? "bg-[#2F4836] text-white"
                  : "bg-[#f8faf7] text-[#8F9E8B] hover:bg-[#EAEFE9]"
              }`}
            >
              H{level}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Enter heading text..."
        className={`w-full px-4 py-2 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] ${
          block.level === 1 ? "text-2xl font-bold" : block.level === 2 ? "text-xl font-semibold" : "text-lg font-medium"
        }`}
      />
    </div>
  );
}
