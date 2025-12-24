import os
from PIL import Image, ImageDraw, ImageFont

# Configuration
WIDTH = 1920
HEIGHT = 1080
BG_COLOR = (255, 255, 255)
PRIMARY_COLOR = (0, 212, 170) # #00d4aa
SECONDARY_COLOR = (31, 78, 121) # #1F4E79
TEXT_COLOR = (10, 22, 40) # #0a1628
GRAY_COLOR = (200, 200, 200)

OUTPUT_DIR = "docgen"
SVG_PATH = os.path.join(OUTPUT_DIR, "system_architecture.svg")
PNG_PATH = os.path.join(OUTPUT_DIR, "system_architecture.png")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- 1. Generate SVG ---
def generate_svg():
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4aa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1F4E79;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="white" />
  
  <!-- Left: Clients -->
  <g transform="translate(200, 300)">
    <rect x="0" y="0" width="300" height="480" rx="20" fill="#f8f9fa" stroke="{SECONDARY_COLOR}" stroke-width="2" />
    <text x="150" y="50" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="{TEXT_COLOR}" font-weight="bold">CLIENTS</text>
    
    <!-- Mobile Icon -->
    <g transform="translate(100, 100)">
        <rect x="0" y="0" width="100" height="180" rx="10" fill="url(#grad1)" />
        <rect x="5" y="5" width="90" height="150" rx="5" fill="white" />
        <circle cx="50" cy="165" r="8" fill="white" />
        <text x="50" y="195" font-family="Arial" font-size="16" text-anchor="middle" fill="{TEXT_COLOR}">Mobile App</text>
    </g>
    
    <!-- Web Icon -->
    <g transform="translate(60, 320)">
        <rect x="0" y="0" width="180" height="110" rx="5" fill="url(#grad1)" />
        <rect x="5" y="5" width="170" height="85" fill="white" />
        <rect x="70" y="110" width="40" height="20" fill="{SECONDARY_COLOR}" />
        <rect x="50" y="130" width="80" height="10" rx="2" fill="{SECONDARY_COLOR}" />
        <text x="90" y="160" font-family="Arial" font-size="16" text-anchor="middle" fill="{TEXT_COLOR}">Web Dashboard</text>
    </g>
  </g>

  <!-- Center: Server -->
  <g transform="translate(700, 300)">
    <rect x="0" y="0" width="500" height="480" rx="20" fill="#f0f4f8" stroke="{SECONDARY_COLOR}" stroke-width="2" />
    <text x="250" y="50" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="{TEXT_COLOR}" font-weight="bold">BACKEND SERVER</text>
    
    <!-- Spring Boot Box -->
    <rect x="100" y="150" width="300" height="200" rx="10" fill="{SECONDARY_COLOR}" />
    <text x="250" y="260" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="white" font-weight="bold">Spring Boot</text>
    <text x="250" y="300" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#00d4aa">API Service</text>
  </g>

  <!-- Right: Data & External -->
  <g transform="translate(1400, 300)">
    <rect x="0" y="0" width="300" height="480" rx="20" fill="#f8f9fa" stroke="{SECONDARY_COLOR}" stroke-width="2" />
    <text x="150" y="50" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="{TEXT_COLOR}" font-weight="bold">DATA & EXT</text>
    
    <!-- Database Icon -->
    <g transform="translate(100, 100)">
        <ellipse cx="50" cy="20" rx="50" ry="20" fill="#D3D3D3" stroke="{SECONDARY_COLOR}" />
        <rect x="0" y="20" width="100" height="100" fill="#D3D3D3" stroke="{SECONDARY_COLOR}" stroke-width="0" />
        <path d="M0,20 v100 a50,20 0 0,0 100,0 v-100" fill="#D3D3D3" stroke="{SECONDARY_COLOR}" />
        <ellipse cx="50" cy="120" rx="50" ry="20" fill="#D3D3D3" stroke="{SECONDARY_COLOR}" />
        <text x="50" y="70" font-family="Arial" font-size="20" text-anchor="middle" fill="{TEXT_COLOR}" font-weight="bold">Tibero</text>
    </g>
    
    <!-- Kakao Icon -->
    <g transform="translate(80, 300)">
        <path d="M20,0 h100 a20,20 0 0,1 20,20 v60 a20,20 0 0,1 -20,20 h-60 l-20,20 l0,-20 h-20 a20,20 0 0,1 -20,-20 v-60 a20,20 0 0,1 20,-20 z" fill="#F7E600" />
        <text x="70" y="60" font-family="Arial" font-size="18" text-anchor="middle" fill="#3A1D1D" font-weight="bold">Kakao</text>
    </g>
  </g>

  <!-- Arrows -->
  <g stroke="{GRAY_COLOR}" stroke-width="4" fill="none" marker-end="url(#arrowhead)">
    <!-- Client to Server -->
    <line x1="500" y1="500" x2="700" y2="500" />
    <!-- Server to DB -->
    <line x1="1200" y1="450" x2="1400" y2="450" />
    <!-- Server to Kakao -->
    <line x1="1200" y1="650" x2="1400" y2="650" />
  </g>
  
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="{GRAY_COLOR}" />
    </marker>
  </defs>
