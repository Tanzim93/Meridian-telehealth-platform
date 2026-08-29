import { icon } from '../icons.js';

let toastTimeout;

export function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = icon('check', 15) + `<span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2600);
}
