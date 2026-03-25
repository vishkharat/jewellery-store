const express = require("express");
const router = express.Router();

const {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.patch("/:id/default", protect, setDefaultAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;