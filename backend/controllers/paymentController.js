const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const calculateCheckoutPricing = require("../utils/calculateCheckoutPricing");
const PaymentVerification = require("../models/PaymentVerification");

// CREATE PAYMENT ORDER
const createPaymentOrder = async (req, res) => {
  try {
    const { couponCode = "", walletGramsToUse = 0 } = req.body;

    const pricing = await calculateCheckoutPricing({
      userId: req.user._id,
      couponCode,
      walletGramsToUse,
    });

    if (pricing.finalPayable <= 0) {
      return res.json({
        paymentRequired: false,
        pricing,
      });
    }

    const options = {
      amount: Math.round(Number(pricing.finalPayable) * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, // short receipt for Razorpay
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      ...order,
      paymentRequired: true,
      pricing,
    });
  } catch (error) {
    console.error("CREATE PAYMENT ORDER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to create payment order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pricing = {},
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment verification fields",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    const existingPayment = await PaymentVerification.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingPayment) {
      return res.json({
        message: "Payment already verified",
        paymentVerified: true,
        razorpayOrderId: existingPayment.razorpayOrderId,
        razorpayPaymentId: existingPayment.razorpayPaymentId,
      });
    }

    await PaymentVerification.create({
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: Number(pricing.finalPayable || 0),
      currency: "INR",
      pricingSnapshot: {
        subtotal: Number(pricing.subtotal || 0),
        couponCode: pricing.couponCode || "",
        couponDiscount: Number(pricing.couponDiscount || 0),
        walletGramsUsed: Number(pricing.walletGramsUsed || 0),
        walletDiscount: Number(pricing.walletDiscount || 0),
        silverRateUsed: Number(pricing.silverRate || pricing.silverRateUsed || 0),
        finalPayable: Number(pricing.finalPayable || 0),
      },
      isUsedForOrder: false,
    });

    return res.json({
      message: "Payment verified successfully",
      paymentVerified: true,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Payment verification failed",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};