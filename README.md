# 🏺 Handcrafted Haven

A full-stack marketplace web application for artisans and crafters to showcase and sell unique handcrafted items, connecting independent creators with customers who value handmade quality.

## **Live Site:** [https://handcrafted-haven-sigma-vert.vercel.app](https://handcrafted-haven-sigma-vert.vercel.app)
## **GitHub Repository:** [https://github.com/uriyahsam/handcrafted-haven](https://github.com/uriyahsam/handcrafted-haven)
## **Developer LinkedIn:** [https://www.linkedin.com/in/uriyahsam](https://www.linkedin.com/in/uriyahsam)

---

## 🔐 Test Logins

| Role   | Email                           | Password    |
|--------|---------------------------------|-------------|
| Seller | artisan@handcraftedhaven.com    | password123 |
| Buyer  | buyer@example.com               | password123 |

---

## 📋 Project Overview

Handcrafted Haven is a full-stack e-commerce platform built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **NextAuth.js**. It was designed and developed solo as part of a group project course assignment, with instructor awareness of the individual effort.

---

## ✅ Features Implemented

### Seller Profiles & Authentication (WI-008)
- Sign up / log in via NextAuth.js with credential-based authentication
- Role-based access: `BUYER`, `SELLER`, and `ADMIN` roles
- Dedicated seller profile pages with shop name, bio, location, and avatar

### Product Listings & Catalog (WI-006, WI-007)
- Browse page with grid layout, category filters, price range filter, and sort options (newest, price, popularity)
- Search functionality integrated into the navbar and shop page
- Individual product detail pages with image gallery, full description, seller info, and add-to-cart button
- Pagination for browsing large catalogs

### Product Management Dashboard (WI-009)
- Authenticated seller dashboard to list new products (title, description, price, category, images)
- Edit and manage existing listings
- Toggle product status: Active, Inactive, or Sold

### Reviews & Ratings (WI-010)
- Star-rating widget and written review form on product pages
- Aggregate rating display with individual review listings
- Only authenticated users can submit reviews; one review per user per product enforced at the database level

### Cart & Wishlist
- Client-side cart and wishlist powered by React Context
- Persistent across navigation within a session

### Responsive Navigation & Footer (WI-004)
- Sticky navbar with brand logo, search bar, navigation links, cart/wishlist icons, and auth state
- Mobile hamburger menu for smaller viewports
- Four-column footer: Shop, Sell, Help, and brand info

### Home / Landing Page (WI-005)
- Hero section with CTA buttons and site statistics
- Featured products carousel
- Category grid (Jewelry, Pottery, Textiles, Woodwork, Candles, Art & Prints)
- Featured artisan cards
- Customer reviews section
- Seller CTA banner

---

## 🎨 Design System

### Color Palette
| Token          | Hex       | Usage                              |
|----------------|-----------|------------------------------------|
| Warm Honey     | `#D4A76A` | Primary brand color, CTAs          |
| Saddle Brown   | `#8B4513` | Accent, links, highlights          |
| Cream White    | `#FFF8F0` | Page & card backgrounds            |
| Terracotta     | `#C0522B` | Hover states, badges               |
| Dark Espresso  | `#3D2B1F` | Footer, navbar, body text          |
| Linen Sand     | `#F0E6D3` | Sidebar, section dividers          |

### Typography
| Role              | Font Family      | Weight |
|-------------------|------------------|--------|
| H1 / Page Titles  | Playfair Display | 700    |
| H2 / Section Heads| Playfair Display | 600    |
| H3 / Sub-headers  | Inter            | 600    |
| Body Text         | Inter            | 400    |
| UI Labels/Buttons | Inter            | 500    |
| Prices / IDs      | Roboto Mono      | 400    |

### Layout Principles
- Mobile-first responsive design using CSS custom properties and media queries
- Product grid: 1 column (mobile) → 2 (tablet) → 3–4 (desktop)
- Consistent 8px spacing scale throughout
- `border-radius: 8px` on cards, buttons, and image containers
- Subtle drop shadows on product cards (`--shadow-md`)

---

## 🛠 Technology Stack

| Layer            | Technology                         |
|------------------|------------------------------------|
| Front-End        | Next.js 15 (App Router), TypeScript |
| Styling          | CSS Modules + CSS custom properties |
| Authentication   | NextAuth.js (credentials provider) |
| ORM              | Prisma 7                           |
| Database         | PostgreSQL                         |
| Deployment       | Vercel                             |
| Code Management  | Git + GitHub                       |

---

## 🗃 Database Schema

Key models: `User`, `SellerProfile`, `Product`, `Category`, `Review`, `Account`, `Session`

- `User` has a `role` enum (`BUYER` | `SELLER` | `ADMIN`)
- `SellerProfile` is a 1-to-1 extension of `User` for sellers
- `Product` belongs to a `Category` and a `SellerProfile`
- `Review` enforces one review per user per product via a `@@unique([userId, productId])` constraint
- `ProductStatus` enum: `ACTIVE` | `INACTIVE` | `SOLD`

---

## 🚀 Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/uriyahsam/handcrafted-haven.git
cd handcrafted-haven

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Generate Prisma client
npx prisma generate

# 5. Create tables in your database
npx prisma db push

# 6. Seed demo data
npm run db:seed

# 7. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

*Built with ❤️ by Uriyah Sam · BYU-Idaho*
