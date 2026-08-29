// Entry point. Importing each module runs its top-level code, which
// registers the functions referenced by inline onclick="" handlers
// onto window (see the bottom of each page/component file).
import './pages/auth.js';
import './components/sidebar.js';
import './pages/dashboard.js';
import './pages/find-doctor.js';
import './pages/appointments.js';
import './pages/messages.js';
import './pages/record.js';
import './pages/prescriptions.js';
import './pages/billing.js';
import './pages/profile.js';
import './components/videocall.js';

import { resumeSession } from './pages/auth.js';

window.addEventListener('DOMContentLoaded', () => {
  resumeSession();
});
