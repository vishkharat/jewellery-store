const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const PaymentVerification = require("../models/PaymentVerification");
const sendEmail = require("../utils/sendEmail");
const calculateCheckoutPricing = require("../utils/calculateCheckoutPricing");
const {
  getCustomerOrderConfirmationTemplate,
  getAdminNewOrderTemplate,
  getOrderStatusUpdateTemplate,
} = require("../utils/orderEmailTemplates");

const roundToThree = (num) => Number(Number(num).toFixed(3));

const ALLOWED_STATUS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const CUSTOMER_CANCELLABLE_STATUS = ["Order Placed", "Processing"];

const restoreOrderStock = async (order, session = null) => {
  for (const item of order.orderItems) {
    let productQuery = Product.findById(item.product);

    if (session) {
      productQuery = productQuery.session(session);
    }

    const product = await productQuery;

    if (!product) continue;

    const quantity = Number(item.quantity || 0);

    if (
      item.selectedVariant &&
      item.selectedVariant.name &&
      item.selectedVariant.value
    ) {
      const variantIndex = product.variants.findIndex(
        (variant) =>
          String(variant.name) === String(item.selectedVariant.name) &&
          String(variant.value) === String(item.selectedVariant.value)
      );

      if (variantIndex !== -1) {
        product.variants[variantIndex].stock =
          Number(product.variants[variantIndex].stock || 0) + quantity;
      } else {
        product.stock = Number(product.stock || 0) + quantity;
      }
    } else {
      product.stock = Number(product.stock || 0) + quantity;
    }

    product.sold = Math.max(0, Number(product.sold || 0) - quantity);

    if (session) {
      await product.save({ session });
    } else {
      await product.save();
    }
  }
};

