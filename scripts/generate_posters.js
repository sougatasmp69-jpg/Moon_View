import fs from 'fs';
import path from 'path';

const wallpapers = [
  {
    filename: 'naruto_kurama_sage.svg',
    title: 'SIX PATHS SAGE',
    anime: 'NARUTO SHIPPUDEN',
    color1: '#f59e0b',
    color2: '#ea580c',
    color3: '#7c2d12',
    moonColor: '#fef08a',
    element: 'kurama'
  },
  {
    filename: 'sukuna_malevolent_shrine.svg',
    title: 'MALEVOLENT SHRINE',
    anime: 'JUJUTSU KAISEN',
    color1: '#ef4444',
    color2: '#991b1b',
    color3: '#450a0a',
    moonColor: '#f87171',
    element: 'shrine'
  },
  {
    filename: 'zenitsu_thunder_god.svg',
    title: 'GODSPEED THUNDER',
    anime: 'DEMON SLAYER',
    color1: '#eab308',
    color2: '#ca8a04',
    color3: '#1e1b4b',
    moonColor: '#fef9c3',
    element: 'thunder'
  },
  {
    filename: 'itachi_blood_moon.svg',
    title: 'TSUKUYOMI ILLUSION',
    anime: 'NARUTO SHIPPUDEN',
    color1: '#dc2626',
    color2: '#7f1d1d',
    color3: '#18181b',
    moonColor: '#ef4444',
    element: 'sharingan'
  },
  {
    filename: 'megumi_chimera_garden.svg',
    title: 'CHIMERA SHADOW',
    anime: 'JUJUTSU KAISEN',
    color1: '#06b6d4',
    color2: '#0e7490',
    color3: '#090a16',
    moonColor: '#67e8f9',
    element: 'shadow'
  },
  {
    filename: 'levi_beast_slayer.svg',
    title: 'HUMANITYS STRONGEST',
    anime: 'ATTACK ON TITAN',
    color1: '#10b981',
    color2: '#047857',
    color3: '#064e3b',
    moonColor: '#a7f3d0',
    element: 'blades'
  },
  {
    filename: 'chainsaw_denji_hybrid.svg',
    title: 'CHAINSAW DEVIL',
    anime: 'CHAINSAW MAN',
    color1: '#f97316',
    color2: '#c2410c',
    color3: '#1c1917',
    moonColor: '#fdba74',
    element: 'chainsaw'
  },
  {
    filename: 'bleach_ichigo_bankai.svg',
    title: 'TENSA ZANGETSU',
    anime: 'BLEACH: TYBW',
    color1: '#3b82f6',
    color2: '#1d4ed8',
    color3: '#0f172a',
    moonColor: '#93c5fd',
    element: 'bankai'
  }
];

function generateSvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bg-${item.element}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.color3}" />
      <stop offset="50%" stop-color="#070814" />
      <stop offset="100%" stop-color="#030308" />
    </linearGradient>
    <radialGradient id="moon-${item.element}" cx="65%" cy="35%" r="50%">
      <stop offset="0%" stop-color="${item.moonColor}" stop-opacity="1" />
      <stop offset="70%" stop-color="${item.color1}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${item.color2}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="aura-${item.element}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${item.color1}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${item.color2}" stop-opacity="0" />
    </radialGradient>
    <filter id="glow-${item.element}">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Deep space background -->
  <rect width="1920" height="1080" fill="url(#bg-${item.element})" />

  <!-- Stars -->
  ${Array.from({ length: 60 }).map(() => {
    const cx = Math.floor(Math.random() * 1920);
    const cy = Math.floor(Math.random() * 1080);
    const r = (Math.random() * 2 + 0.5).toFixed(1);
    const op = (Math.random() * 0.7 + 0.3).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${op}" />`;
  }).join('\n  ')}

  <!-- Cosmic Moon -->
  <circle cx="1280" cy="380" r="280" fill="url(#moon-${item.element})" />
  <circle cx="1280" cy="380" r="320" fill="none" stroke="${item.color1}" stroke-width="2" opacity="0.4" stroke-dasharray="15 8" />
  <circle cx="1280" cy="380" r="380" fill="none" stroke="${item.color2}" stroke-width="1" opacity="0.2" />

  <!-- Aura Glow Center -->
  <circle cx="960" cy="640" r="500" fill="url(#aura-${item.element})" />

  <!-- Dynamic Geometry / Anime Silhouettes -->
  <path d="M 300 1080 L 700 450 L 960 700 L 1300 380 L 1680 1080 Z" fill="#0b0d1e" opacity="0.8" />
  <path d="M 450 1080 L 780 560 L 1100 800 L 1450 490 L 1800 1080 Z" fill="#111427" opacity="0.6" />

  <!-- Energy Rings & Swirls -->
  <ellipse cx="960" cy="620" rx="600" ry="140" fill="none" stroke="${item.color1}" stroke-width="6" opacity="0.6" filter="url(#glow-${item.element})" transform="rotate(-15 960 620)" />
  <ellipse cx="960" cy="620" rx="680" ry="160" fill="none" stroke="${item.color2}" stroke-width="3" opacity="0.4" transform="rotate(25 960 620)" />

  <!-- Holographic Grid Base -->
  <line x1="0" y1="920" x2="1920" y2="920" stroke="${item.color1}" stroke-width="1.5" opacity="0.3" />
  <line x1="0" y1="980" x2="1920" y2="980" stroke="${item.color1}" stroke-width="1.5" opacity="0.2" />
  <line x1="0" y1="1040" x2="1920" y2="1040" stroke="${item.color1}" stroke-width="1.5" opacity="0.1" />

  <!-- Anime Typography & Watermark Stamp -->
  <g transform="translate(120, 320)">
    <text x="0" y="0" font-family="'Outfit', 'Impact', sans-serif" font-size="28" font-weight="800" fill="${item.color1}" letter-spacing="8" opacity="0.9">${item.anime}</text>
    <text x="0" y="80" font-family="'Outfit', sans-serif" font-size="82" font-weight="900" fill="#ffffff" letter-spacing="4">${item.title}</text>
    <rect x="0" y="110" width="120" height="4" fill="${item.color1}" />
    <text x="0" y="145" font-family="'JetBrains Mono', monospace" font-size="20" fill="#94a3b8" letter-spacing="3">MOON_VIEW 3D CINEMATIC MASTER // 8K HDR</text>
  </g>

  <!-- 3D Badge Indicator -->
  <g transform="translate(1620, 100)">
    <rect x="0" y="0" width="180" height="50" rx="25" fill="#090b1a" stroke="${item.color1}" stroke-width="2" />
    <text x="90" y="32" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="${item.color1}" text-anchor="middle" letter-spacing="2">★ 3D LIVE</text>
  </g>
</svg>`;
}

const outDir = path.resolve('public/wallpapers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

wallpapers.forEach((wp) => {
  const filePath = path.join(outDir, wp.filename);
  fs.writeFileSync(filePath, generateSvg(wp));
  console.log('Created', wp.filename);
});
