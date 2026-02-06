import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";

const categories = [
  "Flowering Plants",
  "Indoor Plants",
  "Succulent Plants",
  "Medicinal Plants",
  "Climbers",
  "Seeds",
  "Fertilizers",
  "Pebbles & Decor",
];

const sortOptions = [
  "Most Bought",
  "Price- Low to High",
  "Price- High to Low",
];

export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  let filteredProducts = products || [];

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }

  if (selectedSort === "Price- Low to High") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (selectedSort === "Price- High to Low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHero image="/images/shop-hero.png" title="Shop With Us" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          <aside className="space-y-8" data-testid="sidebar-filters">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mb-4 tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter & Sort
              </h3>
            </div>

            <div>
              <h4 className="font-heading text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3 border-b border-[#eee] pb-2">
                Category
              </h4>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    data-testid={`filter-category-${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-3.5 h-3.5 border-2 border-[#ccc] rounded-none accent-[#2F4836] cursor-pointer"
                    />
                    <span className="text-sm text-[#4A4A4A] group-hover:text-[#1A1A1A] transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3 border-b border-[#eee] pb-2">
                Sort By
              </h4>
              <div className="space-y-2.5">
                {sortOptions.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    data-testid={`filter-sort-${opt.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSort === opt}
                      onChange={() => setSelectedSort(selectedSort === opt ? "" : opt)}
                      className="w-3.5 h-3.5 border-2 border-[#ccc] rounded-none accent-[#2F4836] cursor-pointer"
                    />
                    <span className="text-sm text-[#4A4A4A] group-hover:text-[#1A1A1A] transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-[#f8f9f7] rounded-sm animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#8F9E8B] font-heading text-lg">No products found</p>
                <p className="text-[#4A4A4A] text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" data-testid="grid-products">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
                          currentPage === i + 1
                            ? "bg-[#2F4836] text-white border-[#2F4836]"
                            : "bg-white text-[#4A4A4A] border-[#ddd] hover:border-[#2F4836]"
                        }`}
                        data-testid={`button-page-${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="w-9 h-9 flex items-center justify-center text-sm border border-[#ddd] bg-white text-[#4A4A4A] hover:border-[#2F4836] transition-colors"
                        data-testid="button-page-next"
                      >
                        &gt;
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
