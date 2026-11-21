// Builds the front page for Friday 20 November 2026 as HTML + inline SVG, then screenshots it
// with headless Edge to ../entry.png (1024x1024). Run: node tools/render.mjs
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- drawings (flat vector, 300x120 viewBox) ----------
const art = {
  // the lead's drawing is wider: 540x110
  markets: `
    <rect width="540" height="110" fill="#fff4f2"/>
    ${[18, 42, 66, 90].map((y) => `<line x1="10" x2="530" y1="${y}" y2="${y}" stroke="#f0d4cf"/>`).join('')}
    <polyline points="12,16 50,22 84,18 118,34 150,30 184,50 214,46 244,68 270,64 296,94" fill="none" stroke="#c8102e" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="286,84 302,102 278,100" fill="#c8102e"/>
    ${[['NASDAQ', '−5.3%'], ['NVIDIA', '−14%'], ['NIKKEI', '−5.1%'], ['KOSPI', '−5.2%']].map(([n, v], i) => `
      <g transform="translate(${318 + (i % 2) * 108},${8 + Math.floor(i / 2) * 50})">
        <rect width="100" height="44" rx="5" fill="#fff" stroke="#c8102e" stroke-width="1.5"/>
        <text x="50" y="17" font-size="12" font-weight="800" text-anchor="middle" fill="#111">${n}</text>
        <text x="50" y="37" font-size="18" font-weight="900" text-anchor="middle" fill="#c8102e">▼ ${v}</text></g>`).join('')}`,
  // mini-card drawings: 120x100
  m_nigeria: `
    <rect width="120" height="100" fill="#dbeef0"/>
    <path d="M0 52 q15 -6 30 0 t30 0 t30 0 t30 0 V100 H0Z" fill="#2f7f8c"/>
    <path d="M24 56 L96 42 L90 60 L30 70 Z" fill="#8b5a2b" transform="rotate(16 60 56)"/>
    <circle cx="18" cy="62" r="5" fill="#f2c94c"/><circle cx="102" cy="66" r="5" fill="#f2c94c"/>
    <path d="M8 8 h33 v24 h-33z" fill="#008751"/><path d="M19 8 h11 v24 h-11z" fill="#fff"/>`,
  m_iraq: `
    <rect width="120" height="100" fill="#efe6d2"/>
    <rect x="8" y="8" width="42" height="27" fill="#fff"/><rect x="8" y="8" width="42" height="9" fill="#ce1126"/><rect x="8" y="26" width="42" height="9" fill="#111"/>
    <rect y="76" width="120" height="24" fill="#cdb889"/>
    <rect x="34" y="52" width="62" height="24" rx="4" fill="#5b6b3a"/><rect x="52" y="40" width="26" height="14" rx="3" fill="#4b5a2e"/>
    <path d="M78 46 H104" stroke="#4b5a2e" stroke-width="4"/>
    ${[42, 56, 70, 84].map((x) => `<circle cx="${x}" cy="78" r="6" fill="#222"/>`).join('')}`,
  m_gaza: `
    <rect width="120" height="100" fill="#e9e4dc"/>
    <path d="M0 100 V70 l12 -8 l10 10 v-20 h18 l6 12 l10 -16 h16 v24 l12 -6 l14 10 l22 -4 V100Z" fill="#9b8f80"/>
    <path d="M60 18 h26 l-6 6 h-14z" fill="#444"/><path d="M52 14 h42" stroke="#444" stroke-width="3"/>
    <path d="M72 26 l-10 30" stroke="#444" stroke-width="2" stroke-dasharray="3 3"/>
    <circle cx="60" cy="60" r="9" fill="#ff7a2f"/>`,
  m_strike: `
    <rect width="120" height="100" fill="#f3efe6"/>
    <rect x="6" y="8" width="16" height="30" fill="#009246"/><rect x="22" y="8" width="16" height="30" fill="#fff"/><rect x="38" y="8" width="16" height="30" fill="#ce2b37"/>
    ${[[30, 54], [62, 48], [94, 56]].map(([x, y]) => `<path d="M${x} ${y + 18} V${y + 42}" stroke="#555" stroke-width="3"/><rect x="${x - 16}" y="${y}" width="32" height="20" fill="#fff" stroke="#c8102e" stroke-width="2"/><circle cx="${x}" cy="${y + 48}" r="7" fill="#7a5c48"/>`).join('')}
    <text x="62" y="62" font-size="9" font-weight="900" text-anchor="middle" fill="#c8102e">SCIOPERO</text>`,
  euuk: `
    <rect width="300" height="120" fill="#eef3ff"/>
    <rect x="22" y="18" width="104" height="66" fill="#003399"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${74 + 22 * Math.cos(a)}" cy="${51 + 22 * Math.sin(a)}" r="3.2" fill="#ffcc00"/>`; }).join('')}
    <rect x="174" y="18" width="104" height="66" fill="#012169"/>
    <path d="M174 18 L278 84 M278 18 L174 84" stroke="#fff" stroke-width="12"/>
    <path d="M174 18 L278 84 M278 18 L174 84" stroke="#c8102e" stroke-width="4"/>
    <path d="M226 18 V84 M174 51 H278" stroke="#fff" stroke-width="18"/>
    <path d="M226 18 V84 M174 51 H278" stroke="#c8102e" stroke-width="10"/>
    <path d="M118 100 q32 -26 64 0" fill="none" stroke="#333" stroke-width="3"/>
    <ellipse cx="128" cy="102" rx="16" ry="9" fill="#e7b48f"/><ellipse cx="172" cy="102" rx="16" ry="9" fill="#c98f6b"/>
    <text x="150" y="60" font-size="22" font-weight="900" text-anchor="middle" fill="#111">⇄</text>`,
  ukraine: `
    <rect width="300" height="120" fill="#1d2433"/>
    ${[[40, 20], [90, 12], [150, 26], [210, 10], [260, 22]].map(([x, y]) => `<path d="M${x} ${y} l18 34" stroke="#ffb347" stroke-width="3"/><circle cx="${x + 18}" cy="${y + 34}" r="3" fill="#ffdd88"/>`).join('')}
    <rect x="0" y="86" width="300" height="34" fill="#2c3e5c"/>
    <path d="M10 84 H118 M170 84 H292" stroke="#c9c9c9" stroke-width="7"/>
    ${[20, 60, 100, 180, 220, 260].map((x) => `<rect x="${x}" y="84" width="6" height="30" fill="#9aa3b2"/>`).join('')}
    <path d="M118 84 l14 22 M170 84 l-12 24" stroke="#c9c9c9" stroke-width="6"/>
    <circle cx="144" cy="78" r="16" fill="#ff7a2f" opacity=".85"/><circle cx="144" cy="78" r="8" fill="#ffd24a"/>
    <text x="144" y="56" font-size="11" font-weight="700" text-anchor="middle" fill="#fff">KERCH</text>`,
  poland: `
    <rect width="300" height="120" fill="#e8f3d8"/>
    <rect y="70" width="300" height="50" fill="#a7c46a"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M0 ${80 + i * 9} H300" stroke="#93b058" stroke-width="2"/>`).join('')}
    <ellipse cx="170" cy="84" rx="34" ry="9" fill="#6b4a2b"/>
    <path d="M120 10 L166 78" stroke="#555" stroke-width="7" stroke-linecap="round"/>
    <path d="M114 4 l10 4 l-4 8z" fill="#555"/>
    <rect x="18" y="14" width="64" height="40" fill="#fff" stroke="#bbb"/><rect x="18" y="34" width="64" height="20" fill="#dc143c"/>
    <text x="238" y="40" font-size="13" font-weight="800" text-anchor="middle" fill="#333">Kh-101</text>
    <text x="238" y="56" font-size="11" text-anchor="middle" fill="#333">Lublin region</text>`,
  hormuz: `
    <rect width="300" height="120" fill="#cfe7f5"/>
    <rect y="74" width="300" height="46" fill="#3c7fb1"/>
    <path d="M40 74 H250 L232 98 H58 Z" fill="#7b2d26"/>
    <rect x="200" y="54" width="34" height="20" fill="#e6e6e6"/>
    <path d="M90 74 q8 -40 24 -18 q6 -30 22 -6 q10 -26 20 4 z" fill="#ff7a2f"/>
    <path d="M100 30 q20 -26 50 -14 q22 -14 40 4" fill="none" stroke="#666" stroke-width="10" opacity=".55" stroke-linecap="round"/>
    <text x="268" y="30" font-size="12" font-weight="800" text-anchor="middle" fill="#123">OMAN</text>`,
  yemen: `
    <rect width="300" height="120" fill="#f6ecd6"/>
    <path d="M0 96 H300 V120 H0Z" fill="#d9c08e"/>
    ${[[40, 70], [80, 60], [120, 74]].map(([x, h]) => `<rect x="${x}" y="${96 - h + 30}" width="30" height="${h - 30}" fill="#b48a5a"/>`).join('')}
    <path d="M190 30 l30 -6 l-6 8 l26 2 l-26 4 l6 8 z" fill="#3a4a5c"/>
    <path d="M150 50 l-22 30" stroke="#3a4a5c" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="126" cy="84" r="14" fill="#ff7a2f"/>
    <text x="250" y="80" font-size="12" font-weight="800" text-anchor="middle" fill="#333">HODEIDAH</text>
    <text x="250" y="94" font-size="10" text-anchor="middle" fill="#333">Sanaa · Saada · Taiz</text>`,
  cop: `
    <rect width="300" height="120" fill="#e6f5ee"/>
    <circle cx="70" cy="62" r="42" fill="#2e8bc0"/>
    <path d="M50 34 q16 8 10 24 q-14 6 -20 -6z M76 52 q20 -4 24 14 q-6 16 -22 10z M58 82 q12 -2 14 10 q-8 6 -16 0z" fill="#3fae5a"/>
    <circle cx="208" cy="54" r="30" fill="#fff" stroke="#333" stroke-width="3"/>
    <path d="M208 54 V32 M208 54 L226 64" stroke="#c8102e" stroke-width="4" stroke-linecap="round"/>
    <text x="208" y="106" font-size="13" font-weight="800" text-anchor="middle" fill="#123">OVERTIME</text>`,
  nigeria: `
    <rect width="300" height="120" fill="#dbeef0"/>
    <path d="M0 64 q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 V120 H0Z" fill="#2f7f8c"/>
    <path d="M100 70 L210 52 L200 74 L112 88 Z" fill="#8b5a2b" transform="rotate(14 155 70)"/>
    ${[60, 236, 262].map((x) => `<circle cx="${x}" cy="76" r="6" fill="#f2c94c"/>`).join('')}
    <path d="M24 30 h40 v40 h-40z" fill="#008751"/><path d="M37 30 h14 v40 h-14z" fill="#fff"/>
    <text x="240" y="30" font-size="12" font-weight="800" text-anchor="middle" fill="#123">BAYELSA</text>`,
};

// ---------- stories (all from Friday 20 November 2026) ----------
const lead = {
  tag: 'MARKETS · GLOBAL', art: 'markets',
  head: 'AI sell-off: Nasdaq plunges 5.3%, S&P 500 falls into correction',
  body: 'Nvidia −14% after a Reuters report that SEC staff are examining its accounting; chip index −10.7%. Asia fell first: Nikkei −5.1%, Kospi −5.2%, Taiex −6.2%. Anthropic shares slide after their Nasdaq debut.',
};
const tiles = [
  { tag: 'EUROPE · BRUSSELS', art: 'euuk', head: 'EU and UK seal "reset" deal at summit',
    body: 'Youth scheme for 100,000 a year, food-rules and carbon-market links; UK says +0.5% to GDP.' },
  { tag: 'UKRAINE · RUSSIA', art: 'ukraine', head: 'Russian barrage kills 8; Kerch Bridge road span down',
    body: 'Zelenskyy: 400+ drones, 110+ missiles fired overnight; 6 dead in Kyiv, 2 in Lviv. Ukraine hits Crimea bridge.' },
  { tag: 'POLAND · NATO', art: 'poland', head: 'Russian missile lands in Polish field',
    body: 'Kh-101 strikes a field near Nowy Lipowiec, no casualties; Tusk calls 3 airspace breaches a "provocation".' },
  { tag: 'GULF · HORMUZ', art: 'hormuz', head: 'Tanker hit and on fire in Strait of Hormuz',
    body: 'Damaged off Khasab, Oman, say UKMTO and Iran\'s IRGC navy, as the US tightens its Iran blockade.' },
  { tag: 'YEMEN · SAUDI ARABIA', art: 'yemen', head: 'Saudi-led coalition strikes Houthi targets',
    body: 'Raids on Hodeidah, Sanaa, Saada and Taiz; Houthis threaten Saudi ports and warn airlines away.' },
  { tag: 'CLIMATE · TÜRKİYE', art: 'cop', head: 'COP31 climate talks run into overtime',
    body: 'About 200 nations deadlocked in Antalya; latest draft drops fossil-fuel wording.' },
];
const minis = [
  { tag: 'NIGERIA', art: 'm_nigeria', head: 'Funeral boat capsizes in Bayelsa',
    body: 'Mourners\' boat overturns; up to 30 feared dead, many missing.' },
  { tag: 'IRAQ', art: 'm_iraq', head: 'Troops enter militia stronghold',
    body: 'Forces deploy in Kataib Hezbollah\'s Jurf al-Sakhar under a deal.' },
  { tag: 'GAZA', art: 'm_gaza', head: 'Israeli drone strikes kill 7',
    body: 'At least seven Palestinians killed in central Gaza, four in Bureij.' },
  { tag: 'ITALY · EUROPE', art: 'm_strike', head: 'Italy holds general strike',
    body: 'Protests over wages and living costs in cities across Europe.' },
];
const briefs = [
  ['EUROPE', [
    'Estonia shuts its Russia border; Moscow decries a "new iron curtain"',
    'Belgrade mayor charged with assaulting an opposition politician',
    'Young Germans protest against plans for military service',
    'Qatar\'s emir deepens ties with Germany on Berlin visit',
  ]],
  ['AMERICAS', [
    'Bukele seeks a third term after El Salvador scraps term limits',
    'Salvadoran soldiers in Haiti killed while handling explosives',
    'US Senate passes bill to speed up energy project approvals',
    'NYC mayor Mamdani unveils plan to close Rikers Island by 2032',
  ]],
  ['AMERICAS · AFRICA', [
    'Brazil recognises Indigenous land as Lula visits Chief Raoni',
    'Thousands protest Colombia\'s tax plans',
    'Senegal migrant boat capsizes; four bodies recovered',
    'Malawi fuel shortage brings queues and chaos',
  ]],
  ['ASIA · TECH', [
    'Myanmar and China object to ICJ Rohingya genocide ruling',
    'Pakistan minister in New Delhi for SCO forum, first since 2025 war',
    'Meta rethinks 2030 climate goal as AI data centres lift emissions',
    'US lawmakers push tougher AI chip export rules',
  ]],
];
const numbers = [
  ['−5.3%', 'Nasdaq'], ['−3.7%', 'S&P 500'], ['−14%', 'Nvidia'], ['−5.2%', 'Kospi'],
  ['400+', 'drones at Ukraine'], ['100k', 'EU–UK youth visas'], ['8', 'killed in Kyiv, Lviv'],
];
// story count per region (lead + tiles + briefs), checked against total below
const regions = [['Global', 3], ['Europe', 8], ['Mid East', 4], ['Americas', 7], ['Africa', 3], ['Asia', 2]];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = (k, w = 300, h = 120) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" font-family="Segoe UI, Arial">${art[k]}</svg>`;
const total = 1 + tiles.length + minis.length + briefs.reduce((n, [, l]) => n + l.length, 0);
if (regions.reduce((n, [, c]) => n + c, 0) !== total) throw new Error('region tally does not add up to ' + total);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1024px;height:1024px;overflow:hidden;background:#faf7f0;font-family:"Segoe UI",Arial,sans-serif;color:#111}
header{height:132px;background:#111;color:#fff;padding:10px 18px 0;position:relative}
.kicker{font-size:15px;letter-spacing:3px;font-weight:700;color:#ffcc33}
h1{font-family:Georgia,serif;font-size:64px;line-height:68px;font-weight:900;letter-spacing:-1px}
.strap{font-size:15px;color:#ddd;margin-top:2px}
.stamp{position:absolute;right:18px;top:14px;text-align:right;font-size:13px;color:#bbb;line-height:18px}
.stamp b{display:block;font-size:30px;color:#fff;line-height:34px}
.nums{display:flex;height:50px;background:#c8102e;color:#fff}
.nums div{flex:1;text-align:center;border-right:1px solid #e86a7d;padding-top:3px}
.nums b{display:block;font-size:22px;line-height:24px;font-weight:900}
.nums span{font-size:11px;opacity:.95}
main{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:226px;gap:8px;padding:8px 10px 0}
.card{background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden;display:flex;flex-direction:column}
.card svg{width:100%;height:92px;display:block}
.card.lead{grid-column:span 2}
.card.lead svg{height:110px}
.tag{font-size:10.5px;font-weight:800;letter-spacing:1px;color:#c8102e;padding:5px 8px 0}
.head{font-size:17px;line-height:19px;font-weight:800;padding:2px 8px 0;font-family:Georgia,serif}
.lead .head{font-size:22px;line-height:24px}
.body{font-size:11.5px;line-height:14.5px;color:#333;padding:3px 8px 0}
.minis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px 10px 0}
.mini{display:flex;background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden;height:126px}
.mini svg{width:96px;height:126px;flex:none;display:block}
.mini div{padding:4px 7px 0}
.mini .tag{padding:0}
.mini .head{font-size:14.5px;line-height:16.5px;padding:1px 0 0}
.mini .body{font-size:11px;line-height:13.5px;padding:2px 0 0}
.briefs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px 10px 0}
.briefs h3{font-size:11px;letter-spacing:1px;color:#fff;background:#222;padding:2px 6px;border-radius:3px}
.briefs li{font-size:12px;line-height:14px;list-style:none;padding:3px 0 0 10px;position:relative}
.briefs li:before{content:"";position:absolute;left:1px;top:8px;width:5px;height:5px;background:#c8102e;border-radius:50%}
footer{position:absolute;left:0;right:0;bottom:0;height:40px;background:#111;color:#ddd;font-size:11px;padding:4px 12px;display:flex;align-items:center;gap:12px}
.bar{display:flex;height:14px;width:330px;border-radius:3px;overflow:hidden;flex:none}
.bar i{display:block;height:100%;font-style:normal;font-size:9px;color:#fff;text-align:center;line-height:14px;font-weight:700}
</style></head><body>
<header>
  <div class="kicker">THE WORLD'S NEWS · ONE DAY ON ONE PAGE</div>
  <h1>Friday 20 November 2026</h1>
  <div class="strap">AI rout drags Wall Street into correction · EU and UK reset ties · Russia pounds Ukraine, missile lands in Poland · COP31 overruns</div>
  <div class="stamp"><b>${total}</b>stories · 6 regions</div>
</header>
<div class="nums">${numbers.map(([n, l]) => `<div><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
<main>
  <div class="card lead">${svg(lead.art, 540, 110)}<div class="tag">${lead.tag}</div><div class="head">${esc(lead.head)}</div><div class="body">${esc(lead.body)}</div></div>
  ${tiles.map((t) => `<div class="card">${svg(t.art)}<div class="tag">${t.tag}</div><div class="head">${esc(t.head)}</div><div class="body">${esc(t.body)}</div></div>`).join('\n  ')}
</main>
<section class="minis">${minis.map((m) => `<div class="mini">${svg(m.art, 120, 100)}<div><div class="tag">${m.tag}</div><div class="head">${esc(m.head)}</div><div class="body">${esc(m.body)}</div></div></div>`).join('')}</section>
<section class="briefs">${briefs.map(([h, l]) => `<div><h3>${h}</h3><ul>${l.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</section>
<footer>
  <div class="bar">${regions.map(([r, n], i) => `<i style="width:${(n / total) * 100}%;background:${['#555', '#003399', '#b5651d', '#2e8b57', '#c8102e', '#7b3fa0'][i]}">${r} ${n}</i>`).join('')}</div>
  <div>Date check: every item happened or was first reported on Fri 20 Nov 2026. Figures and claims as reported by AP, Reuters, Al Jazeera and officials; casualty tolls are early counts.</div>
</footer>
</body></html>`;

mkdirSync(join(root, 'build'), { recursive: true });
const page = join(root, 'build', 'page.html');
writeFileSync(page, html);

const edge = process.env.EDGE ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const out = join(root, 'entry.png');
execFileSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${out}`, 'file:///' + page.replace(/\\/g, '/')], { stdio: 'inherit' });
console.log('entry.png', statSync(out).size, 'bytes, stories:', total);
