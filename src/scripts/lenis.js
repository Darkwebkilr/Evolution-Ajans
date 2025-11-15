import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({
  smooth: true,
  smoothTouch: true,
  syncTouch: true,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
