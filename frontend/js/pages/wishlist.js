// Fetch and display wishlist items
async function fetchWishlist() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-favourite-books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // JWT token
        id: localStorage.getItem("userId"), // User ID
      },
    });
    const result = await response.json();
    if (result.status === "Success") {
      displayWishlistItems(result.data);
    } else {
      console.error("Failed to fetch wishlist items");
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
}

// Display wishlist items in the table
function displayWishlistItems(wishlistItems) {
  const tbody = document.getElementById("wishlist-items");
  tbody.innerHTML = ""; // Clear existing items

  wishlistItems.forEach((item) => {
    const bookHTML = `
        <tr>
          <td class="product__cart__item">
            <div class="product__cart__item__pic">
              <img src="${item.url}" alt="${item.title}" />
            </div>
            <div class="product__cart__item__text">
              <h6>${item.title}</h6>
            </div>
          </td>
          <td class="cart__price">₹ ${item.price}</td>
          <td class="cart__stock">${item.stock}</td>
          <td class="cart__btn">
            <a href="#" class="primary-btn" onclick="addToCart('${item._id}')">Add to cart</a>
          </td>
          <td class="cart__close">
            <span class="icon_close" onclick="removeFromFavourites('${item._id}')"></span>
          </td>
        </tr>`;
    tbody.innerHTML += bookHTML;
  });
}

// Function to add book to cart
async function addToCart(bookId) {
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
    alert(result.message);
  } catch (error) {
    console.error("Error adding book to cart:", error);
  }
}

// Function to remove book from favourites
async function removeFromFavourites(bookId) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/remove-book-from-favourite`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: localStorage.getItem("userId"),
          bookid: bookId,
        },
        body: JSON.stringify({ bookid: bookId }),
      }
    );
    const result = await response.json();
    alert(result.message);
    fetchWishlist(); // Refresh wishlist after removal
  } catch (error) {
    console.error("Error removing book from favourites:", error);
  }
}

// Fetch wishlist items on page load
document.addEventListener("DOMContentLoaded", fetchWishlist);
