import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderRecord() {
  const r = DB.patient.record;
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar"><div><h1>Health record</h1><p class="sub">Shared securely with every doctor you see on Meridian.</p></div></div>
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h2>Allergies</h2></div>
        <div class="record-list" id="allergy-list"></div>
        <div class="inline-add"><input id="allergy-input" placeholder="Add an allergy" onkeydown="if(event.key==='Enter')addAllergy()"/><button class="btn btn-ghost btn-sm" onclick="addAllergy()">${icon('plus',14)}</button></div>

        <div class="section-title" style="margin-top:22px;"><h2>Current medications</h2></div>
        <div class="record-list" id="med-list"></div>
        <div class="inline-add"><input id="med-input" placeholder="Add a medication" onkeydown="if(event.key==='Enter')addMedication()"/><button class="btn btn-ghost btn-sm" onclick="addMedication()">${icon('plus',14)}</button></div>
      </div>
      <div class="card">
        <div class="section-title"><h2>Conditions</h2></div>
        <div class="record-list">${r.conditions.map(c=>`<div class="record-item">${c}</div>`).join('')}</div>

        <div class="section-title" style="margin-top:22px;"><h2>Blood type</h2></div>
        <div class="record-item" style="justify-content:flex-start;gap:10px;"><span style="font-family:var(--font-mono);font-weight:600;">${r.bloodType}</span></div>

        <div class="section-title" style="margin-top:22px;"><h2>Documents</h2></div>
        <div class="record-list">
          ${r.documents.map(f=>`<div class="doc-thumb">${icon('file',16)}${f.name}</div>`).join('')}
          <button class="btn btn-ghost btn-sm btn-block" style="margin-top:6px;" onclick="uploadDoc()">${icon('plus',14)} Upload document</button>
        </div>
      </div>
    </div>
  `;
  renderAllergyList();
  renderMedList();
}

function renderAllergyList() {
  const list = DB.patient.record.allergies;
  document.getElementById('allergy-list').innerHTML = list.length ?
    list.map((a, i) => `<div class="record-item">${a}<button class="x" onclick="removeAllergy(${i})">${icon('close',13)}</button></div>`).join('') :
    `<div style="font-size:12.5px;color:var(--ink-faint);">No allergies on file.</div>`;
}

function renderMedList() {
  const list = DB.patient.record.medications;
  document.getElementById('med-list').innerHTML = list.length ?
    list.map((m, i) => `<div class="record-item">${m}<button class="x" onclick="removeMed(${i})">${icon('close',13)}</button></div>`).join('') :
    `<div style="font-size:12.5px;color:var(--ink-faint);">No medications on file.</div>`;
}

export async function addAllergy() {
  const input = document.getElementById('allergy-input'); const v = input.value.trim();
  if (!v) return;
  DB.patient.record = await api('/api/record/allergies', { method: 'POST', body: JSON.stringify({ value: v }) });
  input.value = ''; renderAllergyList(); showToast('Allergy added.');
}

export async function removeAllergy(i) {
  DB.patient.record = await api(`/api/record/allergies/${i}`, { method: 'DELETE' });
  renderAllergyList();
}

export async function addMedication() {
  const input = document.getElementById('med-input'); const v = input.value.trim();
  if (!v) return;
  DB.patient.record = await api('/api/record/medications', { method: 'POST', body: JSON.stringify({ value: v }) });
  input.value = ''; renderMedList(); showToast('Medication added.');
}

export async function removeMed(i) {
  DB.patient.record = await api(`/api/record/medications/${i}`, { method: 'DELETE' });
  renderMedList();
}

export async function uploadDoc() {
  DB.patient.record = await api('/api/record/documents', { method: 'POST', body: JSON.stringify({ value: 'New upload — ' + new Date().toLocaleDateString() + '.pdf' }) });
  renderRecord();
  showToast('Document uploaded (demo only).');
}

window.addAllergy = addAllergy;
window.removeAllergy = removeAllergy;
window.addMedication = addMedication;
window.removeMed = removeMed;
window.uploadDoc = uploadDoc;
