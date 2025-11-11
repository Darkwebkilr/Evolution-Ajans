const btn = document.getElementById("mobile-menu-button");
const menu = document.getElementById("mobile-menu");
const closeBtn = document.getElementById("close-menu");
let cls = "bg-gradient-to-r from-white/50 to-pink-200/50";

btn.addEventListener("click", () => {
  menu.classList.remove("hidden");
  menu.classList.add("flex");
  setTimeout(() => {
    menu.classList.remove("translate-y-full");
    menu.classList.add("translate-y-0");
  }, 10);
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("translate-y-0");
  menu.classList.add("translate-y-full");
});

const nav = document.querySelector("nav");
const h = nav.clientHeight;
const bod = document.body;

if (window.innerWidth <= 1024) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 200) {
      nav.classList.add("fixed");
      bod.style.marginTop = h + "px";
    } else {
      nav.classList.remove("fixed");
      bod.style.marginTop = "0px";
    }
  });
}
