const mongoose = require("mongoose");

// TRACKING HISTORY SCHEMA
const trackingSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  note: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
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
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    pricing: {
      subtotal: {
        type: Number,
        default: 0,
      },
      couponCode: {
        type: String,
        default: "",
      },
      couponDiscount: {
        type: Number,
        default: 0,
      },
      walletGramsUsed: {
        type: Number,
        default: 0,
      },
      walletDiscount: {
        type: Number,
        default: 0,
      },
      silverRateUsed: {
        type: Number,
        default: 0,
      },
      finalPayable: {
        type: Number,
        default: 0,
      },
    },

    shippingAddress: {
      fullName: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      addressLine: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      postalCode: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "India",
      },
    },

    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Wallet Only"],
      default: "Razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Not Required", "Failed"],
      default: "Pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentResult: {
      razorpayOrderId: {
        type: String,
        default: "",
      },
      razorpayPaymentId: {
        type: String,
        default: "",
      },
      razorpaySignature: {
        type: String,
        default: "",
      },
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // MANUAL SHIPPING READY FIELDS
    shippingDetails: {
      courierName: {
        type: String,
        default: "",
      },
      trackingNumber: {
        type: String,
        default: "",
      },
      shippedAt: {
        type: Date,
        default: null,
      },
      estimatedDelivery: {
        type: Date,
        default: null,
      },
      shippingNote: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },

    trackingHistory: [trackingSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);