import { MousePointerClick } from "lucide-react";
import type { CTABlock } from "./types";

interface CTABlockEditorProps {
  block: CTABlock;
  onChange: (block: CTABlock) => void;
}

export default function CTABlockEditor({ block, onChange }: CTABlockEditorProps) {
  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <MousePointerClick className="w-5 h-5 text-[#2F4836]" />
        <span className="text-sm font-medium text-[#1A1A1A]">Call to Action</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8F9E8B] mb-1">Title</label>
          <input
            type="text"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="e.g., Ready to Start?"
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8F9E8B] mb-1">Button Text</label>
          <input
            type="text"
            value={block.buttonText}
            onChange={(e) => onChange({ ...block, buttonText: e.target.value })}
            placeholder="e.g., Shop Now"
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#8F9E8B] mb-1">Description</label>
        <textarea
          value={block.description}
          onChange={(e) => onChange({ ...block, description: e.target.value })}
          placeholder="Brief description..."
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8F9E8B] mb-1">Button Link</label>
        <input
          type="text"
          value={block.buttonLink}
          onChange={(e) => onChange({ ...block, buttonLink: e.target.value })}
          placeholder="/shop or https://..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
        />
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-r from-[#2F4836] to-[#4a6b52] rounded-xl p-6 text-center">
        <h3 className="font-heading text-xl font-bold text-white mb-2">
          {block.title || "Your CTA Title"}
        </h3>
        <p className="text-white/80 text-sm mb-4">
          {block.description || "Your description will appear here"}
        </p>
        <button className="bg-white text-[#2F4836] px-6 py-2 rounded-full text-sm font-semibold">
          {block.buttonText || "Button Text"}
        </button>
      </div>
    </div>
  );
}
