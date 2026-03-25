const Coupon = require("../models/Coupon");


// CREATE COUPON (ADMIN)
const createCoupon = async (req, res) => {
  try {

    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate
    } = req.body;

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate
    });

    const savedCoupon = await coupon.save();

    res.status(201).json(savedCoupon);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// GET ALL COUPONS
const getCoupons = async (req, res) => {
  try {

    const coupons = await Coupon.find();

    res.json(coupons);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// APPLY COUPON
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon code"
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        message: "Coupon inactive"
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        message: "Coupon expired"
      });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount ₹${coupon.minOrderAmount}`
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    }

    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    const finalPrice = cartTotal - discount;

    res.json({
      code: coupon.code,
      originalPrice: cartTotal,
      discount,
      finalPrice
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE COUPON
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found"
      });
    }

    coupon.code = req.body.code || coupon.code;
    coupon.discountType = req.body.discountType || coupon.discountType;
    coupon.discountValue =
      req.body.discountValue !== undefined
        ? req.body.discountValue
        : coupon.discountValue;
    coupon.minOrderAmount =
      req.body.minOrderAmount !== undefined
        ? req.body.minOrderAmount
        : coupon.minOrderAmount;
    coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;

    if (req.body.isActive !== undefined) {
      coupon.isActive =
        req.body.isActive === true || req.body.isActive === "true";
    }

    const updatedCoupon = await coupon.save();

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE COUPON
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found"
      });
    }

    await coupon.deleteOne();

    res.json({
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  applyCoupon,
  updateCoupon,
  deleteCoupon
};