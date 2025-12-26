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

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const ICONS_DIR = path.join(__dirname, 'icons');
const IMAGES_DIR = '/home/jji/project/HAVC_prd/HAVC/detail_design';

if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

// Brand colors
const NAVY = '002452';
const RED = 'C51F2A';
const GRAY = '666666';
const LIGHT_GRAY = 'F8F9FA';
const GREEN = '388E3C';
const ORANGE = 'F57C00';

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
  // Slide 3: Project Overview
  await rasterizeIcon(MdQrCode, NAVY, 64, 'qr_code.png');
  await rasterizeIcon(MdSync, RED, 64, 'sync.png');
  await rasterizeIcon(MdAnalytics, '4B6580', 64, 'analytics.png');
  await rasterizeIcon(MdNotifications, 'E9B86E', 64, 'notifications.png');
  // Slide 5: Personas
  await rasterizeIcon(MdPerson, '1976D2', 64, 'person_blue.png');
  await rasterizeIcon(MdVerifiedUser, GREEN, 64, 'approval_green.png');
  await rasterizeIcon(MdBuild, ORANGE, 64, 'build_orange.png');
  await rasterizeIcon(MdDashboard, '7B1FA2', 64, 'dashboard_purple.png');
  // Slide 7: Mobile Features
  await rasterizeIcon(MdQrCodeScanner, NAVY, 64, 'qr_scan.png');
  await rasterizeIcon(MdEdit, NAVY, 64, 'edit.png');
  await rasterizeIcon(MdCheckCircle, NAVY, 64, 'check.png');
  await rasterizeIcon(MdBuild, NAVY, 64, 'build.png');
  // Slide 8: Web Features
  await rasterizeIcon(MdDashboard, 'FFFFFF', 64, 'dashboard_white.png');
  await rasterizeIcon(MdListAlt, 'FFFFFF', 64, 'list_white.png');
  await rasterizeIcon(MdHistory, 'FFFFFF', 64, 'history_white.png');
  await rasterizeIcon(MdSettings, 'FFFFFF', 64, 'settings_white.png');
  // Slide 16: Benefits
  await rasterizeIcon(MdCancel, 'FFFFFF', 64, 'cancel_white.png');
  await rasterizeIcon(MdVisibility, 'FFFFFF', 64, 'visibility_white.png');
  await rasterizeIcon(MdEventAvailable, 'FFFFFF', 64, 'event_white.png');
  // Kakao icon
  await createKakaoIcon('kakao.png');
  console.log('Icons generated.');
}

