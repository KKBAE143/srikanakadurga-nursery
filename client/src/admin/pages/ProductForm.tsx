import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";
import { getProductById, type Product } from "@/lib/data";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const CATEGORIES = ["Indoor Plants", "Medicinal Plants", "Succulent Plants", "Flowering Plants"];

interface ProductFormData {
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  image: string;
  careInstructions: string;
  lightRequirement: string;
  waterFrequency: string;
  petFriendly: boolean;
  inStock: boolean;
  featured: boolean;
}

const defaultFormData: ProductFormData = {
  name: "",
  price: 0,
  originalPrice: 0,
  category: CATEGORIES[0],
  description: "",
  image: "",
  careInstructions: "",
  lightRequirement: "",
  waterFrequency: "",
  petFriendly: false,
  inStock: true,
  featured: false,
};

export default function ProductForm() {
  const [, params] = useRoute("/admin/products/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const isEditing = params?.id && params.id !== "new";
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  useEffect(() => {
    if (isEditing && params?.id) {
      const fetchProduct = async () => {
        try {
          // Try Firestore first
          const docRef = doc(db, "products", params.id!);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as ProductFormData;
            setFormData(data);
          } else {
            // Fallback to static data
            const staticProduct = getProductById(params.id!);
            if (staticProduct) {
              setFormData({
                name: staticProduct.name,
                price: staticProduct.price,
                originalPrice: staticProduct.originalPrice || 0,
                category: staticProduct.category,
                description: staticProduct.description,
                image: staticProduct.image,
                careInstructions: staticProduct.careInstructions || "",
                lightRequirement: staticProduct.lightRequirement || "",
                waterFrequency: staticProduct.waterFrequency || "",
                petFriendly: staticProduct.petFriendly || false,
                inStock: staticProduct.inStock,
                featured: false,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to load product data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [isEditing, params?.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid,
      };

      if (isEditing && params?.id) {
        await setDoc(doc(db, "products", params.id), productData, { merge: true });
        toast({
          title: "Product updated",
          description: "Your changes have been saved.",
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date().toISOString(),
          createdBy: user?.uid,
        });
        toast({
          title: "Product created",
          description: "New product has been added to your catalog.",
        });
      }

      setLocation("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
      title={isEditing ? "Edit Product" : "Add New Product"}
      subtitle={isEditing ? `Editing: ${formData.name}` : "Create a new product for your catalog"}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/admin/products")}
            className="px-4 py-2.5 rounded-lg font-medium text-sm text-[#8F9E8B] hover:text-[#1A1A1A] transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
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
                {isEditing ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Areca Palm"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe this plant..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">Pricing</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="299"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={handleChange}
                    placeholder="399 (for discount display)"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Care Instructions
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Care Instructions
                  </label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleChange}
                    placeholder="How to care for this plant..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Light Requirement
                    </label>
                    <input
                      type="text"
                      name="lightRequirement"
                      value={formData.lightRequirement}
                      onChange={handleChange}
                      placeholder="e.g., Bright indirect light"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Water Frequency
                    </label>
                    <input
                      type="text"
                      name="waterFrequency"
                      value={formData.waterFrequency}
                      onChange={handleChange}
                      placeholder="e.g., Once a week"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Product Image
              </h2>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="products"
                aspectRatio="square"
              />

              <div className="mt-3">
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Or enter Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">Status</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <span className="text-sm text-[#1A1A1A]">In Stock</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="petFriendly"
                    checked={formData.petFriendly}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[#e5ebe3] text-[#2F4836] focus:ring-[#2F4836]"
                  />
                  <span className="text-sm text-[#1A1A1A]">Pet Friendly</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
