const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = __dirname;

// System Architecture Diagram - 800x400px
async function createArchitectureDiagram() {
  const width = 800;
  const height = 400;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Shadows -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
    <filter id="shadowLight" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.1"/>
    </filter>

    <!-- Gradients -->
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#42A5F5"/>
      <stop offset="100%" style="stop-color:#1976D2"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#66BB6A"/>
      <stop offset="100%" style="stop-color:#388E3C"/>
    </linearGradient>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A3A6E"/>
      <stop offset="100%" style="stop-color:#002452"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#FFFFFF"/>

  <!-- Tier Labels -->
  <text x="120" y="35" font-family="Arial" font-size="11" fill="#999999" text-anchor="middle" font-weight="500">CLIENT</text>
  <text x="400" y="35" font-family="Arial" font-size="11" fill="#999999" text-anchor="middle" font-weight="500">SERVER</text>
  <text x="680" y="35" font-family="Arial" font-size="11" fill="#999999" text-anchor="middle" font-weight="500">DATA</text>

  <!-- Connection Lines -->
  <line x1="200" y1="140" x2="290" y2="200" stroke="#B0BEC5" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="200" y1="270" x2="290" y2="200" stroke="#B0BEC5" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="510" y1="200" x2="580" y2="140" stroke="#B0BEC5" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="510" y1="200" x2="580" y2="270" stroke="#B0BEC5" stroke-width="2" stroke-dasharray="5,3"/>

  <!-- Arrow heads -->
  <polygon points="285,197 295,200 285,203" fill="#B0BEC5"/>
  <polygon points="285,197 295,200 285,203" fill="#B0BEC5" transform="translate(0,60)"/>
  <polygon points="575,137 585,140 575,143" fill="#B0BEC5"/>
  <polygon points="575,267 585,270 575,273" fill="#B0BEC5"/>

  <!-- Connection Labels -->
  <rect x="215" y="148" width="60" height="18" rx="9" fill="#F5F5F5"/>
  <text x="245" y="161" font-family="Arial" font-size="9" fill="#666666" text-anchor="middle">REST API</text>

  <rect x="530" y="148" width="40" height="18" rx="9" fill="#F5F5F5"/>
  <text x="550" y="161" font-family="Arial" font-size="9" fill="#666666" text-anchor="middle">JPA</text>

  <rect x="530" y="268" width="60" height="18" rx="9" fill="#F5F5F5"/>
  <text x="560" y="281" font-family="Arial" font-size="9" fill="#666666" text-anchor="middle">알림톡 API</text>

  <!-- Mobile App Box -->
  <rect x="40" y="80" width="160" height="120" rx="16" fill="url(#blueGrad)" filter="url(#shadow)"/>
  <rect x="95" y="110" width="50" height="35" rx="6" fill="rgba(255,255,255,0.25)"/>
  <rect x="105" y="115" width="30" height="20" rx="3" fill="rgba(255,255,255,0.4)"/>
  <text x="120" y="165" font-family="Arial" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="600">Mobile App</text>
  <rect x="80" y="175" width="80" height="20" rx="10" fill="rgba(255,255,255,0.9)"/>
  <text x="120" y="189" font-family="Arial" font-size="10" fill="#1976D2" text-anchor="middle" font-weight="500">Flutter</text>

  <!-- Web Admin Box -->
  <rect x="40" y="210" width="160" height="120" rx="16" fill="url(#greenGrad)" filter="url(#shadow)"/>
  <rect x="80" y="235" width="80" height="50" rx="4" fill="rgba(255,255,255,0.25)"/>
  <rect x="85" y="240" width="70" height="6" rx="2" fill="rgba(255,255,255,0.4)"/>
  <rect x="85" y="250" width="40" height="30" rx="2" fill="rgba(255,255,255,0.3)"/>
  <rect x="130" y="250" width="20" height="30" rx="2" fill="rgba(255,255,255,0.3)"/>
  <text x="120" y="300" font-family="Arial" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="600">Web Admin</text>
  <rect x="85" y="308" width="70" height="20" rx="10" fill="rgba(255,255,255,0.9)"/>
  <text x="120" y="322" font-family="Arial" font-size="10" fill="#388E3C" text-anchor="middle" font-weight="500">React</text>

  <!-- Backend Server Box -->
  <rect x="290" y="95" width="220" height="210" rx="20" fill="url(#navyGrad)" filter="url(#shadow)"/>
  <rect x="370" y="130" width="60" height="50" rx="6" fill="rgba(255,255,255,0.15)"/>
  <rect x="385" y="145" width="30" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
  <rect x="385" y="155" width="30" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
  <rect x="385" y="165" width="30" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
  <text x="400" y="210" font-family="Arial" font-size="15" fill="#FFFFFF" text-anchor="middle" font-weight="600">Backend Server</text>
  <rect x="335" y="225" width="130" height="24" rx="12" fill="rgba(255,255,255,0.9)"/>
  <text x="400" y="242" font-family="Arial" font-size="11" fill="#002452" text-anchor="middle" font-weight="500">Spring Boot</text>
  <text x="400" y="275" font-family="Arial" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">REST API / Jeus 8.x</text>

  <!-- Tibero DB Box -->
  <rect x="600" y="80" width="160" height="100" rx="12" fill="#607D8B" filter="url(#shadowLight)"/>
  <ellipse cx="680" cy="110" rx="40" ry="12" fill="rgba(255,255,255,0.2)"/>
  <rect x="640" y="110" width="80" height="35" fill="#607D8B"/>
  <ellipse cx="680" cy="145" rx="40" ry="12" fill="rgba(255,255,255,0.15)"/>
  <text x="680" y="170" font-family="Arial" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="600">Tibero 6.x</text>

  <!-- Kakao API Box -->
  <rect x="600" y="210" width="160" height="100" rx="12" fill="#FEE500" filter="url(#shadowLight)"/>
  <circle cx="680" cy="250" r="22" fill="#3C1E1E"/>
  <path d="M680 238 c-8 0-14 5-14 11 0 4 2.5 7.5 6.5 9.5l-1.5 5.5 6-4c1 0.2 2 0.3 3 0.3 8 0 14-5 14-11.3s-6-11-14-11z" fill="#FEE500"/>
  <text x="680" y="295" font-family="Arial" font-size="11" fill="#3C1E1E" text-anchor="middle" font-weight="600">카카오톡 API</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'system_architecture.png'));

  console.log('Created: system_architecture.png');
}

