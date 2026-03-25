const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    silverWalletGrams: user.silverWalletGrams || 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const sendValidationError = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  return null;
};

const registerUser = async (req, res) => {
  try {
    const validationErrorResponse = sendValidationError(req, res);
    if (validationErrorResponse) return;

    const { name, email, password } = req.body;

    const trimmedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("REGISTER USER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const validationErrorResponse = sendValidationError(req, res);
    if (validationErrorResponse) return;

    const { email, password } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("LOGIN USER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};