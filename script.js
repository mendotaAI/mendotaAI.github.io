const story = document.querySelector('.story');
const stage = document.querySelector('.story-stage');
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const switcher = document.querySelector('.design-switch');
const chapters = [...document.querySelectorAll('.story-copy')];
let paused = false;
let frame = 0;
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const mix = (a, b, t) => Math.round(a+(b-a)*t);
function render() {
  frame = 0;
  if (paused || document.hidden) return;
  const range = Math.max(1, story.offsetHeight-stage.offsetHeight);
  const p = reducedMotion.matches ? 1 : clamp(-story.getBoundingClientRect().top/range);
  const clear = smooth(.28, .52, p);
  const first = 1-smooth(.20, .36, p);
  const last = smooth(.43, .58, p);
  const color = `rgb(${mix(241,20,clear)} ${mix(240,37,clear)} ${mix(233,57,clear)})`;
  const values = {
    '--paint':1-clear, '--quiet':clear, '--world-scale':1.04+.04*p,
    '--first':first, '--first-y':`${-24*(1-first)}px`, '--last':last, '--last-y':`${24*(1-last)}px`,
    '--sample-scale':1.16-.36*smooth(.1,.85,p), '--sample-x':`${20-10*clear}px`, '--sample-y':`${-15*clear}px`,
    '--sample-rotate':`${-8+8*smooth(.12,.82,p)}deg`, '--pigment':1-smooth(.15,.72,p), '--surface':clear,
    '--wave-opacity':.72*smooth(.62,.9,p), '--wave-offset':1-smooth(.62,.96,p),
    '--header-color':color, '--header-line':`rgb(${mix(241,20,clear)} ${mix(240,37,clear)} ${mix(233,57,clear)} / .18)`,
    '--logo-invert':1-clear, '--signature':1-smooth(.1,.45,p)
  };
  Object.entries(values).forEach(([key,value]) => story.style.setProperty(key,String(value)));
  const active = p < .43 ? 0 : 1;
  chapters.forEach((chapter,i) => { chapter.setAttribute('aria-hidden',String(i!==active)); chapter.classList.toggle('is-active',i===active); });
  story.dataset.phase = active === 0 ? 'experience' : 'grounded';
}
function requestFrame() { if(!frame) frame=requestAnimationFrame(render); }
function syncMotion() {
  document.body.dataset.motion = paused || reducedMotion.matches || document.hidden ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.setAttribute('aria-label',paused?'Play animation':'Pause animation');
  motionButton.querySelector('.motion-icon').textContent=paused?'▷':'Ⅱ';
  motionButton.querySelector('.motion-label').textContent=paused?'Play':'Pause';
  requestFrame();
}
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
window.addEventListener('scroll',requestFrame,{passive:true});
window.addEventListener('resize',requestFrame);
document.addEventListener('visibilitychange',syncMotion);
reducedMotion.addEventListener('change',syncMotion);
document.addEventListener('keydown',event=>{if(event.key==='Escape' && switcher.open){switcher.open=false;switcher.querySelector('summary').focus();}});
document.addEventListener('click',event=>{if(!switcher.contains(event.target))switcher.open=false;});
document.querySelectorAll('a[href="#"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:reducedMotion.matches?'auto':'smooth'});history.replaceState(null,'',location.pathname+location.search);}));
syncMotion();
