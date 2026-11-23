'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Light and dark mode ---------- */
const root = document.documentElement;
const themeBtn = $('#theme-toggle');
const isDark = () => (root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

function syncTheme() {
  const dark = isDark();
  root.dataset.theme = dark ? 'dark' : 'light';
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeBtn.addEventListener('click', () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
  syncTheme();
});
syncTheme();

/* ---------- Highlight current section in the nav ---------- */
const tabs = $$('.left .tab:not(.small)');
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      tabs.forEach(t => t.setAttribute('status', t.getAttribute('href') === '#' + en.target.id ? 'on' : ''));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- Skills (grouped) ---------- */
const GROUPS = [
  ['AI', ['AI training', 'LLM evaluation', 'Prompt evaluation', 'AI response evaluation', 'Content review', 'AI testing', 'Multilingual AI', 'AI quality assurance', 'AI model assessment']],
  ['Programming', ['Python', 'SQL (basic)', 'JSON', 'Git (basic)', 'GitHub', 'APIs (basic)', 'Data structures', 'Algorithms', 'Computer networks', 'HTML', 'CSS', 'JavaScript']],
  ['Research and data', ['Data annotation', 'Data collection', 'Data entry', 'Online research', 'Data validation', 'Information verification', 'Fact checking', 'Dataset analysis', 'Spreadsheet analysis']],
  ['Tools', ['Microsoft Excel', 'Google Sheets', 'Microsoft Office', 'VS Code', 'ChatGPT', 'Claude', 'Gemini', 'Linux']],
  ['Soft skills', ['Critical thinking', 'Analytical thinking', 'Problem solving', 'Attention to detail', 'Written communication', 'Verbal communication', 'Adaptability', 'Time management', 'Self-learning']]
];

const skillsBox = $('#skills-groups');
GROUPS.forEach(([title, skills]) => {
  const wrap = document.createElement('div');
  wrap.className = 'skill-group';
  const h3 = document.createElement('h3');
  h3.className = 'group-title';
  h3.textContent = title;
  const ul = document.createElement('ul');
  ul.className = 'skills';
  skills.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });
  wrap.append(h3, ul);
  skillsBox.appendChild(wrap);
});

/* ---------- Contact form ---------- */
const form = $('#contact-form');
const success = $('#form-success');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email, like name@example.com.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};

function validate(field) {
  const input = form.elements[field];
  const result = rules[field](input.value);
  $('#' + field + '-error').textContent = result === true ? '' : result;
  input.closest('.field').classList.toggle('invalid', result !== true);
  input.setAttribute('aria-invalid', String(result !== true));
  return result === true;
}
Object.keys(rules).forEach(f => form.elements[f].addEventListener('blur', () => validate(f)));

form.addEventListener('submit', e => {
  e.preventDefault();
  success.hidden = true;
  const ok = Object.keys(rules).map(validate).every(Boolean);
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }

  // No backend: open the visitor's mail app with the message filled in
  const { name, email, message } = form.elements;
  const subject = encodeURIComponent('Portfolio message from ' + name.value.trim());
  const body = encodeURIComponent(message.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim());
  window.location.href = `mailto:abdeldjabbar2ii5@gmail.com?subject=${subject}&body=${body}`;

  success.textContent = 'Thanks, ' + name.value.trim() + '. Your email app should open with the message ready to send.';
  success.hidden = false;
  form.reset();
});

$('#year').textContent = new Date().getFullYear();
