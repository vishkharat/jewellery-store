const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/couponRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const addressRoutes = require("./routes/addressRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const app = express();

// CONNECT DATABASE
connectDB();

// TRUST PROXY FOR RENDER / NGINX
app.set("trust proxy", 1);

// ONLY IN DEVELOPMENT IF REALLY NEEDED
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// SECURITY HEADERS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// HELPERS
const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/\/$/, ""));
};

const exactAllowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ADMIN_FRONTEND_URL),
  "https://jewellery-store-henna.vercel.app/",
  "https://jewellery-store-henna.vercel.app/",
].filter(Boolean);

const allowedOriginPatterns = [/^https:\/\/.*\.vercel\.app$/];

const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, "");
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const cleanOrigin = normalizeOrigin(origin);

  if (exactAllowedOrigins.includes(cleanOrigin)) {
    return true;
  }

  return allowedOriginPatterns.some((pattern) => pattern.test(cleanOrigin));
};

console.log("✅ Allowed CORS origins:", exactAllowedOrigins);

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS BLOCKED ORIGIN:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// BODY PARSERS
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// RATE LIMITERS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP. Please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth requests. Please try again later.",
  },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many payment requests. Please try again later.",
  },
});

app.use("/api", globalLimiter);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Jewellery Ecommerce Backend Running");
});

// ROUTES
app.use("/api/users", authLimiter, userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", paymentLimiter, orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

// 404 HANDLER
app.use((req, res) => {
  return res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS blocked this request origin",
      origin: req.headers.origin || "unknown",
    });
  }

  return res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});