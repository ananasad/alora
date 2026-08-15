/* ============================================================
   ALORA — store logic
   Replace PRODUCTS below with your real items (and swap the
   placeholder SVGs in product-media for real photos — see README).
   ============================================================ */

const PRODUCTS = [
  { id: "d1", name: "Terracotta Wrap Dress",   category: "Dresses", price: 2499, shape: "dress",  tint: "maroon" },
  { id: "d2", name: "Sage Midi Slip",          category: "Dresses", price: 2299, shape: "dress",  tint: "sage" },
  { id: "d3", name: "Undyed Cotton Sundress",  category: "Dresses", price: 2799, shape: "dress",  tint: "cream" },
  { id: "t1", name: "Clay Linen Shirt",        category: "Tops",    price: 1499, shape: "top",    tint: "maroon" },
  { id: "t2", name: "Sage Boxy Tee",           category: "Tops",    price: 999,  shape: "top",    tint: "sage" },
  { id: "t3", name: "Raw Cotton Blouse",       category: "Tops",    price: 1699, shape: "top",    tint: "cream" },
  { id: "b1", name: "Maroon Wide-Leg Trouser", category: "Bottoms", price: 1899, shape: "bottom", tint: "maroon" },
  { id: "b2", name: "Sage Linen Trouser",      category: "Bottoms", price: 1899, shape: "bottom", tint: "sage" },
  { id: "b3", name: "Undyed Straight Pant",    category: "Bottoms", price: 1799, shape: "bottom", tint: "cream" },
];

/* ---------- Garment placeholder art ---------- */
function garmentSVG(shape, tint) {
  const color = tint === "maroon" ? "var(--maroon)" : tint === "sage" ? "var(--sage-dark)" : "var(--ink-soft)";
  const shapes = {
    dress: `<path d="M35 10 L30 22 L20 90 L80 90 L70 22 L65 10 Q50 20 35 10 Z" fill="none" stroke="${color}" stroke-width="2.2"/><path d="M35 10 Q50 20 65 10" fill="none" stroke="${color}" stroke-width="2.2"/>`,
    top: `<path d="M30 14 L12 26 L20 38 L30 30 L30 88 L70 88 L70 30 L80 38 L88 26 L70 14 Q50 24 30 14Z" fill="none" stroke="${color}" stroke-width="2.2"/>`,
    bottom: `<path d="M28 10 H72 L75 90 L55 90 L50 46 L45 90 L25 90 Z" fill="none" stroke="${color}" stroke-width="2.2"/><line x1="28" y1="10" x2="72" y2="10" stroke="${color}" stroke-width="2.2"/>`,
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${shapes[shape]}</svg>`;
}

/* ---------- Cart state (in-memory) ---------- */
let cart = {}; // { productId: qty }

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}
function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

/* ---------- Render product grid ---------- */
const grid = document.getElementById("productGrid");

function renderGrid(filter = "all") {
  grid.innerHTML = "";
  PRODUCTS.filter(p => filter === "all" || p.category === filter).forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <span class="product-tag">${p.category}</span>
        ${garmentSVG(p.shape, p.tint)}
      </div>
      <p class="product-name">${p.name}</p>
      <p class="product-category">${p.category}</p>
      <div class="product-row">
        <span class="product-price">${money(p.price)}</span>
        <button class="add-btn" data-id="${p.id}">Add to bag</button>
      </div>`;
    grid.appendChild(card);
  });
}
renderGrid();

grid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "Add to bag"; btn.classList.remove("added"); }, 900);
});

/* ---------- Filters ---------- */
document.getElementById("filterRow").addEventListener("click", e => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderGrid(chip.dataset.filter);
});

/* ---------- Cart drawer ---------- */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartCountEl = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");

function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", () => { closeCart(); closeCheckout(); });

function renderCart() {
  cartCountEl.textContent = cartCount();
  cartSubtotalEl.textContent = money(cartTotal());

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty" id="cartEmpty">Your bag is empty. Everything here starts on the <a href="#shop">shop page</a>.</p>`;
    cartFooter.style.display = "none";
    return;
  }
  cartFooter.style.display = "block";
  cartItemsEl.innerHTML = "";
  entries.forEach(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `
      <div class="cart-line-media">${garmentSVG(p.shape, p.tint)}</div>
      <div class="cart-line-info">
        <p class="cart-line-name">${p.name}</p>
        <p class="cart-line-meta">${p.category}</p>
        <div class="qty-control">
          <button data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
          <button class="cart-line-remove" data-action="remove" data-id="${id}">Remove</button>
        </div>
        <p class="cart-line-price">${money(p.price * qty)}</p>
      </div>`;
    cartItemsEl.appendChild(line);
  });
}

cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "inc") cart[id]++;
  if (action === "dec") { cart[id]--; if (cart[id] <= 0) delete cart[id]; }
  if (action === "remove") delete cart[id];
  renderCart();
  renderCheckoutSummary();
});

/* ---------- Checkout modal ---------- */
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutTotalEl = document.getElementById("checkoutTotal");

function openCheckout() {
  if (cartCount() === 0) { openCart(); return; }
  renderCheckoutSummary();
  closeCart();
  checkoutOverlay.classList.add("open");
}
function closeCheckout() { checkoutOverlay.classList.remove("open"); }

document.getElementById("checkoutOpenBtn").addEventListener("click", openCheckout);
document.getElementById("checkoutClose").addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", e => { if (e.target === checkoutOverlay) closeCheckout(); });

function renderCheckoutSummary() {
  checkoutSummary.innerHTML = "";
  Object.entries(cart).forEach(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    if (!p) return;
    const row = document.createElement("div");
    row.className = "checkout-line";
    row.innerHTML = `<span>${p.name} × ${qty}</span><span>${money(p.price * qty)}</span>`;
    checkoutSummary.appendChild(row);
  });
  checkoutTotalEl.textContent = money(cartTotal());
}

/* ---------- Payment: Razorpay + WhatsApp fallback ----------
   IMPORTANT: swap RAZORPAY_KEY_ID for your own LIVE key before
   accepting real payments. See README.md for full instructions.
------------------------------------------------------------- */
const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXX"; // <-- replace with your Razorpay key
const WHATSAPP_NUMBER = "910000000000"; // <-- replace with your business WhatsApp number (country code, no +)
const UPI_ID = "alora@okaxis"; // <-- replace with your real UPI ID (VPA) — get this from your bank's UPI app
const UPI_PAYEE_NAME = "Alora";

const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(checkoutForm).entries());
  const total = cartTotal();

  if (!RAZORPAY_KEY_ID.includes("XXXX")) {
    const rzp = new Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: total * 100, // paise
      currency: "INR",
      name: "Alora",
      description: `Order for ${data.name}`,
      prefill: { name: data.name, contact: data.phone },
      theme: { color: "#8B2E39" },
      handler: function () {
        alert("Payment successful! We'll confirm your order by phone shortly.");
        cart = {};
        renderCart();
        closeCheckout();
      },
    });
    rzp.open();
  } else {
    alert("Add your Razorpay key in script.js to enable card/UPI payment. Using WhatsApp checkout for now.");
    sendWhatsAppOrder(data, total);
  }
});

const upiQrWrap = document.getElementById("upiQrWrap");
const upiQrImg = document.getElementById("upiQrImg");
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

document.getElementById("upiBtn").addEventListener("click", () => {
  if (!checkoutForm.reportValidity()) return;
  const total = cartTotal();
  const note = encodeURIComponent(`Alora order - ${cartCount()} item(s)`);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${total}&cu=INR&tn=${note}`;

  if (isMobile) {
    // Opens the customer's UPI app (GPay/PhonePe/Paytm/etc.) directly with the amount pre-filled
    window.location.href = upiLink;
  } else {
    // Desktop has no UPI app to hand off to — show a scannable QR code instead
    upiQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    upiQrWrap.classList.add("open");
  }
});

document.getElementById("whatsappBtn").addEventListener("click", () => {
  const data = Object.fromEntries(new FormData(checkoutForm).entries());
  if (!checkoutForm.reportValidity()) return;
  sendWhatsAppOrder(data, cartTotal());
});

function sendWhatsAppOrder(data, total) {
  const lines = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return `- ${p.name} × ${qty} (${money(p.price * qty)})`;
  });
  const message =
    `New order from Alora website%0A%0A` +
    `Name: ${data.name}%0APhone: ${data.phone}%0AAddress: ${data.address}%0A%0A` +
    `Items:%0A${lines.join("%0A")}%0A%0ATotal: ${money(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});
mainNav.addEventListener("click", e => {
  if (e.target.tagName === "A") mainNav.classList.remove("open");
});

/* ---------- Misc ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
renderCart();

/* ============ TOKENS ============ */
:root{
  --cream: #DCC5A0;
  --cream-light: #EFE2C9;
  --paper: #F7F0E1;
  --maroon: #8B2E39;
  --maroon-dark: #6E212A;
  --sage: #7C9178;
  --sage-dark: #5F7259;
  --ink: #2A1F16;
  --ink-soft: #5B4B3B;
  --line: rgba(42,31,22,0.14);

  --display: 'Playfair Display', Georgia, serif;
  --body: 'Jost', -apple-system, sans-serif;

  --container: 1180px;
  --radius: 2px;
}

*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  font-family:var(--body);
  color:var(--ink);
  background:var(--paper);
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3{font-family:var(--display); margin:0; color:var(--ink); font-weight:600;}
p{margin:0; line-height:1.6;}
a{color:inherit; text-decoration:none;}
button{font-family:var(--body); cursor:pointer;}
img,svg{display:block; max-width:100%;}
:focus-visible{outline:2px solid var(--maroon); outline-offset:3px;}

.eyebrow{
  font-size:0.72rem;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--maroon);
  font-weight:500;
  margin-bottom:0.9rem;
}

/* ============ BUTTONS ============ */
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:0.95rem 2rem;
  font-size:0.85rem;
  letter-spacing:0.06em;
  text-transform:uppercase;
  border-radius:var(--radius);
  border:1px solid transparent;
  transition:background .2s ease, color .2s ease, border-color .2s ease;
}
.btn-primary{ background:var(--maroon); color:var(--paper); }
.btn-primary:hover{ background:var(--maroon-dark); }
.btn-ghost{ background:transparent; color:var(--ink); border-color:var(--ink); }
.btn-ghost:hover{ background:var(--ink); color:var(--paper); }
.btn-block{ width:100%; }
.btn[disabled]{ opacity:0.55; cursor:not-allowed; }

