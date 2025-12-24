Professional PPTX Generation Architecture
이 계획은 단순한 텍스트 기반 슬라이드를 넘어, 사람이 직접 디자인한 듯한 고품질(Apple/Stripe 스타일)의 PPTX를 LLM이 생성하기 위한 기술적 요구사항과 아키텍처를 정의합니다.

User Review Required
IMPORTANT

레이아웃 고정성: 정교한 디자인을 위해 특정 컴포넌트(워크플로우, 비교표 등)는 미리 정의된 레이아웃 엔진을 사용합니다. LLM은 내용과 데이터만 채우는 방식으로 작동해야 시각적 완성도가 보장됩니다.
폰트 제약: python-pptx는 사용자 시스템에 설치된 폰트만 사용할 수 있습니다. 'Pretendard' 또는 'Apple SD 산돌고딕 Neo'와 같은 전문 폰트 사용을 권장합니다.
Proposed Changes
전문가 수준의 PPTX 생성을 위해 다음 4가지 핵심 레이어를 구축해야 합니다.

1. Design System Registry
디자인의 일관성을 유지하기 위한 상수 및 스타일 함수 셋입니다.

Color Palettes: 단순한 RGB 값이 아닌, 테마별(Minimal, Dark, Corporate) 색상 조합 제공.
Grid System: 12컬럼 시스템 기반의 좌표 계산 로직.
Effect Simulator: python-pptx에서 기본으로 제공하지 않는 그림자나 투명도 효과를 우회적으로 구현(Soft shadows via shapes).
2. Professional Component Library
정교한 시각화를 담당하는 파이썬 함수 모음입니다.

[NEW] 
components.py
create_workflow_node(): 노드와 화살표를 사용한 시각적 프로세스 맵.
create_comparison_table(): 장단점이나 옵션 비교를 위한 대칭 구조 레이아웃.
create_data_chart(): python-pptx.chart를 활용하되, 스타일링이 완료된 차트 객체 생성.
create_infographic_box(): 아이콘과 제목, 본문이 강조된 인포그래픽 박스.
3. Structured Data Interface (DSL)
LLM이 생성해야 할 데이터의 형식을 정의합니다. 마크다운이 아닌 구체적인 JSON 형식을 통해 정밀도를 높입니다.

{
  "type": "workflow",
  "data": {
    "steps": [
      {"id": 1, "title": "신고", "desc": "QR 스캔 후 발송"},
      {"id": 2, "title": "배정", "desc": "담당자 자동 지정"}
    ]
  },
  "visual_style": "minimal_blue"
}
4. Image Generation Pipeline
슬라이드 내용에 맞춰 이미지를 생성하고 자동 삽입하는 로직입니다.

Prompt Engineering: 슬라이드 주제를 분석하여 "Clean 3D Isometric illustration style" 등 일관된 스타일의 이미지 프롬프트 생성.
Verification Plan
Automated Tests
pytest를 사용하여 각 컴포넌트가 오류 없이 
.pptx
 객체를 반환하는지 검증.
generate_ppt.py
 실행 후 결과물 파일 존재 여부 확인.
Manual Verification
생성된 
.pptx
 파일을 열어 다음 사항 확인:
텍스트 겹침 현상 유무.
차트 및 데이터 정확성.
이미지의 맥락 적합성 및 해상도.
워크플로우 화살표 및 배치 정교함.