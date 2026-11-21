// v2 front page for Friday 20 November 2026: HTML + inline SVG drawn here, screenshotted by headless Edge
// to ../entry.png (1024x1024). Run: node tools/render.mjs
// Every story was checked to have happened, or been first reported, on 20 Nov 2026; items that turned out
// to be Thursday 19 Nov news are listed in the DATE CHECK box instead of being shown as the day's news.
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- drawings: every one on a 300x120 canvas ----------
const flagUK = (x, y, w, h) => `<g transform="translate(${x},${y}) scale(${w / 60},${h / 30})">
  <rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/>
  <path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0V30M0 15H60" stroke="#fff" stroke-width="10"/>
  <path d="M30 0V30M0 15H60" stroke="#c8102e" stroke-width="6"/></g>`;
const flagEU = (x, y, w, h) => `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" fill="#003399"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 2 * Math.PI; return `<circle cx="${w / 2 + h * 0.32 * Math.cos(a)}" cy="${h / 2 + h * 0.32 * Math.sin(a)}" r="${h * 0.045}" fill="#ffcc00"/>`; }).join('')}</g>`;
const tri = (x, y, w, h, cols, vertical = true) => cols.map((c, i) => vertical
  ? `<rect x="${x + (i * w) / cols.length}" y="${y}" width="${w / cols.length}" height="${h}" fill="${c}"/>`
  : `<rect x="${x}" y="${y + (i * h) / cols.length}" width="${w}" height="${h / cols.length}" fill="${c}"/>`).join('');

