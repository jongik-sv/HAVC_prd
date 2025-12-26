const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const { MdQrCode, MdSync, MdAnalytics, MdNotifications, MdPerson, MdBuild, MdDashboard,
        MdSmartphone, MdComputer, MdDns, MdStorage, MdChat, MdQrCodeScanner, MdEdit,
        MdCheckCircle, MdHistory, MdSettings, MdListAlt, MdCancel, MdVisibility,
        MdEventAvailable, MdVerifiedUser } = require('react-icons/md');

const ICONS_DIR = path.join(__dirname, 'icons');
const SLIDES_DIR = path.join(__dirname, 'slides');
const SKILL_DIR = '/home/jji/project/HAVC_prd/.claude/skills/pptx';

if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

async function rasterizeIcon(IconComponent, color, size, filename) {
  const svgString = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: size })
  );
  await sharp(Buffer.from(svgString)).png().toFile(path.join(ICONS_DIR, filename));
}

async function createKakaoIcon(filename) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="28" fill="#FEE500"/>
    <path d="M32 20c-8.8 0-16 5.4-16 12 0 4.3 2.8 8.1 7 10.4l-1.4 5.2c-.1.4.3.7.6.5l6.2-4.1c1.2.2 2.4.3 3.6.3 8.8 0 16-5.4 16-12s-7.2-12-16-12z" fill="#3C1E1E"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(ICONS_DIR, filename));
}

async function generateIcons() {
  console.log('Generating icons...');

  // Slide 3
  await rasterizeIcon(MdQrCode, '002452', '64', 'qr_code.png');
  await rasterizeIcon(MdSync, 'C51F2A', '64', 'sync.png');
  await rasterizeIcon(MdAnalytics, '4B6580', '64', 'analytics.png');
  await rasterizeIcon(MdNotifications, 'E9B86E', '64', 'notifications.png');

  // Slide 5
  await rasterizeIcon(MdPerson, '1976D2', '64', 'person_blue.png');
  await rasterizeIcon(MdVerifiedUser, '388E3C', '64', 'approval_green.png');
  await rasterizeIcon(MdBuild, 'F57C00', '64', 'build_orange.png');
  await rasterizeIcon(MdDashboard, '7B1FA2', '64', 'dashboard_purple.png');

  // Slide 6/7/8
  await rasterizeIcon(MdSmartphone, 'FFFFFF', '64', 'smartphone_white.png');
  await rasterizeIcon(MdComputer, 'FFFFFF', '64', 'computer_white.png');
  await rasterizeIcon(MdDns, 'FFFFFF', '64', 'dns_white.png');
  await rasterizeIcon(MdStorage, 'FFFFFF', '64', 'storage_white.png');
  await rasterizeIcon(MdChat, '333333', '64', 'chat_dark.png');
  await rasterizeIcon(MdQrCodeScanner, '1976D2', '128', 'qr_scan_blue.png');
  await rasterizeIcon(MdQrCode, 'FFFFFF', '64', 'qr_code_white.png');
  await rasterizeIcon(MdEdit, 'FFFFFF', '64', 'edit_white.png');
  await rasterizeIcon(MdCheckCircle, 'FFFFFF', '64', 'check_white.png');
  await rasterizeIcon(MdBuild, 'FFFFFF', '64', 'build_white.png');
  await rasterizeIcon(MdDashboard, 'FFFFFF', '64', 'dashboard_white.png');
  await rasterizeIcon(MdListAlt, 'FFFFFF', '64', 'list_white.png');
  await rasterizeIcon(MdHistory, 'FFFFFF', '64', 'history_white.png');
  await rasterizeIcon(MdSettings, 'FFFFFF', '64', 'settings_white.png');

  // Slide 13/14
  await createKakaoIcon('kakao_yellow.png');
  await rasterizeIcon(MdSmartphone, '1976D2', '64', 'smartphone_blue.png');
  await rasterizeIcon(MdComputer, '388E3C', '64', 'computer_green.png');

  // Slide 16
  await rasterizeIcon(MdCancel, 'FFFFFF', '64', 'cancel_white.png');
  await rasterizeIcon(MdVisibility, 'FFFFFF', '64', 'visibility_white.png');
  await rasterizeIcon(MdEventAvailable, 'FFFFFF', '64', 'event_white.png');

  console.log('Icons generated.');
}

async function buildPresentation() {
  const html2pptx = require(path.join(SKILL_DIR, 'scripts', 'html2pptx.js'));

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = '동국시스템즈';
  pptx.title = '공조설비 정보관리 시스템 구축 사전 설명회';

  console.log('\nBuilding presentation...');

  for (let i = 1; i <= 18; i++) {
    const slideNum = String(i).padStart(2, '0');
    const htmlFile = path.join(SLIDES_DIR, `slide${slideNum}.html`);

    if (fs.existsSync(htmlFile)) {
      console.log(`Processing slide ${i}...`);
      try {
        await html2pptx(htmlFile, pptx, { tmpDir: path.join(__dirname, 'tmp') });
      } catch (err) {
        console.error(`  Error: ${err.message}`);
      }
    }
  }

  const outputPath = '/home/jji/project/HAVC_prd/docgen/HAVC_presentation.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log(`\nSaved: ${outputPath}`);
}

async function main() {
  try {
    await generateIcons();
    await buildPresentation();
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main();
