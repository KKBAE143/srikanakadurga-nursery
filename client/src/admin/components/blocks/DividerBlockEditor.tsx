import { Minus } from "lucide-react";
import type { DividerBlock } from "./types";

interface DividerBlockEditorProps {
  block: DividerBlock;
  onChange: (block: DividerBlock) => void;
}

export default function DividerBlockEditor({ block, onChange }: DividerBlockEditorProps) {
  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Minus className="w-5 h-5 text-[#8F9E8B]" />
        <span className="text-sm font-medium text-[#1A1A1A]">Divider</span>
      </div>
      <div className="py-4 flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e5ebe3] to-transparent" />
      </div>
      <p className="text-xs text-[#8F9E8B] text-center">Visual separator between sections</p>
    </div>
  );
}
