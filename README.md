# EquipRent — Premium Equipment Rental Marketplace Platform (Client)

A modern, responsive, and feature-rich Next.js (App Router) peer-to-peer equipment rental web application connecting contractors, creators, and agricultural producers with verified fleet owners.

## 🚀 Live Demo & Repositories
- **Live Client URL**: [https://equiprent-client.vercel.app](https://equiprent-client.vercel.app) *(or your deployed Vercel URL)*
- **Client Repository**: [https://github.com/Shanto472/Ph-Assignment-09-Client-](https://github.com/Shanto472/Ph-Assignment-09-Client-)
- **Server Repository**: [https://github.com/Shanto472/Ph-Assignment-09-Server](https://github.com/Shanto472/Ph-Assignment-09-Server)

---

## 🔑 Default Submitted Credentials
| Role | Email | Password |
|---|---|---|
| **SuperAdmin** | `admin@equiprent.com` | `Admin123456` |
| **Fleet Owner** | `owner@equiprent.com` | `Owner123456` |
| **Customer / Renter** | `customer@equiprent.com` | `Customer123456` |

*(Quick-autofill buttons are also provided on the `/login` page for fast review!)*

---

## 🎯 Project Purpose & Core Objective
EquipRent empowers equipment owners to list heavy machinery, cameras, tools, and vehicles for rent while enabling verified customers to browse, book, and securely pay via Stripe escrow. The platform includes full role-based access control (RBAC), server-side filtering, interactive data visualizations, and automated rental expiry updates.

---

## ✨ Key Features

### 1. 🌟 Public Experience & Home Page
- **Framer Motion Animations**: Smooth staggered hero animations in the Banner, Featured Equipment section, Categories Showcase, and Reviews.
- **Featured Equipment**: Displays 6 approved listings dynamically fetched using MongoDB `.limit(6)`.
- **6 Equipment Categories**: Construction, Photography, Transportation, Agriculture, Electronics, and Event Equipment.
- **Why Choose Us Section**: Highlights platform advantages including verified owners and Stripe escrow protection.
- **Customer Reviews**: Dynamic testimonials showcasing verified contractor feedback and star ratings.
- **Extra Sections**: Visual 4-step "How It Works" workflow and Platform Statistics milestone counters.
- **Dark & Light Mode**: Theme toggle with instant persistence in `localStorage`.
- **Responsive Layout**: Pixel-perfect view on mobile, tablet, and desktop devices, featuring modern X logo.

### 2. 🚜 All Equipment & Dynamic Catalog
- **3-Column Grid**: Uniform image proportions and equal card dimensions.
- **Server-Side Search**: Search by equipment name, brand, or location.
- **Multi-Factor Filters**: Filter by industry category, rental rate type (Daily, Weekly, Monthly), price range, and stock availability.
- **Server-Side Sorting**: Sort by price low-to-high, high-to-low, or recently added.
- **Pagination**: Numbered pagination controls to handle large fleets effortlessly.

### 3. 🔐 Authentication & Role-Based Access Control (RBAC)
- **Email/Password Registration**: Full validation requiring uppercase, lowercase, and at least 6 characters.
- **Image Upload Support**: Direct URL or file upload (ImgBB base64 format).
- **JWT Session Persistence**: Token stored securely, protected against private route redirects on reload.
- **Google Social Login**: One-click Google sign-in assigning default Customer role.
- **Toasts & SweetAlert2**: Interactive visual feedback for all authentication and payment operations.

### 4. 📅 Equipment Details & Stripe Booking Flow
- **Detailed Specifications**: Full specs, operating condition, rate type, location, inventory counter, and owner contact.
- **Favorites System**: Save and toggle favorite equipment stored in database.
- **Interactive Booking Modal**: Live rate calculator computing total rental cost from dates and quantity.
- **Stripe Checkout**: Direct redirect to Stripe Checkout session with transaction recording in `payments` collection upon success.

### 5. 📊 Dynamic Multi-Role Dashboards
- **Customer Dashboard**:
  - `My Rentals`: Table of active and completed bookings with dates, amounts, and payment statuses.
  - `Saved Favorites`: Table of bookmarked equipment with View and Remove actions.
  - `Profile`: View and update user name, photo, phone, and delivery address.
- **Owner Dashboard**:
  - `Owner Analytics`: Interactive Recharts graphs showing total listed fleet, active orders, and monthly earnings.
  - `Add Equipment`: Full listing submission form with pending status.
  - `My Equipment`: Fleet table with Edit modal, Delete confirmation, and stock indicators.
  - `Equipment Rentals`: Order management table to update delivery and return states.
- **Admin Dashboard**:
  - `Platform Analytics`: Recharts area and bar charts tracking platform revenue, bookings, and user distributions.
  - `All Users`: Role management (switch between Customer, Owner, and Admin) and user deletion.
  - `All Equipment`: Moderation panel with Approve and Reject actions.
  - `All Rentals`: Comprehensive marketplace order management with manual `node-cron` synchronization.

---

## 📦 NPM Packages Used & Justification
- `next` (14.2.23) — React framework powering SSR, App Router architecture, and dynamic routing.
- `react` & `react-dom` (^18.3.1) — Core UI library for component state and lifecycle.
- `framer-motion` (^11.18.2) — Fluid spring physics and enter/exit animations across all sections.
- `lucide-react` (^0.473.0) — Modern, clean icons including updated X social brand logo.
- `recharts` (^2.15.0) — Responsive SVG charts for dynamic Admin and Owner business analytics.
- `sweetalert2` (^11.15.10) — Accessible, beautiful modal alerts for confirmations and success messages.
- `react-hot-toast` (^2.5.1) — Lightweight notifications for immediate feedback.
- `tailwindcss` (^3.4.17) — Utility-first styling framework with class-based dark mode.

---

## 🛠️ Local Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Shanto472/Ph-Assignment-09-Client-.git
   cd Ph-Assignment-09-Client-
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_for_grading
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
