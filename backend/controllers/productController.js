const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ADD PRODUCT (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      type,
      metal,
      weight,
      metalWeight,
      purity,
      makingCharges,
      price,
      stock,
      variants,
      isFeatured,
    } = req.body;

    const uploadedImages = [];

    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    let parsedVariants = [];

    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid variants format",
        });
      }
    }

    const product = new Product({
      name,
      description,
      category,
      type,
      metal,
      weight: Number(weight),
      metalWeight: Number(metalWeight),
      purity: Number(purity),
      makingCharges: Number(makingCharges),
      price: Number(price),
      stock: Number(stock),
      images: uploadedImages,
      variants: parsedVariants,
      isFeatured: isFeatured === "true" || isFeatured === true,
      createdBy: req.user._id,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PRODUCTS WITH FILTER + SORT + PAGINATION
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const type = req.query.type ? { type: req.query.type } : {};
    const metal = req.query.metal ? { metal: req.query.metal } : {};

    const priceFilter =
      req.query.minPrice && req.query.maxPrice
        ? {
            price: {
              $gte: Number(req.query.minPrice),
              $lte: Number(req.query.maxPrice),
            },
          }
        : {};

    const filter = {
      ...keyword,
      ...category,
      ...type,
      ...metal,
      ...priceFilter,
    };

    let sortOption = {};

    if (req.query.sort === "price") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "-price") {
      sortOption = { price: -1 };
    }

    if (req.query.sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (req.query.sort === "bestseller") {
      sortOption = { sold: -1 };
    }

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedData = {
      ...req.body,
      weight: Number(req.body.weight),
      metalWeight: Number(req.body.metalWeight),
      purity: Number(req.body.purity),
      makingCharges: Number(req.body.makingCharges),
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    };

    if (req.body.isFeatured !== undefined) {
      updatedData.isFeatured =
        req.body.isFeatured === true || req.body.isFeatured === "true";
    }

    if (req.body.variants !== undefined) {
      try {
        updatedData.variants =
          typeof req.body.variants === "string"
            ? JSON.parse(req.body.variants)
            : req.body.variants;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid variants format",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD PRODUCT REVIEW
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "Product already reviewed",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FEATURED PRODUCTS
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BEST SELLERS
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LATEST PRODUCTS
const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PRODUCT SEARCH ENGINE
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword) {
      return res.status(400).json({
        message: "Search keyword required",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
        { metal: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH SUGGESTIONS
const searchSuggestions = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .select("name")
      .limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const image = product.images.find((img) => img._id.toString() === imageId);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    await cloudinary.uploader.destroy(image.public_id);

    product.images = product.images.filter(
      (img) => img._id.toString() !== imageId
    );

    await product.save();

    res.json({
      message: "Image deleted successfully",
      images: product.images,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const uploadedImages = [];

    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + base64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    product.images.push(...uploadedImages);

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getFeaturedProducts,
  getBestSellers,
  getLatestProducts,
  searchProducts,
  searchSuggestions,
  deleteProductImage,
  addProductImages,
};