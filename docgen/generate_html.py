import json
import os

JSON_PATH = 'docgen/presentation_content2.json'
OUTPUT_HTML = 'docgen/professional_presentation.html'

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Pretendard:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        :root {
            --primary: #0f172a;
            --accent: #C51F2A;
            --sky: #0ea5e9;
            --bg-glass: rgba(255, 255, 255, 0.75);
            --border-glass: rgba(255, 255, 255, 0.3);
            --shadow-premium: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }

        body {
            font-family: 'Pretendard', 'Inter', sans-serif;
            background-color: #f8fafc;
            color: var(--primary);
            overflow: hidden;
            background-image: radial-gradient(#e2e8f0 0.5px, transparent 0.5px);
            background-size: 24px 24px;
        }

        .slide-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 2000px;
        }

        .slide {
            width: 1600px;
            height: 900px;
            background: #fff;
            border-radius: 40px;
            padding: 5rem;
            box-sizing: border-box;
            display: none;
            flex-direction: column;
            box-shadow: var(--shadow-premium), 0 0 0 1px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
        }

        .slide.active {
            display: flex;
            animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px) rotateX(-5deg); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0) rotateX(0); filter: blur(0); }
        }

        .slide::before {
            content: '';
            position: absolute;
            top: -200px;
            right: -200px;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
            z-index: 0;
        }

        .slide-header { z-index: 10; }

        h1 { font-size: 5rem; font-weight: 800; color: var(--primary); line-height: 1.05; letter-spacing: -0.4em; }
        h2 { font-size: 3.2rem; font-weight: 700; color: var(--primary); letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .action-title { 
            font-size: 1.8rem; 
            font-weight: 500;
            color: #475569; 
            margin-bottom: 3rem; 
            border-left: 6px solid var(--accent); 
            padding-left: 2rem; 
            line-height: 1.5; 
            max-width: 90%;
        }

        .glass-card {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            border-radius: 32px;
            padding: 2.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .glass-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 10, 0.05);
        }

        .badge-navy { background: #0f172a; color: white; border-radius: 12px; padding: 0.5rem 1.2rem; font-weight: 700; }

        .grid-icon {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #0ea5e9, #6366f1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.5rem;
        }

        .nav-controls {
            position: fixed;
            bottom: 3rem;
            right: 3rem;
            display: flex;
            gap: 1.5rem;
            z-index: 1000;
        }

        .nav-btn {
            width: 4rem;
            height: 4rem;
            border-radius: 20px;
            background: white;
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            transition: all 0.3s;
            font-size: 1.2rem;
        }

        .nav-btn:hover { background: var(--primary); color: white; transform: scale(1.1); }

        .custom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        .custom-table th { background: #f8fafc; color: #475569; padding: 1.5rem; text-align: left; font-weight: 700; }
        .custom-table td { padding: 1.5rem; border-top: 1px solid #f1f5f9; }

    </style>
</head>
<body>
    <div class="slide-container">
        <div id="presentation">
            {{slides_html}}
        </div>
    </div>

    <div class="nav-controls">
        <button class="nav-btn" onclick="prevSlide()"><i class="fas fa-chevron-left"></i></button>
        <button class="nav-btn" onclick="nextSlide()"><i class="fas fa-chevron-right"></i></button>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        showSlide(currentSlide);
    </script>
</body>
</html>
"""

def generate_slides_html(data):
    html = ""
    for i, slide in enumerate(data['presentation']['slides']):
        layout_id = slide['layout_id']
        ph = slide['placeholders']
        custom = slide.get('custom_elements', [])
        
        slide_class = "slide"
        content = ""
        
        if layout_id == 1:
            slide_class += " slide-title bg-slate-50"
            content = f"<div class='animate__animated animate__zoomIn'><h1 class='mb-6'>{ph.get('title', '')}</h1><p class='text-3xl text-slate-400 font-medium'>{ph.get('subtitle', '')}</p></div>"
        else:
            main_title = ph.get('main_title', '')
            action_title = ph.get('action_title', '')
            
            content = f"<div class='slide-header animate__animated animate__fadeInDown'><h2>{main_title}</h2>"
            if action_title:
                content += f"<div class='action-title'>{action_title}</div></div>"
            else:
                content += "</div>"
            
            content += "<div class='flex-grow overflow-hidden pt-4 animate__animated animate__fadeInUp' style='animation-delay: 0.3s;'>"
            
            if 'body' in ph:
                content += "<ul class='space-y-6 text-2xl font-medium text-slate-600'>"
                for item in ph['body']:
                    indent = f"ml-{(item['level']-1)*12}"
                    content += f"<li class='{indent} flex items-start'><span class='text-red-500 mr-4 font-bold'>→</span>{item['text']}</li>"
                content += "</ul>"
            
            if 'toc_items' in ph:
                content += "<div class='grid grid-cols-1 gap-6 max-w-5xl'>"
                for item in ph['toc_items']:
                    content += f"<div class='glass-card p-8 flex justify-between items-center'><span class='text-2xl'><b class='badge-navy mr-6'>{item['number']}</b> <span class='font-bold text-slate-800'>{item['title']}</span></span><span class='text-slate-400 font-bold'>{item['pages']}</span></div>"
                content += "</div>"

            for el in custom:
                if el['type'] == 'icon_box_grid':
                    cols = el['data'].get('columns', 4)
                    content += f"<div class='grid grid-cols-{cols} gap-8 h-full items-center'>"
                    for item in el['data']['items']:
                        content += f"<div class='glass-card h-full flex flex-col items-center text-center'><div class='grid-icon'><i class='fas fa-circle-nodes'></i></div><h3 class='text-2xl font-bold mb-4 text-slate-800'>{item['title']}</h3><p class='text-lg leading-relaxed text-slate-500 font-medium'>{item['desc']}</p></div>"
                    content += "</div>"
                
                elif el['type'] == 'table':
                    content += "<table class='custom-table mt-8 text-xl'>"
                    content += "<thead><tr>" + "".join([f"<th class='p-6 uppercase tracking-wider'>{h}</th>" for h in el['data']['headers']]) + "</tr></thead>"
                    content += "<tbody>"
                    for row in el['data']['rows']:
                        content += "<tr>" + "".join([f"<td class='p-6 font-medium text-slate-700'>{v}</td>" for v in row]) + "</tr>"
                    content += "</tbody></table>"

                elif el['type'] == 'process_flow':
                    content += "<div class='flex justify-between items-center mt-20 px-10'>"
                    for j, step in enumerate(el['data']['steps']):
                        content += f"<div class='relative flex flex-col items-center group'><div class='w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl group-hover:bg-red-600 transition-colors mb-6'>{j+1}</div><div class='text-2xl font-bold text-slate-800'>{step['name']}</div><div class='text-lg font-bold text-red-500'>{step['actor']}</div></div>"
                        if j < len(el['data']['steps']) - 1:
                            content += "<div class='flex-grow h-1 bg-slate-200 mx-6 mb-8'></div>"
                    content += "</div>"
                
                elif el['type'] == 'architecture_diagram':
                    content += "<div class='mt-10 flex justify-center'>"
                    content += "<img src='system_architecture_premium.png' class='max-h-[600px] rounded-3xl shadow-2xl animate__animated animate__zoomIn'>"
                    content += "</div>"
            
            content += "</div>"

        html += f"<div class='{slide_class}' id='slide-{i+1}'>{content}</div>\n"
    return html

def main():
    if not os.path.exists(JSON_PATH):
        print(f"Error: {JSON_PATH} not found.")
        return
        
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    slides_html = generate_slides_html(data)
    final_html = HTML_TEMPLATE.replace('{{title}}', data['presentation']['title'])
    final_html = final_html.replace('{{slides_html}}', slides_html)
    
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print(f"Professional HTML presentation saved to {OUTPUT_HTML}")

if __name__ == "__main__":
    main()
