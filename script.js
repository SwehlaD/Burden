// ========================= MENU TOGGLE =========================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const nav = document.querySelector("nav");

toggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevents the document click listener from immediately closing it
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
    const targetId = link.getAttribute("href");
    
    // Only intercept internal links starting with #
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const target = document.getElementById(targetId.slice(1));
      if (!target) return;

      const headerHeight = nav.offsetHeight;
      const elementTop = target.getBoundingClientRect().top;
      // Precise calculation: current scroll + relative position - menu height
      const scrollPosition = window.pageYOffset + elementTop - headerHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
      });

      // Close menu on link click (for mobile)
      navLinks.classList.remove("show");
    }
  });
});

// ========================= DYNAMIC BACKGROUND GRADIENT =========================
let ticking = false;

function updateGradient() {
  const scrollY = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  // Guard against division by zero on very short pages
  if (scrollHeight <= 0) return;

  const rawT = Math.min(scrollY / scrollHeight, 1);
  const t = Math.pow(rawT, 0.5); // Ease-out effect

  const dark = { r: 18, g: 18, b: 18 };
  const top = { r: 74, g: 46, b: 29 };
  const bottom = { r: 149, g: 122, b: 105 };

  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  const c1 = { r: mix(dark.r, top.r, t), g: mix(dark.g, top.g, t), b: mix(dark.b, top.b, t) };
  const c3 = { r: mix(dark.r, bottom.r, t), g: mix(dark.g, bottom.g, t), b: mix(dark.b, bottom.b, t) };

  // Applying background to body
  document.body.style.background = `linear-gradient(to bottom, 
    rgb(${c1.r},${c1.g},${c1.b}) 0%, 
    rgb(${c1.r},${c1.g},${c1.b}) 50%, 
    rgb(${c3.r},${c3.g},${c3.b}) 100%)`;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateGradient();
      ticking = false;
    });
    ticking = true;
  }
});

// Initialize on load
updateGradient();
