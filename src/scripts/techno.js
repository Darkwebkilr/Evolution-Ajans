import { gsap } from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.set("#heading", { opacity: 0 });
let split = SplitText.create("#heading", { type: "chars" });

ScrollTrigger.create({
  trigger: "#heading",
  once: true,
  onEnter: () => {
    gsap.set("#heading", { opacity: 1 });
    gsap.from(split.chars, {
      duration: 0.5,
      y: 20,
      autoAlpha: 0,
      stagger: {
        amount: 0.5,
        from: "random",
        yoyo: true,
      },
    });
  },
});

gsap.utils.toArray("#tt").forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    pin: true,
    pinSpacing: false,
  });
});

gsap.utils.toArray("#tt").forEach((panel, i) => {
  if (i == 0) {
    return;
  } else {
    ScrollTrigger.create({
      trigger: panel,
      snap: 1 / 2,
      duration: 0.1,
    });
  }
});

let i = 0;
while (i < 2) {
  i++;
  document.addEventListener("DOMContentLoaded", () => {
    dd();
  });
}

const a = document.getElementById("hea");
function dd() {
  if (window.innerWidth <= 560) {
    a.classList.remove("hidden");
    a.classList.add("block");
  } else {
    a.classList.remove("block");
    a.classList.add("hidden");
  }
}
window.onresize = dd;