/* ============ HEADER ============ */
.site-header{
  position:sticky; top:0; z-index:40;
  background:rgba(220,197,160,0.92);
  backdrop-filter:blur(6px);
  border-bottom:1px solid var(--line);
}
.header-inner{
  max-width:var(--container);
  margin:0 auto;
  padding:1rem 1.5rem;
  display:grid;
  grid-template-columns:auto 1fr auto auto;
  align-items:center;
  gap:1.2rem;
}
.brand{ display:flex; align-items:center; gap:0.55rem; grid-column:2; justify-self:center;}
.brand-mark{ width:26px; height:19px; }
.brand-word{
  font-family:var(--display);
  font-size:1.4rem;
  letter-spacing:0.12em;
  color:var(--ink);
}
.main-nav{ display:none; gap:2rem; grid-column:3; }
.main-nav a{
  font-size:0.85rem; letter-spacing:0.05em; text-transform:uppercase;
  color:var(--ink-soft); position:relative; padding-bottom:4px;
}
.main-nav a:hover{ color:var(--maroon); }
.nav-toggle{
  grid-column:1;
  width:26px; height:20px; background:none; border:none; padding:0;
  display:flex; flex-direction:column; justify-content:space-between;
}
.nav-toggle span{ display:block; height:2px; background:var(--ink); border-radius:2px; }
.cart-toggle{
  grid-column:4;
  position:relative; background:none; border:none; color:var(--ink); padding:0.3rem;
}
.cart-count{
  position:absolute; top:-6px; right:-8px;
  background:var(--maroon); color:var(--paper);
  font-size:0.65rem; min-width:16px; height:16px; border-radius:50%;
  display:flex; align-items:center; justify-content:center; font-weight:600;
}

@media(min-width:820px){
  .header-inner{ grid-template-columns:auto 1fr auto; }
  .brand{ grid-column:1; justify-self:start; }
  .main-nav{ display:flex; grid-column:2; justify-self:center; }
  .nav-toggle{ display:none; }
  .cart-toggle{ grid-column:3; }
}

/* mobile nav drawer */
.main-nav.open{
  display:flex; flex-direction:column; gap:0;
  position:absolute; top:100%; left:0; right:0;
  background:var(--cream-light); border-bottom:1px solid var(--line);
  padding:0.5rem 1.5rem 1.2rem;
}
.main-nav.open a{ padding:0.7rem 0; border-bottom:1px solid var(--line); }

/* ============ HERO ============ */
.hero{
  position:relative;
  overflow:hidden;
  padding:6.5rem 1.5rem 5.5rem;
  background:linear-gradient(180deg, var(--cream) 0%, var(--cream-light) 100%);
  text-align:center;
}
.hero-watermark{
  position:absolute; top:-6%; left:50%; transform:translateX(-50%);
  width:min(900px, 140vw); color:var(--maroon); opacity:0.06; pointer-events:none;
}
.hero-inner{ position:relative; max-width:640px; margin:0 auto; }
.hero h1{
  font-size:clamp(2.4rem, 6vw, 4.2rem);
  line-height:1.05;
  font-weight:600;
}
.hero h1 em{ color:var(--maroon); font-style:italic; font-weight:500; }
.hero-sub{
  margin:1.6rem auto 2.4rem;
  max-width:480px;
  color:var(--ink-soft);
  font-size:1.02rem;
}

