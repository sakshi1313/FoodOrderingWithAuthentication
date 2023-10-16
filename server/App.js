const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

require("./database/connection");
app.use(express.json());

app.use(require("./routes/users"));

dotenv.config({ path: "./.env" });
// app.use(express.urlencoded({ extended: true }));

// ------------- DATABASE--------------------

// ----------------- ROUTES -----------------------------

app.get("/", (req, res) => {
  res.send("hello");
});

// app.get("/login", (req, res) => {
//   res.send("login");
// });

// app.get("/signup", (req, res) => {
//   res.send("signup");
// });

app.get("/menu", (req, res) => {
  res.send("menu");
});

app.get("/cart", (req, res) => {
  res.send("cart");
});

app.listen(8080, () => {
  console.log("server is running");
});