// Process Flow Diagram - 900x300px
async function createProcessFlowDiagram() {
  const width = 900;
  const height = 300;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
    <linearGradient id="navyNode" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A3A6E"/>
      <stop offset="100%" style="stop-color:#002452"/>
    </linearGradient>
    <linearGradient id="greenNode" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#43A047"/>
      <stop offset="100%" style="stop-color:#2E7D32"/>
    </linearGradient>
    <linearGradient id="orangeNode" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF9800"/>
      <stop offset="100%" style="stop-color:#F57C00"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#FFFFFF"/>

  <!-- Connection arrows with Kakao icons -->
  ${[0, 1, 2, 3, 4].map(i => {
    const x1 = 100 + i * 130;
    const x2 = x1 + 90;
    return `
      <line x1="${x1 + 45}" y1="120" x2="${x2}" y2="120" stroke="#E0E0E0" stroke-width="2"/>
      <polygon points="${x2 - 5},116 ${x2 + 5},120 ${x2 - 5},124" fill="#E0E0E0"/>
      <circle cx="${(x1 + 45 + x2) / 2}" cy="100" r="12" fill="#FEE500"/>
      <path d="M${(x1 + 45 + x2) / 2} 94 c-4 0-7 2.5-7 5.5 0 2 1.3 3.8 3.3 4.8l-0.8 2.7 3-2c0.5 0.1 1 0.15 1.5 0.15 4 0 7-2.5 7-5.65s-3-5.5-7-5.5z" fill="#3C1E1E" transform="scale(0.8) translate(${((x1 + 45 + x2) / 2) * 0.25}, 20)"/>
    `;
  }).join('')}

  <!-- Node 1: 수리요청 (Navy - Internal) -->
  <circle cx="100" cy="120" r="40" fill="url(#navyNode)" filter="url(#nodeShadow)"/>
  <text x="100" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text>
  <text x="100" y="180" font-family="Arial" font-size="12" fill="#002452" text-anchor="middle" font-weight="600">수리요청</text>
  <text x="100" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">신고자(내부)</text>

  <!-- Node 2: 승인 (Green - Approval) -->
  <circle cx="230" cy="120" r="40" fill="url(#greenNode)" filter="url(#nodeShadow)"/>
  <text x="230" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">20</text>
  <text x="230" y="180" font-family="Arial" font-size="12" fill="#2E7D32" text-anchor="middle" font-weight="600">승인</text>
  <text x="230" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">승인권자(내부)</text>

  <!-- Node 3: 고장접수 (Orange - External) -->
  <circle cx="360" cy="120" r="40" fill="url(#orangeNode)" filter="url(#nodeShadow)"/>
  <text x="360" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">30</text>
  <text x="360" y="180" font-family="Arial" font-size="12" fill="#F57C00" text-anchor="middle" font-weight="600">고장접수</text>
  <text x="360" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">정비업체(외부)</text>

  <!-- Node 4: 수리시작 (Orange - External) -->
  <circle cx="490" cy="120" r="40" fill="url(#orangeNode)" filter="url(#nodeShadow)"/>
  <text x="490" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">40</text>
  <text x="490" y="180" font-family="Arial" font-size="12" fill="#F57C00" text-anchor="middle" font-weight="600">수리시작</text>
  <text x="490" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">정비업체(외부)</text>

  <!-- Node 5: 수리완료 (Orange - External) -->
  <circle cx="620" cy="120" r="40" fill="url(#orangeNode)" filter="url(#nodeShadow)"/>
  <text x="620" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">50</text>
  <text x="620" y="180" font-family="Arial" font-size="12" fill="#F57C00" text-anchor="middle" font-weight="600">수리완료</text>
  <text x="620" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">정비업체(외부)</text>

  <!-- Node 6: 종료 (Navy - Internal) -->
  <circle cx="750" cy="120" r="40" fill="url(#navyNode)" filter="url(#nodeShadow)"/>
  <text x="750" y="128" font-family="Arial" font-size="22" fill="#FFFFFF" text-anchor="middle" font-weight="700">60</text>
  <text x="750" y="180" font-family="Arial" font-size="12" fill="#002452" text-anchor="middle" font-weight="600">종료</text>
  <text x="750" y="196" font-family="Arial" font-size="9" fill="#999999" text-anchor="middle">신고자(내부)</text>

  <!-- Last arrow -->
  <line x1="665" y1="120" x2="705" y2="120" stroke="#E0E0E0" stroke-width="2"/>
  <polygon points="700,116 710,120 700,124" fill="#E0E0E0"/>
  <circle cx="685" cy="100" r="12" fill="#FEE500"/>

  <!-- Legend -->
  <rect x="280" y="240" width="340" height="40" rx="8" fill="#F8F9FA"/>
  <circle cx="330" cy="260" r="10" fill="#002452"/>
  <text x="350" y="264" font-family="Arial" font-size="11" fill="#666666">내부 사용자</text>
  <circle cx="460" cy="260" r="10" fill="#F57C00"/>
  <text x="480" y="264" font-family="Arial" font-size="11" fill="#666666">외부 정비업체</text>
  <circle cx="570" cy="260" r="8" fill="#FEE500"/>
  <text x="585" y="264" font-family="Arial" font-size="11" fill="#666666">알림</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'process_flow.png'));

  console.log('Created: process_flow.png');
}

async function main() {
  console.log('Generating diagrams with Systematic Precision philosophy...\n');

  try {
    await createArchitectureDiagram();
    await createProcessFlowDiagram();
    console.log('\nAll diagrams generated successfully!');
  } catch (err) {
    console.error('Error generating diagrams:', err);
    process.exit(1);
  }
}

main();
