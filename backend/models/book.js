const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    uploader_id: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "used", "like new", "refurbished"],
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId, // Reference to the Category schema
      ref: "category", // Model name to reference
      required: true, // Make it required
    },
    stock: {
      type: Number,
      required: true, // Making stock required
      min: 0, // Ensuring stock cannot be negative
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
