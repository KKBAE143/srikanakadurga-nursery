# Srikanakadurganursery

## Overview
A plant nursery e-commerce website for "Srikanakadurganursery" based in Ramanthapur, Hyderabad. Features sage green color palette, minimalist typography, and botanical imagery with Firebase authentication and Firestore for user-specific data.

## Recent Changes
- 2026-02-06: Migrated product/blog data from Firestore to local data.ts module (eliminates Firebase dependency for browsing)
- 2026-02-06: Created About Us page with 10 nursery photos gallery, story, values, and visit info
- 2026-02-06: Added "About" link to header navigation
- 2026-02-06: Removed duplicate "Why Choose Us" emoji section from Home page
- 2026-02-06: Firestore now handles ONLY user-specific data: cart, wishlist, contact messages, auth
- 2026-02-06: Cart and Wishlist pages enrich Firestore records by looking up products from local data.ts
- 2026-02-06: All product/blog pages load instantly without network dependency
- 2026-02-06: Added Firebase Auth (Google sign-in + email/password) with AuthContext
- 2026-02-06: Built 11 pages: Home, Shop, Blog, Cart, Contact, Login, Signup, ProductDetail, Profile, Wishlist, About
- 2026-02-06: All 23+ images (WebP products + JPEG nursery photos)

## Tech Stack
- Frontend: React + Vite + TailwindCSS + wouter routing
- Backend: Express (serves frontend only, no API routes)
- Data: Local data.ts for products/blogs, Firebase Firestore for user data (cart/wishlist/auth)
- Auth: Firebase Authentication (Google + email/password)
- Fonts: Josefin Sans (headings), Poppins (body), Playfair Display (serif accents)

## Project Architecture
- `client/src/pages/` - Page components (Home, Shop, Blog, Cart, Contact, Login, Signup, ProductDetail, Profile, Wishlist, About)
- `client/src/components/` - Shared components (Header, Footer, PageHero, ProductCard)
- `client/src/contexts/AuthContext.tsx` - Firebase auth context with Google/email sign-in
- `client/src/lib/firebase.ts` - Firebase app initialization
- `client/src/lib/data.ts` - Local product/blog data with stable IDs and helper functions
- `client/src/lib/firestore.ts` - Firestore service layer (cart, wishlist, contact only - NO products/blogs)
- `server/` - Express server (only serves Vite frontend, no API routes)
- `client/public/images/` - WebP product images + JPEG nursery photos

## Data Architecture
- Products (10 items) and Blog Posts (4 items) live in `client/src/lib/data.ts` with stable string IDs
- Product IDs: areca-palm, snake-plant, money-plant, jade-plant, peace-lily, tulsi, aloe-vera, rubber-plant, spider-plant, zz-plant
- Cart items in Firestore store `productId` which resolves against local data via `getProductById()`
- Wishlist items similarly reference `productId` from local data

## Firestore Collections (user-specific only)
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
