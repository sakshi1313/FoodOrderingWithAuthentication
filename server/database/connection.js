const mongoose = require("mongoose");
// const db = process.env.DATABASE;

const db_url = "mongodb://localhost:27017/store";
const db =
  "mongodb+srv://sakshidwivedi13:tGxONeIDm16p1BCg@cluster0.v8ymznj.mongodb.net/?retryWrites=true&w=majority";

console.log(db_url);
mongoose
  .connect(db)
  .then(() => {
    console.log("DATABASE connection successful");
  })
  .catch((err) => {
    console.log("no connection");
  });
