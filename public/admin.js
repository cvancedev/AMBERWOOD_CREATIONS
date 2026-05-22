let savedAdminPassword = "";

const loginForm = document.getElementById("loginForm");
const loginCard = document.getElementById("loginCard");
const adminPage = document.getElementById("adminPage");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const password = document.getElementById("adminPassword").value;

  const response = await fetch("/api/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": savedAdminPassword
    },
    body: JSON.stringify({ password })
  });

  const data = await response.json();

  if (data.success) {
    savedAdminPassword = password;

    loginCard.classList.add("hidden");
    adminPage.classList.remove("hidden");
    
  } else {
    loginMessage.textContent = "Wrong password.";
  }
});

const adminForm = document.querySelector(".admin-form");

adminForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const product = {
    title: document.getElementById("productTitle").value,
    description: document.getElementById("productDescription").value,
    category: document.getElementById("productCategory").value,
    image: document.getElementById("productImage").value
  };

  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (data.success) {
    alert("Product added successfully!");
    adminForm.reset();
  } else {
    alert("Something went wrong.");
  }
});