// Fetch and display books uploaded by the user
async function fetchUserBooks() {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-books-by-uploader`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // JWT token
          id: localStorage.getItem("userId"), // User ID
        },
      }
    );
    const result = await response.json();
    if (result.status === "Success") {
      displayUserBooks(result.data);
    } else {
      console.error("Failed to fetch books uploaded by user");
    }
  } catch (error) {
    console.error("Error fetching user's books:", error);
  }
}

// Display uploaded books in the table
function displayUserBooks(books) {
  const tbody = document.getElementById("user-books-items");
  tbody.innerHTML = ""; // Clear existing items

  books.forEach((item) => {
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
            <a href="edit-book.html?bookid=${item._id}" class="primary-btn">Edit</a>
          </td>
          <td class="cart__close">
            <span class="icon_close" onclick="deleteBook('${item._id}')"></span>
          </td>
        </tr>`;
    tbody.innerHTML += bookHTML;
  });
}

// Function to delete a book
async function deleteBook(bookId) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/delete-book`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        id: localStorage.getItem("userId"),
        bookid: bookId,
      },
    });
    const result = await response.json();
    alert(result.message);
    fetchUserBooks(); // Refresh the book list after deletion
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}

// Fetch uploaded books on page load
document.addEventListener("DOMContentLoaded", fetchUserBooks);
