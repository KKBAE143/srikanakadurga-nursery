import { useState } from "react";
import { ShoppingBag, X, Search, Check } from "lucide-react";
import { products as allProducts } from "@/lib/data";
import type { ProductsBlock } from "./types";

interface ProductsBlockEditorProps {
  block: ProductsBlock;
  onChange: (block: ProductsBlock) => void;
}

export default function ProductsBlockEditor({ block, onChange }: ProductsBlockEditorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const selectedProducts = block.productIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    if (block.productIds.includes(productId)) {
      onChange({
        ...block,
        productIds: block.productIds.filter((id) => id !== productId),
      });
    } else {
      onChange({
        ...block,
        productIds: [...block.productIds, productId],
      });
    }
  };

  return (
    <div className="bg-white border border-[#e5ebe3] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-[#2F4836]" />
          <span className="text-sm font-medium text-[#1A1A1A]">Featured Products</span>
        </div>
        <span className="text-xs text-[#8F9E8B]">{block.productIds.length} selected</span>
      </div>

      {/* Title input */}
      <input
        type="text"
        value={block.title || ""}
        onChange={(e) => onChange({ ...block, title: e.target.value })}
        placeholder="Section title (e.g., 'Shop These Plants')"
        className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5ebe3] bg-[#f8faf7] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
      />

      {/* Selected products */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => product && (
            <div
              key={product.id}
              className="flex items-center gap-2 bg-[#EAEFE9] rounded-lg px-2 py-1"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-8 h-8 rounded object-cover"
              />
              <span className="text-sm text-[#1A1A1A]">{product.name}</span>
              <button
                type="button"
                onClick={() => toggleProduct(product.id)}
                className="text-[#8F9E8B] hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Product picker */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full py-2 text-sm text-[#2F4836] border border-[#2F4836] rounded-lg hover:bg-[#EAEFE9] transition-colors"
      >
        {showPicker ? "Close Picker" : "Select Products"}
      </button>

      {showPicker && (
        <div className="border border-[#e5ebe3] rounded-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[#e5ebe3] bg-[#f8faf7]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9E8B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#e5ebe3] bg-white placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836]"
              />
            </div>
          </div>

          {/* Product list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#e5ebe3]">
            {filteredProducts.map((product) => {
              const isSelected = block.productIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`w-full flex items-center gap-3 p-2 text-left hover:bg-[#f8faf7] transition-colors ${
                    isSelected ? "bg-[#EAEFE9]" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded bg-[#f8faf7] overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
                    <p className="text-xs text-[#8F9E8B]">{product.category} • ₹{product.price}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-[#2F4836] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
