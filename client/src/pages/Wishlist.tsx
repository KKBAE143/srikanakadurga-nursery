import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWishlistItems, removeFromWishlist, addCartItem } from "@/lib/firestore";
import { getProductById, type Product } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  ArrowRight,
  Sparkles,
  Package,
} from "lucide-react";

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [wishProducts, setWishProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login");
      return;
    }
    const load = async () => {
      setLoading(true);
      const wishItems = await getWishlistItems(user.uid);
      const prods: Product[] = [];
      for (const item of wishItems) {
        const p = getProductById(item.productId);
        if (p) prods.push(p);
      }
      setWishProducts(prods);
      setLoading(false);
    };
    load();
  }, [user, authLoading, setLocation]);

  const handleRemove = async (productId: string) => {
    if (!user) return;
    setRemovingId(productId);
    try {
      await removeFromWishlist(user.uid, productId);
      setWishProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) return;
    setAddingToCartId(product.id);
    try {
      await addCartItem(user.uid, product.id);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    if (!user || wishProducts.length === 0) return;
    for (const product of wishProducts) {
      if (product.inStock) {
        await addCartItem(user.uid, product.id);
      }
    }
    toast({
      title: "Added to cart",
      description: "All available items have been added to your cart",
    });
  };

  if (authLoading) return null;

  const totalValue = wishProducts.reduce((sum, p) => sum + p.price, 0);
  const totalSavings = wishProducts.reduce(
    (sum, p) => sum + (p.originalPrice ? p.originalPrice - p.price : 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2F4836] to-[#1a2e1f] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                </div>
                <h1
                  className="font-heading text-2xl sm:text-3xl font-bold text-white"
                  data-testid="text-wishlist-title"
                >
                  My Wishlist
                </h1>
              </div>
              <p className="text-white/60 text-sm">
                {wishProducts.length} {wishProducts.length === 1 ? "item" : "items"} saved
              </p>
            </div>

            {wishProducts.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Value</p>
                  <p className="text-white font-bold text-xl">₹{totalValue.toLocaleString()}</p>
                  {totalSavings > 0 && (
                    <p className="text-green-400 text-xs">You save ₹{totalSavings}</p>
                  )}
                </div>
                <button
                  onClick={handleMoveAllToCart}
                  className="bg-white text-[#2F4836] px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#a8d5a2] transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-[#e5ebe3] animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : wishProducts.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#EAEFE9] to-[#dde3dc] rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#8F9E8B]" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-[#8F9E8B] mb-8 max-w-md mx-auto">
                Save plants you love by clicking the heart icon on any product. We'll keep them here for when you're ready.
              </p>
              <Link href="/shop">
                <button
                  className="bg-[#2F4836] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors inline-flex items-center gap-2"
                  data-testid="button-browse-plants"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Plants
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wishProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-[#e5ebe3] hover:border-[#2F4836]/30 hover:shadow-lg transition-all overflow-hidden group"
                    data-testid={`wishlist-item-${product.id}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <Link href={`/product/${product.id}`}>
                        <div className="relative w-full sm:w-40 h-40 bg-gradient-to-br from-[#f8faf7] to-[#EAEFE9] flex-shrink-0 cursor-pointer overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                          {discount > 0 && (
                            <div className="absolute top-2 left-2 bg-[#2F4836] text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{discount}%
                            </div>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col">
                        <div className="flex-1">
                          {/* Category & Rating */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8F9E8B] bg-[#f0f4ef] px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
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
                          </div>

                          {/* Name */}
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] hover:text-[#2F4836] transition-colors cursor-pointer mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Description */}
                          <p className="text-sm text-[#8F9E8B] line-clamp-2 mb-3">
                            {product.description}
                          </p>

                          {/* Price */}
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-[#2F4836]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-[#8F9E8B] line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                Save ₹{product.originalPrice! - product.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#e5ebe3]">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock || addingToCartId === product.id}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                              product.inStock
                                ? "bg-[#2F4836] text-white hover:bg-[#243a2b]"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            data-testid={`button-add-cart-${product.id}`}
                          >
                            {addingToCartId === product.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
                              </>
                            )}
                          </button>

                          <Link href={`/product/${product.id}`}>
                            <button className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#2F4836] border border-[#2F4836] hover:bg-[#2F4836] hover:text-white transition-colors flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              View
                            </button>
                          </Link>

                          <button
                            onClick={() => handleRemove(product.id)}
                            disabled={removingId === product.id}
                            className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove from wishlist"
                            data-testid={`button-remove-${product.id}`}
                          >
                            {removingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Continue Shopping */}
              <div className="text-center pt-8">
                <Link href="/shop">
                  <button className="text-[#2F4836] font-medium hover:underline inline-flex items-center gap-2">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
