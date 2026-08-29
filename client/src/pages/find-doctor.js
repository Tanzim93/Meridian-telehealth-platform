import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB, state, SLOT_TIMES, SLOT_DAYS } from '../state.js';
import { emptyState, doctorCard } from '../helpers.js';
import { showToast } from '../components/toast.js';
import { switchTab } from '../components/sidebar.js';

export function renderFind() {
  const specialties = ['All', ...new Set(DB.doctors.map(d => d.specialty))];
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar">
      <div><h1>Find a doctor</h1><p class="sub">${DB.doctors.length} clinicians available across ${specialties.length-1} specialties.</p></div>
      <div class="search-box">${icon('search',16)}<input id="doc-search" placeholder="Search by name or specialty" value="${state.doctorSearch}" oninput="handleDoctorSearch(this.value)"/></div>
    </div>
    <div class="doctor-filters" id="doc-filters">
      ${specialties.map(s=>`<button class="chip ${state.doctorFilter===s?'active':''}" onclick="handleFilterChange('${s}')">${s}</button>`).join('')}
    </div>
    <div class="grid-3" id="doc-list"></div>
  `;
  renderFindList();
}

export function handleDoctorSearch(value) {
  state.doctorSearch = value;
  renderFindList();
}

export function handleFilterChange(specialty) {
  state.doctorFilter = specialty;
  renderFind();
}

function renderFindList() {
  const q = state.doctorSearch.toLowerCase();
  const list = DB.doctors.filter(d => (state.doctorFilter === 'All' || d.specialty === state.doctorFilter) && (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)));
  const el = document.getElementById('doc-list');
  el.innerHTML = list.length ? list.map(d => doctorCard(d)).join('') : emptyState('No doctors match your search', 'Try a different name or specialty.');
}

export function openProfile(id) {
  state.profileDoctorId = id;
  state.pendingSlot = null;
  const d = DB.doctors.find(x => x.id === id);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'profile-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) closeProfile(); };
  overlay.innerHTML = `<div class="modal">
    <button class="modal-close" onclick="closeProfile()">${icon('close',15)}</button>
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:6px;">
      <div class="avatar" style="width:56px;height:56px;font-size:19px;">${d.initials}</div>
      <div><h2 style="font-family:var(--font-display);font-size:20px;">${d.name}</h2>
      <div class="rating">${icon('star',13)} ${d.rating} (${d.reviews} reviews) · ${d.specialty}</div></div>
    </div>
    <p style="font-size:13.5px;color:var(--ink-soft);line-height:1.6;margin-top:12px;">${d.bio}</p>
    <div style="display:flex;gap:16px;margin-top:14px;font-size:12.5px;color:var(--ink-faint);">
      <span>${d.years} years experience</span><span>·</span><span>$${d.price} per visit</span>
    </div>
    <div style="margin-top:20px;">
      <div class="section-title"><h2>Choose a time</h2></div>
      <div id="slot-days"></div>
    </div>
    <button id="confirm-book-btn" class="btn btn-primary btn-block" style="margin-top:18px;" disabled onclick="confirmBooking()">Select a time to continue</button>
  </div>`;
  document.body.appendChild(overlay);
  renderSlotDays();
}

function renderSlotDays() {
  const el = document.getElementById('slot-days');
  if (!el) return;
  el.innerHTML = SLOT_DAYS.map((day, di) => `
    <div class="day-block">
      <div class="lbl">${day}</div>
      <div class="slot-grid">
        ${SLOT_TIMES.filter((_, i) => (i + di) % 4 !== 0).map(t => {
          const key = day + '|' + t;
          const sel = state.pendingSlot === key ? 'selected' : '';
          return `<button class="slot-btn ${sel}" onclick="pickSlot('${day}','${t}')">${t}</button>`;
        }).join('')}
      </div>
    </div>`).join('');
}

export function pickSlot(day, time) {
  state.pendingSlot = day + '|' + time;
  renderSlotDays();
  const btn = document.getElementById('confirm-book-btn');
  btn.disabled = false;
  btn.textContent = `Confirm ${day} at ${time}`;
}

export function closeProfile() {
  const el = document.getElementById('profile-overlay');
  if (el) el.remove();
}

export async function confirmBooking() {
  if (!state.pendingSlot) return;
  const [day, time] = state.pendingSlot.split('|');
  const dateLabel = day === 'Today' ? 'Aug 5' : day === 'Tomorrow' ? 'Aug 6' : 'Aug 7';
  try {
    const appt = await api('/api/appointments', { method: 'POST', body: JSON.stringify({ doctorId: state.profileDoctorId, day, date: dateLabel, time }) });
    DB.patient.appointments.unshift(appt);
    closeProfile();
    showToast('Appointment booked — see you then.');
    switchTab('appointments');
  } catch (e) { showToast('Could not book appointment: ' + e.message); }
}

window.handleDoctorSearch = handleDoctorSearch;
window.handleFilterChange = handleFilterChange;
window.openProfile = openProfile;
window.pickSlot = pickSlot;
window.closeProfile = closeProfile;
window.confirmBooking = confirmBooking;