const art = {
  kyiv: `<rect width="300" height="120" fill="#141b2b"/>
    ${[[200, 6], [236, 2], [268, 10]].map(([x, y]) => `<path d="M${x} ${y} L${x - 40} ${y + 50}" stroke="#ffb347" stroke-width="2.5" stroke-dasharray="6 4"/><circle cx="${x - 40}" cy="${y + 50}" r="3" fill="#ffe08a"/>`).join('')}
    ${[30, 48, 62, 90, 104, 130].map((x, i) => `<rect x="${x}" y="${40 + (i % 3) * 8}" width="12" height="${46 - (i % 3) * 8}" fill="#2b3550"/>`).join('')}
    <path d="M0 92 Q150 82 300 92 V120 H0Z" fill="#1f4f7a"/>
    <path d="M14 84 H286" stroke="#b8c0cc" stroke-width="6"/>
    ${[40, 100, 160, 220, 270].map((x) => `<rect x="${x}" y="84" width="6" height="22" fill="#8b95a5"/>`).join('')}
    ${[70, 150, 232].map((x) => `<circle cx="${x}" cy="80" r="12" fill="#ff7a2f" opacity=".9"/><circle cx="${x}" cy="80" r="5" fill="#ffe08a"/>`).join('')}
    <text x="290" y="114" font-size="10" fill="#9fb3cc" text-anchor="end">DNIPRO</text>`,
  cyclone: `<rect width="300" height="120" fill="#2b6a9e"/>
    <path d="M0 0 H118 Q100 30 112 60 Q96 92 70 120 H0Z" fill="#cfe0b0"/>
    <text x="12" y="96" font-size="13" font-weight="800" fill="#33472a">ODISHA</text><text x="12" y="110" font-size="10" fill="#33472a">INDIA</text>
    <circle cx="111" cy="58" r="5" fill="#c8102e" stroke="#fff" stroke-width="2"/>
    <text x="104" y="76" font-size="10" font-weight="700" fill="#fff" text-anchor="end">Gopalpur</text>
    ${[44, 32, 20, 9].map((r, i) => `<path d="M${215 - r} 60 a${r} ${r} 0 1 1 ${r} ${r}" fill="none" stroke="#fff" stroke-width="${4 - i * 0.5}" opacity=".85"/>`).join('')}
    <circle cx="215" cy="60" r="5" fill="#fff"/>
    <path d="M172 60 L124 58" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="290" y="114" font-size="10" fill="#d6e8f5" text-anchor="end">BAY OF BENGAL</text>`,
  rout: `<rect width="300" height="120" fill="#16181d"/>
    ${[20, 45, 70, 95].map((y) => `<line x1="8" x2="160" y1="${y}" y2="${y}" stroke="#2c3038"/>`).join('')}
    <polyline points="10,22 34,26 54,20 78,40 98,36 118,60 136,58 156,96" fill="none" stroke="#ff4d4d" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="148,86 162,104 140,100" fill="#ff4d4d"/>
    ${[['S&P 500', '−3.7%'], ['Nasdaq', '−5.3%'], ['Nvidia', '−14%'], ['Taiex', '−6.2%'], ['Kospi', '−5.2%']].map(([n, v], i) => `
      <text x="176" y="${22 + i * 21}" font-size="13" font-weight="700" fill="#e8e8e8">${n}</text>
      <text x="292" y="${22 + i * 21}" font-size="14" font-weight="900" fill="#ff5c5c" text-anchor="end">${v}</text>`).join('')}`,
  euuk: `<rect width="300" height="120" fill="#e9eefb"/>${flagEU(20, 18, 110, 70)}${flagUK(170, 18, 110, 70)}
    <rect x="120" y="70" width="60" height="30" rx="14" fill="#fff" stroke="#333" stroke-width="2"/>
    <path d="M132 85 h36 M150 76 v18" stroke="#333" stroke-width="3"/>`,
  poland: `<rect width="300" height="120" fill="#e5f0d6"/><rect y="70" width="300" height="50" fill="#9fbf62"/>
    ${[78, 88, 98, 108].map((y) => `<path d="M0 ${y} H300" stroke="#8bab50" stroke-width="2"/>`).join('')}
    <ellipse cx="190" cy="86" rx="34" ry="9" fill="#5e4027"/>
    <path d="M128 12 L184 80" stroke="#59606b" stroke-width="8" stroke-linecap="round"/><path d="M120 6 l14 4 l-6 10z" fill="#59606b"/>
    ${tri(16, 14, 66, 42, ['#fff', '#dc143c'], false)}<rect x="16" y="14" width="66" height="42" fill="none" stroke="#bbb"/>`,
  hormuz: `<rect width="300" height="120" fill="#cde6f4"/><rect y="74" width="300" height="46" fill="#336f9e"/>
    <path d="M30 74 H250 L232 98 H48 Z" fill="#7b2d26"/><rect x="204" y="52" width="32" height="22" fill="#e6e6e6"/>
    <path d="M80 74 q8 -44 26 -18 q8 -30 24 -4 q12 -28 22 6z" fill="#ff7a2f"/><path d="M100 72 q6 -20 16 -8 q6 -14 12 4z" fill="#ffd24a"/>
    <path d="M96 30 q24 -28 56 -14 q24 -16 46 6" fill="none" stroke="#666" stroke-width="12" opacity=".45" stroke-linecap="round"/>`,
  yemen: `<rect width="300" height="120" fill="#f4e8cf"/><rect y="96" width="300" height="24" fill="#d6bb86"/>
    ${[[40, 36], [76, 50], [112, 30]].map(([x, h]) => `<rect x="${x}" y="${96 - h}" width="30" height="${h}" fill="#b08654"/><rect x="${x + 10}" y="${100 - h}" width="8" height="8" fill="#f4e8cf"/>`).join('')}
    <path d="M196 26 l34 -6 l-6 8 l28 2 l-28 4 l6 8z" fill="#33414f"/>
    <path d="M196 34 L142 80" stroke="#33414f" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="138" cy="84" r="14" fill="#ff7a2f"/>`,
  cop: `<rect width="300" height="120" fill="#e4f3ea"/>
    <circle cx="80" cy="60" r="44" fill="#2e86c1"/>
    <path d="M56 30 q18 8 12 26 q-16 6 -22 -6z M86 50 q22 -4 26 14 q-6 18 -24 10z M64 84 q14 -2 16 10 q-8 6 -18 0z" fill="#3aa856"/>
    <circle cx="214" cy="58" r="34" fill="#fff" stroke="#333" stroke-width="3"/>
    <path d="M214 58 V32 M214 58 L236 70" stroke="#c8102e" stroke-width="4" stroke-linecap="round"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 2 * Math.PI; return `<circle cx="${214 + 28 * Math.cos(a)}" cy="${58 + 28 * Math.sin(a)}" r="1.8" fill="#333"/>`; }).join('')}`,
  strike: `<rect width="300" height="120" fill="#f3eee4"/>${tri(16, 12, 72, 46, ['#009246', '#fff', '#ce2b37'])}
    ${[[130, 36], [182, 28], [234, 38]].map(([x, y]) => `<path d="M${x} ${y + 22} V${y + 56}" stroke="#555" stroke-width="3"/><rect x="${x - 24}" y="${y}" width="48" height="24" fill="#fff" stroke="#c8102e" stroke-width="2"/><circle cx="${x}" cy="${y + 66}" r="9" fill="#6e5544"/><rect x="${x - 10}" y="${y + 74}" width="20" height="24" rx="6" fill="#6e5544"/>`).join('')}
    <text x="182" y="46" font-size="10" font-weight="900" text-anchor="middle" fill="#c8102e">SCIOPERO</text>`,
  iraq: `<rect width="300" height="120" fill="#efe6d1"/>${tri(16, 12, 70, 45, ['#ce1126', '#fff', '#111'], false)}
    <rect y="92" width="300" height="28" fill="#ccb683"/>
    ${[120, 210].map((x) => `<rect x="${x}" y="62" width="70" height="28" rx="5" fill="#5b6b3a"/><rect x="${x + 18}" y="48" width="30" height="16" rx="3" fill="#4b5a2e"/><path d="M${x + 48} 55 H${x + 78}" stroke="#4b5a2e" stroke-width="4"/>${[8, 24, 40, 56].map((d) => `<circle cx="${x + d + 3}" cy="92" r="7" fill="#222"/>`).join('')}`).join('')}`,
  kenya: `<rect width="300" height="120" fill="#f6e7c8"/><rect y="94" width="300" height="26" fill="#d9b77c"/>
    <g transform="translate(222,14)">${tri(0, 0, 66, 44, ['#000', '#fff', '#bb0000', '#fff', '#006600'], false)}</g>
    <path d="M150 94 L170 10 L190 94 M156 70 H184 M161 48 H179 M165 28 H175 M156 70 L179 48 M184 70 L161 48" stroke="#444" stroke-width="3" fill="none"/>
    <rect x="128" y="88" width="84" height="10" fill="#555"/>
    <path d="M60 94 q8 -26 20 0" fill="#222"/><circle cx="70" cy="62" r="6" fill="#222"/><text x="70" y="52" font-size="11" font-weight="900" text-anchor="middle" fill="#222">OIL</text>`,
  pill: `<rect width="300" height="120" fill="#fbecef"/>
    <g transform="rotate(-30 90 60)"><rect x="40" y="40" width="100" height="40" rx="20" fill="#fff" stroke="#c8102e" stroke-width="3"/><path d="M90 40 h30 a20 20 0 0 1 0 40 h-30z" fill="#c8102e"/></g>
    <circle cx="222" cy="60" r="40" fill="none" stroke="#f1c6ce" stroke-width="14"/>
    <circle cx="222" cy="60" r="40" fill="none" stroke="#c8102e" stroke-width="14" stroke-dasharray="${(0.607 * 2 * Math.PI * 40).toFixed(1)} 999" transform="rotate(-90 222 60)"/>
    <text x="222" y="66" font-size="18" font-weight="900" text-anchor="middle" fill="#c8102e">60.7%</text>`,
  film: `<rect width="300" height="120" fill="#20152b"/>
    <rect x="60" y="12" width="180" height="70" fill="#f2e6c9"/><text x="150" y="58" font-size="30" font-weight="900" text-anchor="middle" fill="#7a1f1f">$21M</text>
    <text x="150" y="30" font-size="11" font-weight="700" text-anchor="middle" fill="#7a1f1f">PREVIEWS</text>
    ${[30, 70, 110, 150, 190, 230, 270].map((x) => `<circle cx="${x}" cy="104" r="11" fill="#3d2a52"/><rect x="${x - 13}" y="108" width="26" height="12" fill="#3d2a52"/>`).join('')}`,
  cricket: `<rect width="300" height="120" fill="#d7ecc9"/><ellipse cx="150" cy="130" rx="190" ry="50" fill="#9ccc72"/>
    <g transform="rotate(-35 90 64)"><rect x="84" y="10" width="12" height="40" rx="4" fill="#6b4a2b"/><rect x="76" y="48" width="28" height="64" rx="6" fill="#e8cf96"/></g>
    <circle cx="150" cy="40" r="10" fill="#c8102e"/><path d="M143 35 q7 5 14 0 M143 45 q7 -5 14 0" stroke="#fff" stroke-width="1.2" fill="none"/>
    <rect x="186" y="16" width="100" height="52" rx="4" fill="#123"/><text x="236" y="38" font-size="12" font-weight="800" text-anchor="middle" fill="#fff">NICHOLLS</text>
    <text x="236" y="60" font-size="20" font-weight="900" text-anchor="middle" fill="#ffd400">175*</text>`,
  delhi: `<rect width="300" height="120" fill="#f1ece2"/>
    <g>${tri(20, 20, 90, 60, ['#fff'])}<rect x="42" y="20" width="68" height="60" fill="#01411c"/><circle cx="80" cy="50" r="15" fill="#fff"/><circle cx="86" cy="46" r="14" fill="#01411c"/></g>
    <path d="M122 50 H178" stroke="#333" stroke-width="3" stroke-dasharray="6 4"/><path d="M172 42 l10 8 l-10 8" fill="none" stroke="#333" stroke-width="3"/>
    ${tri(190, 20, 90, 60, ['#ff9933', '#fff', '#138808'], false)}<circle cx="235" cy="50" r="7" fill="none" stroke="#000080" stroke-width="2"/>
    <text x="150" y="104" font-size="12" font-weight="800" text-anchor="middle" fill="#333">SCO FORUM · NEW DELHI</text>`,
};

