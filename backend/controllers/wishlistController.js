const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    if (existing) {
      return res.status(400).json({
        message: "Product already in wishlist"
      });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId
    });

    res.status(201).json(wishlistItem);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET USER WISHLIST
const getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.find({
      user: req.user._id
    }).populate("product");

    res.json(wishlist);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {

    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found"
      });
    }

    await item.deleteOne();

    res.json({
      message: "Removed from wishlist"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};