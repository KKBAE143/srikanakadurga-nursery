import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import type { Product } from "@/lib/data";
import {
  addCartItem,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!user) return;
    isInWishlist(user.uid, product.id)
      .then(setWishlisted)
      .catch(() => {});
  }, [user, product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    setAdding(true);
    try {
      await addCartItem(user.uid, product.id);
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Sign in to save items",
        variant: "destructive",
      });
      return;
    }
    try {
      if (wishlisted) {
        await removeFromWishlist(user.uid, product.id);
        setWishlisted(false);
      } else {
        await addToWishlist(user.uid, product.id);
        setWishlisted(true);
        toast({
          title: "Saved",
          description: `${product.name} added to wishlist`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl border border-[#e5ebe3] hover:border-[#2F4836]/30 relative"
      data-testid={`card-product-${product.id}`}
    >
      {/* Wishlist Button - Top Right */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          wishlisted
            ? "bg-red-50 text-red-500"
            : "bg-white/90 backdrop-blur-sm text-[#8F9E8B] hover:text-red-500 hover:bg-red-50"
        } shadow-sm`}
        data-testid={`button-wishlist-${product.id}`}
      >
        <Heart
          className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`}
        />
      </button>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-[#2F4836] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-20 bg-white/80 flex items-center justify-center">
          <span className="bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-gradient-to-br from-[#f8faf7] to-[#EAEFE9] overflow-hidden relative cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            data-testid={`img-product-${product.id}`}
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-[#2F4836]/0 group-hover:bg-[#2F4836]/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/95 backdrop-blur-sm text-[#2F4836] text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        {/* Category Tag */}
        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#8F9E8B] bg-[#f0f4ef] px-2 py-0.5 rounded mb-2">
          {product.category}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < product.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-[#8F9E8B] ml-1">
            ({product.rating}.0)
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3
            className="font-heading text-sm font-semibold text-[#1A1A1A] mb-2 hover:text-[#2F4836] cursor-pointer line-clamp-2 leading-snug transition-colors"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-lg font-bold text-[#2F4836]"
            data-testid={`text-product-price-${product.id}`}
          >
            &#8377;{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#8F9E8B] line-through">
              &#8377;{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding || !product.inStock}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.inStock
              ? "bg-[#2F4836] text-white hover:bg-[#243a2b] active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          data-testid={`button-add-cart-${product.id}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {adding ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
