/**
 * Generates a multi-page PDF from the character sheet, formatted for A4.
 */
function generatePdf() {
    const { jsPDF } = window.jspdf;
    const characterSheet = document.querySelector('.character-sheet');
    const charNameInput = document.getElementById('char-name');
    const charName = charNameInput.value.trim() || 'character_sheet';
    const fileName = `${charName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Options for html2canvas to ensure print styles are applied
    const canvasOptions = {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (document) => {
            // This is crucial for applying print-specific styles
            // It forces the media type to 'print' during rendering
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'assets/css/print.css'; // Adjust path if needed
            link.media = 'all'; // Temporarily apply to all media for rendering
            document.head.appendChild(link);
        }
    };

    html2canvas(characterSheet, canvasOptions).then(canvas => {
        try {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // The canvas is rendered based on the screen's view, but with print styles.
            // We need to calculate the aspect ratio to fit it onto the PDF page width.
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            // Calculate the height of the image when fitted to the PDF width
            const imgHeight = pdfWidth / canvasAspectRatio;
            let heightLeft = imgHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add new pages if the content is taller than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('An error occurred while generating the PDF. Please check the console for details.');
        }
    }).catch(error => {
        console.error('Error with html2canvas:', error);
        alert('An error occurred while capturing the sheet. Please check the console for details.');
    });
}
