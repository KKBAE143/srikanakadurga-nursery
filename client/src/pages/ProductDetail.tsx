import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Droplets, Sun, Leaf } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addCartItem, addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/firestore";
import { getProductById, products, type Product } from "@/lib/data";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const product = params?.id ? getProductById(params.id) : undefined;
  const relatedProducts = product
    ? products.filter((rp) => rp.category === product.category && rp.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    if (!user || !product) return;
    isInWishlist(user.uid, product.id).then(setWishlisted).catch(() => {});
  }, [user, product?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to sign in to add items to cart", variant: "destructive" });
      return;
    }
    if (!product) return;
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

  const handleWishlist = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to sign in to save items", variant: "destructive" });
      return;
    }
    if (!product) return;
    try {
      if (wishlisted) {
        await removeFromWishlist(user.uid, product.id);
        setWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await addToWishlist(user.uid, product.id);
        setWishlisted(true);
        toast({ title: "Added to wishlist", description: `${product.name} saved to your wishlist` });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EAEFE9]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-heading text-xl text-[#1A1A1A]">Product not found</p>
          <Link href="/shop">
            <button className="mt-4 bg-[#2F4836] text-white px-6 py-2 font-heading text-sm tracking-wider uppercase" data-testid="button-back-to-shop">
              Back to Shop
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-xs text-[#8F9E8B] font-heading mb-8" data-testid="breadcrumb">
          <Link href="/"><span className="hover:text-[#2F4836] cursor-pointer">Home</span></Link>
          <span className="mx-2">/</span>
          <Link href="/shop"><span className="hover:text-[#2F4836] cursor-pointer">Shop</span></Link>
          <span className="mx-2">/</span>
          <span className="text-[#1A1A1A]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-sm p-8 aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              loading="eager"
              data-testid="img-product-detail"
            />
          </div>

          <div>
            <p className="text-xs text-[#8F9E8B] font-heading tracking-wider uppercase mb-2" data-testid="text-product-category">
              {product.category}
            </p>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] tracking-wide uppercase mb-3" data-testid="text-product-detail-name">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-xs text-[#8F9E8B] ml-2">({product.rating}/5)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#2F4836]" data-testid="text-product-detail-price">
                &#8377;{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#8F9E8B] line-through">&#8377;{product.originalPrice}</span>
              )}
            </div>

            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6" data-testid="text-product-description">
              {product.description}
            </p>

            {(product.lightRequirement || product.waterFrequency) && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.lightRequirement && (
                  <div className="flex items-center gap-2 bg-white rounded-sm p-3">
                    <Sun className="w-4 h-4 text-[#8F9E8B]" />
                    <div>
                      <p className="text-[10px] text-[#8F9E8B] font-heading uppercase tracking-wider">Light</p>
                      <p className="text-xs text-[#1A1A1A] font-medium">{product.lightRequirement}</p>
                    </div>
                  </div>
                )}
                {product.waterFrequency && (
                  <div className="flex items-center gap-2 bg-white rounded-sm p-3">
                    <Droplets className="w-4 h-4 text-[#8F9E8B]" />
                    <div>
                      <p className="text-[10px] text-[#8F9E8B] font-heading uppercase tracking-wider">Water</p>
                      <p className="text-xs text-[#1A1A1A] font-medium">{product.waterFrequency}</p>
                    </div>
                  </div>
                )}
                {product.petFriendly !== undefined && (
                  <div className="flex items-center gap-2 bg-white rounded-sm p-3">
                    <Leaf className="w-4 h-4 text-[#8F9E8B]" />
                    <div>
                      <p className="text-[10px] text-[#8F9E8B] font-heading uppercase tracking-wider">Pet Safe</p>
                      <p className="text-xs text-[#1A1A1A] font-medium">{product.petFriendly ? "Yes" : "No"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {product.careInstructions && (
              <div className="bg-white rounded-sm p-4 mb-6">
                <h3 className="text-xs font-heading font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                  Care Instructions
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{product.careInstructions}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.inStock}
                className="flex-1 bg-[#2F4836] text-white py-3.5 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="button-add-to-cart-detail"
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3.5 border transition-colors ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-[#dde3dc] text-[#8F9E8B] hover:text-[#2F4836] hover:border-[#2F4836]"
                }`}
                data-testid="button-wishlist-detail"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-sm">
                <Truck className="w-4 h-4 text-[#2F4836] mx-auto mb-1" />
                <p className="text-[10px] text-[#4A4A4A]">Free Delivery</p>
              </div>
              <div className="text-center p-3 bg-white rounded-sm">
                <Shield className="w-4 h-4 text-[#2F4836] mx-auto mb-1" />
                <p className="text-[10px] text-[#4A4A4A]">Plant Guarantee</p>
              </div>
              <div className="text-center p-3 bg-white rounded-sm">
                <RotateCcw className="w-4 h-4 text-[#2F4836] mx-auto mb-1" />
                <p className="text-[10px] text-[#4A4A4A]">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] tracking-wide uppercase mb-8">
              Related Plants
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
