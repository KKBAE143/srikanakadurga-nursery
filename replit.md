# Srikanakadurganursery

## Overview
A plant nursery e-commerce website for "Srikanakadurganursery" based in Ramanthapur, Hyderabad. Features sage green color palette, minimalist typography, and botanical imagery with Firebase authentication and Firestore database.

## Recent Changes
- 2026-02-06: Migrated from PostgreSQL/Express API to Firebase/Firestore for all data operations
- 2026-02-06: Added Firebase Auth (Google sign-in + email/password) with AuthContext
- 2026-02-06: Built 10 pages: Home, Shop, Blog, Cart, Contact, Login, Signup, ProductDetail, Profile, Wishlist
- 2026-02-06: User-bound cart and wishlist stored in Firestore subcollections
- 2026-02-06: All 23 images converted from PNG to WebP (94% size reduction)
- 2026-02-06: Enhanced product schema with care instructions, light/water requirements, pet-friendly flags
- 2026-02-06: Real-time cart count in header via Firestore onSnapshot listener
- 2026-02-06: Firestore data seeding (10 products, 4 blog posts) runs once on first load

## Tech Stack
- Frontend: React + Vite + TailwindCSS + wouter routing
- Backend: Express (serves frontend only, no API routes)
- Database: Firebase Firestore (client-side SDK)
- Auth: Firebase Authentication (Google + email/password)
- Fonts: Josefin Sans (headings), Poppins (body), Playfair Display (serif accents)

## Project Architecture
- `client/src/pages/` - Page components (Home, Shop, Blog, Cart, Contact, Login, Signup, ProductDetail, Profile, Wishlist)
- `client/src/components/` - Shared components (Header, Footer, PageHero, ProductCard, OptimizedImage)
- `client/src/contexts/AuthContext.tsx` - Firebase auth context with Google/email sign-in
- `client/src/lib/firebase.ts` - Firebase app initialization
- `client/src/lib/firestore.ts` - Firestore service layer (products, blog, cart, wishlist, contact, seeding)
- `server/` - Express server (only serves Vite frontend, no API routes)
- `client/public/images/` - WebP-optimized plant and hero images

## Firestore Collections
- `products` - Plant products with name, price, image, category, rating, description, care details
- `blogPosts` - Blog articles with title, excerpt, image, content, author, date
- `users/{uid}` - User profiles
- `users/{uid}/cart` - Cart items (productId, quantity)
- `users/{uid}/wishlist` - Wishlist items (productId)
- `contactMessages` - Contact form submissions

## Color Palette
- Background: #EAEFE9 (light sage)
- Cards: #FFFFFF (white)
- Primary buttons/footer: #2F4836 (dark forest green)
- Secondary accent: #8F9E8B (muted olive)
- Heading text: #1A1A1A (dark charcoal)
- Body text: #4A4A4A (dark grey)
- Borders: #dde3dc (light sage border)

## Environment Variables
- VITE_FIREBASE_API_KEY - Firebase API key
- VITE_FIREBASE_PROJECT_ID - Firebase project ID
- VITE_FIREBASE_APP_ID - Firebase app ID

## Running
- `npm run dev` starts both frontend and backend on port 5000