</svg>"""
    with open(SVG_PATH, "w") as f:
        f.write(svg_content)
    print(f"SVG generated at {SVG_PATH}")

# --- 2. Generate PNG using Pillow ---
def generate_png():
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 1. Clients Area
    client_x, client_y = 200, 300
    draw.rectangle([client_x, client_y, client_x+300, client_y+480], outline=SECONDARY_COLOR, width=3, fill="#f8f9fa")
    draw.text((client_x + 100, client_y + 20), "CLIENTS", fill=TEXT_COLOR)
    
    # Mobile
    mx, my = client_x + 100, client_y + 100
    draw.rectangle([mx, my, mx+100, my+180], fill=SECONDARY_COLOR)
    draw.rectangle([mx+5, my+5, mx+95, my+150], fill="white")
    draw.text((mx+15, my+190), "Mobile App", fill=TEXT_COLOR)

    # Web
    wx, wy = client_x + 60, client_y + 320
    draw.rectangle([wx, wy, wx+180, wy+110], fill=SECONDARY_COLOR)
    draw.rectangle([wx+5, wy+5, wx+175, wy+90], fill="white")
    draw.text((wx+50, wy+140), "Web Dashboard", fill=TEXT_COLOR)


    # 2. Server Area
    server_x, server_y = 700, 300
    draw.rectangle([server_x, server_y, server_x+500, server_y+480], outline=SECONDARY_COLOR, width=3, fill="#f0f4f8")
    draw.text((server_x + 180, server_y + 20), "BACKEND SERVER", fill=TEXT_COLOR)
    
    # Spring Boot Box
    sb_x, sb_y = server_x + 100, server_y + 150
    draw.rectangle([sb_x, sb_y, sb_x+300, sb_y+200], fill=SECONDARY_COLOR)
    draw.text((sb_x + 110, sb_y + 90), "Spring Boot", fill="white")


    # 3. Data Area
    data_x, data_y = 1400, 300
    draw.rectangle([data_x, data_y, data_x+300, data_y+480], outline=SECONDARY_COLOR, width=3, fill="#f8f9fa")
    draw.text((data_x + 100, data_y + 20), "DATA & EXT", fill=TEXT_COLOR)
    
    # DB Icon
    db_x, db_y = data_x + 100, data_y + 100
    draw.rectangle([db_x, db_y, db_x+100, db_y+120], fill="lightgray", outline=SECONDARY_COLOR)
    draw.text((db_x + 30, db_y + 50), "DB", fill=TEXT_COLOR)

    # Kakao Icon
    k_x, k_y = data_x + 80, data_y + 300
    draw.rectangle([k_x, k_y, k_x+140, k_y+100], fill="#F7E600")
    draw.text((k_x + 50, k_y + 40), "Kakao", fill="#3A1D1D")

    # Arrows (Simple lines for PNG)
    draw.line([client_x+300, client_y+200, server_x, server_y+200], fill="gray", width=5)
    draw.line([server_x+500, server_y+150, data_x, data_y+150], fill="gray", width=5)
    draw.line([server_x+500, server_y+350, data_x, data_y+350], fill="gray", width=5)

    img.save(PNG_PATH)
    print(f"PNG generated at {PNG_PATH}")

if __name__ == "__main__":
    generate_svg()
    generate_png()
