const ExchangeRequest = require("../models/ExchangeRequest");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// CREATE EXCHANGE REQUEST (CUSTOMER)
const createExchangeRequest = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      requestQuantity = 1,
      reason = "",
      customerNote = "",
      selectedVariant = null,
    } = req.body;

    if (!orderId || !productId) {
      return res.status(400).json({
        message: "orderId and productId are required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    }).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be exchanged",
      });
    }

    const matchedOrderItem = order.orderItems.find((item) => {
      const sameProduct =
        item.product && item.product._id.toString() === productId.toString();

      if (!sameProduct) return false;

      if (selectedVariant && selectedVariant.name && selectedVariant.value) {
        return (
          item.selectedVariant &&
          item.selectedVariant.name === selectedVariant.name &&
          item.selectedVariant.value === selectedVariant.value
        );
      }

      return true;
    });

    if (!matchedOrderItem) {
      return res.status(404).json({
        message: "Matching product not found in this order",
      });
    }

    if (Number(requestQuantity) > Number(matchedOrderItem.quantity)) {
      return res.status(400).json({
        message: "Requested quantity exceeds ordered quantity",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingPendingRequest = await ExchangeRequest.findOne({
      user: req.user._id,
      order: orderId,
      product: productId,
      "selectedVariant.name": selectedVariant?.name || "",
      "selectedVariant.value": selectedVariant?.value || "",
      status: { $in: ["pending", "approved", "product_received"] },
    });

    if (existingPendingRequest) {
      return res.status(400).json({
        message: "Exchange request already exists for this item",
      });
    }

    // IMPORTANT FIX:
    // tamara current Product model ma "weight" chhe, "metalWeight" nathi
    const originalMetalWeight = Number(product.weight || 0);

    // current model ma purity field nathi, etle default 0.925
    const purity = 0.925;

    const exchangePercent = 50;

    const estimatedCreditGrams =
      originalMetalWeight *
      purity *
      (exchangePercent / 100) *
      Number(requestQuantity);

    const exchangeRequest = await ExchangeRequest.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      productName: product.name,
      productImage: product.images?.[0]?.url || "",
      selectedVariant: {
        name:
          selectedVariant?.name ||
          matchedOrderItem?.selectedVariant?.name ||
          "",
        value:
          selectedVariant?.value ||
          matchedOrderItem?.selectedVariant?.value ||
          "",
      },
      requestQuantity: Number(requestQuantity),
      originalMetalWeight,
      purity,
      exchangePercent,
      estimatedCreditGrams: Number(estimatedCreditGrams.toFixed(3)),
      approvedCreditGrams: 0,
      creditedToWallet: false,
      reason,
      customerNote,
      status: "pending",
    });

    res.status(201).json(exchangeRequest);
  } catch (error) {
    console.error("CREATE EXCHANGE REQUEST ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY EXCHANGE REQUESTS (CUSTOMER)
const getMyExchangeRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("order", "_id status totalPrice");

    res.json(requests);
  } catch (error) {
    console.error("GET MY EXCHANGE REQUESTS ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL EXCHANGE REQUESTS (ADMIN)
const getAllExchangeRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email silverWalletGrams")
      .populate("order", "_id status totalPrice");

    res.json(requests);
  } catch (error) {
    console.error("GET ALL EXCHANGE REQUESTS ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE EXCHANGE REQUEST (ADMIN)
const updateExchangeRequest = async (req, res) => {
  try {
    const { status, approvedCreditGrams, adminNote } = req.body;

    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Exchange request not found",
      });
    }

    const allowedStatus = [
      "pending",
      "approved",
      "rejected",
      "product_received",
      "credit_issued",
    ];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid exchange status",
      });
    }

    if (approvedCreditGrams !== undefined) {
      request.approvedCreditGrams = Number(approvedCreditGrams);
    }

    if (adminNote !== undefined) {
      request.adminNote = adminNote;
    }

    if (status) {
      request.status = status;
    }

    if (
      request.status === "credit_issued" &&
      request.creditedToWallet === false
    ) {
      if (
        !request.approvedCreditGrams ||
        Number(request.approvedCreditGrams) <= 0
      ) {
        return res.status(400).json({
          message:
            "Approved credit grams must be greater than 0 before issuing credit",
        });
      }

      const user = await User.findById(request.user);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const updatedWallet =
        Number(user.silverWalletGrams || 0) +
        Number(request.approvedCreditGrams);

      await User.findByIdAndUpdate(request.user, {
        $set: {
          silverWalletGrams: Number(updatedWallet.toFixed(3)),
        },
      });

      request.creditedToWallet = true;
    }

    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    console.error("UPDATE EXCHANGE REQUEST ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createExchangeRequest,
  getMyExchangeRequests,
  getAllExchangeRequests,
  updateExchangeRequest,
};