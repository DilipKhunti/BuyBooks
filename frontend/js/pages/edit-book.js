document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-all-categories`
    );
    const data = await response.json();

    if (data.status === "Success") {
      const categoryDropdown = document.getElementById("category");
      categoryDropdown.innerHTML = `<option value="">Select category</option>`; // Clear existing options and add default

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

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("bookid"); // Get the book ID from the query params

// Fetch the book details and pre-fill the form
async function fetchBookDetails() {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/get-book-by-id/${bookId}`
    );
    const result = await response.json();

    if (result.status === "Success") {
      const book = result.data;
      document.getElementById("coverImageUrl").value = book.url;
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
      document.getElementById("price").value = book.price;
      document.getElementById("description").value = book.desc;
      document.getElementById("language").value = book.language;
      document.getElementById("stock").value = book.stock;
      document.getElementById("condition").value = book.condition;
      document.getElementById("category").value = book.category;
    } else {
      document.getElementById("result-message").innerText =
        "Failed to load book details.";
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    document.getElementById("result-message").innerText =
      "Error fetching book details.";
  }
}

// Call this function to load the book details when the page loads
document.addEventListener("DOMContentLoaded", fetchBookDetails);

// Handle book update form submission
document
  .getElementById("update-book-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const coverImageUrl = document.getElementById("coverImageUrl").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const language = document.getElementById("language").value;
    const stock = document.getElementById("stock").value;
    const condition = document.getElementById("condition").value;
    const category = document.getElementById("category").value;

    try {
      const response = await fetch(`${config.API_BASE_URL}/update-book`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token
          id: localStorage.getItem("userId"), // User ID
          bookid: bookId, // The book ID from the query params
        },
        body: JSON.stringify({
          url: coverImageUrl,
          title,
          author,
          price,
          desc: description,
          language,
          stock,
          condition,
          category,
        }),
      });

      const result = await response.json();
      if (result.message === "Book updated successfully!") {
        alert("Book updated successfully!");
        window.location.href = `book.html?id=${bookId}`; // Redirect to the user's book list or any relevant page
      } else {
        document.getElementById("result-message").innerText = result.message;
      }
    } catch (error) {
      console.error("Error updating book:", error);
      document.getElementById("result-message").innerText =
        "Error updating book.";
    }
  });
