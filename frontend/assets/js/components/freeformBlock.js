/**
 * Creates a titled list of text inputs split into two columns.
 * @param {string} targetId - The ID of the element to append the block to.
 * @param {number} numberOfLines - The total number of text inputs to create.
 */
function createTwoColumnTextList(targetId, numberOfLines) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear any placeholders

    const column1 = document.createElement('div');
    column1.className = 'freeform-column';
    const column2 = document.createElement('div');
    column2.className = 'freeform-column';

    const linesPerColumn = Math.ceil(numberOfLines / 2);

    for (let i = 0; i < numberOfLines; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'freeform-list-input';
        if (i < linesPerColumn) {
            column1.appendChild(input);
        } else {
            column2.appendChild(input);
        }
    }

    container.appendChild(column1);
    container.appendChild(column2);
}


/**
 * Creates a container with a title and a list of text inputs.
 * @param {string} targetId - The ID of the element to append the block to.
 * @param {string} title - The title to display above the list.
 * @param {number} numberOfLines - The number of text inputs to create.
 */
function createTitledTextList(targetId, title, numberOfLines) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear any placeholders

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    container.appendChild(titleElement);

    const listContainer = document.createElement('div');
    listContainer.className = 'freeform-list-container';

    for (let i = 0; i < numberOfLines; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'freeform-list-input';
        listContainer.appendChild(input);
    }

    container.appendChild(listContainer);
}

/**
 * Creates a container with a title and a textarea.
 * @param {string} targetId - The ID of the element to append the block to.
 * @param {string} title - The title for the textarea section.
 */
function createTitledTextarea(targetId, title) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear any placeholders

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const textarea = document.createElement('textarea');
    textarea.className = 'freeform-textarea';

    container.appendChild(titleElement);
    container.appendChild(textarea);
}
