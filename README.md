# 🛒 EliteMart — Full Stack MERN Ecommerce App

A full-featured ecommerce web application built with the MERN stack, featuring product management, user authentication, Stripe payment integration and an admin dashboard.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI library & build tool |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Ant Design | UI components (Select, Modal, Badge, Radio) |
| Axios | HTTP client with JWT interceptor |
| Stripe.js | Payment processing |
| React Hot Toast | Toast notifications |
| React Helmet Async | Dynamic page meta tags |
| React Icons | Icon library |
| Vitest | Unit testing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcrypt | Password hashing |
| Stripe | Payment gateway |
| Morgan | HTTP request logging |
| dotenv | Environment variables |
| CORS | Cross-origin requests |

---

## ✨ Features

### Customer
- 🔐 Register, Login, Forgot Password
- 🛍️ Browse products with category and price filters
- 🔍 Search products by name, description or category
- 📦 View product details and similar products
- 🛒 Personal shopping cart (per-user, persists across sessions)
- 💳 Stripe checkout with secure card payment
- 📋 Order history with status tracking

### Admin
- 📊 Admin dashboard with key info
- 🗂️ Create, update, delete categories
- 📦 Create, update, delete products with photo upload
- 👥 View all registered users
- 📋 View and manage all orders
- 🔄 Update order status (processing → shipped → delivered → cancelled)

---

## 📁 Project Structure

```
MERN_Ecommerce_App/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Auth + user management
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── productController.js   # Product CRUD + filters + search
│   │   └── orderController.js     # Orders + Stripe payment
│   ├── helpers/
│   │   └── authHelper.js          # bcrypt hash & compare
│   ├── middlewares/
│   │   └── authMiddleware.js      # requireSignIn, isAdmin
│   ├── models/
│   │   ├── userModel.js
│   │   ├── categoryModel.js
│   │   ├── productModel.js
│   │   └── orderModel.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/                       # Service layer — all API calls
    │   │   ├── axiosInstance.js       # Base axios + JWT interceptor
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── categoryService.js
    │   │   └── orderService.js
    │   ├── store/                     # Redux store
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── cartSlice.js
    │   │       ├── searchSlice.js
    │   │       └── orderSlice.js
    │   ├── hooks/
    │   │   └── useCategory.js
    │   ├── utils/
    │   │   ├── formatters.js          # formatPrice, truncate
    │   │   └── constants.js           # PRICE_RANGES
    │   ├── components/
    │   │   ├── Layout/                # Layout, Header, Footer, AdminMenu, UserMenu
    │   │   ├── Form/                  # SearchInput, CategoryForm
    │   │   ├── common/                # Spinner, ProductCard
    │   │   └── Routes/                # PrivateRoute, AdminRoute
    │   ├── pages/
    │   │   ├── Auth/                  # Login, Register, ForgotPassword
    │   │   ├── User/                  # Dashboard, Profile, Orders
    │   │   ├── Admin/                 # AdminDashboard, CreateCategory,
    │   │   │                          # CreateProduct, UpdateProduct,
    │   │   │                          # Products, Users, AdminOrders
    │   │   └── public/                # HomePage, ProductDetails, CartPage,
    │   │                              # CheckoutPage, PaymentPage, OrderSuccess
    │   │                              # Categories, CategoryProduct, Search,
    │   │                              # About, Contact, Policy, PageNotFound
    │   ├── styles/
    │   │   └── index.css              # Tailwind directives + custom classes
    │   ├── App.jsx                    # All routes
    │   ├── main.jsx                   # Entry point
    │   └── setupTests.js
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Stripe account (free — test mode)

---

## 👤 Default Roles

| Role | Value | Access |
|---|---|---|
| Regular User | `0` | Shop, cart, orders, profile |
| Admin | `1` | Full dashboard access |

---

## 🏗️ SE Principles Applied

| Principle | Implementation |
|---|---|
| **Single Responsibility** | Each service file owns one domain (auth/product/category/order) |
| **DRY** | `ProductCard` reused across 5 pages; `CategoryForm` reused for create & update |
| **Separation of Concerns** | `api/` → `store/` → `components/` → `pages/` are fully independent layers |
| **Open/Closed** | New pages just add a route in `App.jsx` — no existing code changes needed |
| **Security** | Passwords hashed with bcrypt; JWT for auth; Stripe payment verified server-side |
| **Per-user cart** | Cart keyed by `cart_userId` in localStorage — users never see each other's cart |

---

## 👩‍💻 Author

**Ushani** — MERN Stack Developer

> Built as a portfolio project demonstrating full-stack development with React, Node.js, MongoDB and Stripe.
