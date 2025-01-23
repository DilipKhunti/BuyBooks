const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

// Add a new book
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming 'id' is the user ID passed in the headers
    
    // const user = await User.findById(id);
    // Uncomment if you need admin access control
    // if (user.role !== "admin") {
    //   return res.status(400).json({ message: "You don't have access to perform this task" });
    // }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
      uploader_id: id, // Use the authenticated user ID as the uploader_id
      condition: req.body.condition, // New field
      category: req.body.category, // Reference to category
      stock: req.body.stock, // New field for stock
    });

    await book.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Authenticated user's ID
    const { bookid } = req.headers;

    const book = await Book.findById(bookid);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user updating the book is the uploader or admin
    if (book.uploader_id !== id /* && user.role !== "admin" */) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this book" });
    }

    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
      condition: req.body.condition, // Updated field
      category: req.body.category, // Updated field
      stock: req.body.stock, // Updated field for stock
    });

    return res.status(200).json({
      message: "Book updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Authenticated user's ID
    const { bookid } = req.headers;

    const book = await Book.findById(bookid);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user deleting the book is the uploader or admin
    if (book.uploader_id !== id /* && user.role !== "admin" */) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this book" });
    }

    await Book.findByIdAndDelete(bookid);

    return res.status(200).json({
      message: "Book deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get recently added books, limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get book by ID
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("category");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get books uploaded by user
router.get("/get-books-by-uploader", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Authenticated user's ID

    // Find books where the uploader_id matches the authenticated user
    const books = await Book.find({ uploader_id: id })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get books by category (by category name or category ID)
router.get("/get-books-by-category", async (req, res) => {
  try {
    const { category } = req.headers;

    // Find books where the 'category' matches the provided category (name or ID)
    const books = await Book.find({ category })
      .populate("category")
      .sort({ createdAt: -1 });

    if (books.length === 0) {
      return res.status(404).json({
        status: "Failure",
        message: "No books found for this category",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/get-books-by-condition", async (req, res) => {
  try {
    const { condition } = req.headers;

    if (!condition) {
      return res.status(400).json({
        status: "Failure",
        message: "Condition is required",
      });
    }

    // Fetch books by condition
    const books = await Book.find({ condition }).sort({ createdAt: -1 });

    if (books.length === 0) {
      return res.status(404).json({
        status: "Failure",
        message: "No books found for this condition",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Search for books by a search value (title, author, or description)
router.get("/search-books", async (req, res) => {
  try {
    const { search } = req.query; // Get the search value from the query parameters

    if (!search) {
      return res.status(400).json({
        status: "Failure",
        message: "Search value is required",
      });
    }

    // Search books where the title, author, or description contains the search value
    const books = await Book.find({
      $or: [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search
        { author: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ],
    })
      .populate("category")
      .sort({ createdAt: -1 });

    if (books.length === 0) {
      return res.status(404).json({
        status: "Failure",
        message: "No books found matching the search criteria",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
