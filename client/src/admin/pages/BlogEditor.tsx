import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";
import { getBlogPostById, products as allProducts } from "@/lib/data";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  ArrowLeft,
  Loader2,
  FileText,
  Image as ImageIcon,
  Youtube,
  ShoppingBag,
  ListChecks,
  Type,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
  X,
  Plus,
  Trash2,
  Info,
} from "lucide-react";

// Template structure - matches existing blog format
interface BlogTemplate {
  // Basic Info
  title: string;
  excerpt: string;
  featuredImage: string;
  author: string;

  // Introduction
  introduction: string;

  // Section 1
  section1Title: string;
  section1Content: string;
  section1Type: "paragraph" | "numbered" | "bullets";

  // Image Gallery (after Section 1)
  galleryImages: Array<{ url: string; alt: string }>;

  // Section 2
  section2Title: string;
  section2Content: string;
  section2Type: "paragraph" | "numbered" | "bullets";

  // Video (after Section 2)
  videoUrl: string;
  videoTitle: string;

  // Section 3 (optional)
  section3Title: string;
  section3Content: string;
  section3Type: "paragraph" | "numbered" | "bullets";

  // Key Points / Tips
  keyPointsTitle: string;
  keyPoints: string[];

  // Featured Products
  featuredProductIds: string[];

  // Conclusion
  conclusion: string;

  // Meta
  featured: boolean;
  status: "draft" | "published";
}

const defaultTemplate: BlogTemplate = {
  title: "",
  excerpt: "",
  featuredImage: "",
  author: "",
  introduction: "",
  section1Title: "",
  section1Content: "",
  section1Type: "numbered",
  galleryImages: [],
  section2Title: "",
  section2Content: "",
  section2Type: "paragraph",
  videoUrl: "",
  videoTitle: "",
  section3Title: "",
  section3Content: "",
  section3Type: "paragraph",
  keyPointsTitle: "Care Tips",
  keyPoints: [""],
  featuredProductIds: [],
  conclusion: "",
  featured: false,
  status: "draft",
};

// Collapsible Section Component
function Section({
  title,
  icon,
  children,
  hint,
  optional = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#f8faf7] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAEFE9] flex items-center justify-center text-[#2F4836]">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-medium text-[#1A1A1A]">
              {title}
              {optional && <span className="text-[#8F9E8B] text-sm ml-2">(Optional)</span>}
            </h3>
            {hint && <p className="text-xs text-[#8F9E8B]">{hint}</p>}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#8F9E8B]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#8F9E8B]" />
        )}
      </button>
      {open && <div className="p-4 pt-0 border-t border-[#e5ebe3]">{children}</div>}
    </div>
  );
}

// Content Type Selector
function ContentTypeSelector({
  value,
  onChange,
}: {
  value: "paragraph" | "numbered" | "bullets";
  onChange: (v: "paragraph" | "numbered" | "bullets") => void;
}) {
  return (
    <div className="flex gap-2 mb-3">
      <button
        type="button"
        onClick={() => onChange("paragraph")}
        className={`px-3 py-1.5 text-xs rounded-lg border ${
          value === "paragraph"
            ? "bg-[#2F4836] text-white border-[#2F4836]"
            : "bg-white text-[#8F9E8B] border-[#e5ebe3] hover:border-[#2F4836]"
        }`}
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => onChange("numbered")}
        className={`px-3 py-1.5 text-xs rounded-lg border ${
          value === "numbered"
            ? "bg-[#2F4836] text-white border-[#2F4836]"
            : "bg-white text-[#8F9E8B] border-[#e5ebe3] hover:border-[#2F4836]"
        }`}
      >
        Numbered List
      </button>
      <button
        type="button"
        onClick={() => onChange("bullets")}
        className={`px-3 py-1.5 text-xs rounded-lg border ${
          value === "bullets"
            ? "bg-[#2F4836] text-white border-[#2F4836]"
            : "bg-white text-[#8F9E8B] border-[#e5ebe3] hover:border-[#2F4836]"
        }`}
      >
        Bullet Points
      </button>
    </div>
  );
}

