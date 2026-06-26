let products = [];
const defaultStartingPrice = "$24";
const sectionSelectors = "section, main.layout, footer";

const tagMap = {
  shirts: ["Handmade", "Faith-Based", "Custom Sizes"],
  crochet: ["Handmade", "Cozy", "Custom Colors"],
  seasonal: ["Handmade", "Seasonal", "Gift-Ready"]
};

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Unable to load products", error);
  }
}

loadProducts();

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

function getProductTags(product) {
  if (Array.isArray(product.tags) && product.tags.length > 0) {
    return product.tags.slice(0, 3);
  }

  return tagMap[product.category] || ["Handmade", "Small-Batch", "Custom Order"];
}

function getStartingPrice(product) {
  if (product.price) {
    return `Starting at ${product.price}`;
  }

  return `Starting at ${defaultStartingPrice}`;
}

function renderProducts(category = "all") {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(product => product.category === category);

  filteredProducts.forEach(product => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    const tags = getProductTags(product)
      .map(tag => `<span class="product-tag">${tag}</span>`)
      .join("");

    productCard.innerHTML = `
      <div class="product-media">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.title}"
        />
      </div>
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p class="starting-price">${getStartingPrice(product)}</p>
      <div class="product-tags">${tags}</div>
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

function initScrollAnimations() {
  const sections = document.querySelectorAll(sectionSelectors);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    sections.forEach(section => section.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach(section => {
    section.classList.add("reveal-on-scroll");
    observer.observe(section);
  });
}

initScrollAnimations();

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
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
}
