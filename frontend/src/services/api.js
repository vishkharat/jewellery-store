import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;

// GET FEATURED PRODUCTS
export const getFeaturedProducts = async () => {
  const res = await API.get("/products/featured");
  return res.data;
};

// GET ALL PRODUCTS
export const getAllProducts = async (query = "") => {
  const res = await API.get(`/products?${query}`);
  return res.data;
};

// GET SINGLE PRODUCT
export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// ADD TO CART
export const addToCartApi = async (
  productId,
  token,
  selectedVariant = null
) => {
  const res = await API.post(
    "/cart",
    {
      productId,
      quantity: 1,
      selectedVariant,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// GET CART ITEMS
export const getCartItemsApi = async (token) => {
  const res = await API.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// UPDATE CART ITEM
export const updateCartItemApi = async (cartItemId, quantity, token) => {
  const res = await API.put(
    `/cart/${cartItemId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// REMOVE CART ITEM
export const removeCartItemApi = async (cartItemId, token) => {
  const res = await API.delete(`/cart/${cartItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ADD TO WISHLIST
export const addToWishlistApi = async (productId, token) => {
  const res = await API.post(
    "/wishlist",
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// GET WISHLIST ITEMS
export const getWishlistItemsApi = async (token) => {
  const res = await API.get("/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// REMOVE WISHLIST ITEM
export const removeWishlistItemApi = async (wishlistItemId, token) => {
  const res = await API.delete(`/wishlist/${wishlistItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET MY ORDERS
export const getMyOrdersApi = async (token) => {
  const res = await API.get("/orders/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// CANCEL MY ORDER
export const cancelMyOrderApi = async (orderId, token) => {
  const res = await API.put(
    `/orders/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// DOWNLOAD INVOICE
export const downloadInvoiceApi = async (orderId, token) => {
  const res = await API.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// PLACE ORDER
export const placeOrderApi = async (orderData, token) => {
  const res = await API.post("/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// CREATE RAZORPAY ORDER
export const createPaymentOrderApi = async (checkoutData, token) => {
  const res = await API.post("/payments/create-order", checkoutData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// VERIFY PAYMENT
export const verifyPaymentApi = async (paymentData, token) => {
  const res = await API.post("/payments/verify", paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET ADMIN DASHBOARD STATS
export const getAdminDashboardApi = async (token) => {
  const res = await API.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET MONTHLY SALES
export const getMonthlySalesApi = async (token) => {
  const res = await API.get("/admin/sales/monthly", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET TOP PRODUCTS
export const getTopProductsApi = async (token) => {
  const res = await API.get("/admin/top-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// DELETE PRODUCT
export const deleteProductApi = async (productId, token) => {
  const res = await API.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// CREATE PRODUCT
export const createProductApi = async (formData, token) => {
  const res = await API.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// UPDATE PRODUCT
export const updateProductApi = async (productId, updatedData, token) => {
  const res = await API.put(`/products/${productId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ADD PRODUCT IMAGES
export const addProductImagesApi = async (productId, formData, token) => {
  const res = await API.post(`/products/${productId}/images`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// DELETE PRODUCT IMAGE
export const deleteProductImageApi = async (productId, imageId, token) => {
  const res = await API.delete(`/products/${productId}/images/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersApi = async (token) => {
  const res = await API.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// UPDATE ORDER STATUS (ADMIN) + MANUAL SHIPPING DETAILS
export const updateOrderStatusApi = async (orderId, payload, token) => {
  const res = await API.put(`/orders/${orderId}/status`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET COUPONS
export const getCouponsApi = async (token) => {
  const res = await API.get("/coupons", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// CREATE COUPON
export const createCouponApi = async (couponData, token) => {
  const res = await API.post("/coupons", couponData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// APPLY COUPON
export const applyCouponApi = async (code, cartTotal, token) => {
  const res = await API.post(
    "/coupons/apply",
    { code, cartTotal },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// SEARCH PRODUCT SUGGESTIONS
export const getSearchSuggestionsApi = async (query) => {
  const res = await API.get(`/products/suggestions?q=${query}`);
  return res.data;
};

// GET CART COUNT
export const getCartCountApi = async (token) => {
  const res = await API.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET WISHLIST COUNT
export const getWishlistCountApi = async (token) => {
  const res = await API.get("/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ADD PRODUCT REVIEW
export const addProductReviewApi = async (productId, reviewData, token) => {
  const res = await API.post(`/products/${productId}/review`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET USER PROFILE
export const getUserProfileApi = async (token) => {
  const res = await API.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// UPDATE COUPON
export const updateCouponApi = async (couponId, couponData, token) => {
  const res = await API.put(`/coupons/${couponId}`, couponData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// DELETE COUPON
export const deleteCouponApi = async (couponId, token) => {
  const res = await API.delete(`/coupons/${couponId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ADDRESS APIs
export const getAddressesApi = async (token) => {
  const res = await API.get("/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addAddressApi = async (data, token) => {
  const res = await API.post("/addresses", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteAddressApi = async (id, token) => {
  const res = await API.delete(`/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE EXCHANGE REQUEST
export const createExchangeRequestApi = async (exchangeData, token) => {
  const res = await API.post("/exchanges", exchangeData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET MY EXCHANGE REQUESTS
export const getMyExchangeRequestsApi = async (token) => {
  const res = await API.get("/exchanges/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET ALL EXCHANGE REQUESTS (ADMIN)
export const getAllExchangeRequestsApi = async (token) => {
  const res = await API.get("/exchanges", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// UPDATE EXCHANGE REQUEST (ADMIN)
export const updateExchangeRequestApi = async (
  exchangeId,
  updateData,
  token
) => {
  const res = await API.put(`/exchanges/${exchangeId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// contact page
export const submitContactFormApi = async (formData) => {
  const { data } = await API.post("/contact", formData);
  return data;
};

// get contact on admin side
export const getAdminContactMessagesApi = async (token) => {
  const { data } = await API.get("/contact", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// news letter
export const subscribeNewsletterApi = async (email) => {
  const { data } = await API.post("/newsletter/subscribe", { email });
  return data;
};

// get news letter
export const getAdminNewsletterSubscribersApi = async (token) => {
  const { data } = await API.get("/newsletter", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};