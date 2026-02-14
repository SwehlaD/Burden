// ========================= MENU TOGGLE =========================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const nav = document.querySelector("nav");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Close menu if click outside nav
document.addEventListener("click", e => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove("show");
  }
});

// ========================= SMOOTH SCROLL WITH OFFSET =========================
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerHeight = nav.offsetHeight;
    const elementTop = target.getBoundingClientRect().top;
    const scrollPosition = window.scrollY + elementTop - headerHeight;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });

    // Close menu on link click (for mobile)
    navLinks.classList.remove("show");
  });
});

// ========================= DYNAMIC BACKGROUND GRADIENT =========================
const body = document.body;
let ticking = false;

function updateGradient() {
  const scrollY = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const rawT = Math.min(scrollY / scrollHeight, 1);
  const t = Math.pow(rawT, 0.5); // easing effect

  const dark = { r: 18, g: 18, b: 18 };
  const top = { r: 74, g: 46, b: 29 };
  const middle = { r: 74, g: 46, b: 29 };
  const bottom = { r: 149, g: 122, b: 105 };

  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  const c1 = { r: mix(dark.r, top.r, t), g: mix(dark.g, top.g, t), b: mix(dark.b, top.b, t) };
  const c2 = { r: mix(dark.r, middle.r, t), g: mix(dark.g, middle.g, t), b: mix(dark.b, middle.b, t) };
  const c3 = { r: mix(dark.r, bottom.r, t), g: mix(dark.g, bottom.g, t), b: mix(dark.b, bottom.b, t) };

  body.style.background = `linear-gradient(to bottom, 
    rgb(${c1.r},${c1.g},${c1.b}) 0%, 
    rgb(${c2.r},${c2.g},${c2.b}) 50%, 
    rgb(${c3.r},${c3.g},${c3.b}) 100%)`;
}

// Use requestAnimationFrame for smoother performance
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateGradient();
      ticking = false;
    });
    ticking = true;
  }
});

// Initialize gradient on load
updateGradient();
