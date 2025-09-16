/**
 * Creates an image upload block with a title, file input, and preview area.
 * @param {string} targetId - The ID of the element to append the block to.
 * @param {string} title - The title for the upload section.
 */
function createImageUploadBlock(targetId, title) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear any placeholders

    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = `${targetId}-input`;
    fileInput.style.display = 'none'; // Hide the default input

    // Create a custom button label
    const customButton = document.createElement('label');
    customButton.htmlFor = fileInput.id;
    customButton.textContent = 'Escolher Imagem';
    customButton.className = 'button upload-button'; // Style as a button

    // Create a status message area
    const statusMessage = document.createElement('p');
    statusMessage.className = 'upload-status';
    statusMessage.textContent = 'Nenhuma imagem selecionada. (Máx: 5MB)';

    // Create image preview area
    const imagePreview = document.createElement('img');
    imagePreview.className = 'image-preview';
    imagePreview.style.display = 'none'; // Initially hidden

    // Append elements to the container
    container.appendChild(titleElement);
    container.appendChild(customButton);
    container.appendChild(fileInput);
    container.appendChild(statusMessage);
    container.appendChild(imagePreview);

    // Add event listener for file input change
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        // --- Validation ---
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            statusMessage.textContent = 'Erro: O arquivo é maior que 5MB.';
            statusMessage.style.color = 'red';
            imagePreview.style.display = 'none';
            imagePreview.src = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            statusMessage.textContent = 'Erro: O arquivo selecionado não é uma imagem.';
            statusMessage.style.color = 'red';
            imagePreview.style.display = 'none';
            imagePreview.src = '';
            return;
        }

        // --- File Reading & Preview ---
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            statusMessage.textContent = `Arquivo: ${file.name}`;
            statusMessage.style.color = ''; // Reset color

            // Here you would typically update a data model, e.g.:
            // characterData.visuals.characterSketch = e.target.result;
        };
        reader.onerror = () => {
            statusMessage.textContent = 'Erro ao ler o arquivo.';
            statusMessage.style.color = 'red';
        };
        reader.readAsDataURL(file);
    });
}
