import os
import cv2
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

# Diretório para salvar PDFs
PDF_FOLDER = 'Downloads'
os.makedirs(PDF_FOLDER, exist_ok=True)

def detect_and_crop_qrcode(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Erro ao carregar o arquivo: {image_path}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    detector = cv2.QRCodeDetector()
    data, points, _ = detector.detectAndDecode(gray)
    
    if points is not None:
        points = points[0]
        rect = cv2.boundingRect(points)
        x, y, w, h = rect
        qr_crop = img[y:y+h, x:x+w]
        return qr_crop, data
    else:
        raise ValueError("QR Code não detectado")

def process_qrcodes_and_generate_pdf(names, keys, qr_paths):
    pdf_path = os.path.join(PDF_FOLDER, "FOLHA.pdf")
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    # Caminho da imagem base
    base_image_path = 'assets/base.jpg'  # Altere para o caminho da sua imagem base
    c.drawImage(base_image_path, 0, 0, width=width, height=height)

    margin_x = 20 * mm
    margin_y = 15 * mm
    qr_size = 60 * mm
    spacing_x = 50 * mm
    spacing_y = 5 * mm

    start_x = margin_x
    start_y = height - margin_y - qr_size

    for i in range(6):
        if i >= len(qr_paths):
            break

        try:
            qr_crop, data = detect_and_crop_qrcode(qr_paths[i])
            temp_img_path = f"temp_{i}.png"
            cv2.imwrite(temp_img_path, qr_crop)

            x = start_x + (i % 2) * (qr_size + spacing_x)
            y = start_y - (i // 2) * (qr_size + spacing_y + 32 * mm)

            c.drawImage(temp_img_path, x, y, qr_size, qr_size)

            c.setFont("Helvetica", 9)
            text_x = x + qr_size / 2
            text_y = y - 5 * mm

            c.drawCentredString(text_x, text_y, names[i])
            c.drawCentredString(text_x, text_y - 4 * mm, keys[i])

        except Exception as e:
            print(f"Erro ao processar arquivo {qr_paths[i]}: {str(e)}")

    c.showPage()
    c.save()

    # Remover arquivos temporários
    for i in range(6):
        temp_img_path = f"temp_{i}.png"
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

    return pdf_path
