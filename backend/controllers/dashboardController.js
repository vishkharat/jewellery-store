const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");


// ADMIN DASHBOARD STATS

const getDashboardStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();


    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);


    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;


    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");


    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5);


    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      latestOrders,
      topProducts
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getDashboardStats
};