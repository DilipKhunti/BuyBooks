document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-all-categories`
    );
    const data = await response.json();

    if (data.status === "Success") {
      const categoryDropdown = document.getElementById("sort_options");
      categoryDropdown.innerHTML = `<option value="default">All Books</option>
                    <option value="new">New Books</option>
                    <option value="used">Used Books</option>
                    <option value="like new">Like New Books</option>
                    <option value="refurbished">Refurbished</option>`; // Clear existing options and add default

      data.data.forEach((category) => {
        const optionItem = `<option value="${category._id}">${category.name}</option>`;
        categoryDropdown.insertAdjacentHTML("beforeend", optionItem);
      });
    } else {
      console.error("Failed to load categories:", data.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

const selectElement = document.getElementById("sort_options");

// Add an event listener to detect when the value changes
document.getElementById("sort_options").addEventListener("change", function () {
  const selectedValue = document.getElementById("sort_options").value;
  document.querySelector(".book-inventory").innerHTML = "";

  // Reset pagination to page 1 whenever there's a filter change
  currentPage = 1;

  if (selectedValue === "default") {
    fetchAllBooks(); // Fetch all books if "All Books" is selected
  } else if (
    selectedValue === "used" ||
    selectedValue === "like new" ||
    selectedValue === "refurbished" ||
    selectedValue === "new"
  ) {
    fetchBooksByCondition(selectedValue);
  } else {
    fetchBooksByCategory(selectedValue);
  }
});

// Event listener for search
document
  .getElementById("search_books")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const searchValue = document.getElementById("searchInput").value;
    if (searchValue.trim() === "") {
      alert("Please enter a search term");
      return;
    }

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/search-books?search=${searchValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.data && result.data.length > 0) {
        currentPage = 1; // Reset to first page for search results
        totalBooks = result.data.length;
        displayBooks(result.data, currentPage); // Display search results
        setupPagination(result.data);
      } else if (result.data && result.data.length === 0) {
        document.querySelector(
          ".book-inventory"
        ).innerHTML = `<p>No books found for '${searchValue}'</p>`;
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  fetchAllBooks();
});

let currentPage = 1;
const booksPerPage = 8;
let totalBooks = 0;

// Fetch all books
async function fetchAllBooks() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-all-books`);
    const data = await response.json();

    if (data.status === "Success") {
      totalBooks = data.data.length;
      displayBooks(data.data, currentPage);
      setupPagination(data.data);
    } else {
      console.error("Failed to fetch books:", data.message);
    }
  } catch (error) {
    console.error("Error fetching all books:", error);
  }
}

// Fetch books by condition
async function fetchBooksByCondition(condition) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-books-by-condition`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: localStorage.getItem("userId"),
          condition: condition,
        },
      }
    );
    const data = await response.json();

    if (data.status === "Success") {
      totalBooks = data.data.length;
      displayBooks(data.data, currentPage);
      setupPagination(data.data);
    } else {
      console.error("Failed to load books:", data.message);
    }
  } catch (error) {
    console.error("Error fetching books by condition:", error);
  }
}

// Fetch books by category
async function fetchBooksByCategory(category) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-books-by-category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: localStorage.getItem("userId"),
          category: category,
        },
      }
    );
    const data = await response.json();

    if (data.status === "Success") {
      totalBooks = data.data.length;
      displayBooks(data.data, currentPage);
      setupPagination(data.data);
    } else {
      console.error("Failed to load books:", data.message);
    }
  } catch (error) {
    console.error("Error fetching books by category:", error);
  }
}

// Function to display books based on the current page
function displayBooks(books, page) {
  const booksContainer = document.querySelector(".book-inventory");

  // Clear existing books (if any)
  booksContainer.innerHTML = "";

  // Calculate start and end indices for books to display
  const start = (page - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = books.slice(start, end);

  // Insert books into the container
  paginatedBooks.forEach((book) => {
    const bookItem = `
        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="product__item">
            <a href="book.html?id=${book._id}">
              <div class="product__item__pic set-bg" data-setbg="${book.url}">
                <div class="product__label">
                  <span>${book.category.name}</span> <!-- Ensure category name is used -->
                </div>
              </div>
            </a>
            <div class="product__item__text">
              <h6><a href="#">${book.title}</a></h6>
              <div class="product__item__price">₹${book.price}</div>
              <div class="cart_add">
                <a href="#" onclick="addToCart('${book._id}', this)">Add to cart</a>
              </div>
            </div>
          </div>
        </div>
      `;
    booksContainer.insertAdjacentHTML("beforeend", bookItem);
  });

  // Update the range of displayed books
  document.getElementById("display-range").textContent = `${
    start + 1
  }-${Math.min(end, totalBooks)}`;
  document.getElementById("total-books").textContent = totalBooks;

  // Apply the background images once the books are inserted
  setBackgroundImages();
}

// Function to set the background images using the data-setbg attribute
function setBackgroundImages() {
  document.querySelectorAll(".set-bg").forEach((element) => {
    const bg = element.getAttribute("data-setbg");
    if (bg) {
      element.style.backgroundImage = `url('${bg}')`;
    }
  });
}

// Function to setup pagination
function setupPagination(books) {
  const paginationContainer = document.querySelector(".shop__pagination");

  // Calculate total pages
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  // Clear existing pagination (if any)
  paginationContainer.innerHTML = "";

  // Add page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = `<a href="#" class="${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</a>`;
    paginationContainer.insertAdjacentHTML("beforeend", pageItem);
  }

  // Add event listeners to page numbers
  document.querySelectorAll(".shop__pagination a").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = parseInt(e.target.getAttribute("data-page"));
      displayBooks(books, currentPage);
    });
  });
}

async function addToCart(bookId, element) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/add-to-cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        id: localStorage.getItem("userId"),
        bookid: bookId,
      },
      body: JSON.stringify({ bookid: bookId }),
    });
    const result = await response.json();
    element.innerHTML = "Added"; // Change innerHTML of the calling element to "Added"
  } catch (error) {
    console.error("Error adding book to cart:", error);
  }
}
