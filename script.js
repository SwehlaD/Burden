// =========================
// MENU TOGGLE (Mobile Navigation)
// =========================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const nav = document.querySelector("nav");

toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("show");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove("show");
  }
});

// Close menu when a nav link is clicked (mobile)
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});

// =========================
// DEVOTION EXPAND / COLLAPSE (ONE OPEN AT A TIME)
// =========================
const devotionToggles = document.querySelectorAll(".devotion-header");

devotionToggles.forEach(button => {
  button.addEventListener("click", () => {
    const devotion = button.closest(".devotion");
    const isOpen = devotion.classList.contains("open");

    // Close any open devotion section
    document.querySelectorAll(".devotion.open").forEach(openDevotion => {
      openDevotion.classList.remove("open");
    });

    // Toggle the clicked devotion section
    if (!isOpen) {
      devotion.classList.add("open");
    }
  });
});

// =========================
// DYNAMIC BACKGROUND GRADIENT (on scroll)
// =========================
let ticking = false;

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
    linear-gradient(to bottom,
      rgb(${c1.r},${c1.g},${c1.b}) 0%,
      rgb(${c1.r},${c1.g},${c1.b}) 50%,
      rgb(${c3.r},${c3.g},${c3.b}) 100%)
  `;
}

// =========================
// PLATFORM BUTTON GLOW (when in view)
// =========================
const releases = document.querySelectorAll(".release-card");

function updateButtonGlow() {
  const windowHeight = window.innerHeight;

  releases.forEach(card => {
    const top = card.getBoundingClientRect().top;
    const buttons = card.querySelectorAll(".platforms a");

    if (top < windowHeight * 0.75 && top > 0) {
      buttons.forEach(btn => btn.classList.add("glow"));
    } else {
      buttons.forEach(btn => btn.classList.remove("glow"));
    }
  });
}

// =========================
// SCROLL HANDLER (runs every time the user scrolls)
// =========================
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateGradient();
      updateButtonGlow();
      ticking = false;
    });
    ticking = true;
  }
});

// =========================
// INIT (initial setup for scroll effects)
// =========================
updateGradient();
updateButtonGlow();

