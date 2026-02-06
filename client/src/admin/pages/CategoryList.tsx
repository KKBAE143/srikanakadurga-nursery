import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
}

const defaultCategories: Category[] = [
  { id: "indoor", name: "Indoor Plants", slug: "indoor-plants", order: 1, isActive: true },
  { id: "medicinal", name: "Medicinal Plants", slug: "medicinal-plants", order: 2, isActive: true },
  { id: "succulent", name: "Succulent Plants", slug: "succulent-plants", order: 3, isActive: true },
  { id: "flowering", name: "Flowering Plants", slug: "flowering-plants", order: 4, isActive: true },
];

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        if (snap.size > 0) {
          const cats = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Category[];
          setCategories(cats.sort((a, b) => a.order - b.order));
        } else {
          // Use default categories
          setCategories(defaultCategories);
        }
      } catch {
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.name) {
      toast({
        title: "Missing name",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");
      const newCat: Omit<Category, "id"> = {
        name: newCategory.name,
        slug,
        description: newCategory.description,
        order: categories.length + 1,
        isActive: true,
      };

      const docRef = await addDoc(collection(db, "categories"), newCat);
      setCategories([...categories, { id: docRef.id, ...newCat }]);
      setNewCategory({ name: "", description: "" });
      setShowAddForm(false);
      toast({
        title: "Category added",
        description: "New category has been created.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add category.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name) return;

    try {
      const slug = editForm.name.toLowerCase().replace(/\s+/g, "-");
      await setDoc(
        doc(db, "categories", id),
        { name: editForm.name, description: editForm.description, slug },
        { merge: true }
      );
      setCategories(
        categories.map((c) =>
          c.id === id ? { ...c, name: editForm.name, description: editForm.description, slug } : c
        )
      );
      setEditingId(null);
      toast({
        title: "Category updated",
        description: "Changes have been saved.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((c) => c.id !== id));
      toast({
        title: "Category deleted",
        description: "The category has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || "" });
  };

  return (
    <AdminLayout
      title="Categories"
      subtitle={`${categories.length} categories`}
      actions={
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      }
    >
      <div className="max-w-2xl">
        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-[#e5ebe3] p-6 mb-6">
            <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
              Add New Category
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Outdoor Plants"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="bg-[#2F4836] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Category
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ name: "", description: "" });
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#8F9E8B] hover:text-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderTree className="w-12 h-12 mx-auto mb-4 text-[#8F9E8B] opacity-50" />
              <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                No categories yet
              </h3>
              <p className="text-[#8F9E8B] text-sm mb-4">
                Create categories to organize your products.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#2F4836] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors"
              >
                Add Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#e5ebe3]">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 hover:bg-[#f8faf7] transition-colors">
                  {editingId === cat.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Description..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-white text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(cat.id)}
                          className="px-3 py-1.5 bg-[#2F4836] text-white rounded text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-[#8F9E8B] hover:text-[#1A1A1A] text-sm transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-[#8F9E8B] cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
                        <FolderTree className="w-5 h-5 text-[#2F4836]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A]">{cat.name}</p>
                        {cat.description && (
                          <p className="text-sm text-[#8F9E8B]">{cat.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-[#8F9E8B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
