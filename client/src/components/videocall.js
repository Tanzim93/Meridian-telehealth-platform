import { icon } from '../icons.js';
import { DB, state } from '../state.js';
import { showToast } from './toast.js';

export function openCall(doctorId) {
  state.callDoctorId = doctorId;
  state.callSeconds = 0;
  state.micOn = true;
  state.camOn = true;
  const d = DB.doctors.find(x => x.id === doctorId);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'call-overlay';
  overlay.innerHTML = `<div class="call-modal">
    <div class="call-stage">
      <div class="call-timer"><span class="dot"></span><span id="call-timer-text">00:00</span></div>
      <div class="doc-avatar">${d.initials}</div>
      <div class="call-self">You</div>
    </div>
    <div style="text-align:center;padding-top:14px;color:#DDEDE8;font-size:13.5px;">${d.name} · ${d.specialty}</div>
    <div class="call-controls">
      <button class="call-btn" id="mic-btn" onclick="toggleMic()">${icon('mic',18)}</button>
      <button class="call-btn" id="cam-btn" onclick="toggleCam()">${icon('video',18)}</button>
      <button class="call-btn end" onclick="closeCall()">${icon('phoneOff',20)}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  state.callTimerHandle = setInterval(() => {
    state.callSeconds++;
    const m = String(Math.floor(state.callSeconds / 60)).padStart(2, '0');
    const s = String(state.callSeconds % 60).padStart(2, '0');
    const el = document.getElementById('call-timer-text');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

export function toggleMic() {
  state.micOn = !state.micOn;
  const btn = document.getElementById('mic-btn');
  btn.classList.toggle('active-off', !state.micOn);
  btn.innerHTML = state.micOn ? icon('mic', 18) : icon('micOff', 18);
}

export function toggleCam() {
  state.camOn = !state.camOn;
  const btn = document.getElementById('cam-btn');
  btn.classList.toggle('active-off', !state.camOn);
  btn.innerHTML = state.camOn ? icon('video', 18) : icon('camOff', 18);
}

export function closeCall() {
  clearInterval(state.callTimerHandle);
  const el = document.getElementById('call-overlay'); if (el) el.remove();
  showToast('Call ended.');
}

window.openCall = openCall;
window.toggleMic = toggleMic;
window.toggleCam = toggleCam;
window.closeCall = closeCall;
