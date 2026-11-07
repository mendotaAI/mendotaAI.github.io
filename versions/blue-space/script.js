const motionButton = document.querySelector('.motion-toggle');
const opening = document.querySelector('.opening');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
let frame = 0;
function renderScroll() {
  frame = 0;
  if (userPaused || reducedMotion.matches || document.hidden) return;
  const progress = Math.min(1, Math.max(0, -opening.getBoundingClientRect().top / opening.offsetHeight));
  opening.style.setProperty('--block-y', `${progress * 140}px`);
  opening.style.setProperty('--block-scale', String(1 + progress * .18));
}
function requestScrollFrame() { if (!frame) frame = requestAnimationFrame(renderScroll); }
function syncMotion() {
  document.body.dataset.motion = userPaused || reducedMotion.matches || document.hidden ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed', String(userPaused));
  motionButton.setAttribute('aria-label', userPaused ? 'Play animation' : 'Pause animation');
  motionButton.querySelector('.motion-icon').textContent = userPaused ? '▷' : 'Ⅱ';
  motionButton.querySelector('.motion-label').textContent = userPaused ? 'Play' : 'Pause';
  if (reducedMotion.matches) {
    opening.style.removeProperty('--block-y');
    opening.style.removeProperty('--block-scale');
  }
  requestScrollFrame();
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', syncMotion);
window.addEventListener('scroll', requestScrollFrame, { passive: true });
window.addEventListener('resize', requestScrollFrame);
syncMotion();

document.querySelectorAll('a[href="#"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({top:0,behavior:reducedMotion.matches ? 'auto' : 'smooth'});
  history.replaceState(null,'',location.pathname + location.search);
}));
