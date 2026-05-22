let products = [];

async function loadProducts() {
  const response = await fetch("/api/products");
  products = await response.json();
  renderProducts();
}

loadProducts();

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const fs = require("fs");

function renderProducts(category = "all") {
  productGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(product => product.category === category);

  filteredProducts.forEach(product => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
     <img
  class="product-image"
  src="${product.image}"
  alt="${product.title}"
/>
      <h3>${product.title}</h3>
      <p>${product.description}</p>
    `;

    productGrid.appendChild(productCard);
  });
}

renderProducts();

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category;
    renderProducts(category);
  });
});

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const orderType = document.getElementById("orderType").value;
  const message = document.getElementById("message").value;

  try {
    const response = await fetch("/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        orderType,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Message sent successfully!");
      contactForm.reset();
    } else {
      alert("Something went wrong.");
    }
  } catch (error) {
    console.error(error);
    alert("Server error.");
  }
});