// ---------- stories ----------
const leads = [
  { n: 1, key: 'KYIV', art: 'kyiv', tag: 'KYIV, UKRAINE · WAR',
    head: 'Russian missiles hit three Kyiv bridges; 8 killed',
    body: 'Ballistic missiles damaged the Podilskyi, Darnytskyi and Southern bridges, the mayor says. 6 dead in Kyiv, 2 in Lviv, 28 hurt; Kyiv says 400+ drones, 110+ missiles. Power cut in Kyiv and 10 regions.',
    src: 'Ukraine govt, Al Jazeera' },
  { n: 2, key: 'CYCLONE AKVAN', art: 'cyclone', tag: 'ODISHA, INDIA · WEATHER',
    head: 'Cyclone Akvan comes ashore near Gopalpur',
    body: 'Landfall began about 02:00 UTC with 70–80 km/h winds, gusts to 90. Over 300,000 people moved to shelters; no deaths reported. Dozens of trains cancelled.',
    src: 'IMD, Odisha govt' },
  { n: 3, key: 'AI SELL-OFF', art: 'rout', tag: 'NEW YORK · TAIPEI · SEOUL · MARKETS',
    head: 'AI rout pushes S&P 500 into a correction',
    body: 'Nasdaq −5.3%, worst week since March 2020; Dow −950 points. Nvidia −14% after a report SEC staff are examining its accounting. Asia fell first: Taiwan −6.2%, Seoul −5.2%, Tokyo −5.1%.',
    src: 'AP, Reuters, CNBC' },
];
const tiles = [
  { n: 4, key: 'UK–EU DEAL', art: 'euuk', tag: 'BRUSSELS · DIPLOMACY', head: 'UK and EU seal a "reset" deal',
    body: 'Youth visas for 100,000, food rules, carbon markets.', src: 'UK govt' },
  { n: 5, key: 'POLAND', art: 'poland', tag: 'LUBLIN · SECURITY', head: 'Russian missile lands in a Polish field',
    body: 'Kh-101, no one hurt; Tusk: "provocation".', src: 'Polish govt' },
  { n: 6, key: 'HORMUZ', art: 'hormuz', tag: 'OFF OMAN · SHIPPING', head: 'Tanker hit and set ablaze in the strait',
    body: 'Damaged off Khasab as it tried to pass.', src: 'UKMTO' },
  { n: 7, key: 'YEMEN', art: 'yemen', tag: 'HODEIDAH · CONFLICT', head: 'Saudi-led coalition strikes Houthis',
    body: 'Raids on 4 provinces; Houthis threaten ports.', src: 'AP, Al Jazeera' },
  { n: 8, key: 'COP31', art: 'cop', tag: 'ANTALYA · CLIMATE', head: 'Climate summit runs into overtime',
    body: 'Draft drops fossil fuels; ~200 nations split.', src: 'UN talks' },
  { n: 9, key: 'STRIKE', art: 'strike', tag: 'ITALY · LABOUR', head: 'Italy general strike; Europe protests',
    body: 'CGIL rallies in 100+ cities; 25 countries march.', src: 'Unions' },
  { n: 10, key: 'IRAQ', art: 'iraq', tag: 'JURF AL-SAKHAR · SECURITY', head: 'Iraqi troops enter militia stronghold',
    body: 'Kataib Hezbollah to leave within a month.', src: 'Iraqi govt' },
  { n: 11, key: 'KENYA OIL', art: 'kenya', tag: 'TURKANA · ENERGY', head: 'Kenya starts drilling first oil well',
    body: 'Phase one aims for 20,000+ barrels a day.', src: 'Energy ministry' },
  { n: 12, key: 'NEW DELHI', art: 'delhi', tag: 'INDIA · PAKISTAN', head: 'Pakistani minister visits India',
    body: 'First since the May 2025 war; SCO forum.', src: 'Al Jazeera' },
  { n: 13, key: 'CANCER PILL', art: 'pill', tag: 'BARCELONA · HEALTH', head: 'Pill shrinks pancreatic tumours',
    body: '60.7% of 61 patients respond in early trial.', src: 'EORTC' },
  { n: 14, key: 'BOX OFFICE', art: 'film', tag: 'US · FILM', head: 'Hunger Games prequel opens: $21M',
    body: 'Previews second only to Catching Fire.', src: 'Lionsgate' },
  { n: 15, key: 'CRICKET', art: 'cricket', tag: 'WELLINGTON · SPORT', head: 'Nicholls 175* as NZ make 368',
    body: 'India reply 159-1 at stumps on day two.', src: 'NZ Herald' },
];
const briefs = [
  [16, 'Gaza', 'Israeli drone strikes kill 7', 'AJ'],
  [17, 'Lebanon', 'Israeli strikes hit 4 districts', 'AA'],
  [18, 'Yemen', 'Army claims 193 Houthis hit', 'Arab News'],
  [19, 'Nigeria', 'Funeral boat sinks: 4+ dead', 'police'],
  [20, 'Sudan', 'Army claims gains in W. Kordofan', 'army'],
  [21, 'AfDB', '22 states in or near debt distress', 'AfDB'],
  [22, 'Estonia', 'To shut Russia road border', 'govt'],
  [23, 'Germany', 'Youth rally against conscription', 'AJ'],
  [24, 'Berlin', 'Qatar pledges €15bn more', 'Merz'],
  [25, 'Serbia', 'Belgrade mayor charged with assault', 'AJ'],
  [26, 'UK', 'Retail sales +0.7%; borrowing £17bn', 'ONS'],
  [27, 'Zaporizhzhia', 'Hospital strike kills 1', 'AJ'],
  [28, 'Japan', 'October inflation 2.3%, core 2.2%', 'MIC'],
  [29, 'S. Korea', 'Party backs impeaching top judge', 'SBS'],
  [30, 'Australia', 'Xi hails "full turnaround" in ties', 'ABC'],
  [31, 'Myanmar', 'Calls ICJ genocide ruling "unfair"', 'AJ'],
  [32, 'Mexico', 'Sheinbaum leads Revolution parade', 'EFE'],
  [33, 'Argentina', 'Country risk jumps to 1,070', 'Rava'],
  [34, 'Florida', 'Floods: 17+ inches since Tuesday', 'AP'],
  [35, 'New York', 'Mamdani: close Rikers by 2032', 'AJ'],
  [36, 'New York', 'Indian man jailed over Sikh plot', 'court'],
  [37, 'Haiti', 'El Salvador to help build 3 prisons', 'AP'],
  [38, 'F1', 'Verstappen gets Las Vegas pole', 'FIA'],
  [39, 'Football', 'Nations League: Spain v France', 'UEFA'],
  [40, 'Tennis', 'ATP pay pot tops $350m from 2028', 'AFP'],
];
const numbers = [
  ['8', 'killed in Kyiv and Lviv'], ['3', 'Kyiv bridges hit'], ['300,000+', 'evacuated for Akvan'],
  ['−3.7%', 'S&P 500, in correction'], ['−14%', 'Nvidia'], ['60.7%', 'tumours shrank in pill trial'], ['100,000', 'UK–EU youth visas'],
];
const timeline = [
  ['overnight', 'Missiles hit Kyiv'], ['02:00', 'Akvan landfall'], ['05:30', 'Taiwan closes −6.2%'],
  ['06:30', 'Tokyo closes −5.1%'], ['07:00', 'UK retail +0.7%'], ['11:00', 'Nations League draw'], ['21:00', 'S&P 500 closes −3.7%'],
];
const regionOf = { Europe: [1, 4, 5, 9, 22, 23, 24, 25, 26, 27, 39], 'Mid East': [6, 7, 10, 16, 17, 18],
  'Asia-Pac': [2, 12, 15, 28, 29, 30, 31], Africa: [11, 19, 20, 21], Americas: [3, 14, 32, 33, 34, 35, 36, 37, 38], Global: [8, 13, 40] };
