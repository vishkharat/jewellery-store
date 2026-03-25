const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getCoupons,
  applyCoupon,
  updateCoupon,
  deleteCoupon
} = require("../controllers/couponController");

const { protect, admin } = require("../middleware/authMiddleware");


router.post("/", protect, admin, createCoupon);

router.get("/", protect, admin, getCoupons);

router.post("/apply", protect, applyCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

module.exports = router;