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

document
  .getElementById("upload-book")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const coverImageUrl = document.getElementById("coverImageUrl").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const description = document.getElementById("description").value;
    const language = document.getElementById("language").value;
    const category = document.getElementById("category").value; // New category field
    const condition = document.getElementById("condition").value; // New condition field

    const bookDetails = {
      url: coverImageUrl,
      title,
      author,
      price,
      desc: description,
      language,
      category, // New category
      condition, // New condition
      stock,
    };

    const resultMessage = document.getElementById("result-message");

    try {
      const response = await fetch(`${config.API_BASE_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: `${localStorage.getItem("userId")}`,
        },
        body: JSON.stringify(bookDetails),
      });

      const result = await response.json();

      if (response.ok) {
        resultMessage.style.color = "green";
        resultMessage.textContent = result.message;
        document.getElementById("upload-book").reset();
      } else {
        resultMessage.style.color = "red";
        resultMessage.textContent = result.message;
      }
    } catch (error) {
      console.error("Error during book upload:", error);
      resultMessage.style.color = "red";
      resultMessage.textContent =
        "An error occurred while uploading the book. Please try again.";
    }
  });
