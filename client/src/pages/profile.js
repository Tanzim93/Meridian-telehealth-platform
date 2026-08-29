import { api } from '../api.js';
import { DB } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderProfile() {
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar"><div><h1>Profile</h1><p class="sub">Keep your details current so your care team can reach you.</p></div></div>
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h2>Personal details</h2></div>
        <div class="field"><label>Full name</label><input id="pf-name" value="${DB.patient.name}"/></div>
        <div class="field"><label>Email</label><input id="pf-email" value="${DB.patient.email}"/></div>
        <div class="field"><label>Phone</label><input id="pf-phone" value="${DB.patient.phone}"/></div>
        <div class="field"><label>Insurance provider</label><input id="pf-ins" placeholder="e.g. BlueCross BlueShield" value="BlueCross BlueShield"/></div>
        <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
      </div>
      <div class="card">
        <div class="section-title"><h2>Notification preferences</h2></div>
        ${['Appointment reminders','New messages from doctors','Prescription refill status','Billing receipts'].map((l,i)=>`
          <label style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line-soft);font-size:13.5px;">
            ${l} <input type="checkbox" ${i<3?'checked':''} style="width:17px;height:17px;accent-color:#1F7A6C;"/>
          </label>`).join('')}
      </div>
    </div>
  `;
}

export async function saveProfile() {
  const name = document.getElementById('pf-name').value.trim();
  const email = document.getElementById('pf-email').value.trim();
  const phone = document.getElementById('pf-phone').value.trim();
  try {
    DB.patient = { ...DB.patient, ...(await api('/api/profile', { method: 'PUT', body: JSON.stringify({ name, email, phone }) })) };
    document.getElementById('foot-name').textContent = DB.patient.name;
    showToast('Profile updated.');
  } catch (e) { showToast('Update failed: ' + e.message); }
}

window.saveProfile = saveProfile;
