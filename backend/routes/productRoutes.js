const express = require("express");
const router = express.Router();

const {
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
  addProductImages
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
// PRODUCT SEARCH
router.get("/search", searchProducts);

// SEARCH SUGGESTIONS
router.get("/suggestions", searchSuggestions);

router.get("/featured", getFeaturedProducts);

router.get("/bestsellers", getBestSellers);

router.get("/latest", getLatestProducts);

router.get("/:id", getProductById);

router.post(
"/",
protect,
admin,
upload.array("images",5),
createProduct
);
// ADD IMAGES
router.post(
"/:id/images",
protect,
admin,
upload.array("images",5),
addProductImages
);

// DELETE IMAGE
router.delete(
"/:productId/images/:imageId",
protect,
admin,
deleteProductImage
);
router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/review", protect, addProductReview);

module.exports = router;