const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../database/connection");
const User = require("../model/UserSchema");
const authenticate = require("../middleware/authenticate");

// const Cart = require("../model/CartSchema");

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
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // ----------------- JWT TOKENS--------------------------------------
      const token = await userLogin.generateAuthToken();
      console.log(token);
      // user jb bhi login krega..token generate hoge and database me field me add ho jayega

      // --------------------------------------COOKIES ME STORE KRNA H

      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000), // 30 days ms
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.status(200).json({ message: "User signed in" });
      }
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

router.post("/api/cart", async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    console.log("TOKENNNNNNNN");
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Decoded Token:");
    // console.log(decoded);

    const user = await User.findById(decoded._id);
    console.log("User from Database:");
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { productId, quantity, name, price } = req.body;
    // console.log("Request Body:");
    // console.log(req.body);

    if (!productId || !quantity || !name || !price) {
      return res
        .status(400)
        .json({ message: "Invalid request data. Missing fields." });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.id === productId
    );

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its quantity
      user.cart[existingItemIndex].amount += quantity;
    } else {
      // If the item doesn't exist in the cart, add it as a new item
      const itemToAdd = {
        id: productId,
        name: name, // Replace with actual product data
        price: price, // Replace with actual product data
        amount: quantity,
      };

      user.cart.push(itemToAdd);
    }

    user.totalAmount += price * quantity;

    const updatedUserCart = await user.save();
    console.log("Updated User Cart:");
    console.log(updatedUserCart);

    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.delete("/api/cart/:productId", async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    console.log("TOKENNNNNNNN");
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const productId = req.params.productId;
    console.log("PoductID:");
    console.log(productId);

    const user = await User.findById(decoded._id);
    console.log("User from Database:");
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex((item) => item.id === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    const item = user.cart[itemIndex];

    if (item.amount > 1) {
      item.amount--;
    } else {
      user.cart.splice(itemIndex, 1);
    }

    TODO: user.totalAmount -= item.price;

    const updatedUser = await user.save();

    return res.status(200).json({ message: "Item removed from the cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

router.get("/api/logout", (req, res) => {
  console.log("Logout ");
  res.status(200).send("User Logout");
});

module.exports = router;