const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      couponCode = "",
      walletGramsUsed = 0,
      shippingAddress = null,
      razorpayOrderId = "",
      razorpayPaymentId = "",
      razorpaySignature = "",
    } = req.body;

    const pricing = await calculateCheckoutPricing({
      userId: req.user._id,
      couponCode,
      walletGramsToUse: walletGramsUsed,
    });

    const { cartItems, user } = pricing;

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const finalPayable = Number(pricing.finalPayable || 0);
    let paymentProof = null;

    if (finalPayable > 0) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new Error(
          "Verified payment details are required to place this order"
        );
      }

      paymentProof = await PaymentVerification.findOne({
        user: req.user._id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        isUsedForOrder: false,
      }).session(session);

      if (!paymentProof) {
        throw new Error("No valid verified payment found for this order");
      }

      const alreadyUsedByOrder = await Order.findOne({
        "paymentResult.razorpayPaymentId": razorpayPaymentId,
      }).session(session);

      if (alreadyUsedByOrder) {
        throw new Error("This payment has already been used for an order");
      }
    }

    const orderItems = [];

    for (const item of cartItems) {
      const latestProduct = await Product.findById(item.product._id).session(
        session
      );

      if (!latestProduct) {
        throw new Error(`Product not found: ${item.product.name}`);
      }

      const quantity = Number(item.quantity || 0);

      if (quantity <= 0) {
        throw new Error(`Invalid quantity for ${latestProduct.name}`);
      }

      if (
        item.selectedVariant &&
        item.selectedVariant.name &&
        item.selectedVariant.value
      ) {
        const variantIndex = latestProduct.variants.findIndex(
          (variant) =>
            String(variant.name) === String(item.selectedVariant.name) &&
            String(variant.value) === String(item.selectedVariant.value)
        );

        if (variantIndex === -1) {
          throw new Error(
            `Selected variant not found for ${latestProduct.name}`
          );
        }

        const variantStock = Number(
          latestProduct.variants[variantIndex].stock || 0
        );

        if (variantStock < quantity) {
          throw new Error(
            `Insufficient variant stock for ${latestProduct.name}`
          );
        }

        latestProduct.variants[variantIndex].stock = Math.max(
          0,
          variantStock - quantity
        );
      } else {
        if (Number(latestProduct.stock || 0) < quantity) {
          throw new Error(`Insufficient stock for ${latestProduct.name}`);
        }

        latestProduct.stock = Math.max(
          0,
          Number(latestProduct.stock || 0) - quantity
        );
      }

      latestProduct.sold = Number(latestProduct.sold || 0) + quantity;
      await latestProduct.save({ session });

      orderItems.push({
        product: latestProduct._id,
        quantity,
        price: Number(latestProduct.price || 0),
        selectedVariant: {
          name: item.selectedVariant?.name || "",
          value: item.selectedVariant?.value || "",
        },
      });
    }

    const finalShippingAddress = shippingAddress || user.addresses?.[0] || {};

    if (!finalShippingAddress || !finalShippingAddress.addressLine) {
      throw new Error("Shipping address is required");
    }

    if (Number(pricing.walletGramsUsed || 0) > 0) {
      const updatedWalletBalance = roundToThree(
        Number(user.silverWalletGrams || 0) - Number(pricing.walletGramsUsed)
      );

      if (updatedWalletBalance < 0) {
        throw new Error("Insufficient wallet balance");
      }

      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            silverWalletGrams: updatedWalletBalance,
          },
        },
        { session }
      );
    }

    const createdOrders = await Order.create(
      [
        {
          user: req.user._id,
          orderItems,
          totalPrice: pricing.finalPayable,
          pricing: {
            subtotal: pricing.subtotal,
            couponCode: pricing.couponCode,
            couponDiscount: pricing.couponDiscount,
            walletGramsUsed: pricing.walletGramsUsed,
            walletDiscount: pricing.walletDiscount,
            silverRateUsed: pricing.silverRate,
            finalPayable: pricing.finalPayable,
          },
          shippingAddress: {
            fullName: finalShippingAddress.fullName || "",
            phone: finalShippingAddress.phone || "",
            addressLine: finalShippingAddress.addressLine || "",
            city: finalShippingAddress.city || "",
            state: finalShippingAddress.state || "",
            postalCode: finalShippingAddress.postalCode || "",
            country: finalShippingAddress.country || "India",
          },
          paymentMethod: finalPayable > 0 ? "Razorpay" : "Wallet Only",
          paymentStatus: finalPayable > 0 ? "Paid" : "Not Required",
          isPaid: finalPayable > 0,
          paidAt: finalPayable > 0 ? new Date() : null,
          paymentResult: {
            razorpayOrderId: finalPayable > 0 ? razorpayOrderId : "",
            razorpayPaymentId: finalPayable > 0 ? razorpayPaymentId : "",
            razorpaySignature: finalPayable > 0 ? razorpaySignature : "",
            amount: finalPayable,
            currency: "INR",
          },
          shippingDetails: {
            courierName: "",
            trackingNumber: "",
            shippedAt: null,
            estimatedDelivery: null,
            shippingNote: "",
          },
          status: "Order Placed",
          trackingHistory: [
            {
              status: "Order Placed",
              date: new Date(),
              note: "",
            },
          ],
        },
      ],
      { session }
    );

    const order = createdOrders[0];

    if (paymentProof) {
      paymentProof.isUsedForOrder = true;
      paymentProof.usedAt = new Date();
      await paymentProof.save({ session });
    }

    await Cart.deleteMany({ user: req.user._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await Order.findById(order._id).populate(
      "orderItems.product"
    );

    // fire-and-forget customer email
    try {
      const customerEmailData = getCustomerOrderConfirmationTemplate({
        order: populatedOrder,
        user,
      });

      Promise.resolve(
        sendEmail({
          to: user.email,
          subject: customerEmailData.subject,
          text: customerEmailData.text,
          html: customerEmailData.html,
        })
      )
        .then((info) => {
          console.log("CUSTOMER ORDER EMAIL SENT:", info?.response || info);
        })
        .catch((emailError) => {
          console.error("CUSTOMER ORDER EMAIL ERROR:", emailError);
        });
    } catch (emailError) {
      console.error("CUSTOMER ORDER EMAIL PREP ERROR:", emailError);
    }

    // fire-and-forget admin email
    try {
      if (process.env.ADMIN_EMAIL) {
        const adminEmailData = getAdminNewOrderTemplate({
          order: populatedOrder,
          user,
        });

        Promise.resolve(
          sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: adminEmailData.subject,
            text: adminEmailData.text,
            html: adminEmailData.html,
          })
        )
          .then((info) => {
            console.log("ADMIN ORDER EMAIL SENT:", info?.response || info);
          })
          .catch((emailError) => {
            console.error("ADMIN ORDER EMAIL ERROR:", emailError);
          });
      }
    } catch (emailError) {
      console.error("ADMIN ORDER EMAIL PREP ERROR:", emailError);
    }

    return res.status(201).json(populatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("PLACE ORDER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to place order",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch all orders",
    });
  }
};

const cancelMyOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.user._id) !== String(req.user._id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        message: "You are not allowed to cancel this order",
      });
    }

    if (order.status === "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    if (!CUSTOMER_CANCELLABLE_STATUS.includes(order.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message:
          "This order can no longer be cancelled because it is already being shipped or delivered",
      });
    }

    await restoreOrderStock(order, session);

    order.status = "Cancelled";
    order.trackingHistory.push({
      status: "Cancelled",
      date: new Date(),
      note: "Cancelled by customer",
    });

    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    try {
      if (order.user?.email) {
        const statusEmailData = getOrderStatusUpdateTemplate({
          order: updatedOrder,
          user: order.user,
          status: "Cancelled",
        });

        Promise.resolve(
          sendEmail({
            to: order.user.email,
            subject: statusEmailData.subject,
            text: statusEmailData.text,
            html: statusEmailData.html,
          })
        )
          .then((info) => {
            console.log("CUSTOMER CANCEL EMAIL SENT:", info?.response || info);
          })
          .catch((emailError) => {
            console.error("CUSTOMER CANCEL EMAIL ERROR:", emailError);
          });
      }
    } catch (emailError) {
      console.error("CUSTOMER CANCEL EMAIL PREP ERROR:", emailError);
    }

    return res.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("CANCEL MY ORDER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to cancel order",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    console.log("UPDATE ORDER STATUS HIT");

    const {
      status: newStatus,
      courierName = "",
      trackingNumber = "",
      estimatedDelivery = null,
      shippingNote = "",
    } = req.body;

    if (!ALLOWED_STATUS.includes(newStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const oldStatus = order.status;

    if (oldStatus === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be updated",
      });
    }

    if (oldStatus === "Delivered" && newStatus !== "Delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be changed",
      });
    }

    if (newStatus === "Cancelled" && oldStatus !== "Cancelled") {
      await restoreOrderStock(order);
    }

    const mergedShippingDetails = {
      courierName:
        courierName !== undefined && courierName !== null
          ? String(courierName).trim()
          : order.shippingDetails?.courierName || "",
      trackingNumber:
        trackingNumber !== undefined && trackingNumber !== null
          ? String(trackingNumber).trim()
          : order.shippingDetails?.trackingNumber || "",
      shippedAt:
        newStatus === "Shipped"
          ? order.shippingDetails?.shippedAt || new Date()
          : order.shippingDetails?.shippedAt || null,
      estimatedDelivery: estimatedDelivery
        ? new Date(estimatedDelivery)
        : order.shippingDetails?.estimatedDelivery || null,
      shippingNote:
        shippingNote !== undefined && shippingNote !== null
          ? String(shippingNote).trim()
          : order.shippingDetails?.shippingNote || "",
    };

    if (newStatus === "Shipped") {
      if (
        !mergedShippingDetails.courierName ||
        !mergedShippingDetails.trackingNumber
      ) {
        return res.status(400).json({
          message: "Courier name and tracking number are required",
        });
      }
    }

    order.shippingDetails = mergedShippingDetails;
    order.markModified("shippingDetails");

    if (order.status !== newStatus) {
      order.status = newStatus;
      order.trackingHistory.push({
        status: newStatus,
        date: new Date(),
        note: mergedShippingDetails.shippingNote || "",
      });
    }

    console.log("BEFORE ORDER SAVE");
    const updatedOrder = await order.save();
    console.log("AFTER ORDER SAVE");

    // fire-and-forget email so API never hangs
    try {
      if (order.user?.email) {
        const statusEmailData = getOrderStatusUpdateTemplate({
          order: updatedOrder,
          user: order.user,
          status: newStatus,
        });

        Promise.resolve(
          sendEmail({
            to: order.user.email,
            subject: statusEmailData.subject,
            text: statusEmailData.text,
            html: statusEmailData.html,
          })
        )
          .then((info) => {
            console.log("ORDER STATUS EMAIL SENT:", info?.response || info);
          })
          .catch((emailError) => {
            console.error("ORDER STATUS EMAIL ERROR:", emailError);
          });
      }
    } catch (emailError) {
      console.error("ORDER STATUS EMAIL PREP ERROR:", emailError);
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to update order status",
    });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to access this invoice",
      });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);
    doc.moveDown();

    doc.text("Shipping Address:");
    doc.text(order.shippingAddress.fullName || "");
    doc.text(order.shippingAddress.addressLine || "");
    doc.text(
      `${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""}`
    );
    doc.text(order.shippingAddress.postalCode || "");
    doc.moveDown();

    if (
      order.shippingDetails?.courierName ||
      order.shippingDetails?.trackingNumber
    ) {
      doc.text("Shipping Details:");
      doc.text(`Courier: ${order.shippingDetails.courierName || "-"}`);
      doc.text(
        `Tracking Number: ${order.shippingDetails.trackingNumber || "-"}`
      );
      doc.moveDown();
    }

    doc.text("Items:");
    doc.moveDown();

    order.orderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product?.name || "Product"} (x${
          item.quantity
        }) - ₹${item.price * item.quantity}`
      );
    });

    doc.moveDown();

    doc.text(`Subtotal: ₹${order.pricing?.subtotal || 0}`);
    doc.text(`Discount: ₹${order.pricing?.couponDiscount || 0}`);
    doc.text(`Wallet: ₹${order.pricing?.walletDiscount || 0}`);
    doc.moveDown();

    doc.fontSize(14).text(`Final Total: ₹${order.totalPrice}`, {
      bold: true,
    });

    doc.end();
  } catch (error) {
    console.error("INVOICE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate invoice",
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  cancelMyOrder,
  updateOrderStatus,
  downloadInvoice,
};