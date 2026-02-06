import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/firestore";
import { addCartItem, addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/firestore";
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
    isInWishlist(user.uid, product.id).then(setWishlisted).catch(() => {});
  }, [user, product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to add items to your cart", variant: "destructive" });
      return;
    }
    setAdding(true);
    try {
      await addCartItem(user.uid, product.id);
      toast({ title: "Added to cart", description: `${product.name} added to your cart` });
    } catch {
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to save items", variant: "destructive" });
      return;
    }
    try {
      if (wishlisted) {
        await removeFromWishlist(user.uid, product.id);
        setWishlisted(false);
      } else {
        await addToWishlist(user.uid, product.id);
        setWishlisted(true);
        toast({ title: "Saved", description: `${product.name} added to wishlist` });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
    }
  };

  return (
    <div
      className="bg-white rounded-sm overflow-hidden group transition-shadow duration-300 hover:shadow-lg"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-[#f8f9f7] overflow-hidden relative cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            data-testid={`img-product-${product.id}`}
          />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-center gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-sans text-sm text-[#1A1A1A] font-medium mb-1 hover:text-[#2F4836] cursor-pointer" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#2F4836]" data-testid={`text-product-price-${product.id}`}>
            &#8377;{product.price}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`transition-colors ${wishlisted ? "text-red-500" : "text-[#8F9E8B] hover:text-[#2F4836]"}`}
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="text-[#8F9E8B] hover:text-[#2F4836] transition-colors"
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
