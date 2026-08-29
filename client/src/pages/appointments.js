import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB, state } from '../state.js';
import { emptyState, apptRow } from '../helpers.js';
import { showToast } from '../components/toast.js';
import { switchTab } from '../components/sidebar.js';

export function renderAppointments() {
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar">
      <div><h1>Appointments</h1><p class="sub">Manage your upcoming and past visits.</p></div>
      <button class="btn btn-primary" onclick="switchTab('find')">${icon('plus',16)} Book new visit</button>
    </div>
    <div class="card">
      ${DB.patient.appointments.length ? DB.patient.appointments.map(a => apptRow(a)).join('') : emptyState('No appointments scheduled', 'Find a doctor to book your first visit.')}
    </div>
  `;
}

export async function cancelAppointment(id) {
  try {
    await api('/api/appointments/' + id, { method: 'DELETE' });
    DB.patient.appointments = DB.patient.appointments.filter(a => a.id !== id);
    showToast('Appointment cancelled.');
    switchTab(state.activeTab === 'dashboard' ? 'dashboard' : 'appointments');
  } catch (e) { showToast('Could not cancel: ' + e.message); }
}

window.cancelAppointment = cancelAppointment;
