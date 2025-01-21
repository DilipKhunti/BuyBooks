$(function () {
  $('.btn-link[aria-expanded="true"]')
    .closest(".accordion-item")
    .addClass("active");
  $(".collapse").on("show.bs.collapse", function () {
    $(this).closest(".accordion-item").addClass("active");
  });

  $(".collapse").on("hidden.bs.collapse", function () {
    $(this).closest(".accordion-item").removeClass("active");
  });
});

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${config.API_BASE_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const result = await response.json();
      const resultMessage = document.getElementById("result-message");

      if (response.ok) {
        // Store token in local storage for authentication
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userId", result.id);

        resultMessage.style.color = "green";
        resultMessage.textContent = result.message; // Sign-in successful

        window.location.href = "./index.html";
      } else {
        resultMessage.style.color = "red";
        resultMessage.textContent = result.message; // Sign-in successful
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  });

