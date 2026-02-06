import { useState, useEffect } from "react";
import { Link } from "wouter";
import AdminLayout from "../components/AdminLayout";
import { products as staticProducts, type Product } from "@/lib/data";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Package,
  Filter,
} from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to fetch from Firestore first
        const productsSnap = await getDocs(collection(db, "products"));
        if (productsSnap.size > 0) {
          const firestoreProducts = productsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];
          setProducts(firestoreProducts);
        } else {
          // Fallback to static data
          setProducts(staticProducts);
        }
      } catch {
        // Fallback to static data
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product. It may be static data.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      title="Products"
      subtitle={`${products.length} products in your catalog`}
      actions={
        <Link href="/admin/products/new">
          <button className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </Link>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e5ebe3] p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9E8B]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8F9E8B]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-[#8F9E8B] opacity-50" />
            <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
              No products found
            </h3>
            <p className="text-[#8F9E8B] text-sm mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter."
                : "Get started by adding your first product."}
            </p>
            <Link href="/admin/products/new">
              <button className="bg-[#2F4836] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors">
                Add Product
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8faf7] border-b border-[#e5ebe3]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#8F9E8B] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#8F9E8B] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#8F9E8B] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#8F9E8B] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-[#8F9E8B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5ebe3]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f8faf7] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#EAEFE9] rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A] text-sm">{product.name}</p>
                          <p className="text-xs text-[#8F9E8B] line-clamp-1 max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs font-medium text-[#2F4836] bg-[#EAEFE9] px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">₹{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-[#8F9E8B] line-through">
                            ₹{product.originalPrice}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                          product.inStock
                            ? "text-green-700 bg-green-50"
                            : "text-red-700 bg-red-50"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[#8F9E8B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
