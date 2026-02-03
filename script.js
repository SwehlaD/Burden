const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

window.addEventListener("scroll", () => {
  const scroll = window.scrollY;
  const height = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  const progress = scroll / height;

  // Start colors (your originals)
  const start1 = { r: 6, g: 7, b: 10 };   // #06070a
  const start2 = { r: 0, g: 5, b: 15 };   // #00050f
  const start3 = { r: 8, g: 7, b: 16 };   // #080710

  // How much they shift by the bottom of the page
  const shift = 50; // controls intensity (lower = subtler)

  const c1 = {
    r: Math.floor(start1.r + progress * 8),
    g: Math.floor(start1.g + progress * 6),
    b: Math.floor(start1.b + progress * shift)
  };

  const c2 = {
    r: Math.floor(start2.r + progress * 10),
    g: Math.floor(start2.g + progress * 8),
    b: Math.floor(start2.b + progress * shift)
  };

  const c3 = {
    r: Math.floor(start3.r + progress * 6),
    g: Math.floor(start3.g + progress * 5),
    b: Math.floor(start3.b + progress * shift)
  };

  document.body.style.background = `
    linear-gradient(
      to bottom,
      rgb(${c1.r},${c1.g},${c1.b}),
      rgb(${c2.r},${c2.g},${c2.b}),
      rgb(${c3.r},${c3.g},${c3.b})
    )
  `;
});
