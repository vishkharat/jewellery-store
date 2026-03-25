const { validationResult } = require("express-validator");
const ContactMessage = require("../models/ContactMessage");
const sendContactEmail = require("../utils/sendContactEmail");

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

// POST /api/contact
const createContactMessage = async (req, res) => {
  try {
    const validationErrorResponse = sendValidationError(req, res);
    if (validationErrorResponse) return;

    const { name, email, phone, subject, message } = req.body;

    const contactPayload = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : "",
      subject: String(subject).trim(),
      message: String(message).trim(),
    };

    const savedMessage = await ContactMessage.create(contactPayload);

    try {
      await sendContactEmail(contactPayload);
    } catch (emailError) {
      console.error("CONTACT EMAIL SEND ERROR:", emailError.message);
    }

    return res.status(201).json({
      message: "Your message has been sent successfully",
      contact: savedMessage,
    });
  } catch (error) {
    console.error("CREATE CONTACT MESSAGE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to send contact message",
    });
  }
};

// GET /api/contact
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return res.json(messages);
  } catch (error) {
    console.error("GET ALL CONTACT MESSAGES ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch contact messages",
    });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
};