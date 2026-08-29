import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderBilling() {
  const unpaid = DB.patient.invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0);
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar"><div><h1>Billing</h1><p class="sub">Invoices and payment methods.</p></div></div>
    <div class="grid-3" style="margin-bottom:20px;">
      <div class="stat-card"><div class="k">Outstanding</div><div class="v">$${unpaid}</div></div>
      <div class="stat-card"><div class="k">Payment method</div><div class="v" style="font-size:17px;">Visa •••• 4242</div></div>
      <div class="stat-card"><div class="k">Insurance</div><div class="v" style="font-size:17px;color:var(--teal-deep);">Verified</div></div>
    </div>
    <div class="card">
      <div class="section-title"><h2>Invoices</h2></div>
      ${DB.patient.invoices.map(inv => `
        <div class="inv-row">
          <div class="info"><div class="t">${inv.desc}</div><div class="s">${inv.date}</div></div>
          <div class="amt">$${inv.amount.toFixed(2)}</div>
          <span class="pill-tag ${inv.status==='Paid'?'pill-teal':'pill-coral'}">${inv.status}</span>
          ${inv.status==='Unpaid' ? `<button class="btn btn-primary btn-sm" onclick="openPayment('${inv.id}')">Pay now</button>` : ''}
        </div>`).join('')}
    </div>
  `;
}

export function openPayment(id) {
  const inv = DB.patient.invoices.find(i => i.id === id);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'pay-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `<div class="modal" style="max-width:400px;">
    <button class="modal-close" onclick="document.getElementById('pay-overlay').remove()">${icon('close',15)}</button>
    <h2 style="font-size:19px;">Pay invoice</h2>
    <p style="font-size:13px;color:var(--ink-soft);margin-top:4px;">${inv.desc}</p>
    <div style="font-family:var(--font-display);font-size:30px;color:var(--teal-deep);margin:14px 0 18px;">$${inv.amount.toFixed(2)}</div>
    <div class="field"><label>Card number</label><input value="4242 4242 4242 4242" /></div>
    <div style="display:flex;gap:10px;">
      <div class="field" style="flex:1;"><label>Expiry</label><input value="09 / 28" /></div>
      <div class="field" style="flex:1;"><label>CVC</label><input value="123" /></div>
    </div>
    <button class="btn btn-primary btn-block" onclick="submitPayment('${id}')">Pay $${inv.amount.toFixed(2)}</button>
  </div>`;
  document.body.appendChild(overlay);
}

export async function submitPayment(id) {
  try {
    const inv = await api(`/api/invoices/${id}/pay`, { method: 'POST' });
    const local = DB.patient.invoices.find(i => i.id === id);
    if (local) local.status = inv.status;
    const ov = document.getElementById('pay-overlay'); if (ov) ov.remove();
    showToast('Payment successful — receipt sent to your email.');
    renderBilling();
  } catch (e) { showToast('Payment failed: ' + e.message); }
}

window.openPayment = openPayment;
window.submitPayment = submitPayment;
