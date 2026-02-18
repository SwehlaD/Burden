/* ===========================
   MENU TOGGLE (Unchanged)
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
    e.preventDefault(); // prevent default jump
    musicSection.scrollIntoView({ behavior: "smooth", block: "start" });
    // Close mobile menu if open
    if (navLinks) navLinks.classList.remove("show");
  });
}


/* ===========================
   MUSIC CAROUSEL (OUTSIDE VIEW FIX)
=========================== */
const scrollContainer = document.querySelector(".music-scroll");
const albumCards = document.querySelectorAll(".release-card");

function updateFlip() {
  if (!scrollContainer) return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  albumCards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = cardCenter - containerCenter;

    // "OUTSIDE" VIEW: Changing multiplier to positive makes it curve toward viewer
    const maxRotation = 45;
    const rotationY = (distance / containerRect.width) * maxRotation;

    const inner = card.querySelector(".album-inner");
    if (inner && !card.classList.contains('flipped')) {
      inner.style.transform = `rotateY(${rotationY}deg)`;
    }

    // PROMINENT MIDDLE DETECTION
    if (Math.abs(distance) < cardRect.width / 2) {
      card.classList.add("showcase");
    } else {
      card.classList.remove("showcase");
      card.classList.remove("flipped");
    }
  });
}

/* ===========================
   DRAG TO SCROLL (FIXED)
=========================== */
let isDown = false;
let startX;
let scrollLeft;

if (scrollContainer) {
  scrollContainer.addEventListener("mousedown", e => {
    isDown = true;
    scrollContainer.style.scrollSnapType = "none"; // Disable snap while dragging
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });
  scrollContainer.addEventListener("mouseleave", () => {
    isDown = false;
    scrollContainer.style.scrollSnapType = "x mandatory";
  });
  scrollContainer.addEventListener("mouseup", () => {
    isDown = false;
    scrollContainer.style.scrollSnapType = "x mandatory";
  });
  scrollContainer.addEventListener("mousemove", e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
    updateFlip();
  });
  scrollContainer.addEventListener("scroll", updateFlip);
}

/* ===========================
   DEVOTIONS SETUP (Unchanged Logic)
=========================== */
const devotions = document.querySelectorAll(".devotion");
const devotionsSection = document.getElementById("devotions");

function closeAllDevotions() {
  devotions.forEach(dev => {
    dev.classList.remove("active", "open");
    const body = dev.querySelector(".devotion-body");
    if (body) body.style.maxHeight = null;
  });
}

function openDevotion(devotion) {
  closeAllDevotions();
  if (!devotion) return;
  if (devotionsSection) devotionsSection.classList.add("active");
  devotion.classList.add("active", "open");
  const body = devotion.querySelector(".devotion-body");
  if (body) body.style.maxHeight = body.scrollHeight + "px";
  devotion.scrollIntoView({ behavior: "smooth", block: "start" });
}

albumCards.forEach(card => {
  card.addEventListener("click", () => {
    if (card.classList.contains('showcase')) {
      card.classList.toggle('flipped');
      const devotionId = card.dataset.devotionId;
      const devotion = document.getElementById(devotionId);
      openDevotion(devotion);
    } else {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });
});

document.querySelectorAll(".devotion-header").forEach(header => {
  header.addEventListener("click", () => {
    const devotion = header.closest(".devotion");
    const body = devotion.querySelector(".devotion-body");
    if (devotion.classList.contains("open")) {
      devotion.classList.remove("open");
      body.style.maxHeight = null;
    } else {
      devotion.classList.add("open");
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
});

/* ===========================
   DYNAMIC GRADIENT 
=========================== */
function updateGradient() {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return;
    const rawT = Math.min(scrollY / scrollHeight, 1);
    const t = Math.pow(rawT, 0.5);
    const dark = { r: 18, g: 18, b: 18 };
    const top = { r: 74, g: 46, b: 29 };
    const bottom = { r: 149, g: 122, b: 105 };
    const mix = (a, b, t) => Math.round(a + (b - a) * t);
    const c1 = { r: mix(dark.r, top.r, t), g: mix(dark.g, top.g, t), b: mix(dark.b, top.b, t) };
    const c3 = { r: mix(dark.r, bottom.r, t), g: mix(dark.g, bottom.g, t), b: mix(dark.b, bottom.b, t) };
  document.body.style.background = `linear-gradient(to bottom, rgb(${c1.r},${c1.g},${c1.b}) 0%, rgb(${c1.r},${c1.g},${c1.b}) 50%, rgb(${c3.r},${c3.g},${c3.b}) 100%)`;
}

window.addEventListener("scroll", updateGradient);

// INIT
updateGradient();
updateFlip();