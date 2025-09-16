/**
 * Generates a multi-page PDF from the character sheet by rendering section by section
 * with dynamically applied print styles.
 */
async function generatePdf() {
    const { jsPDF } = window.jspdf;
    const characterSheet = document.querySelector('.character-sheet');
    const body = document.body;
    const charNameInput = document.getElementById('char-name');
    const charName = charNameInput.value.trim() || 'character_sheet';
    const fileName = `${charName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Add print-mode class to apply specific styles for PDF generation
    body.classList.add('print-mode');

    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const a4 = { width: pdf.internal.pageSize.getWidth(), height: pdf.internal.pageSize.getHeight() };

        const canvasOptions = {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
        };

        // Make all tab content visible for printing
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tc => tc.classList.add('print-visible'));

        // Select only the header and sections to be included in the PDF
        const sections = document.querySelectorAll('.character-sheet > header, .character-sheet .tab-content > section');

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (i > 0) {
                pdf.addPage();
            }

            const canvas = await html2canvas(section, canvasOptions);
            const imgData = canvas.toDataURL('image/png');

            const scaledWidth = a4.width;
            const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

            if (scaledHeight > a4.height) {
                // Logic to slice the canvas for sections taller than one page
                let y = 0;
                while (y < canvas.height) {
                    const sliceHeight = Math.min(canvas.height - y, (a4.height * canvas.width) / a4.width);

                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sliceHeight;
                    const pageCtx = pageCanvas.getContext('2d');

                    // Draw the slice from the source canvas onto the page canvas
                    pageCtx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

                    const sliceImgData = pageCanvas.toDataURL('image/png');

                    // Add the slice to the PDF
                    pdf.addImage(sliceImgData, 'PNG', 0, 0, scaledWidth, (sliceHeight * scaledWidth) / canvas.width);

                    y += sliceHeight;

                    // Add a new page if there's more content to draw
                    if (y < canvas.height) {
                        pdf.addPage();
                    }
                }
            } else {
                // If the section fits on one page, add it normally
                pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
            }
        }

        pdf.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please check the console for details.');
    } finally {
        // IMPORTANT: Always remove the print-mode class afterwards
        body.classList.remove('print-mode');
        // And remove the temporary visibility class from tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tc => tc.classList.remove('print-visible'));
    }
}
