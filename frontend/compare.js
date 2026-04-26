// ═══════════════════════════════════════════════════════════
//  EMPATHICA — Compare Page Logic
// ═══════════════════════════════════════════════════════════

'use strict';

let cmpTone = 'friendly';
let cmpBusy = false;

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const liveEl = document.getElementById('live-label');
  try {
    const r = await fetch('/health');
    const d = await r.json();
    if (liveEl) liveEl.textContent = d.device === 'cuda' ? 'GPU Active' : 'CPU Active';
  } catch { if (liveEl) liveEl.textContent = 'Offline'; }
});

// ── Tone selection ────────────────────────────────────────────
document.querySelectorAll('.tone-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tone-chip').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
    cmpTone = btn.dataset.tone;
  });
});

// ── Textarea char counter ─────────────────────────────────────
const cmpTextarea = document.getElementById('cmp-complaint');
const cmpCharEl   = document.getElementById('cmp-char-count');

cmpTextarea.addEventListener('input', () => {
  const n = cmpTextarea.value.length;
  cmpCharEl.textContent = `${n} / 512`;
  cmpCharEl.style.color = n > 480 ? '#B5234F' : '';
});

cmpTextarea.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runComparison();
});

// ── Example fill ──────────────────────────────────────────────
function cmpFillExample(el) {
  cmpTextarea.value = el.textContent.trim();
  cmpTextarea.dispatchEvent(new Event('input'));
  cmpTextarea.focus();
}

// ── State helpers ─────────────────────────────────────────────
function setCardState(prefix, state) {
  ['idle', 'processing', 'result'].forEach(s => {
    document.getElementById(`${prefix}-${s}`).classList.toggle('hidden', s !== state);
  });
}

const EMOTION_EMOJI = {
  anger: '😠', sadness: '😢', fear: '😨',
  joy: '😊', surprise: '😲', disgust: '🤢', neutral: '😐'
};

// ── Main comparison runner ────────────────────────────────────
async function runComparison() {
  if (cmpBusy) return;
  const complaint = cmpTextarea.value.trim();

  if (!complaint) {
    cmpTextarea.style.borderColor = 'var(--claret)';
    cmpTextarea.style.boxShadow   = '0 0 0 4px rgba(127,22,53,0.15)';
    cmpTextarea.focus();
    setTimeout(() => { cmpTextarea.style.borderColor = ''; cmpTextarea.style.boxShadow = ''; }, 1400);
    return;
  }

  cmpBusy = true;
  document.getElementById('cmp-btn').disabled = true;

  // Hide emotion row, show processing for both
  setCardState('base',  'processing');
  setCardState('tuned', 'processing');

  try {
    const res = await fetch('/compare-models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaint, tone: cmpTone }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Show emotion
    const emotion = (data.emotion || 'neutral').toLowerCase();
    const emojiEl = document.getElementById('badge-emotion-text');
    if (emojiEl) emojiEl.textContent = `${EMOTION_EMOJI[emotion] || ''} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`;

    // Render both results
    renderCard('base',  data.base_response);
    renderCard('tuned', data.tuned_response);

  } catch (err) {
    console.error(err);
    setCardState('base',  'idle');
    setCardState('tuned', 'idle');
    alert('Error: Could not reach the backend. Make sure uvicorn is running.');
  } finally {
    cmpBusy = false;
    document.getElementById('cmp-btn').disabled = false;
  }
}

function renderCard(prefix, text) {
  setCardState(prefix, 'result');
  const el = document.getElementById(`${prefix}-response-text`);
  el.textContent = '';
  let i = 0;
  const tick = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(tick);
  }, 16);
}
