const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");


// DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalCustomers = await User.countDocuments({ role: "customer" });

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// MONTHLY SALES
const getMonthlySales = async (req, res) => {
  try {

    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    res.json(sales);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// TOP SELLING PRODUCTS
const getTopProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ sold: -1 })
      .limit(5);

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  getDashboardStats,
  getMonthlySales,
  getTopProducts
};