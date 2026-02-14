// ========================= MENU TOGGLE =========================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", (e) => {
  e.stopPropagation(); // don't let click bubble to document
  navLinks.classList.toggle("show");
});

// Close menu if clicking outside nav (only on mobile)
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("show") && !navLinks.contains(e.target) && e.target !== toggle) {
    navLinks.classList.remove("show");
  }
});

// Smooth scroll and close mobile menu
const navItems = navLinks.querySelectorAll("a");
navItems.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // prevent default jump
    const targetId = link.getAttribute("href").substring(1); // remove #
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // close mobile menu after scroll
    if (navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
    }
  });
});

// ========================= BACKGROUND GRADIENT =========================
const bg = document.body;
let ticking = false;

function updateGradient() {
  const scroll = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const rawT = Math.min(scroll / height, 1);
  const t = Math.pow(rawT, 0.5);

  const dark = { r: 18, g: 18, b: 18 };
  const top = { r: 74, g: 46, b: 29 };
  const middle = { r: 74, g: 46, b: 29 };
  const bottom = { r: 149, g: 122, b: 105 };

  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  const c1 = { r: mix(dark.r, top.r, t), g: mix(dark.g, top.g, t), b: mix(dark.b, top.b, t) };
  const c2 = { r: mix(dark.r, middle.r, t), g: mix(dark.g, middle.g, t), b: mix(dark.b, middle.b, t) };
  const c3 = { r: mix(dark.r, bottom.r, t), g: mix(dark.g, bottom.g, t), b: mix(dark.b, bottom.b, t) };

  bg.style.background = `
    linear-gradient(
      to bottom,
      rgb(${c1.r},${c1.g},${c1.b}) 0%,
      rgb(${c2.r},${c2.g},${c2.b}) 50%,
      rgb(${c3.r},${c3.g},${c3.b}) 100%
    )
  `;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateGradient();
      ticking = false;
    });
    ticking = true;
  }
});

updateGradient();
