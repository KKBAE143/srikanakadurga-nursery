import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUserId, type Order } from "@/lib/orders";
import { getImageUrl } from "@/lib/images";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Loader2,
} from "lucide-react";

// Order status badge component
function OrderStatusBadge({ status }: { status: Order["orderStatus"] }) {
  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: Package },
    processing: { label: "Processing", color: "bg-purple-100 text-purple-700", icon: Package },
    shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-700", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Payment status badge
function PaymentStatusBadge({ status }: { status: Order["paymentStatus"] }) {
  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-700" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700" },
    failed: { label: "Failed", color: "bg-red-100 text-red-700" },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/login");
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const userOrders = await getOrdersByUserId(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, authLoading, setLocation]);

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2F4836] to-[#1a2e1f] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                My Orders
              </h1>
              <p className="text-white/60 text-sm">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#EAEFE9] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-[#8F9E8B]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">
                No orders yet
              </h2>
              <p className="text-[#8F9E8B] mb-6">
                Start shopping to see your orders here
              </p>
              <Link href="/shop">
                <button className="bg-[#2F4836] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors">
                  Browse Plants
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-[#f8faf7] border-b border-[#e5ebe3]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-medium text-[#2F4836]">
                          {order.orderNumber}
                        </span>
                        <OrderStatusBadge status={order.orderStatus} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                      <div className="text-sm text-[#8F9E8B]">
                        Ordered on {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Items */}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3 mb-4">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-16 h-16 bg-[#f8faf7] rounded-lg overflow-hidden flex-shrink-0"
                            >
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 bg-[#f8faf7] rounded-lg flex items-center justify-center text-sm text-[#8F9E8B]">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-[#4A4A4A]">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-[#8F9E8B]">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="lg:w-64">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#8F9E8B] mt-0.5 flex-shrink-0" />
                          <div className="text-[#4A4A4A]">
                            <p className="font-medium text-[#1A1A1A]">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="line-clamp-2">
                              {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                            </p>
                            <p>{order.shippingAddress.pincode}</p>
                          </div>
                        </div>
                      </div>

                      {/* Total & Actions */}
                      <div className="lg:w-40 lg:text-right">
                        <p className="text-xl font-bold text-[#2F4836] mb-3">
                          ₹{order.total}
                        </p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-sm text-[#2F4836] font-medium hover:underline"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e5ebe3] flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Order Details
                </h2>
                <p className="text-sm text-[#8F9E8B]">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-[#f8faf7] rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-[#8F9E8B]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={selectedOrder.orderStatus} />
                <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                <span className="text-sm text-[#8F9E8B]">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium text-[#1A1A1A] mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-[#f8faf7] rounded-lg"
                    >
                      <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                        <p className="text-sm text-[#8F9E8B]">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-[#2F4836]">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium text-[#1A1A1A] mb-3">Shipping Address</h3>
                <div className="p-4 bg-[#f8faf7] rounded-lg text-sm">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-[#4A4A4A]">
                    {selectedOrder.shippingAddress.addressLine1}
                  </p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p className="text-[#4A4A4A]">
                      {selectedOrder.shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-[#4A4A4A]">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-[#4A4A4A] mt-1">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-[#1A1A1A] mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8F9E8B]">Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F9E8B]">Shipping</span>
                    <span className={selectedOrder.shippingCost === 0 ? "text-green-600" : ""}>
                      {selectedOrder.shippingCost === 0 ? "FREE" : `₹${selectedOrder.shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-[#e5ebe3]">
                    <span>Total</span>
                    <span className="text-[#2F4836]">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedOrder.razorpayPaymentId && (
                <div>
                  <h3 className="font-medium text-[#1A1A1A] mb-3">Payment Information</h3>
                  <div className="p-4 bg-[#f8faf7] rounded-lg text-sm">
                    <p className="text-[#8F9E8B]">Payment ID</p>
                    <p className="font-mono text-[#1A1A1A]">{selectedOrder.razorpayPaymentId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e5ebe3] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#2F4836] text-white rounded-lg font-medium hover:bg-[#243a2b] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