// Product Picker Component
function ProductPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected products */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(
            (product) =>
              product && (
                <div
                  key={product.id}
                  className="flex items-center gap-2 bg-[#EAEFE9] rounded-lg px-2 py-1.5"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-sm text-[#1A1A1A]">{product.name}</span>
                  <button
                    type="button"
                    onClick={() => toggle(product.id)}
                    className="text-[#8F9E8B] hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowList(!showList)}
        className="text-sm text-[#2F4836] hover:underline flex items-center gap-1"
      >
        <Plus className="w-4 h-4" />
        {showList ? "Close" : "Select Products"}
      </button>

      {showList && (
        <div className="border border-[#e5ebe3] rounded-lg overflow-hidden">
          <div className="p-2 border-b border-[#e5ebe3] bg-[#f8faf7]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9E8B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#e5ebe3] bg-white placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.slice(0, 10).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                className={`w-full flex items-center gap-3 p-2 text-left hover:bg-[#f8faf7] ${
                  selectedIds.includes(product.id) ? "bg-[#EAEFE9]" : ""
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                  <p className="text-xs text-[#8F9E8B]">₹{product.price}</p>
                </div>
                {selectedIds.includes(product.id) && (
                  <Check className="w-5 h-5 text-[#2F4836]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogEditor() {
  const [, params] = useRoute("/admin/blog/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const isEditing = params?.id && params.id !== "new";
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<BlogTemplate>(defaultTemplate);

  useEffect(() => {
    if (isEditing && params?.id) {
      const fetchBlog = async () => {
        try {
          const docRef = doc(db, "blogPosts", params.id!);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // If it has template data, load it
            if (data.template) {
              setTemplate(data.template);
            } else {
              // Load basic fields from old format
              setTemplate({
                ...defaultTemplate,
                title: data.title || "",
                excerpt: data.excerpt || "",
                featuredImage: data.featuredImage || data.image || "",
                author: data.author || "",
                featured: data.featured || false,
                status: data.status || "draft",
              });
            }
          } else {
            // Try static data
            const staticBlog = getBlogPostById(params.id!);
            if (staticBlog) {
              setTemplate({
                ...defaultTemplate,
                title: staticBlog.title,
                excerpt: staticBlog.excerpt,
                featuredImage: staticBlog.image,
                author: staticBlog.author || "",
                status: "published",
              });
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
  }, [isEditing, params?.id, toast]);

  const updateTemplate = (field: keyof BlogTemplate, value: any) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const addKeyPoint = () => {
    setTemplate((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""],
    }));
  };

  const updateKeyPoint = (index: number, value: string) => {
    const newPoints = [...template.keyPoints];
    newPoints[index] = value;
    setTemplate((prev) => ({ ...prev, keyPoints: newPoints }));
  };

  const removeKeyPoint = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }));
  };

  const addGalleryImage = () => {
    setTemplate((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, { url: "", alt: "" }],
    }));
  };

  const updateGalleryImage = (index: number, field: "url" | "alt", value: string) => {
    const newImages = [...template.galleryImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setTemplate((prev) => ({ ...prev, galleryImages: newImages }));
  };

  const removeGalleryImage = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!template.title) {
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
        title: template.title,
        excerpt: template.excerpt,
        featuredImage: template.featuredImage,
        image: template.featuredImage, // Backward compatibility
        author: template.author,
        featured: template.featured,
        status,
        slug: template.title.toLowerCase().replace(/\s+/g, "-"),
        template: template, // Store the full template
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
      subtitle="Fill in each section to create your blog post"
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
      <div className="w-full space-y-4">
        {/* Info Banner */}
        <div className="bg-[#EAEFE9] border border-[#2F4836]/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2F4836] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#2F4836]">
            <p className="font-medium">How it works</p>
            <p className="text-[#4A4A4A]">
              Fill in each section below. Your blog post will appear on the website exactly like the existing blog posts - with the same beautiful layout and design.
            </p>
          </div>
        </div>

        {/* 1. Basic Info */}
        <Section
          title="Basic Information"
          icon={<FileText className="w-4 h-4" />}
          hint="Title, summary, and featured image"
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={template.title}
                onChange={(e) => updateTemplate("title", e.target.value)}
                placeholder="e.g., 5 Best Indoor Plants for Beginners"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Short Summary (Excerpt)
              </label>
              <textarea
                value={template.excerpt}
                onChange={(e) => updateTemplate("excerpt", e.target.value)}
                placeholder="A brief 1-2 sentence summary that appears in the blog listing..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Featured Image
                </label>
                <ImageUploader
                  value={template.featuredImage}
                  onChange={(url) => updateTemplate("featuredImage", url)}
                  folder="blog"
                  aspectRatio="video"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Author Name</label>
                <input
                  type="text"
                  value={template.author}
                  onChange={(e) => updateTemplate("author", e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
                />

                <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-[#f8faf7] rounded-lg border border-[#e5ebe3]">
                  <input
                    type="checkbox"
                    checked={template.featured}
                    onChange={(e) => updateTemplate("featured", e.target.checked)}
                    className="w-4 h-4 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Feature on Homepage</span>
                </label>
              </div>
            </div>
          </div>
        </Section>

        {/* 2. Introduction */}
        <Section
          title="Introduction"
          icon={<Type className="w-4 h-4" />}
          hint="Opening paragraph that hooks the reader"
        >
          <div className="pt-4">
            <textarea
              value={template.introduction}
              onChange={(e) => updateTemplate("introduction", e.target.value)}
              placeholder="Write an engaging opening paragraph that introduces the topic..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
            />
          </div>
        </Section>

        {/* 3. Section 1 */}
        <Section
          title="Section 1"
          icon={<Sparkles className="w-4 h-4" />}
          hint="First main section with heading and content"
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={template.section1Title}
                onChange={(e) => updateTemplate("section1Title", e.target.value)}
                placeholder="e.g., Top 5 Indoor Plants"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content Type</label>
              <ContentTypeSelector
                value={template.section1Type}
                onChange={(v) => updateTemplate("section1Type", v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content</label>
              <textarea
                value={template.section1Content}
                onChange={(e) => updateTemplate("section1Content", e.target.value)}
                placeholder={
                  template.section1Type === "numbered"
                    ? "1. Snake Plant - Perfect for beginners...\n2. Money Plant - Brings good fortune...\n3. Peace Lily - Great for low light..."
                    : template.section1Type === "bullets"
                    ? "- Snake Plant is perfect for beginners\n- Money Plant brings good fortune\n- Peace Lily is great for low light"
                    : "Write your content here..."
                }
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
              />
            </div>
          </div>
        </Section>

        {/* 4. Image Gallery */}
        <Section
          title="Image Gallery"
          icon={<ImageIcon className="w-4 h-4" />}
          hint="Add 2-3 images to showcase in the article"
          optional
        >
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {template.galleryImages.map((img, index) => (
                <div key={index} className="relative">
                  {img.url ? (
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#f8faf7] relative group">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <ImageUploader
                      value=""
                      onChange={(url) => updateGalleryImage(index, "url", url)}
                      folder="blog"
                      aspectRatio="square"
                    />
                  )}
                </div>
              ))}

              {template.galleryImages.length < 4 && (
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="aspect-square border-2 border-dashed border-[#e5ebe3] rounded-lg flex flex-col items-center justify-center gap-2 text-[#8F9E8B] hover:border-[#2F4836] hover:text-[#2F4836] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs">Add Image</span>
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* 5. Section 2 */}
        <Section
          title="Section 2"
          icon={<Sparkles className="w-4 h-4" />}
          hint="Second main section"
          optional
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={template.section2Title}
                onChange={(e) => updateTemplate("section2Title", e.target.value)}
                placeholder="e.g., Care Tips for Beginners"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content Type</label>
              <ContentTypeSelector
                value={template.section2Type}
                onChange={(v) => updateTemplate("section2Type", v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content</label>
              <textarea
                value={template.section2Content}
                onChange={(e) => updateTemplate("section2Content", e.target.value)}
                placeholder="Write your content here..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
              />
            </div>
          </div>
        </Section>

        {/* 6. Video */}
        <Section
          title="YouTube Video"
          icon={<Youtube className="w-4 h-4" />}
          hint="Embed a YouTube video"
          optional
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={template.videoUrl}
                onChange={(e) => updateTemplate("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Video Title</label>
              <input
                type="text"
                value={template.videoTitle}
                onChange={(e) => updateTemplate("videoTitle", e.target.value)}
                placeholder="e.g., Plant Care Tutorial"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
              />
            </div>
          </div>
        </Section>

        {/* 7. Section 3 */}
        <Section
          title="Section 3"
          icon={<Sparkles className="w-4 h-4" />}
          hint="Third main section"
          optional
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={template.section3Title}
                onChange={(e) => updateTemplate("section3Title", e.target.value)}
                placeholder="e.g., Where to Buy"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content Type</label>
              <ContentTypeSelector
                value={template.section3Type}
                onChange={(v) => updateTemplate("section3Type", v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Content</label>
              <textarea
                value={template.section3Content}
                onChange={(e) => updateTemplate("section3Content", e.target.value)}
                placeholder="Write your content here..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
              />
            </div>
          </div>
        </Section>

        {/* 8. Key Points */}
        <Section
          title="Key Points / Tips"
          icon={<ListChecks className="w-4 h-4" />}
          hint="Important takeaways shown as a bullet list"
          optional
        >
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={template.keyPointsTitle}
                onChange={(e) => updateTemplate("keyPointsTitle", e.target.value)}
                placeholder="e.g., Care Tips, Key Takeaways"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
              />
            </div>

            <div className="space-y-2">
              {template.keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-6 h-10 flex items-center justify-center text-[#2F4836] font-medium">
                    •
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateKeyPoint(index, e.target.value)}
                    placeholder="Enter a key point..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyPoint(index)}
                    className="p-2.5 text-[#8F9E8B] hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addKeyPoint}
                className="flex items-center gap-2 text-sm text-[#2F4836] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Point
              </button>
            </div>
          </div>
        </Section>

        {/* 9. Featured Products */}
        <Section
          title="Featured Products"
          icon={<ShoppingBag className="w-4 h-4" />}
          hint="Products to showcase in the article"
          optional
        >
          <div className="pt-4">
            <ProductPicker
              selectedIds={template.featuredProductIds}
              onChange={(ids) => updateTemplate("featuredProductIds", ids)}
            />
          </div>
        </Section>

        {/* 10. Conclusion */}
        <Section
          title="Conclusion"
          icon={<Type className="w-4 h-4" />}
          hint="Closing paragraph with call to action"
          optional
        >
          <div className="pt-4">
            <textarea
              value={template.conclusion}
              onChange={(e) => updateTemplate("conclusion", e.target.value)}
              placeholder="Write a closing paragraph inviting readers to visit the nursery..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm resize-none"
            />
          </div>
        </Section>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg font-medium text-sm border border-[#e5ebe3] text-[#1A1A1A] hover:bg-[#f8faf7] transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={saving}
            className="bg-[#2F4836] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
