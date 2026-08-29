import { icon } from '../icons.js';
import { state, NAV_ITEMS } from '../state.js';
import { renderDashboard } from '../pages/dashboard.js';
import { renderFind } from '../pages/find-doctor.js';
import { renderAppointments } from '../pages/appointments.js';
import { renderMessages } from '../pages/messages.js';
import { renderRecord } from '../pages/record.js';
import { renderPrescriptions } from '../pages/prescriptions.js';
import { renderBilling } from '../pages/billing.js';
import { renderProfile } from '../pages/profile.js';

const RENDER_MAP = {
  dashboard: renderDashboard,
  find: renderFind,
  appointments: renderAppointments,
  messages: renderMessages,
  record: renderRecord,
  prescriptions: renderPrescriptions,
  billing: renderBilling,
  profile: renderProfile,
};

export function renderSideNav() {
  const nav = document.getElementById('side-nav');
  nav.innerHTML = NAV_ITEMS.map(item => {
    const badge = item.id === 'messages' ? '<span class="badge">2</span>' : '';
    return `<button class="${state.activeTab === item.id ? 'active' : ''}" onclick="switchTab('${item.id}')">${icon(item.icon)}<span class="label-text">${item.label}</span>${badge}</button>`;
  }).join('');
}

export function switchTab(tab) {
  state.activeTab = tab;
  renderSideNav();
  (RENDER_MAP[tab] || renderDashboard)();
}

window.switchTab = switchTab;
