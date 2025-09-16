/**
 * Creates a single editable list item with an input and a remove button.
 * @returns {HTMLElement} The list item element.
 */
function createEditableListItem() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'editable-list-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'freeform-list-input';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn'; // Use existing style for consistency
    removeBtn.innerHTML = '&times;';

    itemDiv.appendChild(input);
    itemDiv.appendChild(removeBtn);

    return itemDiv;
}

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
 * Creates a container with a title, an add button, and a list of editable text inputs.
 * @param {string} targetId - The ID of the element to append the block to.
 * @param {string} title - The title to display above the list.
 * @param {number} numberOfLines - The initial number of text inputs to create.
 */
function createTitledTextList(targetId, title, numberOfLines) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Element with ID "${targetId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear any placeholders

    const titleContainer = document.createElement('div');
    titleContainer.className = 'advantage-title-container'; // Use existing style for flex layout

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const addBtn = document.createElement('button');
    addBtn.className = 'add-trait-btn'; // Use existing style
    addBtn.textContent = '+';
    // Add a specific data attribute to identify this as a freeform list add button
    addBtn.dataset.action = 'add-list-item';
    addBtn.dataset.target = `${targetId}-list`; // Unique target for the list

    titleContainer.appendChild(titleElement);
    titleContainer.appendChild(addBtn);
    container.appendChild(titleContainer);

    const listContainer = document.createElement('div');
    listContainer.className = 'freeform-list-container';
    listContainer.id = `${targetId}-list`; // Set ID for the add button to target

    for (let i = 0; i < numberOfLines; i++) {
        const listItem = createEditableListItem();
        listContainer.appendChild(listItem);
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
