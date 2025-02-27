// app.js or server.js
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Book = require("./routes/book");
const Order = require("./routes/order");
const Favourite = require("./routes/favourites");
const Cart = require("./routes/cart");
const Category = require("./routes/category");

// Enable CORS for all requests
app.use(cors());

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Book);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Category); // Use the category routes

// Creating port
app.listen(process.env.PORT, () => {
  console.log(`Server Started at Port ${process.env.PORT}`);
});
