import cv2

def detect_and_crop_qrcode(image_path):
    # Ler a imagem usando OpenCV
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Erro ao carregar o arquivo: {image_path}")

    # Convertê-la para escala de cinza
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Inicializar o detector de QR Code
    detector = cv2.QRCodeDetector()

    # Detectar e decodificar o QR Code
    data, points, _ = detector.detectAndDecode(gray)
    
    if points is not None:
        # Recortar a área do QR Code
        points = points[0]
        rect = cv2.boundingRect(points)
        x, y, w, h = rect
        qr_crop = img[y:y+h, x:x+w]
        return qr_crop, data
    else:
        raise ValueError("QR Code não detectado")

    return None, None
