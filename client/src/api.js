// Thin fetch wrapper that attaches the JWT and unwraps JSON/error responses.
const API = '';
let TOKEN = localStorage.getItem('meridian_token') || null;

export function getToken() { return TOKEN; }
export function setToken(t) { TOKEN = t; localStorage.setItem('meridian_token', t); }
export function clearToken() { TOKEN = null; localStorage.removeItem('meridian_token'); }

export async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (TOKEN) headers.Authorization = 'Bearer ' + TOKEN;
  const res = await fetch(API + path, { ...opts, headers });
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
}
