import { useState } from "react";
import { Youtube, Play } from "lucide-react";
import type { VideoBlock } from "./types";

interface VideoBlockEditorProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VideoBlockEditor({ block, onChange }: VideoBlockEditorProps) {
  const videoId = getYouTubeId(block.url);

  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Youtube className="w-5 h-5 text-red-500" />
        <span className="text-sm font-medium text-[#1A1A1A]">YouTube Video</span>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
          className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
        />

        <input
          type="text"
          value={block.title || ""}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Video title (optional)"
          className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
        />
      </div>

      {/* Preview */}
      {videoId ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={block.title || "YouTube video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : block.url ? (
        <div className="aspect-video rounded-lg bg-[#f8faf7] flex items-center justify-center text-[#8F9E8B]">
          <p className="text-sm">Invalid YouTube URL</p>
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-gradient-to-br from-[#2F4836] to-[#4a6b52] flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <p className="text-sm text-white/70">Video preview will appear here</p>
        </div>
      )}
    </div>
  );
}
