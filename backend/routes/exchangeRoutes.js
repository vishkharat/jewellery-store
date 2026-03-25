const express = require("express");
const router = express.Router();

const {
  createExchangeRequest,
  getMyExchangeRequests,
  getAllExchangeRequests,
  updateExchangeRequest,
} = require("../controllers/exchangeController");

const { protect, admin } = require("../middleware/authMiddleware");

// CUSTOMER
router.post("/", protect, createExchangeRequest);
router.get("/my", protect, getMyExchangeRequests);

// ADMIN
router.get("/", protect, admin, getAllExchangeRequests);
router.put("/:id", protect, admin, updateExchangeRequest);

module.exports = router;