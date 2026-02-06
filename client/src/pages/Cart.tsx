import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product?: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const subtotal = cartItems?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  ) || 0;

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHero image="/images/cart-hero.png" title="Cart" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="text-center py-20">
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
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-3 border-b border-[#eee] mb-4">
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Product
                </span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">
                  Quantity
                </span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">
                  Subtotal
                </span>
                <span className="text-xs font-heading font-bold text-[#1A1A1A] uppercase tracking-wider text-center">
                  Remove
                </span>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center pb-6 border-b border-[#f0f0f0]"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#f8f9f7] rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.image || ""}
                          alt={item.product?.name || ""}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <span className="font-sans text-sm text-[#1A1A1A] font-medium" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.product?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-[#ddd]">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 })
                              : removeItem.mutate(item.id)
                          }
                          className="px-2 py-1 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 py-1 text-sm text-[#1A1A1A] border-x border-[#ddd] min-w-[40px] text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })
                          }
                          className="px-2 py-1 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-[#1A1A1A]" data-testid={`text-subtotal-${item.id}`}>
                        &#8377;{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => removeItem.mutate(item.id)}
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

            <div className="lg:pl-8" data-testid="cart-summary">
              <h2 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-6 tracking-wide">
                Cart Total
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] uppercase tracking-wider text-xs font-heading">
                    Cart Subtotal
                  </span>
                  <span className="text-[#1A1A1A]" data-testid="text-cart-subtotal">&#8377;{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] uppercase tracking-wider text-xs font-heading">
                    Shipping
                  </span>
                  <span className="text-[#1A1A1A]" data-testid="text-cart-shipping">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-[#eee] pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider font-heading">
                      Total
                    </span>
                    <span className="text-sm font-bold text-[#1A1A1A]" data-testid="text-cart-total">
                      &#8377;{total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-[#8F9E8B] text-white py-3.5 font-heading text-sm tracking-wider uppercase hover:bg-[#7a8b76] transition-colors"
                data-testid="button-checkout"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
