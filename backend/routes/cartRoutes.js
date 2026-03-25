const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");


// ADD TO CART
router.post("/", protect, addToCart);


// GET USER CART
router.get("/", protect, getCart);


// UPDATE CART
router.put("/:id", protect, updateCart);


// REMOVE ITEM
router.delete("/:id", protect, removeFromCart);


module.exports = router;