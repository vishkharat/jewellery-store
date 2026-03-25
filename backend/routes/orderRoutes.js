const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  downloadInvoice,
  cancelMyOrder,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// PLACE ORDER
router.post("/", protect, placeOrder);

// USER ORDER HISTORY
router.get("/my", protect, getMyOrders);

// CUSTOMER CANCEL OWN ORDER
router.put("/:id/cancel", protect, cancelMyOrder);

// ADMIN VIEW ORDERS
router.get("/", protect, admin, getAllOrders);

// ADMIN UPDATE ORDER STATUS
router.put("/:id/status", protect, admin, updateOrderStatus);

// DOWNLOAD INVOICE (USER + ADMIN)
router.get("/:id/invoice", protect, downloadInvoice);

module.exports = router;