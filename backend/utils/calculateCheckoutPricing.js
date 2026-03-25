const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const User = require("../models/User");

const roundToTwo = (num) => Number(Number(num).toFixed(2));
const roundToThree = (num) => Number(Number(num).toFixed(3));

const getMatchingVariant = (product, selectedVariant) => {
  if (
    !product ||
    !product.variants ||
    !product.variants.length ||
    !selectedVariant ||
    !selectedVariant.name ||
    !selectedVariant.value
  ) {
    return null;
  }

  return product.variants.find(
    (variant) =>
      String(variant.name) === String(selectedVariant.name) &&
      String(variant.value) === String(selectedVariant.value)
  );
};

const calculateCheckoutPricing = async ({
  userId,
  couponCode = "",
  walletGramsToUse = 0,
}) => {
  const cartItems = await Cart.find({ user: userId }).populate("product");

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  for (const item of cartItems) {
    if (!item.product) {
      throw new Error("Product not found in cart");
    }

    const product = item.product;
    const quantity = Number(item.quantity || 0);

    if (quantity <= 0) {
      throw new Error(`Invalid quantity for ${product.name}`);
    }

    if (
      item.selectedVariant &&
      item.selectedVariant.name &&
      item.selectedVariant.value
    ) {
      const matchedVariant = getMatchingVariant(product, item.selectedVariant);

      if (!matchedVariant) {
        throw new Error(
          `Selected variant not found for product ${product.name}`
        );
      }

      if (Number(matchedVariant.stock || 0) < quantity) {
        throw new Error(
          `Insufficient stock for ${product.name} - ${matchedVariant.name}: ${matchedVariant.value}`
        );
      }
    } else {
      if (Number(product.stock || 0) < quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }
  }

  const subtotal = roundToTwo(
    cartItems.reduce((acc, item) => {
      return acc + Number(item.product.price || 0) * Number(item.quantity || 0);
    }, 0)
  );

  let couponDiscount = 0;
  let appliedCouponCode = "";

  if (couponCode && String(couponCode).trim()) {
    const normalizedCode = String(couponCode).trim().toUpperCase();

    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.isActive) {
      throw new Error("Coupon inactive");
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new Error("Coupon expired");
    }

    if (subtotal < Number(coupon.minOrderAmount || 0)) {
      throw new Error(`Minimum order amount ₹${coupon.minOrderAmount}`);
    }

    if (coupon.discountType === "percentage") {
      couponDiscount = roundToTwo(
        (subtotal * Number(coupon.discountValue || 0)) / 100
      );
    }

    if (coupon.discountType === "fixed") {
      couponDiscount = roundToTwo(Number(coupon.discountValue || 0));
    }

    if (couponDiscount > subtotal) {
      couponDiscount = subtotal;
    }

    appliedCouponCode = normalizedCode;
  }

  const silverRate = roundToTwo(Number(process.env.SILVER_WALLET_RATE || 80));

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const requestedWalletGrams = Math.max(Number(walletGramsToUse || 0), 0);
  const availableWalletGrams = roundToThree(
    Number(user.silverWalletGrams || 0)
  );

  if (requestedWalletGrams > availableWalletGrams) {
    throw new Error("Requested wallet grams exceed available balance");
  }

  const afterCouponTotal = roundToTwo(subtotal - couponDiscount);

  let actualWalletGramsUsed = roundToThree(requestedWalletGrams);
  let walletDiscount = roundToTwo(actualWalletGramsUsed * silverRate);

  if (walletDiscount > afterCouponTotal) {
    walletDiscount = roundToTwo(afterCouponTotal);
    actualWalletGramsUsed = roundToThree(walletDiscount / silverRate);
  }

  const finalPayable = roundToTwo(afterCouponTotal - walletDiscount);

  return {
    cartItems,
    user,
    subtotal,
    couponCode: appliedCouponCode,
    couponDiscount,
    silverRate,
    walletGramsUsed: actualWalletGramsUsed,
    walletDiscount,
    finalPayable,
    availableWalletGrams,
  };
};

module.exports = calculateCheckoutPricing;