from fpdf import FPDF

def generate_pdf(names, keys, qr_paths):
    pdf = FPDF()
    pdf.add_page()
    
    for i in range(len(names)):
        pdf.set_xy(10, 10 + i*30)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(40, 10, f'Nome: {names[i]}')
        pdf.cell(60, 10, f'Chave Pix: {keys[i]}')
        
        if qr_paths[i]:
            pdf.image(qr_paths[i], x=150, y=10 + i*30, w=30, h=30)
    
    output_path = 'FOLHA.pdf'
    pdf.output(output_path)
    return output_path
