/* =====================================================
   TOKENTRUST V2 — script.js
   Data Economy Infrastructure Platform
   ===================================================== */

/* ──────────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────────── */
const allNavBtns = document.querySelectorAll('[data-section]');
const allPages   = document.querySelectorAll('.page');
let countUpFired = false;

function switchTo(target) {
  allNavBtns.forEach(b => b.classList.toggle('active', b.dataset.section === target));
  allPages.forEach(p => p.classList.remove('page--active'));
  const el = document.getElementById(`section-${target}`);
  if (el) el.classList.add('page--active');

  if (target === 'dashboard' && !countUpFired) {
    countUpFired = true;
    setTimeout(runCountUps, 200);
  }
}

allNavBtns.forEach(b =>
  b.addEventListener('click', e => { e.preventDefault(); switchTo(b.dataset.section); })
);

/* ──────────────────────────────────────────
   COUNT-UP ANIMATION
   ────────────────────────────────────────── */
function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

function countUp(el, target, decimals, duration) {
  const start = performance.now();
  const tick  = now => {
    const p = Math.min((now - start) / duration, 1);
    const v = target * easeOutExpo(p);
    el.textContent = decimals > 0
      ? v.toFixed(decimals)
      : Math.floor(v).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function runCountUps() {
  const balEl = document.getElementById('counter-balance');
  const dqiEl = document.getElementById('counter-dqi');
  const bar   = document.getElementById('dqi-fill');

  if (balEl) countUp(balEl, 1450, 0, 2200);
  if (dqiEl) countUp(dqiEl, 94.2, 1, 2200);
  if (bar)   setTimeout(() => { bar.style.width = '94.2%'; }, 120);
}

/* ──────────────────────────────────────────
   PRIVACY SLIDER — Extended with Compliance Layer
   ────────────────────────────────────────── */
const PRIVACY_STATES = [
  {
    mode:            'Strict Mode',
    tag:             'Protected',
    tagCls:          'tag--gray',
    ledCls:          'strict',
    complianceLevel: 'Maximum Protection',
    regulatoryMode:  'PIPEDA Tier 1 — Zero Disclosure',
    desc:            'Zero-Knowledge Proof is fully active. No raw data is ever transmitted. Your privacy is completely protected — reward generation is disabled in this mode.',
    reward:          '0×',
    data:            'None',
    zk:              'Full ZK',
    enc:             'AES-256',
  },
  {
    mode:            'Balanced Mode',
    tag:             'Active',
    tagCls:          '',
    ledCls:          'balanced',
    complianceLevel: 'Standard Compliance',
    regulatoryMode:  'PIPEDA Tier 2 — Anonymized',
    desc:            'Anonymized behavioral data is shared with selected AI partners. Sensitive data (SSN, medical, financial) is always encrypted and never exposed.',
    reward:          '1.0×',
    data:            'Behavioral',
    zk:              'Partial',
    enc:             'AES-256',
  },
  {
    mode:            'Open Mode',
    tag:             'Max Earnings',
    tagCls:          'tag--green',
    ledCls:          'open',
    complianceLevel: 'Expanded Disclosure',
    regulatoryMode:  'PIPEDA Tier 3 — Pseudonymized',
    desc:            'Full data contribution enabled. Your data maximally supports AI training pipelines. Identity is pseudonymized, behavioral patterns are fully available.',
    reward:          '2.5×',
    data:            'Full',
    zk:              'None',
    enc:             'AES-256',
  },
];

const slider  = document.getElementById('privacy-slider');
const stepEls = document.querySelectorAll('.priv-step');

function fadeSet(id, txt) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = txt; el.style.opacity = '1'; }, 180);
}

