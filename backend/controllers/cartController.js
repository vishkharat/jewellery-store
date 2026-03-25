const Cart = require("../models/Cart");
const Product = require("../models/Product");

const normalizeVariant = (selectedVariant) => {
  if (
    selectedVariant &&
    typeof selectedVariant === "object" &&
    selectedVariant.name &&
    selectedVariant.value
  ) {
    return {
      name: String(selectedVariant.name).trim(),
      value: String(selectedVariant.value).trim(),
    };
  }

  return null;
};

const isSameVariant = (variantA, variantB) => {
  if (!variantA && !variantB) return true;
  if (!variantA || !variantB) return false;

  return (
    String(variantA.name) === String(variantB.name) &&
    String(variantA.value) === String(variantB.value)
  );
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedVariant } = req.body;

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const normalizedVariant = normalizeVariant(selectedVariant);

    // VARIANT VALIDATION
    if (product.variants && product.variants.length > 0) {
      if (!normalizedVariant) {
        return res.status(400).json({
          message: "Please select a variant",
        });
      }

      const matchedVariant = product.variants.find(
        (variant) =>
          String(variant.name) === normalizedVariant.name &&
          String(variant.value) === normalizedVariant.value
      );

      if (!matchedVariant) {
        return res.status(400).json({
          message: "Selected variant is invalid",
        });
      }

      if (matchedVariant.stock < qty) {
        return res.status(400).json({
          message: `Only ${matchedVariant.stock} item(s) available for selected variant`,
        });
      }
    } else {
      if (product.stock < qty) {
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }
    }

    const userCartItems = await Cart.find({
      user: req.user._id,
      product: productId,
    });

    const existingCartItem = userCartItems.find((item) =>
      isSameVariant(item.selectedVariant, normalizedVariant)
    );

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + qty;

      if (product.variants && product.variants.length > 0) {
        const matchedVariant = product.variants.find(
          (variant) =>
            String(variant.name) === normalizedVariant.name &&
            String(variant.value) === normalizedVariant.value
        );

        if (!matchedVariant) {
          return res.status(400).json({
            message: "Selected variant is invalid",
          });
        }

        if (newQuantity > matchedVariant.stock) {
          return res.status(400).json({
            message: `Only ${matchedVariant.stock} item(s) available for selected variant`,
          });
        }
      } else {
        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: `Only ${product.stock} item(s) available in stock`,
          });
        }
      }

      existingCartItem.quantity = newQuantity;
      existingCartItem.selectedVariant = normalizedVariant;

      const updatedCartItem = await existingCartItem.save();
      return res.status(200).json(updatedCartItem);
    }

    const cartItem = await Cart.create({
      user: req.user._id,
      product: productId,
      selectedVariant: normalizedVariant,
      quantity: qty,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE QUANTITY
const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findById(req.params.id).populate("product");

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this cart item",
      });
    }

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    if (!cartItem.product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (cartItem.product.variants && cartItem.product.variants.length > 0) {
      const matchedVariant = cartItem.product.variants.find(
        (variant) =>
          cartItem.selectedVariant &&
          String(variant.name) === String(cartItem.selectedVariant.name) &&
          String(variant.value) === String(cartItem.selectedVariant.value)
      );

      if (!matchedVariant) {
        return res.status(400).json({
          message: "Selected variant is invalid",
        });
      }

      if (qty > matchedVariant.stock) {
        return res.status(400).json({
          message: `Only ${matchedVariant.stock} item(s) available for selected variant`,
        });
      }
    } else {
      if (qty > cartItem.product.stock) {
        return res.status(400).json({
          message: `Only ${cartItem.product.stock} item(s) available in stock`,
        });
      }
    }

    cartItem.quantity = qty;

    const updatedCart = await cartItem.save();

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to remove this cart item",
      });
    }

    await cartItem.deleteOne();

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};