/* ============ SECTION HEAD / DIVIDER ============ */
.section-head{ text-align:center; max-width:640px; margin:0 auto 3rem; padding:0 1.5rem;}
.section-head h2{ font-size:clamp(1.7rem,3.5vw,2.4rem); }
.leaf-divider{ width:34px; margin:1.4rem auto 0; opacity:0.85; }

/* ============ SHOP ============ */
.shop{ padding:6rem 1.5rem 2rem; max-width:var(--container); margin:0 auto; }

.filter-row{
  display:flex; justify-content:center; gap:0.6rem; margin-bottom:3rem; flex-wrap:wrap;
}
.filter-chip{
  padding:0.5rem 1.2rem; border:1px solid var(--ink); background:transparent;
  color:var(--ink); font-size:0.78rem; letter-spacing:0.04em; text-transform:uppercase;
  border-radius:999px; transition:all .2s ease;
}
.filter-chip.active, .filter-chip:hover{ background:var(--ink); color:var(--paper); }

.product-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(240px,1fr));
  gap:2.4rem 1.8rem;
  margin-bottom:5rem;
}
.product-card{ display:flex; flex-direction:column; }
.product-media{
  aspect-ratio:3/4;
  border-radius:var(--radius);
  background:var(--cream-light);
  display:flex; align-items:center; justify-content:center;
  overflow:hidden; position:relative;
  margin-bottom:1rem;
}
.product-media svg{ width:56%; height:56%; }
.product-tag{
  position:absolute; top:0.7rem; left:0.7rem;
  font-size:0.62rem; letter-spacing:0.08em; text-transform:uppercase;
  background:var(--paper); padding:0.25rem 0.55rem; border-radius:999px; color:var(--ink-soft);
}
.product-name{ font-family:var(--display); font-size:1.05rem; margin-bottom:0.15rem; }
.product-category{ font-size:0.78rem; color:var(--ink-soft); margin-bottom:0.6rem; }
.product-row{ display:flex; align-items:center; justify-content:space-between; gap:0.8rem; }
.product-price{ font-weight:500; }
.add-btn{
  border:1px solid var(--ink); background:transparent; color:var(--ink);
  font-size:0.72rem; letter-spacing:0.05em; text-transform:uppercase;
  padding:0.5rem 0.9rem; border-radius:999px; transition:all .2s ease; white-space:nowrap;
}
.add-btn:hover{ background:var(--maroon); border-color:var(--maroon); color:var(--paper); }
.add-btn.added{ background:var(--sage-dark); border-color:var(--sage-dark); color:var(--paper); }

/* ============ ABOUT ============ */
.about{ background:var(--ink); color:var(--paper); padding:6rem 1.5rem; }
.about-inner{ max-width:560px; margin:0 auto; text-align:center; }
.about-mark{ width:56px; margin:0 auto 1.6rem; opacity:0.9; }
.about h2{ color:var(--paper); font-size:clamp(1.6rem,3vw,2.2rem); margin-bottom:1.2rem; }
.about p{ color:rgba(247,240,225,0.75); }

/* ============ FOOTER ============ */
.site-footer{ background:var(--cream-light); padding:4.5rem 1.5rem 1.5rem; }
.footer-inner{
  max-width:var(--container); margin:0 auto;
  display:grid; gap:2.4rem;
  grid-template-columns:1fr;
  padding-bottom:2.5rem; border-bottom:1px solid var(--line);
}
.footer-brand p{ color:var(--ink-soft); margin-top:0.4rem; font-style:italic; font-family:var(--display); }
.footer-col h3{ font-family:var(--body); font-size:0.75rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:0.7rem; font-weight:600;}
.footer-col p{ margin-bottom:0.3rem; }
.footer-col a:hover{ color:var(--maroon); }
.footer-bottom{ max-width:var(--container); margin:0 auto; padding-top:1.4rem; }
.footer-bottom p{ font-size:0.78rem; color:var(--ink-soft); }
@media(min-width:680px){
  .footer-inner{ grid-template-columns:1.4fr 1fr 1fr; }
}

/* ============ CART DRAWER ============ */
.cart-overlay, .modal-overlay{
  position:fixed; inset:0; background:rgba(42,31,22,0.45);
  opacity:0; pointer-events:none; transition:opacity .25s ease; z-index:60;
}
.cart-overlay.open, .modal-overlay.open{ opacity:1; pointer-events:auto; }

