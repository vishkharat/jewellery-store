const mongoose = require("mongoose");

// REVIEW SCHEMA
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// VARIANT SCHEMA
const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

// PRODUCT SCHEMA
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["demi-fine jewellery", "9kt gold jewellery"],
      required: true,
    },

    type: {
      type: String,
      enum: ["ring", "chain", "bracelet", "necklace", "earring"],
      required: true,
    },

    metal: {
      type: String,
      enum: ["gold", "silver", "diamond"],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    metalWeight: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    purity: {
      type: Number,
      required: true,
      default: 0.925,
      min: 0,
      max: 1,
    },

    makingCharges: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    images: [
      {
        url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    variants: [variantSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);