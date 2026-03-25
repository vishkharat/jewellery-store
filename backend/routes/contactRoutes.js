const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createContactMessage,
  getAllContactMessages,
} = require("../controllers/contactController");

const { protect, admin } = require("../middleware/authMiddleware");

const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Subject must be between 3 and 120 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),
];

router.post("/", contactValidation, createContactMessage);
router.get("/", protect, admin, getAllContactMessages);

module.exports = router;