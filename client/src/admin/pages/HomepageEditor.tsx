import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as staticProducts, blogPosts as staticBlogs } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Loader2,
  Home,
  Image as ImageIcon,
  Package,
  FileText,
  Plus,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryLink: string;
  primaryLabel: string;
  secondaryLink?: string;
  secondaryLabel?: string;
}

interface HomepageSettings {
  heroSlides: HeroSlide[];
  featuredProductIds: string[];
  featuredBlogIds: string[];
}

const defaultSettings: HomepageSettings = {
  heroSlides: [
    {
      id: "1",
      image: "/images/hero-leaves.webp",
      title: "Let's Make Your Home Beautiful",
      subtitle: "Shop With Us",
      description: "Premium plants and landscaping in Hyderabad. Transform your living spaces with nature's finest.",
      primaryLink: "/shop",
      primaryLabel: "Shop Now",
      secondaryLink: "/contact",
      secondaryLabel: "Contact Us",
    },
    {
      id: "2",
      image: "/images/hero-tropical.png",
      title: "Transform Your Space with Greenery",
      subtitle: "Bring Nature Indoors",
      description: "Discover our handpicked collection of tropical and indoor plants that purify air and elevate your decor.",
      primaryLink: "/shop",
      primaryLabel: "Explore Plants",
      secondaryLink: "/about",
      secondaryLabel: "Our Story",
    },
    {
      id: "3",
      image: "/images/hero-collection.png",
      title: "Plants That Grow with You",
      subtitle: "Curated for You",
      description: "From low-maintenance succulents to statement palms, find the perfect green companion for every corner.",
      primaryLink: "/shop",
      primaryLabel: "Browse Collection",
      secondaryLink: "/blog",
      secondaryLabel: "Read Blog",
    },
  ],
  featuredProductIds: [],
  featuredBlogIds: [],
};

