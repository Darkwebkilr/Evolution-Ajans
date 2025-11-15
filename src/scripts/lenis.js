import Lenis from "@studio-freight/lenis";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    smoothWheel: true,
    lerp: 0.1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});