function applyPrivacy(val) {
  const cfg = PRIVACY_STATES[val];

  stepEls.forEach((el, i) => el.classList.toggle('priv-step--active', i === val));

  fadeSet('node-mode',       cfg.mode);
  fadeSet('node-desc',       cfg.desc);
  fadeSet('ns-reward',       cfg.reward);
  fadeSet('ns-data',         cfg.data);
  fadeSet('ns-zk',           cfg.zk);
  fadeSet('ns-enc',          cfg.enc);
  fadeSet('ns-compliance',   cfg.complianceLevel);
  fadeSet('ns-regmode',      cfg.regulatoryMode);

  const tagEl = document.getElementById('node-tag');
  if (tagEl) { tagEl.textContent = cfg.tag; tagEl.className = `node-status__tag ${cfg.tagCls}`; }

  const led = document.getElementById('node-led');
  if (led) led.className = `node-status__led ${cfg.ledCls}`;

  const pct = (val / 2) * 100;
  if (slider) {
    slider.style.background =
      `linear-gradient(to right, #2563EB ${pct}%, #E5E7EB ${pct}%)`;
  }
}

if (slider) {
  slider.addEventListener('input', e => applyPrivacy(+e.target.value));
  applyPrivacy(1);
}

stepEls.forEach((el, i) =>
  el.addEventListener('click', () => {
    if (slider) { slider.value = i; applyPrivacy(i); }
  })
);

/* ──────────────────────────────────────────
   HELPER: icon cell HTML
   ────────────────────────────────────────── */
const SVG_MAP = {
  claude:      './claude.svg',
  gemini:      './gemini.svg',
  openai:      './openai.svg',
  grok:        './grok.svg',
  mistral:     './mistral.svg',
  cohere:      './cohere.svg',
  huggingface: './huggingface.svg',
};

function iconHTML(key, label, size = 22) {
  if (SVG_MAP[key]) {
    return `<img src="${SVG_MAP[key]}" alt="${label}" width="${size}" height="${size}" style="display:block">`;
  }
  return label.slice(0, 2);
}

/* ──────────────────────────────────────────
   TOKEN SOURCE DATA
   Data types, DQI breakdown, reward logic per partner
   ────────────────────────────────────────── */
const TOKEN_SOURCE_DATA = {
  claude: {
    sourceType:        'Behavioral Data',
    dqiImpact:         '+12%',
    contributionLabel: 'Session Data',
    dataTypes:         ['Session Behavior', 'Query Patterns', 'Response Feedback', 'Interaction Depth'],
    dqiBreakdown:      { Accuracy: 96, Completeness: 91, Consistency: 88, Timeliness: 94 },
    multiplier:        2.74,
    monthlyEarnings:   842,
    allocation:        58,
  },
  gemini: {
    sourceType:        'Preference Data',
    dqiImpact:         '+7%',
    contributionLabel: 'Preference Data',
    dataTypes:         ['Search Preferences', 'Content Ratings', 'Topic Affinity', 'Language Patterns'],
    dqiBreakdown:      { Accuracy: 89, Completeness: 85, Consistency: 90, Timeliness: 87 },
    multiplier:        1.32,
    monthlyEarnings:   391,
    allocation:        27,
  },
  openai: {
    sourceType:        'Usage Patterns',
    dqiImpact:         '−3%',
    contributionLabel: 'Usage Data',
    dataTypes:         ['API Usage Patterns', 'Prompt Structure', 'Context Length', 'Task Category'],
    dqiBreakdown:      { Accuracy: 82, Completeness: 78, Consistency: 85, Timeliness: 80 },
    multiplier:        1.05,
    monthlyEarnings:   217,
    allocation:        15,
  },
  grok: {
    sourceType:        'Reasoning Patterns',
    dqiImpact:         '−8%',
    contributionLabel: 'Reasoning Data',
    dataTypes:         ['Reasoning Steps', 'Problem Structure', 'Inference Chains', 'Logic Traces'],
    dqiBreakdown:      { Accuracy: 79, Completeness: 74, Consistency: 82, Timeliness: 77 },
    multiplier:        0.98,
    monthlyEarnings:   142,
    allocation:        10,
  },
  mistral: {
    sourceType:        'Fine-tuning Data',
    dqiImpact:         '−12%',
    contributionLabel: 'Training Data',
    dataTypes:         ['Task Examples', 'Domain Expertise', 'Quality Ratings', 'Edge Cases'],
    dqiBreakdown:      { Accuracy: 76, Completeness: 72, Consistency: 79, Timeliness: 74 },
    multiplier:        0.88,
    monthlyEarnings:   128,
    allocation:        9,
  },
  cohere: {
    sourceType:        'Enterprise NLP',
    dqiImpact:         '−15%',
    contributionLabel: 'Enterprise Data',
    dataTypes:         ['Document Structure', 'Query Intent', 'Entity Recognition', 'Semantic Tags'],
    dqiBreakdown:      { Accuracy: 74, Completeness: 70, Consistency: 76, Timeliness: 72 },
    multiplier:        0.74,
    monthlyEarnings:   98,
    allocation:        7,
  },
  huggingface: {
    sourceType:        'Research Data',
    dqiImpact:         '−18%',
    contributionLabel: 'Open Research',
    dataTypes:         ['Model Evaluations', 'Benchmark Results', 'Dataset Annotations', 'Error Analysis'],
    dqiBreakdown:      { Accuracy: 71, Completeness: 68, Consistency: 73, Timeliness: 69 },
    multiplier:        0.65,
    monthlyEarnings:   72,
    allocation:        5,
  },
};

