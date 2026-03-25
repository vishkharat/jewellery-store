const mongoose = require("mongoose");

const paymentVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    razorpaySignature: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    pricingSnapshot: {
      subtotal: { type: Number, default: 0 },
      couponCode: { type: String, default: "" },
      couponDiscount: { type: Number, default: 0 },
      walletGramsUsed: { type: Number, default: 0 },
      walletDiscount: { type: Number, default: 0 },
      silverRateUsed: { type: Number, default: 0 },
      finalPayable: { type: Number, default: 0 },
    },

    isUsedForOrder: {
      type: Boolean,
      default: false,
    },

    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PaymentVerification",
  paymentVerificationSchema
);