const regionColor = { Europe: '#1f4e9c', 'Mid East': '#b5651d', 'Asia-Pac': '#c8102e', Americas: '#2e8b57', Africa: '#7b3fa0', Global: '#555' };
const total = leads.length + tiles.length + briefs.length;
const counted = Object.values(regionOf).flat();
if (counted.length !== total || new Set(counted).size !== total) throw new Error(`region map covers ${counted.length} of ${total}`);

// ---------- locator map: coarse coastlines, equirectangular ----------
const MAP = { w: 250, h: 128, lon0: -125, lon1: 186, lat0: 72, lat1: -52 };
const px = (lon, lat) => [((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w, ((MAP.lat0 - lat) / (MAP.lat0 - MAP.lat1)) * MAP.h];
const land = [
  [[-168, 65], [-140, 70], [-95, 72], [-80, 63], [-60, 55], [-53, 47], [-66, 44], [-75, 35], [-81, 25], [-90, 30], [-97, 26], [-97, 18], [-87, 15], [-80, 8], [-84, 10], [-92, 15], [-105, 20], [-112, 30], [-118, 34], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 55]],
  [[-50, 60], [-40, 65], [-20, 70], [-25, 80], [-55, 82], [-70, 77], [-55, 68]],
  [[-80, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -6], [-39, -14], [-48, -26], [-58, -38], [-65, -55], [-72, -50], [-73, -38], [-70, -18], [-76, -12], [-81, -5], [-78, 2]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 69], [28, 71], [40, 67], [45, 68], [60, 68], [80, 73], [105, 77], [140, 72], [170, 70], [180, 66], [160, 60], [142, 52], [140, 45], [130, 42], [122, 40], [121, 31], [117, 24], [108, 21], [106, 10], [100, 13], [98, 8], [100, 3], [104, 1], [98, 16], [92, 22], [88, 22], [80, 15], [77, 8], [72, 20], [66, 25], [57, 25], [56, 22], [59, 22], [52, 16], [44, 12], [42, 16], [35, 28], [33, 31], [35, 36], [28, 36], [26, 40], [23, 36], [20, 40], [15, 38], [18, 40], [12, 44], [9, 44], [3, 43], [-3, 37]],
  [[-17, 15], [-17, 21], [-10, 30], [-6, 35], [10, 37], [11, 33], [20, 31], [32, 31], [35, 28], [43, 12], [51, 11], [40, -3], [40, -15], [35, -25], [20, -35], [17, -30], [12, -17], [13, -5], [9, 4], [-8, 4], [-15, 10]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [140, -38], [130, -32], [115, -34]],
  [[-5, 50], [1, 51], [0, 54], [-2, 57], [-5, 58], [-5, 55], [-3, 54]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [140, 41], [136, 36], [131, 34]],
  [[172, -34], [178, -38], [174, -41], [170, -46], [167, -46], [172, -41]],
];
const pins = [[1, 30.5, 50.4], [2, 84.9, 19.3], [3, -74, 40.7], [4, 4.4, 50.8], [5, 22.6, 51.2], [6, 56.2, 26.2], [7, 42.9, 14.8],
  [8, 30.7, 36.9], [9, 12.5, 41.9], [10, 44.2, 32.9], [11, 35.6, 2.3], [12, 77.2, 28.6], [13, 2.2, 41.4], [14, -118.2, 34.1],
  [15, 174.8, -41.3]];
