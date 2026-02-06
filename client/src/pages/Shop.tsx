import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { products, getCategories, type Product } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Search,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

export default function Shop() {
  const [location] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

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

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSort("");
    setCurrentPage(1);
  };

  let filteredProducts: Product[] = [...products];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }

  if (selectedSort === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (selectedSort === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (selectedSort === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  } else if (selectedSort === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const categories = getCategories();
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedSort !== "";

  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name", label: "Name: A to Z" },
  ];

  // Sidebar content component for reuse
  const FilterSidebar = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex items-center justify-between lg:hidden mb-4">
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e5ebe3]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#EAEFE9] flex items-center justify-center">
            <Filter className="w-4 h-4 text-[#2F4836]" />
          </div>
          <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
            Categories
          </h3>
        </div>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                selectedCategories.includes(cat)
                  ? "bg-[#2F4836]/10 border border-[#2F4836]/20"
                  : "hover:bg-[#f8faf7] border border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="sr-only"
                data-testid={`checkbox-category-${cat
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              />
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-[#2F4836] border-[#2F4836]"
                    : "border-[#d0d7ce] bg-white"
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${
                  selectedCategories.includes(cat)
                    ? "text-[#2F4836] font-medium"
                    : "text-[#4A4A4A]"
                }`}
              >
                {cat}
              </span>
              <span className="ml-auto text-xs text-[#8F9E8B] bg-[#f0f4ef] px-2 py-0.5 rounded-full">
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e5ebe3]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#EAEFE9] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-[#2F4836]" />
          </div>
          <h3 className="font-heading text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
            Sort By
          </h3>
        </div>
        <div className="space-y-2">
          {sortOptions.map((sort) => (
            <label
              key={sort.value}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                selectedSort === sort.value
                  ? "bg-[#2F4836]/10 border border-[#2F4836]/20"
                  : "hover:bg-[#f8faf7] border border-transparent"
              }`}
            >
              <input
                type="radio"
                name="sort"
                checked={selectedSort === sort.value}
                onChange={() => {
                  setSelectedSort(sort.value);
                  setCurrentPage(1);
                }}
                className="sr-only"
                data-testid={`radio-sort-${sort.value}`}
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedSort === sort.value
                    ? "border-[#2F4836]"
                    : "border-[#d0d7ce] bg-white"
                }`}
              >
                {selectedSort === sort.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F4836]" />
                )}
              </div>
              <span
                className={`text-sm ${
                  selectedSort === sort.value
                    ? "text-[#2F4836] font-medium"
                    : "text-[#4A4A4A]"
                }`}
              >
                {sort.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#d0d7ce] text-[#4A4A4A] hover:border-[#2F4836] hover:text-[#2F4836] transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}

      {/* Promo Card */}
      <div className="bg-gradient-to-br from-[#2F4836] to-[#1a2e1f] rounded-xl p-5 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <Leaf className="w-5 h-5" />
        </div>
        <h4 className="font-heading font-bold mb-2">Need Help Choosing?</h4>
        <p className="text-sm text-white/80 mb-4">
          Our experts can help you find the perfect plants for your space.
        </p>
        <a
          href="/contact"
          className="inline-block text-sm font-semibold text-[#a8d5a2] hover:text-white transition-colors"
        >
          Contact Us →
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      <PageHero
        image="/images/shop-hero.webp"
        title="Shop Our Collection"
        subtitle={
          searchQuery
            ? `Showing results for "${searchQuery}"`
            : "Discover beautiful plants for every corner of your home"
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#e5ebe3] shadow-sm hover:shadow-md transition-all text-sm font-medium text-[#1A1A1A]"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-[#2F4836] text-white text-xs flex items-center justify-center">
                  {selectedCategories.length + (selectedSort ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Results Count */}
            <div className="text-sm text-[#4A4A4A]">
              {searchQuery ? (
                <span data-testid="text-search-results">
                  <span className="font-semibold text-[#1A1A1A]">
                    {filteredProducts.length}
                  </span>{" "}
                  result{filteredProducts.length !== 1 ? "s" : ""} for "
                  {searchQuery}"
                </span>
              ) : (
                <span>
                  Showing{" "}
                  <span className="font-semibold text-[#1A1A1A]">
                    {paginatedProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#1A1A1A]">
                    {filteredProducts.length}
                  </span>{" "}
                  plants
                </span>
              )}
            </div>
          </div>

          {/* View Toggle & Quick Sort (Desktop) */}
          <div className="flex items-center gap-3">
            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-[#e5ebe3] p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-md transition-all ${
                  gridCols === 3
                    ? "bg-[#2F4836] text-white"
                    : "text-[#8F9E8B] hover:text-[#2F4836]"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-md transition-all ${
                  gridCols === 4
                    ? "bg-[#2F4836] text-white"
                    : "text-[#8F9E8B] hover:text-[#2F4836]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sort Dropdown */}
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="hidden sm:block px-4 py-2.5 bg-white rounded-xl border border-[#e5ebe3] shadow-sm text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#2F4836]/20 focus:border-[#2F4836] cursor-pointer"
            >
              <option value="">Sort by: Featured</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#8F9E8B] uppercase tracking-wider">
              Active filters:
            </span>
            {selectedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F4836]/10 text-[#2F4836] rounded-full text-sm font-medium hover:bg-[#2F4836]/20 transition-colors"
              >
                {cat}
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            {selectedSort && (
              <button
                onClick={() => setSelectedSort("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F4836]/10 text-[#2F4836] rounded-full text-sm font-medium hover:bg-[#2F4836]/20 transition-colors"
              >
                {sortOptions.find((s) => s.value === selectedSort)?.label}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block" data-testid="shop-sidebar">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[#f8faf7] p-6 overflow-y-auto">
                <FilterSidebar onClose={() => setMobileFiltersOpen(false)} />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div>
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e5ebe3]">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#EAEFE9] rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-[#8F9E8B]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-2">
                  No plants found
                </h3>
                <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
                  We couldn't find any plants matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F4836] text-white rounded-xl font-medium hover:bg-[#243a2b] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 ${
                  gridCols === 3
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-3 lg:grid-cols-4"
                } gap-4 sm:gap-6`}
                data-testid="product-grid"
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2 mt-12"
                data-testid="pagination"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-[#e5ebe3] bg-white text-sm font-medium text-[#4A4A4A] hover:border-[#2F4836] hover:text-[#2F4836] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e5ebe3] disabled:hover:text-[#4A4A4A] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(currentPage - page) <= 1;

                    if (!showPage) {
                      // Show ellipsis
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span
                            key={i}
                            className="w-9 h-9 flex items-center justify-center text-[#8F9E8B] text-sm"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center text-sm rounded-xl font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#2F4836] text-white shadow-md"
                            : "border border-[#e5ebe3] bg-white text-[#4A4A4A] hover:border-[#2F4836] hover:text-[#2F4836]"
                        }`}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-[#e5ebe3] bg-white text-sm font-medium text-[#4A4A4A] hover:border-[#2F4836] hover:text-[#2F4836] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e5ebe3] disabled:hover:text-[#4A4A4A] transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <p className="text-center text-sm text-[#8F9E8B] mt-4">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