export default function HomepageEditor() {
  const [settings, setSettings] = useState<HomepageSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "products" | "blogs">("hero");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as HomepageSettings);
        }
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "homepage"), {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid,
      });
      toast({
        title: "Homepage updated",
        description: "Your changes have been saved.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save homepage settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      image: "",
      title: "",
      subtitle: "",
      description: "",
      primaryLink: "/shop",
      primaryLabel: "Shop Now",
      secondaryLink: "/contact",
      secondaryLabel: "Contact Us",
    };
    setSettings((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide],
    }));
  };

  const removeSlide = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((s) => s.id !== id),
    }));
  };

  const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const toggleProduct = (productId: string) => {
    setSettings((prev) => ({
      ...prev,
      featuredProductIds: prev.featuredProductIds.includes(productId)
        ? prev.featuredProductIds.filter((id) => id !== productId)
        : [...prev.featuredProductIds, productId],
    }));
  };

  const toggleBlog = (blogId: string) => {
    setSettings((prev) => ({
      ...prev,
      featuredBlogIds: prev.featuredBlogIds.includes(blogId)
        ? prev.featuredBlogIds.filter((id) => id !== blogId)
        : [...prev.featuredBlogIds, blogId],
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Homepage">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Homepage Editor"
      subtitle="Customize your homepage content"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-[#e5ebe3] mb-6">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "hero"
              ? "text-[#2F4836] border-b-2 border-[#2F4836]"
              : "text-[#8F9E8B] hover:text-[#1A1A1A]"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Hero Slides
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "products"
              ? "text-[#2F4836] border-b-2 border-[#2F4836]"
              : "text-[#8F9E8B] hover:text-[#1A1A1A]"
          }`}
        >
          <Package className="w-4 h-4" />
          Featured Products
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "blogs"
              ? "text-[#2F4836] border-b-2 border-[#2F4836]"
              : "text-[#8F9E8B] hover:text-[#1A1A1A]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Featured Blogs
        </button>
      </div>

      {/* Hero Slides Tab */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          {settings.heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden"
            >
              <div className="p-4 bg-[#f8faf7] border-b border-[#e5ebe3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-[#8F9E8B] cursor-move" />
                  <span className="font-medium text-[#1A1A1A]">Slide {index + 1}</span>
                </div>
                {settings.heroSlides.length > 1 && (
                  <button
                    onClick={() => removeSlide(slide.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Image Preview */}
                  <div>
                    {slide.image ? (
                      <div className="aspect-video bg-[#EAEFE9] rounded-lg overflow-hidden mb-3">
                        <img
                          src={slide.image}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-[#f8faf7] border-2 border-dashed border-[#e5ebe3] rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-8 h-8 text-[#8F9E8B]" />
                      </div>
                    )}
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => updateSlide(slide.id, "image", e.target.value)}
                      placeholder="Image URL..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                    />
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)}
                          placeholder="e.g., Welcome to"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Title
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                          placeholder="e.g., Bring Nature Home"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={slide.description}
                        onChange={(e) => updateSlide(slide.id, "description", e.target.value)}
                        placeholder="Brief description..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Button Label
                        </label>
                        <input
                          type="text"
                          value={slide.primaryLabel}
                          onChange={(e) => updateSlide(slide.id, "primaryLabel", e.target.value)}
                          placeholder="e.g., Shop Now"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={slide.primaryLink}
                          onChange={(e) => updateSlide(slide.id, "primaryLink", e.target.value)}
                          placeholder="/shop"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Secondary Button Label
                        </label>
                        <input
                          type="text"
                          value={slide.secondaryLabel || ""}
                          onChange={(e) => updateSlide(slide.id, "secondaryLabel", e.target.value)}
                          placeholder="e.g., Contact Us"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Secondary Button Link
                        </label>
                        <input
                          type="text"
                          value={slide.secondaryLink || ""}
                          onChange={(e) => updateSlide(slide.id, "secondaryLink", e.target.value)}
                          placeholder="/contact"
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addSlide}
            className="w-full py-4 border-2 border-dashed border-[#e5ebe3] rounded-xl text-[#8F9E8B] hover:text-[#2F4836] hover:border-[#2F4836] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Hero Slide
          </button>
        </div>
      )}

      {/* Featured Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
          <div className="p-4 bg-[#f8faf7] border-b border-[#e5ebe3]">
            <p className="text-sm text-[#8F9E8B]">
              Select products to feature on the homepage ({settings.featuredProductIds.length} selected)
            </p>
          </div>
          <div className="divide-y divide-[#e5ebe3] max-h-[500px] overflow-y-auto">
            {staticProducts.map((product) => {
              const isSelected = settings.featuredProductIds.includes(product.id);
              return (
                <label
                  key={product.id}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#f8faf7] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProduct(product.id)}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <div className="w-12 h-12 bg-[#EAEFE9] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A] text-sm">{product.name}</p>
                    <p className="text-xs text-[#8F9E8B]">{product.category} • ₹{product.price}</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-medium text-[#2F4836] bg-[#EAEFE9] px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Blogs Tab */}
      {activeTab === "blogs" && (
        <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
          <div className="p-4 bg-[#f8faf7] border-b border-[#e5ebe3]">
            <p className="text-sm text-[#8F9E8B]">
              Select blog posts to feature on the homepage ({settings.featuredBlogIds.length} selected)
            </p>
          </div>
          <div className="divide-y divide-[#e5ebe3]">
            {staticBlogs.map((blog) => {
              const isSelected = settings.featuredBlogIds.includes(blog.id);
              return (
                <label
                  key={blog.id}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#f8faf7] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleBlog(blog.id)}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <div className="w-16 h-12 bg-[#EAEFE9] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A] text-sm">{blog.title}</p>
                    <p className="text-xs text-[#8F9E8B] line-clamp-1">{blog.excerpt}</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-medium text-[#2F4836] bg-[#EAEFE9] px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
