import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
}

export interface ContactMessage {
  id?: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const snap = await getDocs(collection(db, "users", userId, "cart"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CartItem));
}

export async function addCartItem(userId: string, productId: string, quantity: number = 1) {
  const cartRef = collection(db, "users", userId, "cart");
  const q = query(cartRef, where("productId", "==", productId));
  const existing = await getDocs(q);

  if (!existing.empty) {
    const existingDoc = existing.docs[0];
    const currentQty = existingDoc.data().quantity || 0;
    await updateDoc(existingDoc.ref, { quantity: currentQty + quantity });
    return { id: existingDoc.id, productId, quantity: currentQty + quantity };
  }

  const docRef = await addDoc(cartRef, { productId, quantity });
  return { id: docRef.id, productId, quantity };
}

export async function updateCartItemQty(userId: string, cartItemId: string, quantity: number) {
  await updateDoc(doc(db, "users", userId, "cart", cartItemId), { quantity });
}

export async function removeCartItem(userId: string, cartItemId: string) {
  await deleteDoc(doc(db, "users", userId, "cart", cartItemId));
}

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  const snap = await getDocs(collection(db, "users", userId, "wishlist"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WishlistItem));
}

export async function addToWishlist(userId: string, productId: string) {
  const wishRef = collection(db, "users", userId, "wishlist");
  const q = query(wishRef, where("productId", "==", productId));
  const existing = await getDocs(q);
  if (!existing.empty) return;
  await addDoc(wishRef, { productId });
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishRef = collection(db, "users", userId, "wishlist");
  const q = query(wishRef, where("productId", "==", productId));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
  }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const wishRef = collection(db, "users", userId, "wishlist");
  const q = query(wishRef, where("productId", "==", productId));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function submitContactMessage(msg: Omit<ContactMessage, "id">) {
  await addDoc(collection(db, "contactMessages"), msg);
}
