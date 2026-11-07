const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const switcher = document.querySelector('.design-switch');
let userPaused = false;
let frame = 0;
let pointerX = 0;
function renderCanvas() {
  frame = 0;
  if (userPaused || reducedMotion.matches || document.hidden) return;
  const progress = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
  document.body.style.setProperty('--canvas-y', `${-60 * progress}px`);
  document.body.style.setProperty('--canvas-x', `${pointerX * 12}px`);
}
function requestFrame() { if (!frame) frame = requestAnimationFrame(renderCanvas); }
function syncMotion() {
  document.body.dataset.motion = userPaused || reducedMotion.matches || document.hidden ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed', String(userPaused));
  motionButton.setAttribute('aria-label', userPaused ? 'Play animation' : 'Pause animation');
  motionButton.querySelector('.motion-icon').textContent = userPaused ? '▷' : 'Ⅱ';
  motionButton.querySelector('.motion-label').textContent = userPaused ? 'Play' : 'Pause';
  if (reducedMotion.matches) { document.body.style.removeProperty('--canvas-x'); document.body.style.removeProperty('--canvas-y'); }
  requestFrame();
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', syncMotion);
window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame);
window.addEventListener('pointermove', event => { if (!finePointer.matches) return; pointerX = event.clientX / innerWidth - .5; requestFrame(); }, { passive: true });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && switcher.open) { switcher.open = false; switcher.querySelector('summary').focus(); } });
document.addEventListener('click', event => { if (!switcher.contains(event.target)) switcher.open = false; });
syncMotion();

document.querySelectorAll('a[href="#"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({top:0,behavior:reducedMotion.matches ? 'auto' : 'smooth'});
  history.replaceState(null,'',location.pathname + location.search);
}));
