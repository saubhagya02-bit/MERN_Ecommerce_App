import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createRequire } from "module";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoute.js";

dotenv.config();
connectDB();

const require = createRequire(import.meta.url);
const mongoSanitize = (() => {
  try {
    return require("express-mongo-sanitize");
  } catch {
    return null;
  }
})();
const xss = (() => {
  try {
    return require("xss-clean");
  } catch {
    return null;
  }
})();

const app = express();

app.disable("x-powered-by");
app.use(
  helmet({
    //allows product images to load cross-origin (Vercel → Railway)
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

//  CORS
const allowedOrigins = [
  "https://mern-ecommerce-app-v2.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (mongoSanitize) app.use(mongoSanitize());
if (xss) app.use(xss());

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/review", reviewRoutes);

app.get("/", (_, res) => res.send("<h1>EliteMart API ✅</h1>"));

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
