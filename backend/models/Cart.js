const mongoose = require("mongoose");

const selectedVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    selectedVariant: {
      type: selectedVariantSchema,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);