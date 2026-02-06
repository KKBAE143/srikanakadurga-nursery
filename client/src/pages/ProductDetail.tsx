import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Droplets,
  Sun,
  Leaf,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Check,
  Package,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  addCartItem,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/firestore";
import { getProductById, products, type Product } from "@/lib/data";
import { getImageUrl } from "@/lib/images";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "care" | "shipping">("description");
  const [copied, setCopied] = useState(false);

  const product = params?.id ? getProductById(params.id) : undefined;
  const relatedProducts = product
    ? products
        .filter((rp) => rp.category === product.category && rp.id !== product.id)
        .slice(0, 4)
    : [];

  useEffect(() => {
    if (!user || !product) return;
    isInWishlist(user.uid, product.id)
      .then(setWishlisted)
      .catch(() => {});
  }, [user, product?.id]);

  useEffect(() => {
    // Scroll to top on product change
    window.scrollTo(0, 0);
  }, [params?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addCartItem(user.uid, product.id);
      }
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} added to your cart`,
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

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to save items",
        variant: "destructive",
      });
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
        toast({
          title: "Added to wishlist",
          description: `${product.name} saved to your wishlist`,
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share it with friends" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8faf7]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#EAEFE9] rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-[#8F9E8B]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">
            Product not found
          </h1>
          <p className="text-[#4A4A4A] mb-6">
            The plant you're looking for might have been moved or doesn't exist.
          </p>
          <Link href="/shop">
            <button
              className="bg-[#2F4836] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#243a2b] transition-colors"
              data-testid="button-back-to-shop"
            >
              Browse All Plants
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-[#8F9E8B] mb-8"
          data-testid="breadcrumb"
        >
          <Link href="/">
            <span className="hover:text-[#2F4836] cursor-pointer transition-colors">
              Home
            </span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop">
            <span className="hover:text-[#2F4836] cursor-pointer transition-colors">
              Shop
            </span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>
            <span className="hover:text-[#2F4836] cursor-pointer transition-colors">
              {product.category}
            </span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1A1A] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl p-8 aspect-square flex items-center justify-center shadow-sm border border-[#e5ebe3] overflow-hidden group">
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#2F4836] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  Save {discount}%
                </div>
              )}

              {/* Stock Badge */}
              <div
                className={`absolute top-4 right-4 z-10 text-sm font-medium px-3 py-1.5 rounded-full ${
                  product.inStock
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>

              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="eager"
                data-testid="img-product-detail"
              />
            </div>

            {/* Thumbnail placeholder - for future expansion */}
            <div className="hidden sm:flex gap-3">
              <div className="w-20 h-20 bg-white rounded-xl border-2 border-[#2F4836] p-2 cursor-pointer">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#f8faf7] to-[#EAEFE9] rounded-xl border border-[#e5ebe3] flex items-center justify-center text-[#8F9E8B]">
                <Leaf className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            {/* Category */}
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#2F4836] bg-[#EAEFE9] px-3 py-1 rounded-full mb-4 hover:bg-[#2F4836] hover:text-white transition-colors cursor-pointer">
                {product.category}
              </span>
            </Link>

            {/* Name */}
            <h1
              className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4"
              data-testid="text-product-detail-name"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#4A4A4A]">
                {product.rating}.0 rating
              </span>
              <span className="text-[#d0d7ce]">|</span>
              <span className="text-sm text-[#2F4836] font-medium">
                12 Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span
                className="text-4xl font-bold text-[#2F4836]"
                data-testid="text-product-detail-price"
              >
                &#8377;{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-[#8F9E8B] line-through">
                    &#8377;{product.originalPrice}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    You save &#8377;{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              data-testid="text-product-description"
            >
              {product.description}
            </p>

            {/* Plant Care Quick Info */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {product.lightRequirement && (
                <div className="bg-white rounded-xl p-4 border border-[#e5ebe3] text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-amber-50 rounded-full flex items-center justify-center">
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider mb-1">
                    Light
                  </p>
                  <p className="text-xs text-[#1A1A1A] font-medium">
                    {product.lightRequirement}
                  </p>
                </div>
              )}
              {product.waterFrequency && (
                <div className="bg-white rounded-xl p-4 border border-[#e5ebe3] text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-blue-50 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider mb-1">
                    Water
                  </p>
                  <p className="text-xs text-[#1A1A1A] font-medium">
                    {product.waterFrequency}
                  </p>
                </div>
              )}
              {product.petFriendly !== undefined && (
                <div className="bg-white rounded-xl p-4 border border-[#e5ebe3] text-center">
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      product.petFriendly ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <Leaf
                      className={`w-5 h-5 ${
                        product.petFriendly ? "text-green-500" : "text-red-400"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider mb-1">
                    Pet Safe
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      product.petFriendly ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {product.petFriendly ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3.5 hover:bg-[#f8faf7] transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-[#4A4A4A]" />
                </button>
                <span className="px-6 py-3 text-center min-w-[60px] font-semibold text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3.5 hover:bg-[#f8faf7] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#4A4A4A]" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.inStock}
                className="flex-1 bg-[#2F4836] text-white py-3.5 px-8 rounded-xl font-medium hover:bg-[#243a2b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                data-testid="button-add-to-cart-detail"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding
                  ? "Adding..."
                  : product.inStock
                  ? `Add to Cart - ₹${product.price * quantity}`
                  : "Out of Stock"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleWishlist}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-[#e5ebe3] text-[#4A4A4A] hover:text-[#2F4836] hover:border-[#2F4836]"
                }`}
                data-testid="button-wishlist-detail"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">
                  {wishlisted ? "Saved" : "Save"}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e5ebe3] text-[#4A4A4A] hover:text-[#2F4836] hover:border-[#2F4836] transition-all"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {copied ? "Copied!" : "Share"}
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#EAEFE9] rounded-xl">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#2F4836]" />
                </div>
                <p className="text-xs text-[#1A1A1A] font-medium">Free Delivery</p>
                <p className="text-[10px] text-[#8F9E8B]">Orders over ₹500</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#2F4836]" />
                </div>
                <p className="text-xs text-[#1A1A1A] font-medium">Plant Guarantee</p>
                <p className="text-[10px] text-[#8F9E8B]">7-day freshness</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#2F4836]" />
                </div>
                <p className="text-xs text-[#1A1A1A] font-medium">Easy Returns</p>
                <p className="text-[10px] text-[#8F9E8B]">Hassle-free policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-[#e5ebe3]">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "description"
                  ? "border-[#2F4836] text-[#2F4836]"
                  : "border-transparent text-[#8F9E8B] hover:text-[#4A4A4A]"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "care"
                  ? "border-[#2F4836] text-[#2F4836]"
                  : "border-transparent text-[#8F9E8B] hover:text-[#4A4A4A]"
              }`}
            >
              Care Guide
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "shipping"
                  ? "border-[#2F4836] text-[#2F4836]"
                  : "border-transparent text-[#8F9E8B] hover:text-[#4A4A4A]"
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="bg-white rounded-b-2xl rounded-tr-2xl p-8 border border-t-0 border-[#e5ebe3]">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                  About {product.name}
                </h3>
                <p className="text-[#4A4A4A] leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-[#4A4A4A] leading-relaxed">
                  Bring home this beautiful {product.name.toLowerCase()} from Sri
                  Kanakadurga Nursery. Each plant is carefully selected and
                  nurtured to ensure it arrives at your doorstep healthy and
                  thriving. Perfect for {product.category.toLowerCase()} enthusiasts
                  and beginners alike.
                </p>

                <div className="mt-6 p-4 bg-[#f8faf7] rounded-xl">
                  <h4 className="font-heading font-semibold text-[#1A1A1A] mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                      <Check className="w-4 h-4 text-[#2F4836]" />
                      Healthy {product.name} plant
                    </li>
                    <li className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                      <Check className="w-4 h-4 text-[#2F4836]" />
                      Nursery pot included
                    </li>
                    <li className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                      <Check className="w-4 h-4 text-[#2F4836]" />
                      Care instruction card
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  How to Care for Your {product.name}
                </h3>

                {product.careInstructions && (
                  <div className="p-4 bg-[#f8faf7] rounded-xl">
                    <p className="text-[#4A4A4A] leading-relaxed">
                      {product.careInstructions}
                    </p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {product.lightRequirement && (
                    <div className="flex gap-4 p-4 bg-white border border-[#e5ebe3] rounded-xl">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-1">
                          Light Requirements
                        </h4>
                        <p className="text-sm text-[#4A4A4A]">
                          {product.lightRequirement}. Place near a window for
                          optimal growth.
                        </p>
                      </div>
                    </div>
                  )}
                  {product.waterFrequency && (
                    <div className="flex gap-4 p-4 bg-white border border-[#e5ebe3] rounded-xl">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-1">
                          Watering Schedule
                        </h4>
                        <p className="text-sm text-[#4A4A4A]">
                          Water {product.waterFrequency.toLowerCase()}. Check soil
                          moisture before watering.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-l-4 border-[#2F4836] bg-[#EAEFE9] rounded-r-xl">
                  <p className="text-sm text-[#4A4A4A]">
                    <strong className="text-[#1A1A1A]">Pro Tip:</strong> Most
                    houseplants prefer humidity. Mist your plant regularly or
                    place it on a pebble tray with water.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Shipping & Returns
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-[#f8faf7] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-[#2F4836]" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A]">
                        Free Delivery
                      </h4>
                    </div>
                    <p className="text-sm text-[#4A4A4A]">
                      Free delivery on orders above ₹500 within Hyderabad. Standard
                      shipping charges apply for other locations.
                    </p>
                  </div>

                  <div className="p-5 bg-[#f8faf7] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#2F4836]" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A]">
                        Delivery Time
                      </h4>
                    </div>
                    <p className="text-sm text-[#4A4A4A]">
                      Orders are processed within 24 hours. Delivery within
                      Hyderabad: 1-2 days. Outside Hyderabad: 3-5 days.
                    </p>
                  </div>

                  <div className="p-5 bg-[#f8faf7] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-[#2F4836]" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A]">
                        Return Policy
                      </h4>
                    </div>
                    <p className="text-sm text-[#4A4A4A]">
                      If your plant arrives damaged, contact us within 24 hours
                      with photos. We'll replace it free of charge.
                    </p>
                  </div>

                  <div className="p-5 bg-[#f8faf7] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#2F4836]" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A]">
                        Plant Guarantee
                      </h4>
                    </div>
                    <p className="text-sm text-[#4A4A4A]">
                      7-day freshness guarantee. If your plant doesn't thrive,
                      we'll help troubleshoot or provide a replacement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Need Help Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#2F4836] to-[#1a2e1f] rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl font-bold mb-2">
                Need Help With Your Plants?
              </h3>
              <p className="text-white/80">
                Our plant experts are here to answer your questions and help you
                choose the perfect plants.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Call Us</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-[#a8d5a2] hover:bg-[#8fc789] text-[#1a2e1f] rounded-xl transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold text-[#1A1A1A]">
                You May Also Like
              </h2>
              <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>
                <span className="text-sm font-medium text-[#2F4836] hover:underline cursor-pointer flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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