/* ──────────────────────────────────────────
   DESTINATIONS (Data Flow) — Extended
   ────────────────────────────────────────── */
const DESTINATIONS = [
  {
    key: 'claude',  label: 'Claude',  name: 'Anthropic Claude', type: 'LLM Training',
    reward: '2.74×', valueReceived: '12.4 TKTR', dqiWeight: 0.92,
    demandMultiplier: '×2.74', flowDirection: 'sent',
    tokenPath: ['User Node', 'ZK Layer', 'Claude Pipeline'],
    crossPlatformChange: '+18.2%', demandLevel: 'High',
  },
  {
    key: 'gemini',  label: 'Gemini',  name: 'Google Gemini', type: 'Behavioral Analysis',
    reward: '1.32×', valueReceived: '5.9 TKTR', dqiWeight: 0.88,
    demandMultiplier: '×1.32', flowDirection: 'sent',
    tokenPath: ['User Node', 'ZK Layer', 'Gemini Analysis'],
    crossPlatformChange: '+4.1%', demandLevel: 'Medium',
  },
  {
    key: 'openai',  label: 'OpenAI',  name: 'OpenAI GPT-4o', type: 'Usage Patterns',
    reward: '1.05×', valueReceived: '3.1 TKTR', dqiWeight: 0.81,
    demandMultiplier: '×1.05', flowDirection: 'received',
    tokenPath: ['User Node', 'ZK Layer', 'OpenAI Pipeline'],
    crossPlatformChange: '−2.3%', demandLevel: 'Medium',
  },
  {
    key: 'grok',    label: 'Grok',    name: 'xAI Grok', type: 'Reasoning Patterns',
    reward: '0.98×', valueReceived: '2.0 TKTR', dqiWeight: 0.77,
    demandMultiplier: '×0.98', flowDirection: 'received',
    tokenPath: ['User Node', 'ZK Layer', 'xAI Grok'],
    crossPlatformChange: '−5.7%', demandLevel: 'Low',
  },
  {
    key: 'mistral', label: 'Mistral', name: 'Mistral AI', type: 'Fine-tuning',
    reward: '0.88×', valueReceived: '1.8 TKTR', dqiWeight: 0.74,
    demandMultiplier: '×0.88', flowDirection: 'sent',
    tokenPath: ['User Node', 'Anonymizer', 'Mistral Fine-tune'],
    crossPlatformChange: '+1.2%', demandLevel: 'Low',
  },
  {
    key: 'cohere',  label: 'Cohere',  name: 'Cohere', type: 'Enterprise NLP',
    reward: '0.74×', valueReceived: '1.4 TKTR', dqiWeight: 0.71,
    demandMultiplier: '×0.74', flowDirection: 'sent',
    tokenPath: ['User Node', 'Anonymizer', 'Cohere NLP'],
    crossPlatformChange: '+0.8%', demandLevel: 'Low',
  },
  {
    key: 'huggingface', label: 'HF', name: 'Hugging Face', type: 'Open Research',
    reward: '0.65×', valueReceived: '1.1 TKTR', dqiWeight: 0.68,
    demandMultiplier: '×0.65', flowDirection: 'sent',
    tokenPath: ['User Node', 'Open Layer', 'HF Research'],
    crossPlatformChange: '−1.4%', demandLevel: 'Low',
  },
];

