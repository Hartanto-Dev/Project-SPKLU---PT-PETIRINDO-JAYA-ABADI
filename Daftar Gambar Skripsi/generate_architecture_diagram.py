import os
from PIL import Image, ImageDraw, ImageFont

def draw_arrow(draw, start, end, label_text="", font=None, arrow_color="#333333", text_color="#1a1a1a", label_pos="above"):
    # Draw line
    draw.line([start, end], fill=arrow_color, width=2)
    
    # Draw arrowhead
    x1, y1 = start
    x2, y2 = end
    
    # Determine direction
    dx = x2 - x1
    dy = y2 - y1
    
    if dx > 0: # Right arrow
        draw.polygon([(x2 - 10, y2 - 6), (x2, y2), (x2 - 10, y2 + 6)], fill=arrow_color)
    elif dx < 0: # Left arrow
        draw.polygon([(x2 + 10, y2 - 6), (x2, y2), (x2 + 10, y2 + 6)], fill=arrow_color)
    elif dy > 0: # Down arrow
        draw.polygon([(x2 - 6, y2 - 10), (x2, y2), (x2 + 6, y2 - 10)], fill=arrow_color)
    elif dy < 0: # Up arrow
        draw.polygon([(x2 - 6, y2 + 10), (x2, y2), (x2 + 6, y2 + 10)], fill=arrow_color)

    # Draw label text
    if label_text and font:
        # Calculate label position
        tx = (x1 + x2) / 2
        ty = (y1 + y2) / 2
        
        # Adjust y offset based on position
        if label_pos == "above":
            ty -= 20
        elif label_pos == "below":
            ty += 5
            
        # Draw text centered at tx, ty
        text_w = draw.textlength(label_text, font=font)
        draw.text((tx - text_w/2, ty), label_text, fill=text_color, font=font)

def create_diagram():
    # 900x550 canvas size
    width = 900
    height = 550
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    font_path = "C:/Windows/Fonts/arial.ttf"
    font_title = ImageFont.truetype(font_path, 16)
    font_bold = ImageFont.truetype(font_path, 14)
    font_normal = ImageFont.truetype(font_path, 12)
    font_small = ImageFont.truetype(font_path, 11)
    
    # Define Colors
    color_border = "#2c3e50"
    color_header_bg = "#ecf0f1"
    color_sub_header_bg = "#e3f2fd"
    color_text = "#1a1a1a"
    
    # Draw Box 1: User Browser (Left Column)
    # x: 50, y: 80, width: 280, height: 380
    draw.rectangle([50, 80, 330, 460], outline=color_border, width=2)
    # Box 1 Header
    draw.rectangle([50, 80, 330, 115], fill=color_header_bg, outline=color_border, width=2)
    draw.text((65, 88), "User Browser (Client-side)", fill=color_text, font=font_title)
    
    # User Browser Inner Modules
    # Module A: React Engine (SPA)
    draw.rectangle([65, 130, 315, 195], outline="#7f8c8d", width=1, fill=color_sub_header_bg)
    draw.text((75, 138), "React Engine (SPA)", fill=color_text, font=font_bold)
    draw.text((75, 158), "- React Router DOM (Routing)\n- AuthContext (State Autentikasi)", fill=color_text, font=font_small)
    
    # Module B: Interactive Leaflet Map
    draw.rectangle([65, 215, 315, 280], outline="#7f8c8d", width=1, fill=color_sub_header_bg)
    draw.text((75, 223), "Interactive Leaflet Map", fill=color_text, font=font_bold)
    draw.text((75, 243), "- Plotting Marker SPKLU\n- Filter & Search Handler", fill=color_text, font=font_small)
    
    # Module C: Dashboard Visualizer
    draw.rectangle([65, 300, 315, 365], outline="#7f8c8d", width=1, fill=color_sub_header_bg)
    draw.text((75, 308), "Dashboard Visualizer", fill=color_text, font=font_bold)
    draw.text((75, 328), "- Recharts Bar/Pie/Line Component\n- Pengolah Statistik Kendaraan Listrik", fill=color_text, font=font_small)
    
    # User Browser Footer text
    draw.text((65, 390), "Lingkungan Runtime:\nPeramban Web (V8 / JavaScript Engine)\nClient-side Storage (Local Memory)", fill="#555555", font=font_small)

    # Draw Box 2: Static Web Hosting / Vite Dev Server (Right Column Top)
    # x: 530, y: 60, width: 320, height: 100
    draw.rectangle([530, 60, 850, 160], outline=color_border, width=2)
    draw.rectangle([530, 60, 850, 95], fill=color_header_bg, outline=color_border, width=2)
    draw.text((545, 68), "Static Web Hosting / Vite Dev Server", fill=color_text, font=font_bold)
    draw.text((545, 108), "Menyajikan berkas bundle statis:\n- index.html, index.css, main.jsx\n- Aset statis & logo perusahaan", fill=color_text, font=font_normal)

    # Draw Box 3: spkluData.js (Right Column Middle)
    # x: 530, y: 195, width: 320, height: 100
    draw.rectangle([530, 195, 850, 295], outline=color_border, width=2)
    draw.rectangle([530, 195, 850, 230], fill=color_header_bg, outline=color_border, width=2)
    draw.text((545, 203), "spkluData.js (Data Statis)", fill=color_text, font=font_bold)
    draw.text((545, 243), "Menyimpan data terstruktur SPKLU:\n- Koordinat geografis stasiun\n- Spesifikasi konektor & tipe pengisian", fill=color_text, font=font_normal)

    # Draw Box 4: OpenStreetMap Tile Server (Right Column Bottom)
    # x: 530, y: 330, width: 320, height: 100
    draw.rectangle([530, 330, 850, 430], outline=color_border, width=2)
    draw.rectangle([530, 330, 850, 365], fill=color_header_bg, outline=color_border, width=2)
    draw.text((545, 338), "OpenStreetMap Tile Server (External)", fill=color_text, font=font_bold)
    draw.text((545, 378), "Penyedia ubin peta dasar (basemap):\n- Request gambar petak (tiles) spasial\n- Diakses asinkron oleh Leaflet", fill=color_text, font=font_normal)

    # Draw Arrows
    # Arrow 1: User Browser -> Web Server (Akses HTTP/HTTPS)
    draw_arrow(draw, (330, 100), (530, 100), label_text="Akses HTTP/HTTPS", font=font_small, label_pos="above")
    # Arrow 2: Web Server -> User Browser (Unduh file statis)
    draw_arrow(draw, (530, 130), (330, 130), label_text="Kirim Bundle Statis (HTML/CSS/JS)", font=font_small, label_pos="below")
    
    # Arrow 3: spkluData.js -> User Browser (Read data)
    draw_arrow(draw, (530, 245), (330, 245), label_text="Membaca Data Statis SPKLU", font=font_small, label_pos="above")
    
    # Arrow 4: OSM Tile Server -> User Browser (Fetch Map Tiles)
    draw_arrow(draw, (530, 380), (330, 380), label_text="Unduh Ubin Peta Dasar (Basemap)", font=font_small, label_pos="above")

    # Save Image
    output_dir = "c:/Hartanto 2026/SKRIPSI KU/Daftar Gambar Skripsi"
    os.makedirs(output_dir, exist_ok=True)
    img.save(os.path.join(output_dir, "Arsitektur Diagram.png"), "PNG")
    print("Success: Image created and saved to C:/Hartanto 2026/SKRIPSI KU/Daftar Gambar Skripsi/Arsitektur Diagram.png")

if __name__ == '__main__':
    create_diagram()
