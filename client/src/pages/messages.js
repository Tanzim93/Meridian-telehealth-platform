import { icon } from '../icons.js';
import { api } from '../api.js';
import { DB, state } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderMessages() {
  document.getElementById('tab-content').innerHTML = `
    <div class="topbar"><div><h1>Messages</h1><p class="sub">Secure messaging with your care team.</p></div></div>
    <div class="msg-shell">
      <div class="thread-list" id="thread-list"></div>
      <div class="chat-col">
        <div class="chat-head" id="chat-head"></div>
        <div class="chat-body" id="chat-body"></div>
        <div class="chat-input">
          <button class="icon-btn" title="Attach file" onclick="showToast('File attached (demo only).')">${icon('paperclip',16)}</button>
          <input id="chat-text" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMessage()"/>
          <button class="icon-btn" style="background:var(--teal-deep);color:#fff;border-color:var(--teal-deep);" onclick="sendMessage()">${icon('send',15)}</button>
        </div>
      </div>
    </div>
  `;
  renderThreadList();
  renderChat();
}

function renderThreadList() {
  const el = document.getElementById('thread-list');
  el.innerHTML = Object.keys(DB.patient.messages).map(did => {
    const doc = DB.doctors.find(d => d.id === did); if (!doc) return '';
    const thread = DB.patient.messages[did]; const last = thread[thread.length - 1];
    return `<div class="thread-item ${state.activeChat===did?'active':''}" onclick="selectThread('${did}')">
      <div class="avatar" style="width:36px;height:36px;font-size:13px;">${doc.initials}</div>
      <div style="min-width:0;"><div class="n">${doc.name}</div><div class="p">${last.from==='me'?'You: ':''}${last.text}</div></div>
    </div>`;
  }).join('');
}

function renderChat() {
  const doc = DB.doctors.find(d => d.id === state.activeChat);
  if (!doc) return;
  document.getElementById('chat-head').innerHTML = `<div class="avatar" style="width:34px;height:34px;font-size:12.5px;">${doc.initials}</div>
    <div><div style="font-size:13.5px;font-weight:600;">${doc.name}</div><div style="font-size:11.5px;color:var(--ink-faint);">${doc.specialty}</div></div>`;
  const body = document.getElementById('chat-body');
  const thread = DB.patient.messages[state.activeChat] || [];
  body.innerHTML = thread.map(m => `<div class="bubble ${m.from==='me'?'me':'them'}">${m.text}<span class="time">${m.time}</span></div>`).join('');
  body.scrollTop = body.scrollHeight;
}

export function selectThread(doctorId) {
  state.activeChat = doctorId;
  renderThreadList();
  renderChat();
}

export async function sendMessage() {
  const input = document.getElementById('chat-text');
  const text = input.value.trim();
  if (!text) return;
  if (!DB.patient.messages[state.activeChat]) DB.patient.messages[state.activeChat] = [];
  DB.patient.messages[state.activeChat].push({ from: 'me', text, time: 'Now' });
  input.value = '';
  renderChat();
  renderThreadList();
  try {
    await api('/api/messages/' + state.activeChat, { method: 'POST', body: JSON.stringify({ text }) });
    setTimeout(async () => {
      try {
        const messages = await api('/api/messages');
        DB.patient.messages = messages;
        if (state.activeTab === 'messages') { renderChat(); renderThreadList(); }
      } catch (e) { /* ignore */ }
    }, 1200);
  } catch (e) { showToast('Message failed to send: ' + e.message); }
}

window.selectThread = selectThread;
window.sendMessage = sendMessage;
window.showToast = showToast;
