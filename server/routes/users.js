const express = require("express");
const router = express.Router();

require("../database/connection");
const User = require("../model/UserSchema");
const Cart = require("../model/CartSchema");

// --------------- LOGIN ------------------------------------

router.post("/api/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Fill the data" });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      res.json({ message: "User signed in successfully" });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// ------------------------------ SIGNUP ----------------------------------------

router.post("/api/signup", async (req, res) => {
  console.log(req.body);
  // res.json({ message: req.body });

  // res.send(req.body.name);
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(400).json({ error: "Please fill all the details" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email Exists" });
    } else if (password != cpassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password does not match" });
    } else {
      const user = new User({ name, email, phone, password, cpassword });

      // password hashing

      const userRegistered = await user.save();
      if (userRegistered) {
        console.log(user);
        res.status(201).json({ message: "user successfully registered" });
      } else {
        res.status(500).json({ error: "Failed to register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.session.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a cart item
    const cartItem = {
      product: productId,
      quantity: quantity,
    };

    // Add the cart item to the user's cart
    user.cart.items.push(cartItem);

    // Recalculate the total price based on the cart items (you'll need to implement this logic)
    // user.cart.total = calculateTotalPrice(user.cart.items);

    // Save the user document with the updated cart
    await user.save();

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

router.get("/api/logout", (req, res) => {
  console.log("Logout ");
  res.status(200).send("User Logout");
});

module.exports = router;
