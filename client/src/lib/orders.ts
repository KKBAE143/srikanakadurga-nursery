import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Order item interface
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Shipping address interface
export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

// Order status types
export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

// Main order interface
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Create order input (without auto-generated fields)
export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  notes?: string;
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKN-${timestamp}${random}`;
}

// Create a new order
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const orderData: Omit<Order, "id"> = {
    ...input,
    orderNumber,
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);

  return {
    id: docRef.id,
    ...orderData,
  };
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Order;
}

// Get orders by user ID
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

// Update order with Razorpay details after payment creation
export async function updateOrderWithRazorpay(
  orderId: string,
  razorpayOrderId: string
): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, {
    razorpayOrderId,
    paymentStatus: "processing",
    updatedAt: new Date().toISOString(),
  });
}

// Update order after successful payment
export async function updateOrderPaymentSuccess(
  orderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, {
    razorpayPaymentId,
    razorpaySignature,
    paymentStatus: "paid",
    orderStatus: "confirmed",
    updatedAt: new Date().toISOString(),
  });
}

// Update order after failed payment
export async function updateOrderPaymentFailed(orderId: string): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, {
    paymentStatus: "failed",
    updatedAt: new Date().toISOString(),
  });
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus
): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, {
    orderStatus,
    updatedAt: new Date().toISOString(),
  });
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<void> {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, {
    orderStatus: "cancelled",
    updatedAt: new Date().toISOString(),
  });
}

// Clear user's cart after successful order
export async function clearUserCart(userId: string): Promise<void> {
  const cartRef = collection(db, "users", userId, "cart");
  const snapshot = await getDocs(cartRef);

  const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));

  await Promise.all(deletePromises);
}
