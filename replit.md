# Srikanakadurganursery

## Overview
A plant nursery e-commerce website for "Srikanakadurganursery" based in Ramanthapur, Hyderabad. Replicates the visual style of the "LeafyHeaven" reference design with sage green color palette, minimalist typography, and botanical imagery.

## Recent Changes
- 2026-02-06: Initial MVP build with all 5 pages (Home, Shop, Blog, Cart, Contact)
- Database seeded with 10 plant products and 4 blog posts
- Custom images generated for all products, heroes, and blog posts

## Tech Stack
- Frontend: React + Vite + TailwindCSS + wouter routing
- Backend: Express + PostgreSQL + Drizzle ORM
- Fonts: Josefin Sans (headings), Poppins (body), Playfair Display (serif accents)

## Project Architecture
- `client/src/pages/` - Page components (Home, Shop, Blog, Cart, Contact)
- `client/src/components/` - Shared components (Header, Footer, PageHero, ProductCard)
- `server/` - Express API with session-based cart management
- `shared/schema.ts` - Drizzle schema for products, cart_items, blog_posts, contact_messages
- `client/public/images/` - Generated plant and hero images

## Color Palette
- Background: #EAEFE9 (light sage)
- Cards: #FFFFFF (white)
- Primary buttons/footer: #2F4836 (dark forest green)
- Secondary accent: #8F9E8B (muted olive)
- Heading text: #1A1A1A (dark charcoal)
- Body text: #4A4A4A (dark grey)

## API Routes
- GET /api/products - List all products
- GET /api/products/:id - Get single product
- GET /api/cart - Get cart items for current session
- POST /api/cart - Add item to cart { productId, quantity }
- PATCH /api/cart/:id - Update cart item quantity { quantity }
- DELETE /api/cart/:id - Remove cart item
- GET /api/blog - List all blog posts
- POST /api/contact - Submit contact form { fullName, email, message }

## Running
- `npm run dev` starts both frontend and backend on port 5000
