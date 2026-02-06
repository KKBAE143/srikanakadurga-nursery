import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getProducts, type Product } from "@/lib/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";

const PRODUCTS_PER_PAGE = 8;

export default function Shop() {
  const [location] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const search = params.get("search") || "";
    setSearchQuery(search);
    if (search) setCurrentPage(1);
  }, [location]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  let filteredProducts = products;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }

  if (selectedSort === "Price- Low to High") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (selectedSort === "Price- High to Low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (selectedSort === "Rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <PageHero
        image="/images/shop-hero.webp"
        title="Shop With Us"
        subtitle={searchQuery ? `Showing results for "${searchQuery}"` : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          <aside className="space-y-6" data-testid="shop-sidebar">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-sm text-[#4A4A4A] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="accent-[#2F4836] w-3.5 h-3.5"
                      data-testid={`checkbox-category-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
                Sort By
              </h3>
              <div className="space-y-2">
                {["Price- Low to High", "Price- High to Low", "Rating"].map(
                  (sort) => (
                    <label
                      key={sort}
                      className="flex items-center gap-2 text-sm text-[#4A4A4A] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        checked={selectedSort === sort}
                        onChange={() => { setSelectedSort(sort); setCurrentPage(1); }}
                        className="accent-[#2F4836] w-3.5 h-3.5"
                        data-testid={`radio-sort-${sort.replace(/\s+/g, "-").toLowerCase()}`}
                      />
                      {sort}
                    </label>
                  )
                )}
              </div>
            </div>
          </aside>

          <div>
            {searchQuery && (
              <p className="text-sm text-[#4A4A4A] mb-4" data-testid="text-search-results">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-sm animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8F9E8B] font-heading text-lg">No plants found</p>
                <p className="text-sm text-[#4A4A4A] mt-1">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
                      currentPage === i + 1
                        ? "bg-[#2F4836] text-white border-[#2F4836]"
                        : "border-[#ddd] bg-white text-[#4A4A4A] hover:border-[#2F4836]"
                    }`}
                    data-testid={`button-page-${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
