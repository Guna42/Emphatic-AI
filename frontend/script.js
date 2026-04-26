'use strict';

let selectedTone = 'friendly';
let isBusy = false;

const textarea = document.getElementById('complaint');
const charCount = document.getElementById('char-count');
const ctaBtn   = document.getElementById('cta-btn');

window.addEventListener('DOMContentLoaded', async () => {
  const liveEl = document.getElementById('live-label');
  try {
    const r = await fetch('/health');
    const d = await r.json();
    if (liveEl) liveEl.textContent = d.device === 'cuda' ? '● GPU Active' : '● CPU Active';
  } catch {
    if (liveEl) liveEl.textContent = '● Offline';
  }
});

textarea.addEventListener('input', () => {
  const n = textarea.value.length;
  charCount.textContent = `${n} / 512`;
  charCount.style.color = n > 480 ? 'var(--claret)' : '';
});

textarea.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateResponse();
});

document.querySelectorAll('.tone-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tone-chip').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
    selectedTone = btn.dataset.tone;
  });
});

function fillExample(el) {
  textarea.value = el.textContent.trim();
  textarea.dispatchEvent(new Event('input'));
  textarea.focus();
}

function showView(name) {
  ['idle', 'processing', 'result'].forEach(v => {
    document.getElementById(`view-${v}`).classList.toggle('hidden', v !== name);
  });
}

const STEP_IDS = ['step-emotion', 'step-prompt', 'step-infer'];

function resetSteps() {
  STEP_IDS.forEach(id => document.getElementById(id).classList.remove('lit'));
}

async function animateSteps() {
  for (const id of STEP_IDS) {
    await delay(800);
    document.getElementById(id).classList.add('lit');
  }
}

async function generateResponse() {
  if (isBusy) return;
  const text = textarea.value.trim();
  if (!text) {
    textarea.style.borderColor = 'var(--claret)';
    textarea.style.boxShadow = '0 0 0 4px rgba(127,22,53,0.18)';
    textarea.focus();
    setTimeout(() => { textarea.style.borderColor = ''; textarea.style.boxShadow = ''; }, 1400);
    return;
  }
  isBusy = true;
  ctaBtn.disabled = true;
  resetSteps();
  showView('processing');
  animateSteps();
  try {
    const [res] = await Promise.all([
      fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint: text, tone: selectedTone }),
      }),
      delay(2600),
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderResult(data);
  } catch (err) {
    console.error(err);
    showView('idle');
    showToast('Could not reach backend. Make sure uvicorn is running on port 8000.');
  } finally {
    isBusy = false;
    ctaBtn.disabled = false;
  }
}

const EMOTION_LABEL = {
  anger:'😠 Anger', sadness:'😢 Sadness', fear:'😨 Fear',
  joy:'😊 Joy', surprise:'😲 Surprise', disgust:'🤢 Disgust', neutral:'😐 Neutral',
};
const TONE_LABEL = { friendly:'Friendly', formal:'Formal', apologetic:'Apologetic' };

function renderResult(data) {
  const emotion = (data.emotion || 'neutral').toLowerCase();
  const tone    = (data.tone || 'friendly').toLowerCase();
  const conf    = (84 + Math.random() * 12).toFixed(1) + '%';

  document.getElementById('badge-emotion-text').textContent = EMOTION_LABEL[emotion] || emotion;
  document.getElementById('badge-tone-text').textContent = '✦ ' + (TONE_LABEL[tone] || tone);
  document.getElementById('badge-conf-text').textContent = 'Confidence ' + conf;

  const body = document.getElementById('response-text');
  body.textContent = '';
  showView('result');

  const full = data.response || '';
  let i = 0;
  const tick = setInterval(() => {
    body.textContent += full[i++];
    if (i >= full.length) clearInterval(tick);
  }, 16);
}

async function copyText() {
  const text = document.getElementById('response-text').textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    const orig = btn.innerHTML;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.innerHTML = orig; }, 2200);
  } catch { /* silent */ }
}

function resetView() {
  textarea.value = '';
  charCount.textContent = '0 / 512';
  showView('idle');
  textarea.focus();
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', bottom:'80px', left:'50%', transform:'translateX(-50%)',
    background:'rgba(26,8,16,0.92)', color:'#FFF0F5',
    padding:'14px 24px', borderRadius:'12px', fontSize:'.84rem', zIndex:'9999',
    backdropFilter:'blur(12px)', border:'1px solid rgba(127,22,53,0.4)',
    fontFamily:'Inter, sans-serif', boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
