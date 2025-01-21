document.addEventListener("DOMContentLoaded", () => {
  // Extract book id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (bookId) {
    // Fetch book details using the bookId
    fetchBookDetails(bookId);
  } else {
    console.error("No book ID found in the URL");
  }
});

// Fetch book details from the backend using the book ID
async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-book-by-id/${bookId}`
    );
    const data = await response.json();

    if (data.status === "Success") {
      displayBookDetails(data.data); // Call function to display the book details
    } else {
      console.error("Failed to fetch book details:", data.message);
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
}

// Function to display book details on the product page
function displayBookDetails(book) {
  document.querySelector(".big_img").src = book.url;
  document.querySelector(".book-author").textContent = book.author;
  document.querySelector(".book-title").textContent = book.title;
  document.querySelector(".book-price").textContent = `₹ ${book.price}`;
  document.querySelector(".book-desc").textContent = book.desc;
  document.querySelector(".book-stock").textContent = book.stock; // Display available stock
  document.querySelector(".book-category").textContent = book.category.name; // Assuming you want to display the category name
  document.querySelector(".book-condition").textContent = book.condition; // Display condition
  document.querySelector(".book-description").textContent = book.desc; // If you want to show the description again
  // Add other fields as necessary
}

async function fetchRecentBooks() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-recent-books`);
    const result = await response.json();
    if (result.status === "Success") {
      const books = result.data;
      displayRelatedBooks(books);
    } else {
      console.error("Failed to fetch related books");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function displayRelatedBooks(books) {
  const container = document.getElementById("related-products-container");
  container.innerHTML = ""; // Clear existing products

  books.forEach((book) => {
    const bookHTML = `
      <div class="col-lg-3">
        <div class="product__item">
          <a href="./book.html?id=${book._id}">
            <div
              class="product__item__pic set-bg"
              style="background-image: url('${book.url}');"
            >
              <div class="product__label">
                <span>${book.category.name || "Category"}</span>
              </div>
            </div>
          </a>
          <div class="product__item__text">
            <h6><a href="./book.html?id=${book._id}">${book.title}</a></h6>
            <div class="product__item__price">₹ ${book.price}</div>
            <div class="cart_add">
              <a href="#">Add to cart</a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", bookHTML);
  });
}

function addToCart(element) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (!bookId) {
    console.error("No book ID found in the URL");
    return;
  }

  fetch(`${config.API_BASE_URL}/add-to-cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      bookid: bookId,
      Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you're using JWT and storing it in localStorage
      id: localStorage.getItem("userId"), // Assuming you store user ID in localStorage
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        console.log(data.message);
        element.innerHTML = "Added"; // Change innerHTML of the calling element to "Added"
      } else {
        console.error("Failed to add book to cart:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error adding book to cart:", error);
    });
}

function addToFav(element) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (!bookId) {
    console.error("No book ID found in the URL");
    return;
  }

  fetch(`${config.API_BASE_URL}/add-book-to-favourite`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      bookid: bookId,
      Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you're using JWT and storing it in localStorage
      id: localStorage.getItem("userId"), // Assuming you store user ID in localStorage
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        console.log(data.message); // Change innerHTML of the calling element to "Added to Favourites"
      } else {
        console.error("Failed to add book to favourites:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error adding book to favourites:", error);
    });
}

// Fetch recent books on page load
fetchRecentBooks();
