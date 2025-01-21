// Function to fetch the user's cart
async function fetchUserCart() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/get-user-cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you're using JWT and storing it in localStorage
        id: localStorage.getItem("userId"), // Assuming you store user ID in localStorage
      },
    });
    const result = await response.json();
    if (result.status === "Success") {
      displayCartItems(result.data);
    } else {
      console.error("Failed to fetch cart items");
    }
  } catch (error) {
    console.error("Error fetching user cart:", error);
  }
}

// Function to display cart items in the table
function displayCartItems(cartItems) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing items
  let totalAmount = 0; // Initialize total amount

  cartItems.forEach((item) => {
    const itemTotal = item.price; // Assuming item.price is the total price for that item
    totalAmount += itemTotal; // Accumulate total amount

    const bookHTML = `
        <tr>
          <td class="product__cart__item">
            <div class="product__cart__item__pic">
              <img class="img1" src="${item.url}" alt="${item.title}" />
            </div>
            <div class="product__cart__item__text">
              <h6>${item.title}</h6>
              <h5>₹ ${item.price}</h5>
            </div>
          </td>
          <td class="quantity__item">
            <div class="quantity">
              <div class="pro-qty">
                <input type="text" value="1" data-id="${item._id}" onchange="updateCartQuantity(this)" />
              </div>
            </div>
          </td>
          <td class="cart__price">₹ ${itemTotal}</td>
          <td class="cart__close">
            <span class="icon_close" onclick="removeFromCart('${item._id}')" style="cursor : pointer;"></span>
          </td>
        </tr>`;
    tbody.innerHTML += bookHTML;
  });

  updateTotalAmount(totalAmount); // Update total amount
}

// Function to update cart quantity
async function updateCartQuantity(input) {
  const bookId = input.getAttribute("data-id");
  const newQuantity = parseInt(input.value);

  // Here you would typically send a request to update the quantity in the backend.
  // After updating, re-fetch the cart to get the new totals.
  fetchUserCart();
}

// Function to remove an item from the cart
async function removeFromCart(bookId) {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/remove-from-cart/${bookId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          id: localStorage.getItem("userId"),
        },
      }
    );
    const result = await response.json();
    if (result.status === "Success") {
      alert(result.message);
      fetchUserCart(); // Refresh the cart after removal
    } else {
      console.error("Failed to remove item from cart");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
}

// Function to update total amount display
function updateTotalAmount(total) {
  const totalElement = document.querySelector(".cart__total ul"); // Make sure this selector targets your total display element correctly
  const subtotalElement = totalElement.querySelector("li:first-child span"); // Get the subtotal element
  const deliveryChargesElement = totalElement.querySelector(
    "li:nth-child(2) span"
  ); // Assuming delivery charges are in the second list item

  const deliveryCharges = 375; // Example delivery charge, you may get this from a backend or calculation
  const totalAmount = total + deliveryCharges; // Calculate total amount

  subtotalElement.innerText = `₹ ${total.toFixed(2)}`; // Update subtotal
  deliveryChargesElement.innerText = `₹ ${deliveryCharges.toFixed(2)}`; // Update delivery charges

  const totalDisplayElement = totalElement.querySelector("li:last-child span"); // Get the total amount element
  totalDisplayElement.innerText = `₹ ${totalAmount.toFixed(2)}`; // Update total amount
}

// Fetch and display the cart on page load
document.addEventListener("DOMContentLoaded", fetchUserCart);