function buildDestinations() {
  const grid = document.getElementById('dest-grid');
  if (!grid) return;

  grid.innerHTML = DESTINATIONS.map(d => `
    <div class="dest-card" data-key="${d.key}" style="cursor:pointer">
      <div class="dest-card__flow-label">
        <span class="flow-direction flow-direction--${d.flowDirection}">
          ${d.flowDirection === 'sent' ? '↑ Value sent to' : '↓ Value returned from'}
        </span>
      </div>
      <div class="dest-card__top">
        <div class="dest-card__icon">${iconHTML(d.key, d.label, 22)}</div>
        <div>
          <p class="dest-card__name">${d.name}</p>
          <p class="dest-card__type">${d.type}</p>
        </div>
      </div>
      <div class="dest-card__metrics">
        <div class="dest-metric">
          <span class="dest-metric__label">Value</span>
          <span class="dest-metric__val">${d.valueReceived}</span>
        </div>
        <div class="dest-metric">
          <span class="dest-metric__label">DQI Weight</span>
          <span class="dest-metric__val">${(d.dqiWeight * 100).toFixed(0)}%</span>
        </div>
        <div class="dest-metric">
          <span class="dest-metric__label">Demand</span>
          <span class="dest-metric__val dest-demand--${d.demandLevel.toLowerCase()}">${d.demandLevel}</span>
        </div>
      </div>
      <div class="dest-card__foot">
        <div class="dest-card__status">
          <span class="dest-card__dot"></span>
          Active
        </div>
        <span class="dest-card__reward">${d.reward}</span>
      </div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────
   RECENT TRANSFERS
   ────────────────────────────────────────── */
const TIMES = ['2h ago', '5h ago', '11h ago', '18h ago', '1d ago', '2d ago'];

function buildTransfers() {
  const list = document.getElementById('transfer-list');
  if (!list) return;

  list.innerHTML = DESTINATIONS.slice(0, 6).map((d, i) => `
    <div class="transfer-item">
      <div class="transfer-icon">${iconHTML(d.key, d.label, 18)}</div>
      <div class="transfer-body">
        <p class="transfer-to">${d.name}</p>
        <p class="transfer-sub">${d.flowDirection === 'sent' ? 'Value sent to' : 'Value returned from'} · ${d.type}</p>
      </div>
      <div class="transfer-right">
        <p class="transfer-amt">${d.valueReceived}</p>
        <p class="transfer-time">${TIMES[i]}</p>
      </div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────
   TRANSACTION TABLE — Extended with Return Context
   ────────────────────────────────────────── */
const TX_SOURCES = [
  { key: 'claude',      label: 'Claude',  name: 'Anthropic Claude' },
  { key: 'gemini',      label: 'Gemini',  name: 'Google Gemini'    },
  { key: 'openai',      label: 'OpenAI',  name: 'OpenAI GPT-4o'    },
  { key: 'grok',        label: 'Grok',    name: 'xAI Grok'         },
  { key: 'mistral',     label: 'Mistral', name: 'Mistral AI'       },
  { key: 'cohere',      label: 'Cohere',  name: 'Cohere'           },
  { key: 'huggingface', label: 'HF',      name: 'Hugging Face'     },
];

const TX_TYPES = [
  'Data Contribution', 'Research Session',
  'Behavioral Log', 'Fine-tuning', 'Preference Data',
];

const TX_TAGS = [
  'REINVESTED', 'REINVESTED', 'REFUND',      'REINVESTED', 'REFUND',
  'REINVESTED', 'REINVESTED', 'REFUND',      'REINVESTED', 'REINVESTED',
  'REFUND',     'REINVESTED', 'REINVESTED',  'REFUND',     'REINVESTED',
  'REINVESTED', 'REFUND',     'REINVESTED',  'REINVESTED', 'REFUND',
];

const REFUND_REASONS = [
  'Low DQI Score', 'High Demand Realloc',
  'Partner Redistribution', 'Quality Flag', 'Network Rebalance',
];

const RETENTION_RATES = [94, 87, 82, 96, 91, 78, 88, 95, 84, 90,
                          93, 86, 79, 97, 85, 81, 92, 88, 76, 94];

const REALLOC_TARGETS = [
  'Claude', 'Gemini', 'Open Pool', 'Claude',  'GPT-4o',
  'Claude', 'Gemini', 'Open Pool', 'Claude',  'GPT-4o',
  'Claude', 'Gemini', 'Open Pool', 'Claude',  'GPT-4o',
  'Claude', 'Gemini', 'Open Pool', 'Claude',  'Claude',
];

const TX_AMOUNTS = [2.4, 3.1, 0.8, 4.7, 1.9, 2.2, 3.8, 1.4, 5.1, 2.9,
                    0.6, 3.4, 4.2, 1.7, 2.8, 3.6, 1.1, 2.5, 4.8, 0.9];

function buildTransactions() {
  const tbody = document.getElementById('tx-tbody');
  if (!tbody) return;

  const base = new Date('2026-05-12');
  let html = '';

  for (let i = 0; i < 20; i++) {
    const d        = new Date(base);
    d.setDate(d.getDate() - i * 3);
    const date     = d.toISOString().slice(0, 10);
    const src      = TX_SOURCES[i % TX_SOURCES.length];
    const type     = TX_TYPES[i % TX_TYPES.length];
    const done     = i >= 4;
    const tag      = TX_TAGS[i];
    const reason   = REFUND_REASONS[i % REFUND_REASONS.length];
    const retained = RETENTION_RATES[i];
    const realloc  = REALLOC_TARGETS[i];
    const amount   = TX_AMOUNTS[i];
    const tagCls   = tag === 'REFUND' ? 'tx-tag--refund' : 'tx-tag--reinvested';

    const pill = done
      ? `<span class="tx-pill tx-pill--done">Complete</span>`
      : `<span class="tx-pill tx-pill--pend">Pending</span>`;

    const txPayload = JSON.stringify({ date, src: src.name, type, reason, retained, realloc, amount, tag });

    html += `<tr class="tx-row" data-tx='${txPayload}' style="cursor:pointer">
      <td style="color:var(--text-2)">${date}</td>
      <td>
        <div class="tx-cell">
          <div class="tx-avatar">${iconHTML(src.key, src.label, 16)}</div>
          <div>
            <span style="display:block">${src.name}</span>
            <span class="tx-tag ${tagCls}">${tag}</span>
          </div>
        </div>
      </td>
      <td>
        <span style="display:block; color:var(--text-2)">${type}</span>
        <span class="tx-reason">${reason}</span>
      </td>
      <td style="text-align:right">
        <span style="display:block; font-weight:600; color:var(--text-1)">${amount.toFixed(1)} TKTR</span>
        <span class="tx-retention">${retained}% retained</span>
        <span class="tx-realloc">→ ${realloc}</span>
      </td>
      <td style="text-align:right">${pill}</td>
    </tr>`;
  }

  tbody.innerHTML = html;
}

/* ──────────────────────────────────────────
   EARNING SOURCE LAYER (Dashboard)
   Shows per-token data source, DQI impact, contribution type
   ────────────────────────────────────────── */
const DASHBOARD_TOKENS = [
  { key: 'claude', name: 'Claude'  },
  { key: 'gemini', name: 'Gemini'  },
  { key: 'openai', name: 'GPT-4o'  },
];

function buildEarningSourceLayer() {
  const el = document.getElementById('earning-source-layer');
  if (!el) return;

  const rows = DASHBOARD_TOKENS.map(t => {
    const src     = TOKEN_SOURCE_DATA[t.key];
    const dqiCls  = src.dqiImpact.startsWith('+') ? 'dqi-impact--up' : 'dqi-impact--dn';
    return `
      <div class="esl-row" data-key="${t.key}" title="Click for data source detail">
        <div class="esl-row__left">
          <div class="ai-avatar esl-avatar">${iconHTML(t.key, t.name, 16)}</div>
          <div>
            <span class="esl-name">${t.name}</span>
            <span class="esl-contribution">${src.contributionLabel}</span>
          </div>
        </div>
        <div class="esl-row__mid">
          <span class="esl-src-type">${src.sourceType}</span>
        </div>
        <div class="esl-row__right">
          <span class="dqi-impact ${dqiCls}">${src.dqiImpact} DQI</span>
          <span class="esl-alloc">${src.allocation}% of portfolio</span>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="card card--table esl-card">
      <div class="card__header">
        <div class="card__header-left">
          <h2 class="card__title">Earning Source Layer</h2>
          <span class="chip">Data → Value</span>
        </div>
        <span class="esl-note">Click any row to inspect data source</span>
      </div>
      <div class="esl-head">
        <span>Token</span>
        <span>Source Type</span>
        <span style="text-align:right">DQI Impact · Allocation</span>
      </div>
      <div class="esl-body">${rows}</div>
    </div>
  `;
}

/* ──────────────────────────────────────────
   MODAL SYSTEM
   ────────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('modal--open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('modal--open'); document.body.style.overflow = ''; }
}

/* ── MODAL A: Data Source Detail ── */
function openDataSourceModal(key) {
  const src  = TOKEN_SOURCE_DATA[key];
  const dest = DESTINATIONS.find(d => d.key === key);
  if (!src || !dest) return;

  const dqiRows = Object.entries(src.dqiBreakdown).map(([k, v]) => `
    <div class="modal-dqi-row">
      <span class="modal-dqi-label">${k}</span>
      <div class="modal-dqi-bar-wrap">
        <div class="modal-dqi-bar" style="width:${v}%"></div>
      </div>
      <span class="modal-dqi-score">${v}/100</span>
    </div>
  `).join('');

  const typeChips = src.dataTypes
    .map(t => `<span class="modal-data-chip">${t}</span>`)
    .join('');

  document.getElementById('ds-modal-icon').innerHTML       = iconHTML(key, key, 28);
  document.getElementById('ds-modal-name').textContent     = dest.name;
  document.getElementById('ds-modal-srctype').textContent  = src.sourceType;
  document.getElementById('ds-modal-types').innerHTML      = typeChips;
  document.getElementById('ds-modal-dqi').innerHTML        = dqiRows;
  document.getElementById('ds-modal-baserate').textContent = '1.0 TKTR / session';
  document.getElementById('ds-modal-multiplier').textContent = `×${src.multiplier}`;
  document.getElementById('ds-modal-earnings').textContent   = `${src.monthlyEarnings} TKTR / month`;

  const impactEl = document.getElementById('ds-modal-dqi-impact');
  impactEl.textContent  = `${src.dqiImpact} DQI impact`;
  impactEl.className    = `modal-reward-val ${src.dqiImpact.startsWith('+') ? 'val--green' : 'val--red'}`;

  openModal('modal-data-source');
}

/* ── MODAL B: Refund Detail ── */
function openRefundModal(txDataStr) {
  let tx;
  try { tx = JSON.parse(txDataStr); } catch (e) { return; }

  document.getElementById('rf-modal-date').textContent    = tx.date;
  document.getElementById('rf-modal-source').textContent  = tx.src;
  document.getElementById('rf-modal-reason').textContent  = tx.reason;
  document.getElementById('rf-modal-original').textContent =
    `${Number(tx.amount).toFixed(1)} TKTR`;
  document.getElementById('rf-modal-retained-amt').textContent =
    `${(tx.amount * tx.retained / 100).toFixed(1)} TKTR`;
  document.getElementById('rf-modal-retained-pct').textContent =
    `(${tx.retained}% retained)`;
  document.getElementById('rf-modal-refunded-amt').textContent =
    `${(tx.amount * (100 - tx.retained) / 100).toFixed(1)} TKTR`;
  document.getElementById('rf-modal-realloc').textContent = `→ ${tx.realloc}`;

  const tagEl = document.getElementById('rf-modal-tag');
  tagEl.textContent = tx.tag;
  tagEl.className   = `modal-tag ${tx.tag === 'REFUND' ? 'modal-tag--refund' : 'modal-tag--reinvested'}`;

  openModal('modal-refund');
}

/* ── MODAL C: Value Flow Detail ── */
function openFlowModal(key) {
  const dest = DESTINATIONS.find(d => d.key === key);
  if (!dest) return;

  const pathHTML = dest.tokenPath.map((node, i) => `
    <div class="flow-path-node">
      <div class="flow-path-dot"></div>
      <span class="flow-path-label">${node}</span>
      ${i < dest.tokenPath.length - 1 ? '<div class="flow-path-line"></div>' : ''}
    </div>
  `).join('');

  document.getElementById('vf-modal-icon').innerHTML      = iconHTML(key, key, 28);
  document.getElementById('vf-modal-name').textContent    = dest.name;
  document.getElementById('vf-modal-type').textContent    = dest.type;
  document.getElementById('vf-modal-path').innerHTML      = pathHTML;
  document.getElementById('vf-modal-value').textContent   = dest.valueReceived;
  document.getElementById('vf-modal-demand').textContent  = dest.demandLevel;
  document.getElementById('vf-modal-multiplier').textContent = dest.demandMultiplier;
  document.getElementById('vf-modal-dqi').textContent     = `${(dest.dqiWeight * 100).toFixed(0)}%`;

  const changeEl = document.getElementById('vf-modal-change');
  changeEl.textContent = dest.crossPlatformChange;
  changeEl.className   = `modal-reward-val ${dest.crossPlatformChange.startsWith('+') ? 'val--green' : 'val--red'}`;

  const dirEl = document.getElementById('vf-modal-direction');
  dirEl.textContent = dest.flowDirection === 'sent'
    ? '↑ Value Sent To Partner'
    : '↓ Value Returned From Partner';
  dirEl.className = `modal-direction-badge ${dest.flowDirection === 'sent' ? 'dir--sent' : 'dir--received'}`;

  openModal('modal-flow');
}

/* ──────────────────────────────────────────
   CLICK DELEGATION (single handler)
   ────────────────────────────────────────── */
document.addEventListener('click', e => {
  /* Modal close via overlay or ✕ button */
  if (e.target.matches('.modal__overlay') || e.target.closest('.modal__close')) {
    document.querySelectorAll('.modal.modal--open').forEach(m => {
      m.classList.remove('modal--open');
    });
    document.body.style.overflow = '';
    return;
  }

  /* Token row (dashboard holdings) → Data Source Modal */
  const tokenRow = e.target.closest('.token-row[data-key]');
  if (tokenRow) { openDataSourceModal(tokenRow.dataset.key); return; }

  /* Earning Source Layer row → Data Source Modal */
  const eslRow = e.target.closest('.esl-row[data-key]');
  if (eslRow) { openDataSourceModal(eslRow.dataset.key); return; }

  /* Transaction row → Refund Detail Modal */
  const txRow = e.target.closest('.tx-row[data-tx]');
  if (txRow) { openRefundModal(txRow.dataset.tx); return; }

  /* Destination card → Value Flow Modal */
  const destCard = e.target.closest('.dest-card[data-key]');
  if (destCard) { openFlowModal(destCard.dataset.key); return; }

  /* Table filter tabs */
  if (e.target.matches('.filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    e.target.classList.add('filter-btn--active');
  }
});

/* ──────────────────────────────────────────
   INIT
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildTransactions();
  buildDestinations();
  buildTransfers();
  buildEarningSourceLayer();

  setTimeout(runCountUps, 400);
  countUpFired = true;
});
