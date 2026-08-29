import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderPrescriptions() {
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar"><div><h1>Prescriptions</h1><p class="sub">E-prescriptions sent directly to your pharmacy.</p></div></div>
    <div class="card">
      ${DB.patient.prescriptions.map(p => `
        <div class="rx-row">
          <div class="rx-icon">${icon('pill',18)}</div>
          <div class="info"><div class="t">${p.name}</div><div class="s">${p.doctor} · ${p.instructions}</div></div>
          <span class="pill-tag ${p.status==='Active'?'pill-teal':'pill-gray'}">${p.status}</span>
          ${p.status==='Active' ? `<button class="btn btn-ghost btn-sm" ${p.refillsLeft<1?'disabled':''} onclick="requestRefill('${p.id}')">${p.refillsLeft>0?'Request refill ('+p.refillsLeft+' left)':'No refills left'}</button>` : ''}
        </div>`).join('')}
    </div>
  `;
}

export async function requestRefill(id) {
  try {
    const rx = await api(`/api/prescriptions/${id}/refill`, { method: 'POST' });
    const local = DB.patient.prescriptions.find(p => p.id === id);
    if (local) local.refillsLeft = rx.refillsLeft;
    showToast(`Refill requested for ${rx.name}.`);
    renderPrescriptions();
  } catch (e) { showToast('Refill failed: ' + e.message); }
}

window.requestRefill = requestRefill;
