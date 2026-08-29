import { icon } from './icons.js';
import { DB } from './state.js';

export function emptyState(title, sub) {
  return `<div style="text-align:center;padding:30px 10px;color:var(--ink-faint);">
    <div style="font-weight:600;color:var(--ink-soft);margin-bottom:4px;">${title}</div>
    <div style="font-size:13px;">${sub}</div>
  </div>`;
}

export function apptRow(a) {
  const doc = DB.doctors.find(d => d.id === a.doctorId);
  return `<div class="appt-row">
    <div class="date-chip"><div class="m">${a.date.split(' ')[0]}</div><div class="d">${a.date.split(' ')[1]}</div></div>
    <div class="info"><div class="t">${doc.name} <span class="pill-tag pill-teal" style="margin-left:6px;">${doc.specialty}</span></div><div class="s">${a.day} · ${a.time} · ${a.type}</div></div>
    <button class="btn btn-coral btn-sm" onclick="openCall('${a.doctorId}')">${icon('video',14)} Join</button>
    <button class="btn btn-ghost btn-sm" onclick="cancelAppointment('${a.id}')">Cancel</button>
  </div>`;
}

export function doctorCard(d) {
  return `<div class="doctor-card">
    <div class="head">
      <div class="avatar">${d.initials}</div>
      <div><div class="n">${d.name}</div><div class="sp">${d.specialty}</div>
        <div class="rating">${icon('star',13)} ${d.rating} <span style="color:var(--ink-faint);">(${d.reviews})</span></div>
      </div>
    </div>
    <div class="meta">${d.years} yrs experience · $${d.price} / visit</div>
    <div class="foot">
      <button class="btn btn-ghost btn-sm" onclick="openProfile('${d.id}')">View profile</button>
      <button class="btn btn-primary btn-sm" onclick="openProfile('${d.id}')">Book</button>
    </div>
  </div>`;
}
