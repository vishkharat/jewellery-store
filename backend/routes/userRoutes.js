const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { protect, admin } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.get("/admin-test", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

module.exports = router;