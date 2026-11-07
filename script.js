const artwork = document.querySelector('.hero');
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
let inView = true;
function syncMotion() {
  const paused = userPaused || reducedMotion.matches || document.hidden || !inView;
  artwork.dataset.motion = paused ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed', String(userPaused));
  motionButton.setAttribute('aria-label', userPaused ? 'Play animation' : 'Pause animation');
  motionButton.querySelector('.motion-icon').textContent = userPaused ? '▷' : 'Ⅱ';
  motionButton.querySelector('.motion-label').textContent = userPaused ? 'Play motion' : 'Pause motion';
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', syncMotion);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncMotion(); }).observe(artwork);
}
syncMotion();
