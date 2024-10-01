const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected with server");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = connectDB;
