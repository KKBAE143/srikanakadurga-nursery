import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCartItems, removeCartItem } from "@/lib/firestore";
import { getProductById, type Product } from "@/lib/data";
import { getImageUrl } from "@/lib/images";
import {
  createOrder,
  updateOrderWithRazorpay,
  updateOrderPaymentSuccess,
  updateOrderPaymentFailed,
  clearUserCart,
  type ShippingAddress,
  type OrderItem,
} from "@/lib/orders";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Truck,
  Shield,
  Package,
  Loader2,
} from "lucide-react";

// Shipping address validation schema
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  landmark: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface CartItemDisplay {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Cart", icon: ShoppingBag },
    { num: 2, label: "Address", icon: MapPin },
    { num: 3, label: "Payment", icon: CreditCard },
    { num: 4, label: "Done", icon: CheckCircle },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <div key={step.num} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                isActive
                  ? "bg-[#2F4836] text-white"
                  : isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-300 mx-1 sm:mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Indian states for dropdown
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [razorpayKey, setRazorpayKey] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      state: "Telangana",
    },
  });

  // Load cart items
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login");
      return;
    }

    const loadCart = async () => {
      setLoading(true);
      try {
        const items = await getCartItems(user.uid);
        if (items.length === 0) {
          setLocation("/cart");
          return;
        }
        const enriched = items.map((item) => ({
          ...item,
          product: getProductById(item.productId),
        }));
        setCartItems(enriched);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, authLoading, setLocation]);

  // Load Razorpay key and script
  useEffect(() => {
    // Fetch Razorpay key
    fetch("/api/razorpay/key")
      .then((res) => res.json())
      .then((data) => setRazorpayKey(data.key))
      .catch(console.error);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingCost;

  // Handle address submission
  const onAddressSubmit = (data: AddressFormData) => {
    setSavedAddress(data as ShippingAddress);
    setCurrentStep(3);
  };

  // Handle payment initiation
  const handlePayment = async () => {
    if (!user || !savedAddress) return;

    setProcessingPayment(true);

    try {
      // Create order items
      const orderItems: OrderItem[] = cartItems
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.productId,
          name: item.product!.name,
          price: item.product!.price,
          quantity: item.quantity,
          image: item.product!.image,
        }));

      // Create order in Firestore
      const order = await createOrder({
        userId: user.uid,
        items: orderItems,
        shippingAddress: savedAddress,
        subtotal,
        shippingCost,
        total,
      });

      setOrderId(order.id);

      // Create Razorpay order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: order.orderNumber,
          notes: { orderId: order.id },
        }),
      });

      const razorpayOrder = await response.json();

      if (!razorpayOrder.success) {
        throw new Error(razorpayOrder.error || "Failed to create payment order");
      }

      // Update order with Razorpay order ID
      await updateOrderWithRazorpay(order.id, razorpayOrder.order.id);

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        name: "Sri Kanakadurga Nursery",
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrder.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // Update order as paid
              await updateOrderPaymentSuccess(
                order.id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );

              // Clear cart
              await clearUserCart(user.uid);

              // Move to success step
              setCurrentStep(4);

              toast({
                title: "Payment Successful!",
                description: "Your order has been placed successfully.",
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            await updateOrderPaymentFailed(order.id);
            toast({
              title: "Payment Failed",
              description: "Please try again or contact support.",
              variant: "destructive",
            });
          }
          setProcessingPayment(false);
        },
        prefill: {
          name: savedAddress.fullName,
          contact: savedAddress.phone,
          email: user.email || "",
        },
        theme: {
          color: "#2F4836",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast({
              title: "Payment Cancelled",
              description: "You can retry the payment anytime.",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setProcessingPayment(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F4836]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Title */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-6">
          {currentStep === 4 ? "Order Confirmed!" : "Checkout"}
        </h1>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Cart Review */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Review Your Cart ({cartItems.length} items)
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-[#e5ebe3] last:border-0"
                  >
                    <div className="w-16 h-16 bg-[#f8faf7] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.product?.image || "")}
                        alt={item.product?.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1A1A1A] truncate">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-[#8F9E8B]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#2F4836]">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6 h-fit">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Subtotal</span>
                  <span className="text-[#1A1A1A]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : "text-[#1A1A1A]"}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-[#8F9E8B]">
                    Free shipping on orders above ₹999
                  </p>
                )}
                <div className="border-t border-[#e5ebe3] pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1A1A1A]">Total</span>
                    <span className="font-bold text-lg text-[#2F4836]">₹{total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#2F4836] text-white py-3.5 rounded-lg font-medium hover:bg-[#243a2b] transition-colors flex items-center justify-center gap-2"
              >
                Continue to Shipping
                <ChevronRight className="w-4 h-4" />
              </button>

              <Link href="/cart">
                <button className="w-full mt-3 text-[#2F4836] py-2 text-sm font-medium hover:underline">
                  ← Back to Cart
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-6">
                Shipping Address
              </h2>

              <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Full Name *
                    </label>
                    <input
                      {...register("fullName")}
                      className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      {...register("phone")}
                      className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    {...register("addressLine1")}
                    className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                    placeholder="House/Flat No., Building Name, Street"
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Address Line 2
                  </label>
                  <input
                    {...register("addressLine2")}
                    className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                    placeholder="Area, Colony (Optional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      City *
                    </label>
                    <input
                      {...register("city")}
                      className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      State *
                    </label>
                    <select
                      {...register("state")}
                      className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors bg-white"
                    >
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Pincode *
                    </label>
                    <input
                      {...register("pincode")}
                      className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Landmark
                  </label>
                  <input
                    {...register("landmark")}
                    className="w-full px-4 py-2.5 border border-[#e5ebe3] rounded-lg focus:outline-none focus:border-[#2F4836] transition-colors"
                    placeholder="Nearby landmark (Optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-[#e5ebe3] rounded-lg font-medium text-[#1A1A1A] hover:border-[#2F4836] transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2F4836] text-white py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6 h-fit">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <span className="text-[#8F9E8B]">{item.quantity}x</span>
                    <span className="text-[#1A1A1A] truncate flex-1">
                      {item.product?.name}
                    </span>
                    <span className="text-[#1A1A1A]">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-xs text-[#8F9E8B]">
                    +{cartItems.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t border-[#e5ebe3] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#e5ebe3]">
                  <span>Total</span>
                  <span className="text-[#2F4836]">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && savedAddress && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-[#2F4836] hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="bg-[#f8faf7] rounded-lg p-4">
                  <p className="font-medium text-[#1A1A1A]">{savedAddress.fullName}</p>
                  <p className="text-sm text-[#4A4A4A] mt-1">
                    {savedAddress.addressLine1}
                    {savedAddress.addressLine2 && `, ${savedAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-[#4A4A4A]">
                    {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                  </p>
                  {savedAddress.landmark && (
                    <p className="text-sm text-[#8F9E8B]">
                      Landmark: {savedAddress.landmark}
                    </p>
                  )}
                  <p className="text-sm text-[#4A4A4A] mt-2">
                    Phone: {savedAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                  Payment Method
                </h2>

                <div className="bg-[#f8faf7] rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#e5ebe3]">
                      <CreditCard className="w-5 h-5 text-[#2F4836]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1A1A1A]">Razorpay Secure Checkout</p>
                      <p className="text-xs text-[#8F9E8B]">
                        UPI, Cards, Net Banking, Wallets
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto text-[#2F4836] mb-1" />
                    <p className="text-xs text-[#8F9E8B]">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 mx-auto text-[#2F4836] mb-1" />
                    <p className="text-xs text-[#8F9E8B]">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <Package className="w-6 h-6 mx-auto text-[#2F4836] mb-1" />
                    <p className="text-xs text-[#8F9E8B]">Safe Packaging</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-[#e5ebe3] rounded-lg font-medium text-[#1A1A1A] hover:border-[#2F4836] transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="flex-1 bg-[#2F4836] text-white py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{total}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-6 h-fit">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f8faf7] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.product?.image || "")}
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-[#8F9E8B]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e5ebe3] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9E8B]">Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#e5ebe3]">
                  <span>Total</span>
                  <span className="text-[#2F4836]">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Order Confirmation */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-8 md:p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">
                Thank You for Your Order!
              </h2>
              <p className="text-[#8F9E8B] mb-6">
                Your order has been placed successfully. We'll send you an email confirmation shortly.
              </p>

              {orderId && (
                <div className="bg-[#f8faf7] rounded-lg p-4 mb-6">
                  <p className="text-sm text-[#8F9E8B]">Order ID</p>
                  <p className="font-mono font-medium text-[#2F4836]">{orderId}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#f8faf7] rounded-lg p-4">
                  <Package className="w-6 h-6 mx-auto text-[#2F4836] mb-2" />
                  <p className="text-xs text-[#8F9E8B]">Order Confirmed</p>
                </div>
                <div className="bg-[#f8faf7] rounded-lg p-4">
                  <Truck className="w-6 h-6 mx-auto text-[#8F9E8B] mb-2" />
                  <p className="text-xs text-[#8F9E8B]">Ships in 2-3 days</p>
                </div>
                <div className="bg-[#f8faf7] rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 mx-auto text-[#8F9E8B] mb-2" />
                  <p className="text-xs text-[#8F9E8B]">Delivery in 5-7 days</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/orders">
                  <button className="px-6 py-3 bg-[#2F4836] text-white rounded-lg font-medium hover:bg-[#243a2b] transition-colors">
                    View My Orders
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="px-6 py-3 border border-[#2F4836] text-[#2F4836] rounded-lg font-medium hover:bg-[#2F4836] hover:text-white transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
