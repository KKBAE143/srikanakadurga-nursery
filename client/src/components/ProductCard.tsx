import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCart = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", { productId: product.id, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: "Added to cart", description: `${product.name} added to your cart` });
    },
  });

  return (
    <div
      className="bg-white rounded-sm overflow-hidden group transition-shadow duration-300 hover:shadow-lg"
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-square bg-[#f8f9f7] overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-product-${product.id}`}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <h3 className="font-sans text-sm text-[#1A1A1A] font-medium mb-1" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#2F4836]" data-testid={`text-product-price-${product.id}`}>
            &#8377;{product.price}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="text-[#8F9E8B] hover:text-[#2F4836] transition-colors"
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="text-[#8F9E8B] hover:text-[#2F4836] transition-colors"
              onClick={() => addToCart.mutate()}
              disabled={addToCart.isPending}
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
