const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productImage: {
      type: String,
      default: "",
    },

    selectedVariant: {
      name: {
        type: String,
        default: "",
      },
      value: {
        type: String,
        default: "",
      },
    },

    requestQuantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    originalMetalWeight: {
      type: Number,
      required: true,
      default: 0,
    },

    purity: {
      type: Number,
      required: true,
      default: 0.925,
    },

    exchangePercent: {
      type: Number,
      required: true,
      default: 50,
    },

    estimatedCreditGrams: {
      type: Number,
      required: true,
      default: 0,
    },

    approvedCreditGrams: {
      type: Number,
      default: 0,
    },

    creditedToWallet: {
      type: Boolean,
      default: false,
    },

    reason: {
      type: String,
      default: "",
    },

    customerNote: {
      type: String,
      default: "",
    },

    adminNote: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "product_received",
        "credit_issued",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);