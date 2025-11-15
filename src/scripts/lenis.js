import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({
  smooth: true,
  smoothTouch: true,
  syncTouch: true,
  touchMultiplier: 0.75,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
