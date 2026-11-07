// Dusk: the camera. Layers in the hero scene move at different rates on scroll; nothing fades or blurs.
const scene = document.querySelector('.md-scene');
const layers = scene ? [...scene.querySelectorAll('[data-depth]')] : [];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
function render() {
  frame = 0;
  if (!scene || reduced.matches) return;
  const y = Math.min(scene.offsetHeight, Math.max(0, -scene.getBoundingClientRect().top));
  for (const el of layers) el.style.transform = `translateY(${(y * parseFloat(el.dataset.depth) * -0.25).toFixed(1)}px)`;
}
function request() { if (!frame) frame = requestAnimationFrame(render); }
addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
reduced.addEventListener('change', () => { for (const el of layers) el.style.transform = ''; request(); });
request();
