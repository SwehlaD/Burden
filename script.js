/* ===========================
   MENU TOGGLE (UNCHANGED)
=========================== */
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const nav = document.querySelector("nav");

if (toggle && navLinks && nav) {
  toggle.addEventListener("click", e => {
    e.stopPropagation();
    navLinks.classList.toggle("show");
  });

  document.addEventListener("click", e => {
    if (!nav.contains(e.target)) navLinks.classList.remove("show");
  });

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
  });
}

const musicLink = document.getElementById("nav-music");
const musicSection = document.getElementById("music");

if (musicLink && musicSection) {
  musicLink.addEventListener("click", e => {
    e.preventDefault();
    musicSection.scrollIntoView({ behavior: "smooth", block: "start" });
    if (navLinks) navLinks.classList.remove("show");
  });
}

/* ===========================
   MUSIC CAROUSEL (DISTANCE BASED)
=========================== */
const scrollContainer = document.querySelector(".music-scroll");
const albumCards = document.querySelectorAll(".release-card");

function setShowcase(card) {
  albumCards.forEach(c => {
    c.classList.remove("showcase", "flipped");
  });
  card.classList.add("showcase");
  updateCarousel();
}

function updateCarousel() {
  if (!scrollContainer) return;

  const showcase = document.querySelector(".release-card.showcase");

  albumCards.forEach(card => {
    const inner = card.querySelector(".album-inner");
    if (!inner) return;

    if (!showcase) {
      card.style.transform = "";
      card.style.opacity = "";
      inner.style.transform = "";
      return;
    }

    const showcaseRect = showcase.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const showcaseCenter = showcaseRect.left + showcaseRect.width / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;

    const distance = Math.abs(cardCenter - showcaseCenter);
    const maxDistance = window.innerWidth * 0.65;
    const t = Math.min(distance / maxDistance, 1);

    const scale = 1 - t * 0.48; //28 original
    const z = 120 - t * 220;
    const opacity = 1 - t * 0.45;

    card.style.transform = `
      scale(${scale})
      translateZ(${z}px)
    `;
    card.style.opacity = opacity;

    if (!card.classList.contains("flipped")) {
      const rotationY = ((cardCenter - showcaseCenter) / maxDistance) * 15;
      inner.style.transform = `rotateY(${rotationY}deg)`;
    }
  });
}

/* ===========================
   Set Showcase & Center Card
=========================== */
function setShowcase(card) {
  if (!card || !scrollContainer) return;

  // Remove previous showcase
  albumCards.forEach(c => c.classList.remove("showcase", "flipped"));

  // Set new showcase
  card.classList.add("showcase");

  // Center the card in the scroll container
  const containerRect = scrollContainer.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  // Calculate offset to center
  const offset =
    cardRect.left -
    containerRect.left - 
    containerRect.width / 2 + 
    cardRect.width / 2;

  scrollContainer.scrollBy({
    left: offset,
    behavior: "smooth"
  });

  updateCarousel();
}

/* ===========================
   CAROUSEL BUTTON CONTROLS
=========================== */
const leftBtn = document.querySelector(".carousel-btn.left");
const rightBtn = document.querySelector(".carousel-btn.right");

if (scrollContainer && leftBtn && rightBtn) {
  const scrollAmount = () =>
    scrollContainer.querySelector(".release-card")?.offsetWidth * 1.4 || 300;

  leftBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: -scrollAmount(),
      behavior: "smooth"
    });
  });

  rightBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: scrollAmount(),
      behavior: "smooth"
    });
  });
}

/* ===========================
   DRAG TO SCROLL 
=========================== */
let isDown = false;
let startX;
let scrollLeft;

if (scrollContainer) {
  scrollContainer.addEventListener("mousedown", e => {
    isDown = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener("mouseleave", () => {
    isDown = false;
  });

  scrollContainer.addEventListener("mouseup", () => {
    isDown = false;
  });

  scrollContainer.addEventListener("mousemove", e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
    updateCarousel();
  });

  scrollContainer.addEventListener("scroll", updateCarousel);
}

/* ===========================
   DEVOTIONS (FULL TOGGLE)
=========================== */
const devotions = document.querySelectorAll(".devotion");
const devotionsSection = document.getElementById("devotions");

/**
 * Close all devotions
 */
function closeAllDevotions() {
  devotions.forEach(dev => {
    dev.classList.remove("active", "open");
    const body = dev.querySelector(".devotion-body");
    if (body) body.style.maxHeight = null;
  });
  if (devotionsSection) devotionsSection.classList.remove("active");
}

/**
 * Toggle a single devotion
 */
function toggleDevotion(devotion) {
  if (!devotion) return;

  // Already open → close it
  if (devotion.classList.contains("open")) {
    devotion.classList.remove("open", "active");
    const body = devotion.querySelector(".devotion-body");
    if (body) body.style.maxHeight = null;

    const anyOpen = [...devotions].some(d => d.classList.contains("open"));
    if (!anyOpen && devotionsSection) devotionsSection.classList.remove("active");
    return;
  }

  // Otherwise, close all others and open this one
  closeAllDevotions();

  if (devotionsSection) devotionsSection.classList.add("active");
  devotion.classList.add("active", "open");

  const body = devotion.querySelector(".devotion-body");
  if (body) body.style.maxHeight = body.scrollHeight + "px";

  devotion.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===========================
   Album Card Click
=========================== */
albumCards.forEach(card => {
  card.addEventListener("click", () => {
    setShowcase(card);
    card.classList.toggle("flipped");

    const devotionId = card.dataset.devotionId;
    const devotion = document.getElementById(devotionId);
    toggleDevotion(devotion);
  });
});

/* ===========================
   Devotion Click (body or header)
=========================== */
devotions.forEach(devotion => {
  // header click
  const header = devotion.querySelector(".devotion-header");
  if (header) {
    header.addEventListener("click", () => toggleDevotion(devotion));
  }

  // body click
  const body = devotion.querySelector(".devotion-body");
  if (body) {
    body.addEventListener("click", () => toggleDevotion(devotion));
  }
});
/* ===========================
   DYNAMIC GRADIENT 
=========================== */
function updateGradient() {
  const scrollY = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return;

  const rawT = Math.min(scrollY / scrollHeight, 1);
  const t = Math.pow(rawT, 0.5);

  const dark = { r: 18, g: 18, b: 18 };
  const top = { r: 74, g: 46, b: 29 };
  const bottom = { r: 149, g: 122, b: 105 };

  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  const c1 = {
    r: mix(dark.r, top.r, t),
    g: mix(dark.g, top.g, t),
    b: mix(dark.b, top.b, t)
  };

  const c3 = {
    r: mix(dark.r, bottom.r, t),
    g: mix(dark.g, bottom.g, t),
    b: mix(dark.b, bottom.b, t)
  };

  document.body.style.background = `
    linear-gradient(
      to bottom,
      rgb(${c1.r},${c1.g},${c1.b}) 0%,
      rgb(${c1.r},${c1.g},${c1.b}) 50%,
      rgb(${c3.r},${c3.g},${c3.b}) 100%
    )
  `;
}

window.addEventListener("scroll", updateGradient);

/* ===========================
   INIT
=========================== */
updateGradient();
updateCarousel();