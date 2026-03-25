const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getMonthlySales,
  getTopProducts
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, admin, getDashboardStats);

router.get("/sales/monthly", protect, admin, getMonthlySales);

router.get("/top-products", protect, admin, getTopProducts);

module.exports = router;