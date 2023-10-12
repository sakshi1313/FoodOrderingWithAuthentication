const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  cart: [cartItemSchema], // Embed the cart data within the user schema
  totalAmount: { type: Number, default: 0 }, // You can also store the total cart amount
});

const User = mongoose.model("USER", userSchema);
module.exports = User;
