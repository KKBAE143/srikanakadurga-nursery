import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import type { TextBlock } from "./types";

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
}

export default function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your content here..." }),
    ],
    content: block.content,
    onUpdate: ({ editor }) => {
      onChange({ ...block, content: editor.getHTML() });
    },
  });

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-[#e5ebe3] rounded-lg overflow-hidden bg-white">
      {/* Mini Toolbar */}
      <div className="border-b border-[#e5ebe3] p-1.5 flex gap-0.5 bg-[#f8faf7]">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-sm ${
            editor?.isActive("bold") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B] hover:bg-[#EAEFE9]"
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-sm ${
            editor?.isActive("italic") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B] hover:bg-[#EAEFE9]"
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-[#e5ebe3] mx-1 self-center" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-sm ${
            editor?.isActive("bulletList") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B] hover:bg-[#EAEFE9]"
          }`}
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-sm ${
            editor?.isActive("orderedList") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B] hover:bg-[#EAEFE9]"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-[#e5ebe3] mx-1 self-center" />
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded text-sm text-[#8F9E8B] hover:bg-[#EAEFE9]"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[100px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[80px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[#8F9E8B] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}
