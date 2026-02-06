import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { getWishlist, type Product, type WishlistItem } from "@/lib/firestore";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<(WishlistItem & { product?: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login");
      return;
    }
    const load = async () => {
      setLoading(true);
      const wishItems = await getWishlist(user.uid);
      setItems(wishItems);
      setLoading(false);
    };
    load();
  }, [user, authLoading]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] tracking-wide uppercase mb-8" data-testid="text-wishlist-title">
          My Wishlist
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-[#dde3dc] mx-auto mb-4" />
            <p className="font-heading text-xl text-[#8F9E8B] mb-3">Your wishlist is empty</p>
            <p className="text-sm text-[#4A4A4A] mb-6">Save plants you love to your wishlist</p>
            <Link href="/shop">
              <button className="bg-[#2F4836] text-white px-8 py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors" data-testid="button-browse-plants">
                Browse Plants
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) =>
              item.product ? (
                <ProductCard key={item.id} product={item.product} />
              ) : null
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
