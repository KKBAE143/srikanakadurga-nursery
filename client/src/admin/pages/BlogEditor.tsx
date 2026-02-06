import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";
import { getBlogPostById, type BlogPost } from "@/lib/data";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Save,
  ArrowLeft,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Quote,
  Minus,
} from "lucide-react";

interface BlogFormData {
  title: string;
  excerpt: string;
  image: string;
  content: string;
  author: string;
  featured: boolean;
  status: "draft" | "published";
}

const defaultFormData: BlogFormData = {
  title: "",
  excerpt: "",
  image: "",
  content: "",
  author: "",
  featured: false,
  status: "draft",
};

export default function BlogEditor() {
  const [, params] = useRoute("/admin/blog/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const isEditing = params?.id && params.id !== "new";
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 640, height: 480 }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
      CharacterCount,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (isEditing && params?.id) {
      const fetchBlog = async () => {
        try {
          const docRef = doc(db, "blogPosts", params.id!);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as BlogFormData;
            setFormData(data);
            editor?.commands.setContent(data.content || "");
          } else {
            const staticBlog = getBlogPostById(params.id!);
            if (staticBlog) {
              const blogData = {
                title: staticBlog.title,
                excerpt: staticBlog.excerpt,
                image: staticBlog.image,
                content: staticBlog.content.replace(/\*\*/g, ""),
                author: staticBlog.author || "",
                featured: false,
                status: "published" as const,
              };
              setFormData(blogData);
              editor?.commands.setContent(`<p>${blogData.content.replace(/\n/g, "</p><p>")}</p>`);
            }
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
          toast({
            title: "Error",
            description: "Failed to load blog post.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [isEditing, params?.id, toast, editor]);

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const blogData = {
        ...formData,
        status,
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
        content: editor?.getHTML() || "",
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid,
      };

      if (isEditing && params?.id) {
        await setDoc(doc(db, "blogPosts", params.id), blogData, { merge: true });
        toast({
          title: "Blog updated",
          description: status === "published" ? "Your post has been published." : "Draft saved.",
        });
      } else {
        await addDoc(collection(db, "blogPosts"), {
          ...blogData,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: user?.uid,
        });
        toast({
          title: status === "published" ? "Blog published" : "Draft saved",
          description: status === "published" ? "Your post is now live." : "You can continue editing later.",
        });
      }

      setLocation("/admin/blog");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditing ? "Edit Blog Post" : "Write New Post"}
      subtitle={isEditing ? `Editing: ${formData.title}` : "Create engaging content for your audience"}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/admin/blog")}
            className="px-4 py-2.5 rounded-lg font-medium text-sm text-[#8F9E8B] hover:text-[#1A1A1A] transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg font-medium text-sm border border-[#e5ebe3] text-[#1A1A1A] hover:bg-[#f8faf7] transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={saving}
            className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish
          </button>
        </div>
      }
    >
      <div className="max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Excerpt */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title..."
                    className="w-full px-4 py-3 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief summary of your post..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-[#e5ebe3] p-2 flex flex-wrap gap-1">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("bold") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("italic") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#e5ebe3] mx-1 self-center" />
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("heading", { level: 1 }) ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("heading", { level: 2 }) ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("heading", { level: 3 }) ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#e5ebe3] mx-1 self-center" />
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("bulletList") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("orderedList") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded hover:bg-[#f8faf7] ${editor?.isActive("blockquote") ? "bg-[#EAEFE9] text-[#2F4836]" : "text-[#8F9E8B]"}`}
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                  className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#e5ebe3] mx-1 self-center" />
                <button onClick={addLink} className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button onClick={addImage} className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button onClick={addYoutube} className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]">
                  <YoutubeIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#e5ebe3] mx-1 self-center" />
                <button
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 rounded hover:bg-[#f8faf7] text-[#8F9E8B]"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Editor Content */}
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-6 min-h-[400px] focus:outline-none [&_.ProseMirror]:min-h-[350px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[#8F9E8B] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
              />

              {/* Word count */}
              <div className="border-t border-[#e5ebe3] p-3 text-right">
                <span className="text-xs text-[#8F9E8B]">
                  {editor?.storage.characterCount.characters()} characters
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Featured Image
              </h2>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="blog"
                aspectRatio="video"
              />
            </div>

            {/* Author & Settings */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Featured on Homepage</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
