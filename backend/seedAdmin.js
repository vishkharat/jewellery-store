const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {

  await User.create({
    name: "Admin",
    email: "admin@store.com",
    password: "123456",
    isAdmin: true
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();