const regionByStory = Object.fromEntries(Object.entries(regionOf).flatMap(([r, ns]) => ns.map((n) => [n, r])));
const mapSvg = `<svg viewBox="0 0 ${MAP.w} ${MAP.h}" font-family="Segoe UI, Arial">
  <rect width="${MAP.w}" height="${MAP.h}" fill="#203a55"/>
  ${land.map((poly) => `<polygon points="${poly.map(([lo, la]) => px(lo, la).map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="#d9cfb4"/>`).join('')}
  ${pins.map(([n, lo, la]) => { const [x, y] = px(lo, la); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.2" fill="${regionColor[regionByStory[n]]}" stroke="#fff" stroke-width="1.2"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="8" font-weight="800" fill="#fff" text-anchor="middle">${n}</text>`; }).join('')}
</svg>`;

const svg = (k) => `<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" font-family="Segoe UI, Arial">${art[k]}</svg>`;
const card = (s, cls) => `<div class="card ${cls}"><div class="pic">${svg(s.art)}<div class="key"><i>${s.n}</i>${esc(s.key)}</div></div>
  <div class="tag">${esc(s.tag)}</div><div class="head">${esc(s.head)}</div><div class="body">${esc(s.body)} <span class="src">${esc(s.src)}</span></div></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1024px;height:1024px;overflow:hidden;background:#f7f3ea;font-family:"Segoe UI",Arial,sans-serif;color:#151515;position:relative}
.top{display:flex;justify-content:space-between;font-size:12px;font-weight:800;letter-spacing:1.5px;padding:7px 14px 0;color:#c8102e}
.top span:last-child{color:#333}
h1{font-family:Georgia,serif;font-size:66px;line-height:68px;font-weight:900;text-align:center;letter-spacing:-1px;border-top:3px solid #151515;margin:3px 14px 0}
.strap{text-align:center;font-family:Georgia,serif;font-style:italic;font-size:15.5px;padding:1px 0 4px;border-bottom:1px solid #151515;margin:0 14px}
.tl{display:flex;margin:5px 14px 0;height:26px;align-items:stretch;font-size:11px}
.tl b.lab{background:#151515;color:#fff;font-size:10px;padding:0 6px;display:flex;align-items:center;letter-spacing:1px}
.tl div{flex:1;border-right:1px solid #ccc;padding:1px 5px;line-height:12px}
.tl div b{color:#c8102e;display:block;font-size:11.5px}
.nums{display:flex;margin:5px 14px 0;gap:4px}
.nums div{flex:1;border-left:4px solid #c8102e;background:#fff;padding:2px 6px 3px}
.nums b{display:block;font-size:21px;line-height:23px;font-family:Georgia,serif}
.nums span{font-size:10.5px;color:#444;line-height:12px;display:block}
.bar{display:flex;margin:5px 14px 0;height:15px;font-size:9.5px;font-weight:800;color:#fff}
.bar i{font-style:normal;text-align:center;line-height:15px}
.grid{display:grid;gap:7px;margin:7px 14px 0}
.g3{grid-template-columns:repeat(3,1fr)}.g6{grid-template-columns:repeat(6,1fr);gap:6px}
.card{background:#fff;border:1px solid #d8d2c4;overflow:hidden}
.pic{position:relative}.pic svg{display:block;width:100%}
.lead .pic svg{height:108px}.small .pic svg{height:58px}
.key{position:absolute;left:6px;top:6px;background:#c8102e;color:#fff;font-weight:900;letter-spacing:.5px;display:flex;align-items:center;gap:6px;padding:2px 8px 2px 3px;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.key i{font-style:normal;background:#fff;color:#c8102e;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px}
.lead .key{font-size:19px}.small .key{font-size:11.5px;top:auto;bottom:3px;left:3px;padding:1px 5px 1px 2px;gap:4px}
.small .key i{width:15px;height:15px;font-size:9.5px}
.tag{font-size:10px;font-weight:800;color:#1f4e9c;letter-spacing:.6px;padding:4px 7px 0}
.small .tag{font-size:8.5px;letter-spacing:.3px;padding:3px 5px 0;white-space:nowrap;overflow:hidden}
.head{font-family:Georgia,serif;font-weight:900;padding:1px 7px 0}
.lead .head{font-size:20px;line-height:22px}.small .head{font-size:13.5px;line-height:15px;padding:1px 5px 0}
.body{font-size:11.5px;line-height:14px;color:#333;padding:2px 7px 5px}.small .body{font-size:10.5px;line-height:12.5px;padding:2px 5px 4px}
.src{color:#888;font-size:10px;white-space:nowrap}.src:before{content:"— "}
.bottom{display:grid;grid-template-columns:250px minmax(0,1fr);gap:10px;margin:7px 14px 0}
.also{min-width:0}
.mapbox h3,.also h3{font-size:10.5px;letter-spacing:1px;font-weight:900;border-bottom:2px solid #151515;margin-bottom:3px;white-space:nowrap}
.mapbox svg{display:block;width:250px;height:128px}
.also ol{columns:3;column-gap:10px;list-style:none}
.also li{font-size:11px;line-height:13.5px;padding:1.5px 0;break-inside:avoid;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.also li i{font-style:normal;display:inline-block;min-width:17px;height:13px;color:#fff;font-size:9px;font-weight:800;text-align:center;margin-right:3px;border-radius:2px}
.also li b{font-weight:800}.also li em{color:#888;font-style:normal;font-size:9.5px}
.dc{margin-top:5px;border:2px solid #c8102e;padding:3px 6px;font-size:10.5px;line-height:12.5px;color:#333}
.dc b{color:#c8102e}
footer{position:absolute;left:14px;right:14px;bottom:4px;font-size:10px;color:#555;display:flex;justify-content:space-between;border-top:1px solid #999;padding-top:2px}
</style></head><body>
<div class="top"><span>THE WORLD'S NEWS IN ONE DAY</span><span>${total} STORIES · 6 REGIONS · ALL FROM FRIDAY 20 NOVEMBER 2026</span></div>
<h1>Friday 20 November 2026</h1>
<div class="strap">Russian missiles hit Kyiv's bridges · Cyclone Akvan strikes India · AI sell-off drags Wall Street into a correction · UK and EU seal a deal</div>
<div class="tl"><b class="lab">THE DAY IN UTC</b>${timeline.map(([t, l]) => `<div><b>${t}</b>${esc(l)}</div>`).join('')}</div>
<div class="nums">${numbers.map(([n, l]) => `<div><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
<div class="bar">${Object.entries(regionOf).map(([r, ns]) => `<i style="width:${(ns.length / total) * 100}%;background:${regionColor[r]}">${r} ${ns.length}</i>`).join('')}</div>
<div class="grid g3">${leads.map((s) => card(s, 'lead')).join('')}</div>
<div class="grid g6">${tiles.slice(0, 6).map((s) => card(s, 'small')).join('')}</div>
<div class="grid g6">${tiles.slice(6).map((s) => card(s, 'small')).join('')}</div>
<div class="bottom">
  <div class="mapbox"><h3>WHERE IT HAPPENED · stories 1–15</h3>${mapSvg}</div>
  <div class="also"><h3>ALSO ON FRIDAY 20 NOVEMBER — ${briefs.length} MORE</h3>
    <ol>${briefs.map(([n, p, t, s]) => `<li><i style="background:${regionColor[regionByStory[n]]}">${n}</i><b>${esc(p)}</b> ${esc(t)}</li>`).join('')}</ol>
    <div class="dc"><b>DATE CHECK</b> Left out as earlier news: the ICJ's Rohingya ruling, Anthropic's IPO day, the Trump–Putin–Xi statement, the US Senate energy vote, Uganda's Ebola rally ban (all 19 Nov) and the Kerch Bridge strikes (16–19 Nov). Not yet: COP31's final text, the Las Vegas race.</div>
  </div>
</div>
<footer><span>Every story happened, or was first reported, on Fri 20 Nov 2026. Tolls are early official counts; claims attributed.</span><span>Sources: AP, Reuters, AFP, Al Jazeera, Anadolu, CNBC, IMD, ONS, UEFA, EFE · original drawings</span></footer>
</body></html>`;

mkdirSync(join(root, 'build'), { recursive: true });
const page = join(root, 'build', 'page.html');
writeFileSync(page, html);

const edge = process.env.EDGE ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const out = join(root, 'entry.png');
execFileSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${out}`, 'file:///' + page.replace(/\\/g, '/')], { stdio: 'inherit' });
console.log('entry.png', statSync(out).size, 'bytes, stories:', total);
