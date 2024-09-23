document.addEventListener('DOMContentLoaded', () => {
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileNameElement = document.getElementById(`fileName${this.id.replace('fileInput', '')}`);
            const fileList = Array.from(this.files).map(file => file.name).join(', ');
            fileNameElement.textContent = fileList || 'Nenhum arquivo escolhido';
        });
    });

    const fileLabels = document.querySelectorAll('.file-input-label');
    fileLabels.forEach(label => {
        label.addEventListener('click', function() {
            const inputId = this.getAttribute('for');
            document.getElementById(inputId).click();
        });
    });
});
