from flask import Flask, render_template, request, send_file
import os
from werkzeug.utils import secure_filename
from your_script import process_qrcodes_and_generate_pdf

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/generate', methods=['POST'])
def generate_pdf():
    names = request.form.getlist('names')
    keys = request.form.getlist('keys')
    qr_files = request.files.getlist('qrcodes')
    
    file_paths = []
    for file in qr_files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            file_paths.append(file_path)

    try:
        pdf_path = process_qrcodes_and_generate_pdf(names, keys, file_paths)
        return send_file(pdf_path, as_attachment=True)
    except Exception as e:
        print(f"Erro ao processar QR Codes: {str(e)}")
        return "Erro ao processar QR Codes", 500

if __name__ == "__main__":
    app.run(debug=True)