.cart-drawer{
  position:fixed; top:0; right:0; height:100%; width:min(420px, 92vw);
  background:var(--paper); z-index:70;
  transform:translateX(100%); transition:transform .3s ease;
  display:flex; flex-direction:column;
  box-shadow:-8px 0 30px rgba(0,0,0,0.15);
}
.cart-drawer.open{ transform:translateX(0); }
.cart-header{ display:flex; align-items:center; justify-content:space-between; padding:1.5rem; border-bottom:1px solid var(--line); }
.cart-close, .modal-close{ background:none; border:none; font-size:1.6rem; line-height:1; color:var(--ink); }
.cart-items{ flex:1; overflow-y:auto; padding:1.2rem 1.5rem; }
.cart-empty{ color:var(--ink-soft); padding:2rem 0; text-align:center; }
.cart-empty a{ color:var(--maroon); text-decoration:underline; }

.cart-line{ display:flex; gap:0.9rem; padding:0.9rem 0; border-bottom:1px solid var(--line); }
.cart-line-media{ width:60px; height:75px; background:var(--cream-light); border-radius:var(--radius); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.cart-line-media svg{ width:60%; height:60%; }
.cart-line-info{ flex:1; }
.cart-line-name{ font-family:var(--display); font-size:0.95rem; }
.cart-line-meta{ font-size:0.78rem; color:var(--ink-soft); margin:0.2rem 0 0.5rem; }
.qty-control{ display:flex; align-items:center; gap:0.6rem; }
.qty-control button{ width:22px; height:22px; border:1px solid var(--ink); background:none; border-radius:50%; font-size:0.8rem; line-height:1; }
.cart-line-remove{ background:none; border:none; font-size:0.72rem; text-decoration:underline; color:var(--ink-soft); margin-left:auto; }
.cart-line-price{ font-size:0.85rem; margin-top:0.4rem; font-weight:500; }

.cart-footer{ padding:1.3rem 1.5rem 1.6rem; border-top:1px solid var(--line); }
.cart-subtotal{ display:flex; justify-content:space-between; font-family:var(--display); font-size:1.1rem; margin-bottom:0.3rem; }
.cart-note{ font-size:0.75rem; color:var(--ink-soft); margin-bottom:1rem; }

/* ============ CHECKOUT MODAL ============ */
.modal{
  position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) scale(0.97);
  background:var(--paper); width:min(480px, 92vw); max-height:88vh; overflow-y:auto;
  border-radius:var(--radius); padding:2.2rem; z-index:80;
  opacity:0; pointer-events:none; transition:opacity .2s ease, transform .2s ease;
}
.modal-overlay.open .modal{ opacity:1; pointer-events:auto; transform:translate(-50%,-50%) scale(1); }
.modal h2{ margin-bottom:1.4rem; font-size:1.5rem; }
.modal-close{ position:absolute; top:1.2rem; right:1.2rem; }

.checkout-summary{ margin-bottom:1rem; max-height:160px; overflow-y:auto; }
.checkout-line{ display:flex; justify-content:space-between; font-size:0.85rem; padding:0.4rem 0; color:var(--ink-soft); }
.checkout-total{
  display:flex; justify-content:space-between; font-family:var(--display); font-size:1.2rem;
  padding:0.9rem 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); margin-bottom:1.4rem;
}
.checkout-form label{ display:block; font-size:0.78rem; letter-spacing:0.03em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:1rem; }
.checkout-form input, .checkout-form textarea{
  width:100%; margin-top:0.4rem; padding:0.75rem 0.9rem; border:1px solid var(--line);
  border-radius:var(--radius); font-family:var(--body); font-size:0.95rem; background:var(--cream-light);
  color:var(--ink);
}
.checkout-form textarea{ min-height:70px; resize:vertical; }
.checkout-actions{ display:flex; flex-direction:column; gap:0.7rem; margin-top:0.4rem; }
.checkout-fineprint{ font-size:0.7rem; color:var(--ink-soft); margin-top:1rem; text-align:center; }

.upi-qr-wrap{
  display:none;
  flex-direction:column; align-items:center;
  text-align:center; gap:0.6rem;
  margin-top:1rem; padding:1.2rem;
  background:var(--cream-light); border-radius:var(--radius);
}
.upi-qr-wrap.open{ display:flex; }
.upi-qr-wrap img{ width:160px; height:160px; background:var(--paper); padding:8px; border-radius:var(--radius); }
.upi-qr-wrap p{ font-size:0.78rem; color:var(--ink-soft); }

/* reduced motion */
@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior:auto; }
  .cart-drawer, .modal, .modal-overlay, .cart-overlay, .btn, .add-btn{ transition:none; }
}
