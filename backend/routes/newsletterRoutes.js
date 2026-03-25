const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  subscribeNewsletter,
  getAllSubscribers,
} = require("../controllers/newsletterController");

const { protect, admin } = require("../middleware/authMiddleware");

const newsletterValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

router.post("/subscribe", newsletterValidation, subscribeNewsletter);
router.get("/", protect, admin, getAllSubscribers);

module.exports = router;