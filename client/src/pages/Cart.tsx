import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart as CartIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCartItems, updateCartItemQty, removeCartItem } from "@/lib/firestore";
import { getProductById, type Product } from "@/lib/data";
import { getImageUrl } from "@/lib/images";

interface CartItemDisplay {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const items = await getCartItems(user.uid);
      const enriched = items.map((item) => ({
        ...item,
        product: getProductById(item.productId),
      }));
      setCartItems(enriched);
    } catch {
      toast({ title: "Error", description: "Failed to load cart", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadCart();
  }, [user, authLoading]);

  const handleUpdateQty = async (cartItemId: string, newQty: number) => {
    if (!user) return;
    if (newQty < 1) {
      await handleRemove(cartItemId);
      return;
    }
    try {
      await updateCartItemQty(user.uid, cartItemId, newQty);
      setCartItems((prev) =>
        prev.map((item) => item.id === cartItemId ? { ...item, quantity: newQty } : item)
      );
    } catch {
      toast({ title: "Error", description: "Failed to update quantity", variant: "destructive" });
    }
  };

  const handleRemove = async (cartItemId: string) => {
    if (!user) return;
    try {
      await removeCartItem(user.uid, cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#EAEFE9]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <CartIcon className="w-12 h-12 text-[#dde3dc] mx-auto mb-4" />
          <p className="font-heading text-xl text-[#8F9E8B] mb-3">Please sign in to view your cart</p>
          <Link href="/login">
            <button className="bg-[#2F4836] text-white px-8 py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors" data-testid="button-login-to-cart">
              Sign In
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] tracking-wide uppercase mb-8" data-testid="text-cart-title">
          Shopping Cart
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 bg-white rounded-sm p-4">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <CartIcon className="w-12 h-12 text-[#dde3dc] mx-auto mb-4" />
            <p className="text-[#8F9E8B] font-heading text-xl mb-3">Your cart is empty</p>
            <p className="text-[#4A4A4A] text-sm mb-6">
              Browse our collection and add some plants to your cart
            </p>
            <Link href="/shop">
              <button
                className="bg-[#2F4836] text-white px-8 py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
            <div>
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-3 border-b border-[#dde3dc] mb-4">
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider">Product</span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">Quantity</span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">Subtotal</span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">Remove</span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center bg-white rounded-sm p-4"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#f8f9f7] rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item.product?.image || "")}
                          alt={item.product?.name || ""}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div>
                        <span className="font-sans text-sm text-[#1A1A1A] font-medium" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.product?.name}
                        </span>
                        <p className="text-xs text-[#8F9E8B] mt-0.5">&#8377;{item.product?.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-[#dde3dc]">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 py-1 text-sm text-[#1A1A1A] border-x border-[#dde3dc] min-w-[40px] text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-[#1A1A1A] font-medium" data-testid={`text-subtotal-${item.id}`}>
                        &#8377;{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-[#8F9E8B] hover:text-red-500 transition-colors p-1"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 h-fit" data-testid="cart-summary">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-6 tracking-wide uppercase">
                Cart Total
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] uppercase tracking-wider text-xs font-heading">Cart Subtotal</span>
                  <span className="text-[#1A1A1A]" data-testid="text-cart-subtotal">&#8377;{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] uppercase tracking-wider text-xs font-heading">Shipping</span>
                  <span className="text-[#1A1A1A]" data-testid="text-cart-shipping">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-[#eee] pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider font-heading">Total</span>
                    <span className="text-sm font-bold text-[#2F4836]" data-testid="text-cart-total">&#8377;{total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLocation("/checkout")}
                className="w-full mt-6 bg-[#2F4836] text-white py-3.5 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </button>
              <Link href="/shop">
                <button
                  className="w-full mt-2 border border-[#dde3dc] text-[#4A4A4A] py-3 font-heading text-xs tracking-wider uppercase hover:border-[#2F4836] hover:text-[#2F4836] transition-colors"
                  data-testid="button-continue-shopping"
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
