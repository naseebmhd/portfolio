/* ============================================================
   WackyThreads — script.js (optimized)
   ============================================================ */

// ── Products data ──────────────────────────────────────────
const products = [
  { name: "Black Oversized Tee",        price: 999,  img: "images/tshirt1.png", back: "images/tshirt1back.png" },
  { name: "White Oversized Tee",        price: 999,  img: "images/tshirt2.png", back: "images/tshirt2back.png" },
  { name: "Graphic Oversized Tee",      price: 1099, img: "images/tshirt1.png", back: "images/tshirt1back.png" },
  { name: "Drop Shoulder Tee",          price: 899,  img: "images/tshirt2.png", back: "images/tshirt2back.png" },
  { name: "Heavy Cotton Oversized Tee", price: 1199, img: "images/tshirt1.png", back: "images/tshirt1back.png" }
];

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product">
      <a href="product.html?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}">
        <div class="image-container">
          <img src="${p.img}" class="img-front" alt="${p.name}" loading="lazy">
          <img src="${p.back}" class="img-back" alt="${p.name} back" loading="lazy">
        </div>
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </a>
      <button class="quick-add" onclick="event.stopPropagation(); orderOnWhatsApp('${p.name}', ${p.price})">Order</button>
    </div>
  `).join("");
}

// ── Cart ────────────────────────────────────────────────────
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch(e) { cart = []; }

function addToCart() {
  const name  = document.getElementById("product-name")?.innerText;
  const price = parseInt(document.getElementById("product-price")?.innerText.replace("₹",""));
  if (!name || isNaN(price)) return;

  const existing = cart.find(i => i.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });

  saveCart();
  showToast("Added to cart ✔");
  updateCartCount();
}

function addToCartFromHome(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  saveCart();
  showToast("Added to cart ✔");
  updateCartCount();
}

function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch(e) {}
}

function loadCart() {
  const container = document.getElementById("cart-items");
  const totalEl   = document.getElementById("total");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="index.html"><button>Continue Shopping</button></a>
      </div>`;
    if (totalEl) totalEl.innerText = "";
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, i) => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
        <button onclick="removeItem(${i})">Remove</button>
      </div>`;
  }).join("");

  if (totalEl) totalEl.innerText = "Total: ₹" + total;
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  loadCart();
}

// ── Product page ─────────────────────────────────────────────
function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const name   = params.get("name");
  const price  = params.get("price");
  const img    = params.get("img");
  if (!name) return;

  const nameEl  = document.getElementById("product-name");
  const priceEl = document.getElementById("product-price");
  const imgEl   = document.getElementById("product-img");

  if (nameEl)  nameEl.innerText  = name;
  if (priceEl) priceEl.innerText = "₹" + price;
  if (imgEl)   { imgEl.src = img; imgEl.alt = name; }

  // Also update page title
  document.title = name + " — WackyThreads";
}

// ── Toast ────────────────────────────────────────────────────
function showToast(msg = "Done!") {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ── Cart count badge ─────────────────────────────────────────
function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.innerText = count);
}

// ── WhatsApp order ───────────────────────────────────────────
function orderOnWhatsApp(name, price) {
  const phone   = "919074321767";
  const message = `Hello WackyThreads 👋\n\nI want to order:\n\nProduct: ${name}\nPrice: ₹${price}\n\nPlease share payment and delivery details.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

// ── Navbar: hide on scroll down, show on scroll up ───────────
const navbar = document.querySelector("nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const cur = window.scrollY;
  if (navbar) {
    navbar.classList.toggle("hide", cur > lastScroll && cur > 80);
    navbar.classList.toggle("scrolled", cur > 30);
  }
  lastScroll = cur < 0 ? 0 : cur;
}, { passive: true });

// ── Mobile hamburger menu ────────────────────────────────────
const toggle  = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

if (toggle && navMenu) {
  toggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close on link tap
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      toggle.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

// ── Intersection observer for fade-in ────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("animate");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".product, .collection-card, .about-content p").forEach(el => {
  observer.observe(el);
});

// ── Init ─────────────────────────────────────────────────────
renderProducts();
loadProduct();
loadCart();
updateCartCount();
