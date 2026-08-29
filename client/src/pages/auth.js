import { api, setToken, clearToken, getToken } from '../api.js';
import { DB, state } from '../state.js';
import { showToast } from '../components/toast.js';
import { renderSideNav } from '../components/sidebar.js';
import { switchTab } from '../components/sidebar.js';

export function goLanding() {
  document.getElementById('view-landing').classList.remove('hidden');
  document.getElementById('view-auth').classList.add('hidden');
  document.getElementById('view-app').classList.add('hidden');
}

export function openAuth(tab) {
  document.getElementById('view-landing').classList.add('hidden');
  document.getElementById('view-app').classList.add('hidden');
  document.getElementById('view-auth').classList.remove('hidden');
  switchAuthTab(tab);
}

export function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('auth-error').classList.add('hidden');
}

function authFail(msg) {
  const e = document.getElementById('auth-error');
  e.textContent = msg;
  e.classList.remove('hidden');
}

export async function doLogin() {
  const email = document.getElementById('li-email').value.trim();
  const pass = document.getElementById('li-pass').value.trim();
  if (!email || !pass) { authFail('Enter your email and password to continue.'); return; }
  try {
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
    setToken(data.token);
    DB.patient = data.patient;
    await hydrateApp();
  } catch (e) { authFail(e.message); }
}

export async function doSignup() {
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const phone = document.getElementById('su-phone').value.trim();
  const pass = document.getElementById('su-pass').value.trim();
  if (!name || !email || !pass) { authFail('Name, email, and password are required.'); return; }
  try {
    const data = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, phone, password: pass }) });
    setToken(data.token);
    DB.patient = data.patient;
    await hydrateApp();
    showToast('Account created — welcome to Meridian.');
  } catch (e) { authFail(e.message); }
}

export function doLogout() {
  clearToken();
  DB.patient = null;
  goLanding();
}

export async function hydrateApp() {
  if (!DB.doctors.length) DB.doctors = await api('/api/doctors');
  document.getElementById('view-landing').classList.add('hidden');
  document.getElementById('view-auth').classList.add('hidden');
  document.getElementById('view-app').classList.remove('hidden');
  const initials = DB.patient.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('foot-avatar').textContent = initials || 'JR';
  document.getElementById('foot-name').textContent = DB.patient.name || 'Patient';
  state.activeChat = Object.keys(DB.patient.messages)[0] || DB.doctors[0].id;
  renderSideNav();
  switchTab('dashboard');
}

export async function resumeSession() {
  if (!getToken()) { goLanding(); return; }
  try {
    DB.patient = await api('/api/me');
    await hydrateApp();
  } catch (e) {
    clearToken();
    goLanding();
  }
}

// Exposed for inline onclick="" handlers in the rendered HTML
window.goLanding = goLanding;
window.openAuth = openAuth;
window.switchAuthTab = switchAuthTab;
window.doLogin = doLogin;
window.doSignup = doSignup;
window.doLogout = doLogout;
