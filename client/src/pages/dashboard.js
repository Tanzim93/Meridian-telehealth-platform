import { icon } from '../icons.js';
import { DB, state } from '../state.js';
import { emptyState, apptRow, doctorCard } from '../helpers.js';
import { switchTab } from '../components/sidebar.js';

export function renderDashboard() {
  const first = (DB.patient.name || 'there').split(' ')[0];
  const next = DB.patient.appointments[0];
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar">
      <div><h1>Welcome back, ${first}</h1><p class="sub">Here's what's happening with your care.</p></div>
      <button class="btn btn-primary" onclick="switchTab('find')">${icon('plus',16)} Book a visit</button>
    </div>
    <div class="grid-3" style="margin-bottom:20px;">
      <div class="stat-card"><div class="k">Upcoming visits</div><div class="v">${DB.patient.appointments.length}</div><div class="d">${next ? next.day+' at '+next.time : 'Nothing scheduled'}</div></div>
      <div class="stat-card"><div class="k">Active prescriptions</div><div class="v">${DB.patient.prescriptions.filter(p=>p.status==='Active').length}</div><div class="d">${DB.patient.prescriptions.filter(p=>p.status==='Active').map(p=>p.name).join(', ')||'None active'}</div></div>
      <div class="stat-card"><div class="k">Outstanding balance</div><div class="v">$${DB.patient.invoices.filter(i=>i.status==='Unpaid').reduce((s,i)=>s+i.amount,0)}</div><div class="d">${DB.patient.invoices.filter(i=>i.status==='Unpaid').length} unpaid invoice(s)</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="section-title"><h2>Upcoming appointments</h2><button class="link" onclick="switchTab('appointments')">View all</button></div>
        ${DB.patient.appointments.length ? DB.patient.appointments.map(a=>apptRow(a)).join('') : emptyState('No appointments yet','Book your first visit to get started.')}
      </div>
      <div class="card">
        <div class="section-title"><h2>Recent messages</h2><button class="link" onclick="switchTab('messages')">Open inbox</button></div>
        ${Object.keys(DB.patient.messages).map(did=>{
          const doc = DB.doctors.find(d=>d.id===did); if(!doc) return '';
          const thread = DB.patient.messages[did]; const last = thread[thread.length-1];
          return `<div class="thread-item" style="cursor:pointer;border-radius:10px;" onclick="openThreadFromDashboard('${did}')">
            <div class="avatar" style="width:36px;height:36px;font-size:13px;">${doc.initials}</div>
            <div style="min-width:0;"><div class="n">${doc.name}</div><div class="p">${last.from==='me'?'You: ':''}${last.text}</div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div style="margin-top:20px;" class="card">
      <div class="section-title"><h2>Continue with your care team</h2></div>
      <div class="grid-3">
        ${DB.doctors.slice(0,3).map(d=>doctorCard(d)).join('')}
      </div>
    </div>
  `;
}

function openThreadFromDashboard(doctorId) {
  state.activeChat = doctorId;
  switchTab('messages');
}

window.openThreadFromDashboard = openThreadFromDashboard;
