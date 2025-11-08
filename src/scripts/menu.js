const btn = document.getElementById("mobile-menu-button");
const menu = document.getElementById("mobile-menu");
const closeBtn = document.getElementById("close-menu");
const bg = document.getElementById("bg");

btn.addEventListener("click", () => {
  menu.classList.remove("hidden");
  menu.classList.add("flex");
  setTimeout(() => {
    menu.classList.remove("translate-y-full");
    menu.classList.add("translate-y-0");
  }, 10);
  bg.classList.remove("hidden");
  bg.classList.add("absolute");
  bg.classList.remove("pointer-events-none");
  bg.addEventListener("click", () => {
    menu.classList.remove("translate-y-0");
    bg.classList.remove("absolute");
    bg.classList.add("hidden");
    menu.classList.add("translate-y-full");
  });
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("translate-y-0");
  bg.classList.remove("absolute");
  bg.classList.add("hidden");
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
