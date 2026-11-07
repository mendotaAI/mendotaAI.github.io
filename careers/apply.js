// Careers: Apply buttons pre-select the role; the form posts to Formspree and shows the result in place.
const form = document.querySelector('.apply-form');
const roleSelect = form?.querySelector('select[name="role"]');
const subject = form?.querySelector('input[name="_subject"]');
const status = form?.querySelector('.form-status');

function setRole(role) {
  if (!roleSelect) return;
  roleSelect.value = role;
  roleSelect.removeAttribute('aria-invalid');
}
document.querySelectorAll('[data-role]').forEach((a) => a.addEventListener('click', () => setRole(a.dataset.role)));
const ROLE_SLUGS = { 'research-scientist': 'Research Scientist', 'software-engineer-platform': 'Software Engineer (Platform)' };
const fromUrl = ROLE_SLUGS[new URLSearchParams(location.search).get('role')];
if (fromUrl) setRole(fromUrl);

function say(text, isError) {
  status.textContent = text;
  status.classList.toggle('is-error', !!isError);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  let firstBad = null;
  for (const el of form.querySelectorAll('input[required], select[required]')) {
    const bad = !el.checkValidity();
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (bad && !firstBad) firstBad = el;
  }
  if (firstBad) { say('Please fill in the highlighted fields.', true); firstBad.focus(); return; }

  subject.value = `Application: ${roleSelect.value} — ${form.elements.namedItem('name').value.trim()}`;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  say('Sending…');
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    form.innerHTML = '<span class="md-card-rim"></span><div class="apply-done" role="status"><h3>Thank you.</h3><p>Your application is in. We read every one and will be in touch at the email you gave us.</p></div>';
  } catch {
    button.disabled = false;
    say('Something went wrong sending your application. Please email hr@mendota.ai instead.', true);
  }
});
