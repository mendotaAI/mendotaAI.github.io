// Contact: topic comes from ?topic=; the form posts to Formspree and shows the result in place.
const form = document.querySelector('.apply-form');
const topic = form?.querySelector('select[name="topic"]');
const subject = form?.querySelector('input[name="_subject"]');
const status = form?.querySelector('.form-status');
const TOPICS = { 'datasets': 'Datasets', 'evals': 'Custom evaluations', 'post-training': 'Post-training', 'research': 'Research opportunities' };
const fromUrl = TOPICS[new URLSearchParams(location.search).get('topic')];
if (fromUrl && topic) topic.value = fromUrl;

function say(text, isError) {
  status.textContent = text;
  status.classList.toggle('is-error', !!isError);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  let firstBad = null;
  for (const el of form.querySelectorAll('[required]')) {
    const bad = !el.checkValidity();
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (bad && !firstBad) firstBad = el;
  }
  if (firstBad) { say('Please fill in the highlighted fields.', true); firstBad.focus(); return; }

  const org = form.elements.namedItem('organization').value.trim();
  subject.value = `Inquiry: ${topic.value} — ${form.elements.namedItem('name').value.trim()}${org ? ` (${org})` : ''}`;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  say('Sending…');
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    form.innerHTML = '<span class="md-card-rim"></span><div class="apply-done" role="status"><h3>Thank you.</h3><p>Your message is in. We\'ll get back to you at the email you gave us.</p></div>';
  } catch {
    button.disabled = false;
    say('Something went wrong sending your message. Please email contact@mendota.ai instead.', true);
  }
});
