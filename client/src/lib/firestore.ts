import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  careInstructions?: string;
  lightRequirement?: string;
  waterFrequency?: string;
  petFriendly?: boolean;
  inStock: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  author?: string;
  date?: string;
}

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

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const snap = await getDocs(collection(db, "blogPosts"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
}

export async function getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]> {
  const snap = await getDocs(collection(db, "users", userId, "cart"));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CartItem));
  const result: (CartItem & { product?: Product })[] = [];
  for (const item of items) {
    const product = await getProduct(item.productId);
    result.push({ ...item, product: product || undefined });
  }
  return result;
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

export async function getWishlist(userId: string): Promise<(WishlistItem & { product?: Product })[]> {
  const snap = await getDocs(collection(db, "users", userId, "wishlist"));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WishlistItem));
  const result: (WishlistItem & { product?: Product })[] = [];
  for (const item of items) {
    const product = await getProduct(item.productId);
    result.push({ ...item, product: product || undefined });
  }
  return result;
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

export async function seedFirestoreData() {
  const productsSnap = await getDocs(collection(db, "products"));
  if (!productsSnap.empty) return;

  const productsData: Omit<Product, "id">[] = [
    {
      name: "Areca Palm",
      price: 450,
      image: "/images/plant-areca-palm.webp",
      category: "Indoor Plants",
      rating: 5,
      description: "Beautiful areca palm that purifies air and adds tropical vibes to your living space. Known for its graceful, feathery fronds.",
      careInstructions: "Keep soil moist but not waterlogged. Mist leaves regularly for humidity.",
      lightRequirement: "Bright indirect light",
      waterFrequency: "Every 2-3 days",
      petFriendly: true,
      inStock: true,
    },
    {
      name: "Snake Plant",
      price: 350,
      image: "/images/plant-snake-plant.webp",
      category: "Indoor Plants",
      rating: 5,
      description: "Low-maintenance snake plant perfect for beginners. Converts CO2 to oxygen at night, making it ideal for bedrooms.",
      careInstructions: "Allow soil to dry completely between waterings. Tolerates neglect well.",
      lightRequirement: "Low to bright indirect light",
      waterFrequency: "Every 2-3 weeks",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Money Plant",
      price: 199,
      image: "/images/plant-money-plant.webp",
      category: "Indoor Plants",
      rating: 4,
      description: "Lucky money plant that brings prosperity to your home. Easy to grow in water or soil.",
      careInstructions: "Can grow in water or soil. Change water weekly if growing in water.",
      lightRequirement: "Bright indirect light",
      waterFrequency: "Every week",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Jade Plant",
      price: 299,
      image: "/images/plant-jade.webp",
      category: "Succulent Plants",
      rating: 5,
      description: "Elegant jade succulent with thick green leaves symbolizing good luck and prosperity.",
      careInstructions: "Allow soil to dry between waterings. Feed with succulent fertilizer monthly.",
      lightRequirement: "Bright direct or indirect light",
      waterFrequency: "Every 2-3 weeks",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Peace Lily",
      price: 499,
      image: "/images/plant-peace-lily.webp",
      category: "Flowering Plants",
      rating: 5,
      description: "Graceful peace lily with beautiful white blooms. Excellent air purifier ranked by NASA.",
      careInstructions: "Keep soil consistently moist. Wipe leaves regularly to remove dust.",
      lightRequirement: "Low to moderate indirect light",
      waterFrequency: "Every week",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Tulsi",
      price: 149,
      image: "/images/plant-tulsi.webp",
      category: "Medicinal Plants",
      rating: 5,
      description: "Sacred holy basil with medicinal properties. Used in Ayurveda for centuries for immune-boosting benefits.",
      careInstructions: "Water daily. Pinch off flower buds to encourage leaf growth.",
      lightRequirement: "Full sun (6+ hours)",
      waterFrequency: "Daily",
      petFriendly: true,
      inStock: true,
    },
    {
      name: "Aloe Vera",
      price: 249,
      image: "/images/plant-aloe-vera.webp",
      category: "Medicinal Plants",
      rating: 4,
      description: "Natural aloe vera with healing gel for skin. A must-have home remedy plant.",
      careInstructions: "Water deeply but infrequently. Ensure pot has drainage holes.",
      lightRequirement: "Bright indirect to direct light",
      waterFrequency: "Every 2-3 weeks",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Rubber Plant",
      price: 550,
      image: "/images/plant-rubber-plant.webp",
      category: "Indoor Plants",
      rating: 5,
      description: "Stunning rubber plant with large glossy leaves. Makes a bold statement in any room.",
      careInstructions: "Wipe leaves with damp cloth monthly. Allow top inch of soil to dry between waterings.",
      lightRequirement: "Bright indirect light",
      waterFrequency: "Every 1-2 weeks",
      petFriendly: false,
      inStock: true,
    },
    {
      name: "Spider Plant",
      price: 199,
      image: "/images/plant-spider-plant.webp",
      category: "Indoor Plants",
      rating: 4,
      description: "Air-purifying spider plant with graceful arching leaves. Produces baby plantlets for easy propagation.",
      careInstructions: "Keep soil lightly moist. Trim brown tips with clean scissors.",
      lightRequirement: "Bright indirect light",
      waterFrequency: "Every 1-2 weeks",
      petFriendly: true,
      inStock: true,
    },
    {
      name: "ZZ Plant",
      price: 399,
      image: "/images/plant-zz-plant.webp",
      category: "Indoor Plants",
      rating: 5,
      description: "Virtually indestructible ZZ plant for low light spaces. Thrives on neglect with glossy, waxy leaves.",
      careInstructions: "Water only when soil is completely dry. Overwatering is the most common issue.",
      lightRequirement: "Low to bright indirect light",
      waterFrequency: "Every 2-4 weeks",
      petFriendly: false,
      inStock: true,
    },
  ];

  for (const p of productsData) {
    await addDoc(collection(db, "products"), p);
  }

  const blogData: Omit<BlogPost, "id">[] = [
    {
      title: "A Guide to Stunning Indoor Plants",
      excerpt: "Discover the best indoor plants to transform your Hyderabad home into a green paradise. From low-light tolerant species to air-purifying champions, we cover everything you need to know about indoor gardening.",
      image: "/images/blog-indoor-plants.webp",
      content: "Indoor plants have become an essential part of modern home decor. Not only do they add beauty and life to your living spaces, but they also purify the air and boost your mood. In this comprehensive guide, we'll explore the best indoor plants for every room in your home...",
      author: "Priya Sharma",
      date: "2026-01-15",
    },
    {
      title: "The World's Rarest Plant: A Journey of Discovery",
      excerpt: "Explore the fascinating world of rare and exotic plant species from around the globe. Learn about endangered species and what conservation efforts are being made to preserve these botanical treasures.",
      image: "/images/blog-bonsai.webp",
      content: "From the high mountains of the Himalayas to the deep jungles of the Amazon, rare plants tell stories of evolution and adaptation. Join us as we explore some of the most extraordinary plant species on Earth...",
      author: "Dr. Ravi Kumar",
      date: "2026-01-20",
    },
    {
      title: "Indoor Plant Styling: Elevate Your Interior Decor with Greenery",
      excerpt: "Learn creative ways to style your plants and create an Instagram-worthy green space. Tips from professional interior designers on pairing plants with your home decor style.",
      image: "/images/blog-living-room.webp",
      content: "Plants are nature's decorating accessories. Whether your style is minimalist, bohemian, or modern contemporary, there's a plant arrangement that will complement your space perfectly...",
      author: "Meera Reddy",
      date: "2026-01-25",
    },
    {
      title: "Plants and Well-being: Enhancing Mental and Physical Health",
      excerpt: "Understand how plants can improve your mental health and physical well-being. Scientific studies show the remarkable benefits of having plants in your home and workspace.",
      image: "/images/blog-flowering.webp",
      content: "Research from leading universities confirms what plant lovers have always known: being around plants makes us healthier and happier. Studies show that indoor plants can reduce stress, improve focus, and even lower blood pressure...",
      author: "Dr. Anita Rao",
      date: "2026-02-01",
    },
  ];

  for (const b of blogData) {
    await addDoc(collection(db, "blogPosts"), b);
  }

  console.log("Firestore seeded successfully!");
}
