# 🛒 EliteMart - Full Stack MERN Ecommerce App

A production-grade ecommerce web application built with the MERN stack, featuring product management, user authentication, Stripe payments, JWT refresh tokens, star ratings, email-based password reset, and a fully responsive admin dashboard.

🌐 **Live Demo:** [mern-ecommerce-app-v2.vercel.app](https://mern-ecommerce-app-v2.vercel.app)

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI library & build tool |
| Redux Toolkit | Global state (auth, cart, search, orders, products) |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Ant Design | UI components (Select, Modal, Badge, Radio) |
| Axios | HTTP client with JWT silent refresh interceptor |
| Stripe.js / React Stripe | Payment processing & card elements |
| React Hot Toast | Toast notifications |
| React Helmet Async | Dynamic page meta tags |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 22 + Express 5 | Server & REST API |
| MongoDB Atlas + Mongoose | Cloud database & ODM |
| JWT (access + refresh tokens) | Stateless authentication |
| bcryptjs | Password hashing |
| Stripe | Payment gateway + payment intents |
| Nodemailer + Brevo SMTP | Transactional email (password reset) |
| Helmet | Security headers |
| express-rate-limit | Brute-force protection on auth routes |
| hpp | HTTP parameter pollution prevention |
| cookie-parser | httpOnly refresh token cookies |
| Morgan | HTTP request logging |
| CORS | Cross-origin request handling |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted database |
| Vercel | Frontend hosting with global CDN |
| Railway | Backend hosting (always-on Node server) |
| Stripe | Payment processing |

---

## ✨ Features

### Customer
- 🔐 Register, Login, Forgot Password (email reset link), Reset Password
- 🌟 Star ratings and written reviews on products (one per user)
- 🛍️ Browse all products with paginated load more
- 🗂️ Browse by category with price range filter
- 🔍 Search products by name, description, or category
- 📦 Product detail page with live stock count and related products
- 🛒 Per-user cart persisted in localStorage
- ➕➖ Adjust quantity in cart — stock updates on backend in real time
- 💳 Stripe card payment with secure payment intents
- 📋 Order history with delivery address and status tracking
- 👤 Profile management with address, phone, password update

### Admin
- 📊 Admin dashboard
- 🗂️ Create, update, delete categories with professional confirm modal
- 📦 Create, update, delete products with photo upload
- 📋 View and manage all orders with status filter tabs
- 🔄 Update order status: processing → shipped → delivered → cancelled
- 👥 View all registered users with role badges and join dates
- 🚫 No cart access for admin accounts

### Security (OWASP-aligned)
- JWT access tokens (15 min) stored in Redux memory only — never localStorage
- Refresh tokens (7 days) in httpOnly secure cookies
- Silent token refresh via Axios response interceptor
- Helmet security headers on all responses
- Rate limiting on auth routes (30 req / 15 min per IP)
- Generic error messages in production
- x-powered-by header disabled

---

## 📁 Project Structure

```
MERN_Ecommerce_App/
├── api/                               # Backend (Node + Express)
│   ├── config/
│   │   ├── db.js                      # MongoDB Atlas connection
│   │   └── emailService.js            # Nodemailer 
│   ├── controllers/
│   │   ├── authController.js          # Register, login, refresh, reset password
│   │   ├── categoryController.js      # Category CRUD
│   │   ├── productController.js       # Product CRUD, search, filters, stock
│   │   ├── orderController.js         # Stripe payment intents + orders
│   │   └── reviewController.js        # Star ratings and reviews
│   ├── helpers/
│   │   └── authHelper.js              # bcrypt hash and compare
│   ├── middlewares/
│   │   └── authMiddleware.js          # requireSignIn, isAdmin
│   ├── models/
│   │   ├── userModel.js               # + resetPasswordToken fields
│   │   ├── categoryModel.js
│   │   ├── productModel.js            # + averageRating, reviewCount
│   │   ├── orderModel.js
│   │   └── reviewModel.js             # One review per user per product
│   ├── routes/
│   │   ├── authRoute.js               # + /refresh /logout /reset-password
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js           # + PATCH /stock/:id
│   │   ├── orderRoutes.js
│   │   └── reviewRoute.js
│   ├── index.js
│   └── package.json
│
└── client/                            # Frontend (React + Vite)
    └── src/
        ├── api/
        │   ├── axiosInstance.js       # Silent JWT refresh interceptor
        │   ├── authService.js
        │   ├── productService.js      # + adjustStock()
        │   ├── categoryService.js
        │   ├── orderService.js
        │   └── reviewService.js
        ├── store/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js       # Token in memory, user in localStorage
        │       ├── cartSlice.js       # Per-user, quantity tracking
        │       ├── searchSlice.js
        │       ├── orderSlice.js
        │       └── productsSlice.js   # createAsyncThunk for fetching
        ├── components/
        │   ├── Layout/                # Header, Footer, AdminMenu, UserMenu
        │   ├── Form/                  # SearchInput, CategoryForm
        │   ├── common/                # Spinner, ProductCard, StarRating, HeroBanner
        │   └── Routes/                # PrivateRoute, AdminRoute
        ├── pages/
        │   ├── Auth/                  # Login, Register, ForgotPassword, ResetPassword
        │   ├── user/                  # Dashboard, Profile, Orders
        │   ├── Admin/                 # AdminDashboard, CreateCategory, Products...
        │   └── public/                # HomePage, ProductDetails, CartPage, Search...
        ├── styles/
        │   └── index.css              # Design tokens + Tailwind + component classes
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster (free tier)
- Stripe account (test mode)

### Backend setup
```bash
cd api
npm install
```

Create `api/.env`:
```
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/elitemart
JWT_SECRET=any_secret
ACCESS_TOKEN_SECRET=64_char_hex
REFRESH_TOKEN_SECRET=different_64_char_hex
STRIPE_SECRET_KEY=sk_test_xxxx
FRONTEND_URL=http://localhost:5173
```

```bash
npm start
```

### Frontend setup
```bash
cd client
npm install
```

Create `client/.env.development`:
```
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```

```bash
npm run dev
```

---

## 🚢 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. vercel.com → New Project → select repo → Root Directory: `client`
3. Add environment variables: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`
4. Deploy → get `yourapp.vercel.app`

### Backend → Railway
1. Push `api/` to GitHub
2. railway.app → New Project → Deploy from GitHub → Root Directory: `api`
3. Add all backend environment variables in Variables tab
4. Deploy → Settings → Networking → Generate Domain
5. Update `FRONTEND_URL` on Railway with Vercel URL
6. Update `VITE_API_URL` on Vercel with Railway URL
7. Redeploy both

---

## 👤 User Roles

| Role | Value | Access |
|---|---|---|
| Regular User | `0` | Shop, cart, orders, profile, reviews |
| Admin | `1` | Full dashboard — no cart access |

---

## 🔐 Auth Flow

```
Login
  → access token (15 min) stored in Redux memory
  → refresh token (7 days) in httpOnly cookie
        ↓
Access token expires
  → Axios interceptor catches 401 TOKEN_EXPIRED
  → POST /auth/refresh called silently
  → New access token issued, original request retried
        ↓
Refresh token expires
  → User redirected to login
```

---

## 💳 Payment Flow

```
Cart → Checkout (confirm delivery address)
  → POST /order/create-payment-intent (Stripe)
  → User enters card details (Stripe Elements)
  → Stripe confirms payment
  → POST /order/create-order (saves to DB + decrements stock)
  → Cart cleared → Order Success page
```

---

## ⭐ Review Flow

```
Logged-in user on product page
  → Star rating form shown (if not yet reviewed)
  → POST /review/:productId
  → Product averageRating + reviewCount updated automatically
  → User can delete their own review at any time
```

---

## 🏗️ SE Principles Applied

| Principle | Implementation |
|---|---|
| **Single Responsibility** | Each service file owns one domain (auth / product / category / order / review) |
| **DRY** | ProductCard, StarRating, CategoryForm, HeroBanner reused across multiple pages |
| **Separation of Concerns** | api/ → store/ → components/ → pages/ are independent layers |
| **Open/Closed** | New pages only require adding a route in App.jsx |
| **Security** | Passwords hashed; JWT in memory; Stripe verified server-side; Helmet headers |
| **Optimistic UI** | Stock updates instantly on Add to Cart with automatic rollback on failure |

---

## 👩‍💻 Author

**Ushani** - MERN Stack Developer

> Built as a portfolio project demonstrating production-grade full-stack development with React, Node.js, MongoDB, Stripe, JWT refresh tokens, and real-time stock management.
