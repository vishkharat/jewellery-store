const { validationResult } = require("express-validator");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

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

// POST /api/newsletter/subscribe
const subscribeNewsletter = async (req, res) => {
  try {
    const validationErrorResponse = sendValidationError(req, res);
    if (validationErrorResponse) return;

    const { email } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return res.status(400).json({
          message: "This email is already subscribed",
        });
      }

      existingSubscriber.status = "active";
      await existingSubscriber.save();

      return res.json({
        message: "Newsletter subscription re-activated successfully",
        subscriber: existingSubscriber,
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: normalizedEmail,
    });

    return res.status(201).json({
      message: "Subscribed to newsletter successfully",
      subscriber,
    });
  } catch (error) {
    console.error("SUBSCRIBE NEWSLETTER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to subscribe",
    });
  }
};

// GET /api/newsletter
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({
      createdAt: -1,
    });

    return res.json(subscribers);
  } catch (error) {
    console.error("GET ALL NEWSLETTER SUBSCRIBERS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch subscribers",
    });
  }
};

module.exports = {
  subscribeNewsletter,
  getAllSubscribers,
};