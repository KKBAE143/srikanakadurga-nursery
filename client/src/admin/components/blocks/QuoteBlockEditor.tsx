import { Quote as QuoteIcon } from "lucide-react";
import type { QuoteBlock } from "./types";

interface QuoteBlockEditorProps {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
}

export default function QuoteBlockEditor({ block, onChange }: QuoteBlockEditorProps) {
  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <QuoteIcon className="w-5 h-5 text-[#2F4836]" />
        <span className="text-sm font-medium text-[#1A1A1A]">Quote / Highlight</span>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2F4836] rounded-full" />
        <textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Enter the quote or highlighted text..."
          rows={3}
          className="w-full pl-6 pr-4 py-3 text-lg italic rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] resize-none"
        />
      </div>

      <input
        type="text"
        value={block.author || ""}
        onChange={(e) => onChange({ ...block, author: e.target.value })}
        placeholder="Author (optional)"
        className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
      />
    </div>
  );
}