async function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = '동국시스템즈';
  pptx.title = '공조설비 정보관리 시스템 구축 사전 설명회';
  pptx.subject = 'HVAC System Presentation';

  // Slide 1: Title
  let slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: NAVY } });
  slide.addText('공조설비 정보관리 시스템 구축', { x: 0.5, y: 2, w: 9, h: 1, fontSize: 36, bold: true, color: 'FFFFFF', align: 'center' });
  slide.addText('사전 설명회 I 2025.12', { x: 0.5, y: 3.1, w: 9, h: 0.5, fontSize: 18, color: 'E9B86E', align: 'center' });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 4.25, y: 3.7, w: 1.5, h: 0.06, fill: { color: RED } });
  slide.addText('동국시스템즈', { x: 7.5, y: 5.1, w: 2, h: 0.3, fontSize: 10, color: 'AAAAAA', align: 'right' });

  // Slide 2: TOC
  slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: NAVY } });
  slide.addText('목차', { x: 0.5, y: 0.25, w: 9, h: 0.5, fontSize: 24, bold: true, color: 'FFFFFF' });

  const tocItems = [
    ['01', '프로젝트 개요', '03'],
    ['02', '현황 및 문제점', '04-05'],
    ['03', '시스템 구성', '06'],
    ['04', '핵심 기능 및 주요 화면', '07-12'],
    ['05', '업무 프로세스', '13-14'],
    ['06', '기대 효과', '15-16'],
    ['07', '추진 일정', '17']
  ];
  tocItems.forEach((item, i) => {
    const y = 1.2 + i * 0.55;
    slide.addText(item[0], { x: 0.8, y, w: 0.6, h: 0.45, fontSize: 22, bold: true, color: NAVY });
    slide.addText(item[1], { x: 1.5, y, w: 6.5, h: 0.45, fontSize: 14, color: '333333' });
    slide.addText(item[2], { x: 8.5, y, w: 0.7, h: 0.45, fontSize: 11, color: '999999', align: 'right' });
    if (i < tocItems.length - 1) {
      slide.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y + 0.48, w: 8.4, h: 0.01, fill: { color: 'E0E0E0' } });
    }
  });

  // Slide 3: Project Overview
  slide = pptx.addSlide();
  addHeader(slide, pptx, '1. 프로젝트 개요');
  addActionBar(slide, '공조설비 고장신고부터 수리완료까지 전 과정을 디지털화하는 설비 정비 관리 시스템입니다.', pptx);

  const features = [
    ['QR코드 기반', '현장 스캔으로 즉시 고장신고', NAVY, 'qr_code.png'],
    ['실시간 추적', '요청→승인→수리→완료 전 과정', RED, 'sync.png'],
    ['데이터 기반', '고장 통계 및 정비 이력 분석', '4B6580', 'analytics.png'],
    ['자동 알림', '카카오톡 실시간 통보', 'E9B86E', 'notifications.png']
  ];
  features.forEach((f, i) => {
    const x = 0.6 + i * 2.35;
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.8, w: 2.1, h: 2.6, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', blur: 6, offset: 2, angle: 90, opacity: 0.1 } });
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.8, w: 0.06, h: 2.6, fill: { color: f[2] } });
    slide.addImage({ path: path.join(ICONS_DIR, f[3]), x: x + 0.7, y: 2.0, w: 0.6, h: 0.6 });
    slide.addText(f[0], { x: x + 0.2, y: 2.7, w: 1.8, h: 0.35, fontSize: 13, bold: true, color: NAVY });
    slide.addText(f[1], { x: x + 0.2, y: 3.1, w: 1.8, h: 0.8, fontSize: 10, color: GRAY });
  });

  // Slide 4: Problems Table
  slide = pptx.addSlide();
  addHeader(slide, pptx, '2. 현황 및 문제점');
  addActionBar(slide, '전화/구두 신고로 인한 기록 누락과 수작업 대장 관리가 가장 큰 문제입니다.', pptx);

  const tableData = [
    [{ text: '문제점', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } },
     { text: '영향', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } },
     { text: '심각도', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } }],
    ['전화/구두 신고로 기록 누락', '정비 이력 관리 불가', { text: '높음', options: { fill: { color: RED }, color: 'FFFFFF', bold: true } }],
    ['수작업 대장 관리', '실시간 현황 파악 불가', { text: '높음', options: { fill: { color: RED }, color: 'FFFFFF', bold: true } }],
    ['담당자 연락 지연', '수리 완료 시간 증가', { text: '중간', options: { fill: { color: ORANGE }, color: 'FFFFFF', bold: true } }],
    ['부품 재고 파악 어려움', '긴급 구매 빈발', { text: '중간', options: { fill: { color: ORANGE }, color: 'FFFFFF', bold: true } }]
  ];
  slide.addTable(tableData, { x: 0.6, y: 1.8, w: 8.8, h: 2.5, colW: [3.5, 3.5, 1.8], fontSize: 11, border: { pt: 0.5, color: 'E0E0E0' }, align: 'center', valign: 'middle' });

  // Slide 5: Pain Points
  slide = pptx.addSlide();
  addHeader(slide, pptx, '2. 현황 및 문제점');
  addActionBar(slide, '각 이해관계자별로 업무 수행에 어려움을 겪고 있습니다.', pptx);

  const personas = [
    ['신고자', '누구에게 연락?\n진행상황은?\n언제 수리?', 'E3F2FD', '1976D2', 'person_blue.png'],
    ['승인권자', '수많은 전화\n우선순위 판단 어려움', 'E8F5E9', GREEN, 'approval_green.png'],
    ['정비담당자', '현장 위치 파악 어려움\n정비이력 없음', 'FFF3E0', ORANGE, 'build_orange.png'],
    ['관리자', '전체 현황 파악 불가\n통계 산출 불가', 'F3E5F5', '7B1FA2', 'dashboard_purple.png']
  ];
  personas.forEach((p, i) => {
    const x = 0.6 + i * 2.35;
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.7, w: 2.1, h: 2.8, fill: { color: 'FFFFFF' }, line: { color: 'E0E0E0', pt: 1 }, shadow: { type: 'outer', blur: 4, offset: 1, angle: 90, opacity: 0.08 } });
    slide.addShape(pptx.shapes.OVAL, { x: x + 0.65, y: 1.9, w: 0.8, h: 0.8, fill: { color: p[2] } });
    slide.addImage({ path: path.join(ICONS_DIR, p[4]), x: x + 0.75, y: 2.0, w: 0.6, h: 0.6 });
    slide.addText(p[0], { x, y: 2.8, w: 2.1, h: 0.35, fontSize: 12, bold: true, color: p[3], align: 'center' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: x + 0.1, y: 3.2, w: 1.9, h: 1.1, fill: { color: 'FFF5F5' } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: x + 0.1, y: 3.2, w: 0.05, h: 1.1, fill: { color: RED } });
    slide.addText(p[1], { x: x + 0.2, y: 3.3, w: 1.7, h: 0.9, fontSize: 9, color: RED });
  });

  // Slide 6: System Architecture (using canvas-design diagram)
  slide = pptx.addSlide();
  addHeader(slide, pptx, '3. 시스템 구성');
  addActionBar(slide, '모바일 앱, 웹 관리자, 백엔드 서버 3개 컴포넌트로 구성됩니다.', pptx);
  slide.addImage({ path: path.join(DIAGRAMS_DIR, 'system_architecture.png'), x: 0.5, y: 1.6, w: 9, h: 3.6 });

  // Slide 7: Mobile Features
  slide = pptx.addSlide();
  addHeader(slide, pptx, '4. 핵심 기능 - 모바일 앱');
  addActionBar(slide, 'QR스캔으로 설비를 인식하고, 고장신고부터 수리완료까지 전 과정을 처리합니다.', pptx);

  const mobileFeatures = [
    ['01', 'QR 스캔 신고', '설비 QR코드 스캔\n→ 자동 정보 입력', 'qr_scan.png'],
    ['02', '고장 신고 등록', '고장유형, 내용\n사진, 긴급여부', 'edit.png'],
    ['03', '승인/반려', '요청건 승인\n또는 반려 처리', 'check.png'],
    ['04', '수리 시작/완료', '현장 도착 후\nQR 스캔으로 작업', 'build.png']
  ];
  mobileFeatures.forEach((f, i) => {
    const x = 0.6 + i * 2.35;
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.7, w: 2.1, h: 2.6, fill: { color: 'FFFFFF' }, line: { color: 'E8E8E8', pt: 1 }, shadow: { type: 'outer', blur: 4, offset: 1, angle: 90, opacity: 0.06 } });
    slide.addText(f[0], { x, y: 1.8, w: 2.1, h: 0.4, fontSize: 18, color: 'E0E0E0', bold: true });
    slide.addImage({ path: path.join(ICONS_DIR, f[3]), x: x + 0.75, y: 2.2, w: 0.6, h: 0.6 });
    slide.addText(f[1], { x: x + 0.15, y: 2.9, w: 1.9, h: 0.35, fontSize: 11, bold: true, color: NAVY });
    slide.addText(f[2], { x: x + 0.15, y: 3.3, w: 1.9, h: 0.8, fontSize: 9, color: GRAY });
  });

  // Slide 8: Web Features
  slide = pptx.addSlide();
  addHeader(slide, pptx, '4. 핵심 기능 - 웹 관리자');
  addActionBar(slide, '대시보드로 전체 현황을 파악하고, 설비별 이력과 기준정보를 관리합니다.', pptx);

  const webFeatures = [
    ['종합 상황판', '실시간 현황 모니터링', 'dashboard_white.png'],
    ['정비 현황 관리', '전체 요청 검색/조회', 'list_white.png'],
    ['설비별 이력 카드', '고장/수리 타임라인', 'history_white.png'],
    ['기준정보 관리', '설비, 사용자, 업체', 'settings_white.png']
  ];
  webFeatures.forEach((f, i) => {
    const x = 0.6 + i * 2.35;
    slide.addShape(pptx.shapes.OVAL, { x: x + 0.65, y: 1.9, w: 0.8, h: 0.8, fill: { color: GREEN } });
    slide.addImage({ path: path.join(ICONS_DIR, f[2]), x: x + 0.75, y: 2.0, w: 0.6, h: 0.6 });
    slide.addText(f[0], { x, y: 2.8, w: 2.1, h: 0.35, fontSize: 11, bold: true, color: NAVY, align: 'center' });
    slide.addText(f[1], { x, y: 3.15, w: 2.1, h: 0.35, fontSize: 9, color: GRAY, align: 'center' });
  });

  // Slides 9-12: Screenshots
  const screensConfig = [
    { title: '4. 주요 화면 - 모바일 앱 (수리요청)', action: 'QR코드 스캔부터 수리요청까지의 직관적인 사용자 경험을 제공합니다.',
      screens: [['MOB-LOG-001_로그인.png', '로그인'], ['MOB-HOM-001_홈.png', '홈 화면'], ['MOB-REQ-001_수리요청화면.png', '수리요청']] },
    { title: '4. 주요 화면 - 모바일 앱 (작업처리)', action: '정비업체가 사용하는 고장접수부터 수리완료까지의 작업 화면입니다.',
      screens: [['MOB-RCV-002_고장접수처리.png', '고장접수'], ['MOB-STR-001_수리시작등록.png', '수리시작'], ['MOB-END-001_수리완료등록.png', '수리완료']] },
    { title: '4. 주요 화면 - 웹 관리자 (대시보드)', action: '실시간 현황 파악과 정비이력 관리를 위한 관리자 화면입니다.',
      screens: [['WEB-DSH-001_정비현황조회_대시보드.png', '대시보드'], ['WEB-WRK-001_정비진행조회처리.png', '정비 진행 조회'], ['WEB-HIS-001_정비이력조회.png', '정비 이력 조회']] },
    { title: '4. 주요 화면 - 웹 관리자 (기준정보)', action: '시스템 운영을 위한 마스터 데이터 관리 화면입니다.',
      screens: [['WEB-EQP-001_공조설비정보관리.png', '설비 관리'], ['WEB-USR-001_사용자관리.png', '사용자 관리'], ['WEB-VND-001_유지보수업체정보관리.png', '업체 관리']] }
  ];

  for (const config of screensConfig) {
    slide = pptx.addSlide();
    addHeader(slide, pptx, config.title);
    addActionBar(slide, config.action, pptx);
    config.screens.forEach((s, i) => {
      const x = 0.8 + i * 3.0;
      const imgPath = path.join(IMAGES_DIR, s[0]);
      if (fs.existsSync(imgPath)) {
        slide.addImage({ path: imgPath, x, y: 1.8, w: 2.4, h: 2.8 });
      } else {
        slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.8, w: 2.4, h: 2.8, fill: { color: 'F0F0F0' }, line: { color: 'CCCCCC', pt: 1 } });
        slide.addText('Image', { x, y: 2.8, w: 2.4, h: 0.5, fontSize: 12, color: '999999', align: 'center' });
      }
      slide.addText(s[1], { x, y: 4.7, w: 2.4, h: 0.35, fontSize: 11, bold: true, color: NAVY, align: 'center' });
    });
  }

  // Slide 13: Process Flow (using canvas-design diagram)
  slide = pptx.addSlide();
  addHeader(slide, pptx, '5. 업무 프로세스');
  addActionBar(slide, '6단계 프로세스로 진행되며, 각 단계별 카카오톡 알림이 발송됩니다.', pptx);
  slide.addImage({ path: path.join(DIAGRAMS_DIR, 'process_flow.png'), x: 0.3, y: 1.5, w: 9.4, h: 3.2 });

  // Slide 14: Role Matrix
  slide = pptx.addSlide();
  addHeader(slide, pptx, '5. 업무 프로세스');
  addActionBar(slide, '사용자 역할별 주요 기능과 접근 채널입니다.', pptx);

  const roleData = [
    [{ text: '역할', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } },
     { text: '주요 기능', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } },
     { text: '접근 채널', options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true } }],
    ['생산현장 담당자', 'QR스캔, 수리요청, 진행확인', 'Mobile'],
    ['설비팀 과장', '승인/반려, 우선순위 확인', 'Mobile + Web'],
    ['정비업체 기사', '접수, 작업시작/완료', 'Mobile'],
    ['설비관리 팀장', '대시보드, 이력조회, 통계', 'Web']
  ];
  slide.addTable(roleData, { x: 0.6, y: 1.8, w: 8.8, h: 2.2, colW: [2.5, 4.3, 2.0], fontSize: 11, border: { pt: 0.5, color: 'E0E0E0' }, align: 'center', valign: 'middle' });

  // Slide 15: KPI Chart
  slide = pptx.addSlide();
  addHeader(slide, pptx, '6. 기대 효과');
  addActionBar(slide, '시스템 도입으로 수리 완료 시간 50% 단축, 신고 누락 제로화가 가능합니다.', pptx);

  const kpis = [
    ['평균 수리 완료 시간', '8시간', '4시간', '-50%', true],
    ['고장 신고 누락률', '15%', '0%', '-100%', true],
    ['정비 이력 추적률', '40%', '100%', '+150%', false],
    ['관계자 알림 도달률', '60%', '98%', '+63%', false]
  ];
  kpis.forEach((kpi, i) => {
    const y = 1.7 + i * 0.85;
    slide.addText(kpi[0], { x: 0.6, y, w: 2.5, h: 0.4, fontSize: 11, color: '333333' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 3.2, y: y + 0.05, w: 2.0, h: 0.3, fill: { color: 'B0BEC5' } });
    slide.addText(kpi[1], { x: 3.3, y, w: 1.8, h: 0.4, fontSize: 9, color: 'FFFFFF' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 3.2, y: y + 0.4, w: kpi[4] ? 1.0 : 3.5, h: 0.3, fill: { color: kpi[4] ? NAVY : '00C853' } });
    slide.addText(kpi[2], { x: 3.3, y: y + 0.35, w: 1.8, h: 0.4, fontSize: 9, color: 'FFFFFF' });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.3, y: y + 0.15, w: 0.9, h: 0.5, fill: { color: kpi[4] ? 'E3F2FD' : 'E8F5E9' }, rectRadius: 0.1 });
    slide.addText(kpi[3], { x: 8.3, y: y + 0.15, w: 0.9, h: 0.5, fontSize: 10, bold: true, color: kpi[4] ? '1565C0' : '2E7D32', align: 'center', valign: 'middle' });
  });

  // Slide 16: Qualitative Benefits
  slide = pptx.addSlide();
  addHeader(slide, pptx, '6. 기대 효과');
  addActionBar(slide, '정성적 효과로 업무 가시성 확보와 예방 정비 계획 수립이 가능해집니다.', pptx);

  const benefits = [
    ['수기 대장 폐지', '종이 문서 사용\n완전 중단', RED, 'cancel_white.png'],
    ['업무 가시성 확보', '정비 진행 현황\n실시간 파악', '1976D2', 'visibility_white.png'],
    ['예방 정비 가능', '데이터 기반\n정비 계획 수립', GREEN, 'event_white.png']
  ];
  benefits.forEach((b, i) => {
    const x = 1.0 + i * 2.8;
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 1.8, w: 2.4, h: 2.6, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', blur: 8, offset: 3, angle: 90, opacity: 0.12 } });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.75, y: 2.1, w: 0.9, h: 0.9, fill: { color: b[2] }, rectRadius: 0.15 });
    slide.addImage({ path: path.join(ICONS_DIR, b[3]), x: x + 0.9, y: 2.25, w: 0.6, h: 0.6 });
    slide.addText(b[0], { x, y: 3.2, w: 2.4, h: 0.35, fontSize: 14, bold: true, color: '1A1A1A', align: 'center' });
    slide.addText(b[1], { x, y: 3.6, w: 2.4, h: 0.5, fontSize: 10, color: GRAY, align: 'center' });
    slide.addShape(pptx.shapes.RECTANGLE, { x, y: 4.25, w: 2.4, h: 0.05, fill: { color: b[2] } });
  });

  // Slide 17: Timeline
  slide = pptx.addSlide();
  addHeader(slide, pptx, '7. 추진 일정');
  addActionBar(slide, 'Phase 1 MVP 8주, Phase 2 고도화 4주로 총 12주 소요 예정입니다.', pptx);

  // Timeline header
  for (let i = 1; i <= 12; i++) {
    slide.addText(`${i}주`, { x: 0.7 + (i - 1) * 0.75, y: 1.6, w: 0.7, h: 0.3, fontSize: 8, color: GRAY, align: 'center' });
  }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.9, w: 9.0, h: 0.02, fill: { color: 'E0E0E0' } });

  // Phase 1
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.1, w: 0.8, h: 0.7, fill: { color: NAVY }, rectRadius: 0.1 });
  slide.addText('Phase 1\nMVP', { x: 0.3, y: 2.15, w: 0.8, h: 0.65, fontSize: 8, color: 'FFFFFF', align: 'center', valign: 'middle' });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 2.2, w: 6.0, h: 0.5, fill: { color: NAVY }, rectRadius: 0.1 });
  slide.addText('개발환경 / DB설계 / 백엔드 / 모바일 / 웹 / UAT', { x: 1.2, y: 2.2, w: 6.0, h: 0.5, fontSize: 9, color: 'FFFFFF', align: 'center', valign: 'middle' });

  // Phase 2
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.3, y: 2.9, w: 0.8, h: 0.7, fill: { color: RED }, rectRadius: 0.1 });
  slide.addText('Phase 2\n고도화', { x: 0.3, y: 2.95, w: 0.8, h: 0.65, fontSize: 8, color: 'FFFFFF', align: 'center', valign: 'middle' });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.7, y: 3.0, w: 3.0, h: 0.5, fill: { color: RED }, rectRadius: 0.1 });
  slide.addText('마스터관리 / 리포트 / 안정화', { x: 6.7, y: 3.0, w: 3.0, h: 0.5, fontSize: 9, color: 'FFFFFF', align: 'center', valign: 'middle' });

  // Task details
  slide.addText('Phase 1 - MVP', { x: 0.6, y: 3.8, w: 4, h: 0.35, fontSize: 11, bold: true, color: NAVY });
  slide.addText('1-2주: 개발환경 구축, DB 설계\n3-4주: 백엔드 API 개발 (Core)\n5-6주: 모바일 앱 개발 (Core)\n7주: 웹 대시보드 개발\n8주: 통합테스트, UAT',
    { x: 0.6, y: 4.15, w: 4.5, h: 1.2, fontSize: 9, color: GRAY });
  slide.addText('Phase 2 - 고도화', { x: 5.3, y: 3.8, w: 4, h: 0.35, fontSize: 11, bold: true, color: RED });
  slide.addText('9-10주: 마스터 관리 기능\n11주: 리포트/Excel 출력\n12주: 성능 최적화, 안정화',
    { x: 5.3, y: 4.15, w: 4.5, h: 1.2, fontSize: 9, color: GRAY });

  // Slide 18: Q&A
  slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: 'FFFFFF' } });
  slide.addText('Q & A', { x: 0, y: 2.0, w: 10, h: 1, fontSize: 56, bold: true, color: NAVY, align: 'center' });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 4.25, y: 3.0, w: 1.5, h: 0.06, fill: { color: RED } });
  slide.addText('질문 및 의견을 말씀해 주십시오.', { x: 0, y: 3.3, w: 10, h: 0.5, fontSize: 14, color: GRAY, align: 'center' });
  slide.addText('감사합니다.', { x: 0, y: 3.9, w: 10, h: 0.5, fontSize: 18, color: '1A1A1A', align: 'center' });
  slide.addText('동국시스템즈', { x: 0, y: 5.1, w: 10, h: 0.3, fontSize: 10, color: '999999', align: 'center' });

  const outputPath = '/home/jji/project/HAVC_prd/docgen/HAVC_presentation.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation saved: ${outputPath}`);
}

function addHeader(slide, pptx, title) {
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: NAVY } });
  slide.addText(title, { x: 0.5, y: 0.2, w: 9, h: 0.45, fontSize: 20, bold: true, color: 'FFFFFF' });
}

function addActionBar(slide, text, pptx) {
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0.75, w: 10, h: 0.55, fill: { color: LIGHT_GRAY } });
  slide.addText(text, { x: 0.5, y: 0.85, w: 9, h: 0.35, fontSize: 11, color: '333333' });
}

async function main() {
  await generateIcons();
  await buildPresentation();
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
