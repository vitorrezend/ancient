document.addEventListener('DOMContentLoaded', () => {
    // const token = localStorage.getItem('jwt');
    // if (!token) {
    //     window.location.href = 'login.html';
    //     return;
    // }

    initializeSheet();
    setupEventListeners();
});

/**
 * Populates the entire character sheet by calling the createTraitBlock component for each section.
 */
function initializeSheet() {
    // Attributes
    createTraitBlock('physical-attributes', Object.keys(characterData.attributes.physical), 5, 1, { category: 'attributes', group: 'physical' });
    createTraitBlock('social-attributes', Object.keys(characterData.attributes.social), 5, 1, { category: 'attributes', group: 'social' });
    createTraitBlock('mental-attributes', Object.keys(characterData.attributes.mental), 5, 1, { category: 'attributes', group: 'mental' });

    // Abilities
    createTraitBlock('talents', Object.keys(characterData.abilities.talents), 5, 0, { category: 'abilities', group: 'talents' });
    createTraitBlock('skills', Object.keys(characterData.abilities.skills), 5, 0, { category: 'abilities', group: 'skills' });
    createTraitBlock('knowledges', Object.keys(characterData.abilities.knowledges), 5, 0, { category: 'abilities', group: 'knowledges' });

    // Advantages
    const backgrounds = Array(5).fill('___________');
    createTraitBlock('backgrounds', backgrounds, 5, 0, { category: 'advantages', group: 'backgrounds' });
    createTraitBlock('spheres', Object.keys(characterData.advantages.spheres), 5, 0, { category: 'advantages', group: 'spheres' });

    // Other Traits that don't have a "group"
    createTraitBlock('arete', ['Arete'], 10, 1, { category: 'advantages' }, { customClass: 'vertical-trait' });
    createTraitBlock('willpower', ['Força de Vontade'], 10, 1, { category: 'advantages' }, { customClass: 'vertical-trait' });
    createTraitBlock('quintessence', ['Quintessência'], 20, 0, { category: 'advantages', group: 'quintessence' }, { markerType: 'checkbox', customClass: 'vertical-trait', layout: 'circular', individualMarkers: true });

    // Health Track
    createHealthTrack('health', characterData.health);

    // Other Traits
    const otherTraits = Array(9).fill('___________');
    createTraitBlock('other-traits', otherTraits, 5, 0, { category: 'advantages', group: 'other-traits' });

    // Merits & Flaws
    const merits = Array(5).fill('___________');
    createTraitBlock('merits', merits, 5, 0, { category: 'advantages', group: 'merits' });
    const flaws = Array(5).fill('___________');
    createTraitBlock('flaws', flaws, 5, 0, { category: 'advantages', group: 'flaws' });

    // New sections
    const wonders = Array(5).fill('___________');
    createTraitBlock('wonders', wonders, 0, 0, { category: 'advantages', group: 'wonders' });
    const focus = Array(5).fill('___________');
    createTraitBlock('focus', focus, 0, 0, { category: 'advantages', group: 'focus' });
    const rotes = Array(10).fill('___________');
    createTraitBlock('rotes', rotes, 0, 0, { category: 'advantages', group: 'rotes' });

    // Resonance
    createTraitBlock('resonance', Object.keys(characterData.advantages.resonance), 5, 0, { category: 'advantages', group: 'resonance' });

    // Experience Log
    createExperienceLog('experience', characterData.experienceLog);

    // Add temporary willpower checkboxes
    createCheckboxGrid('willpower-temporary', 10);

    initializeAntecedentesTab();
    initializeHistoriaTab();
}

/**
 * Populates the 'Antecedentes' tab with freeform text areas and lists.
 */
function initializeAntecedentesTab() {
    // Expanded Background
    createTwoColumnTextList('expanded-background', 12);

    // Possessions
    createTitledTextList('gear-carried-container', 'Equipamento (Carregado)', 8);
    createTitledTextList('equipment-owned-container', 'Equipamento (Possuído)', 8);

    // Familiar & Grimoire
    createTitledTextarea('familiar-container', 'Familiar');
    createTitledTextarea('grimoire-container', 'Grimório');

    // Chantry
    createTitledTextarea('chantry-location', 'Localização');
    createTitledTextarea('chantry-description', 'Descrição');
}

/**
 * Sets up event listeners for the interactive parts of the sheet.
 */
function setupEventListeners() {
    // Tab switching logic
    const tabs = document.querySelector('.tabs');
    if (tabs) {
        tabs.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab-link')) {
                const tabId = event.target.dataset.tab;

                // Remove active class from all tab links and contents
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                // Add active class to the clicked tab and corresponding content
                event.target.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            }
        });
    }

    const sheet = document.querySelector('.character-sheet');
    if (!sheet) return;

    // Event delegation for clicks
    sheet.addEventListener('click', (event) => {
        if (event.target.classList.contains('marker') && event.target.closest('#quintessence')) {
            handleQuintessenceClick(event.target);
        } else if (event.target.classList.contains('checkbox-marker') && event.target.closest('#willpower-temporary')) {
            handleTempCheckboxClick(event.target);
        } else if (event.target.classList.contains('marker')) {
            handleDotClick(event.target);
        } else if (event.target.classList.contains('health-box')) {
            handleHealthBoxClick(event.target);
        } else if (event.target.classList.contains('remove-btn') && event.target.closest('.editable-list-item')) {
            handleRemoveListItem(event.target);
        } else if (event.target.classList.contains('remove-btn')) {
            handleRemoveTrait(event.target);
        } else if (event.target.classList.contains('add-trait-btn') && event.target.dataset.action === 'add-list-item') {
            handleAddListItem(event.target);
        } else if (event.target.classList.contains('add-trait-btn')) {
            const button = event.target;
            const targetId = button.dataset.target;
            const dataPath = {
                category: button.dataset.category,
                group: button.dataset.group
            };
            handleAddTrait(targetId, dataPath);
        }
    });

    // Event delegation for inputs
    sheet.addEventListener('input', (event) => {
        if (event.target.id === 'experience-log-textarea') {
            characterData.experienceLog = event.target.value;
        } else if (event.target.classList.contains('trait-input')) {
            handleTraitInputChange(event.target);
        }
    });

    // Event listener for the PDF button
    const pdfButton = document.getElementById('generate-pdf-btn');
    if (pdfButton) {
        pdfButton.addEventListener('click', generatePdf);
    }

    // Event listener for the Save JSON button
    const jsonButton = document.getElementById('save-json-btn');
    if (jsonButton) {
        jsonButton.addEventListener('click', saveJSON);
    }

    // Event listener for the Logout button
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwt');
            window.location.href = 'login.html';
        });
    }
}

/**
 * Creates the experience log textarea.
 * @param {string} targetId The ID of the container element.
 * @param {string} initialValue The initial value of the textarea.
 */
function createExperienceLog(targetId, initialValue) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const textarea = document.createElement('textarea');
    textarea.id = 'experience-log-textarea';
    textarea.className = 'experience-log';
    textarea.value = initialValue;
    container.appendChild(textarea);
}

/**
 * Handles removing a trait element from the sheet.
 * @param {HTMLElement} buttonElement - The remove button that was clicked.
 */
function handleRemoveTrait(buttonElement) {
    const traitElement = buttonElement.closest('.trait');
    if (traitElement) {
        traitElement.remove();
    }
}

/**
 * Handles adding a new item to a freeform list.
 * @param {HTMLElement} addButton - The add button that was clicked.
 */
function handleAddListItem(addButton) {
    const targetId = addButton.dataset.target;
    const listContainer = document.getElementById(targetId);
    if (listContainer) {
        const newItem = createEditableListItem();
        listContainer.appendChild(newItem);
    }
}

/**
 * Handles removing an item from a freeform list.
 * @param {HTMLElement} removeButton - The remove button that was clicked.
 */
function handleRemoveListItem(removeButton) {
    const listItem = removeButton.closest('.editable-list-item');
    if (listItem) {
        listItem.remove();
    }
}

/**
 * Handles changes to the name of a trait in an input field.
 * @param {HTMLElement} inputElement - The input element that was changed.
 */
function handleTraitInputChange(inputElement) {
    const traitDiv = inputElement.closest('.trait');
    if (!traitDiv) return;

    const { category, group } = traitDiv.dataset;
    const oldTraitName = inputElement.dataset.currentName || '';
    const newTraitName = inputElement.value.trim();

    // Get the current value from the dots
    const value = Array.from(traitDiv.querySelectorAll('.marker.filled')).length;

    // If the name has changed, remove the old entry from the data model
    if (oldTraitName && oldTraitName !== newTraitName && characterData[category][group][oldTraitName]) {
        delete characterData[category][group][oldTraitName];
    }

    // Add the new or updated trait to the data model, but only if it has a name
    if (newTraitName) {
        characterData[category][group][newTraitName] = value;
        inputElement.dataset.currentName = newTraitName; // Remember the new name
    }
}

/**
 * Handles adding a new trait to the sheet.
 * @param {string} targetId - The ID of the container to add the trait to.
 * @param {object} dataPath - The path to the data in the character model.
 */
function handleAddTrait(targetId, dataPath) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const newTrait = createSingleTraitElement(
        '___________', // Name for a new blank input
        5,             // dotCount
        0,             // initialValue
        dataPath,      // dataPath
        {}             // options
    );

    container.appendChild(newTrait);
}

/**
 * Handles the logic when a dot is clicked.
 * @param {HTMLElement} clickedDot - The dot element that was clicked.
 */
function handleDotClick(clickedDot) {
    const traitDiv = clickedDot.closest('.trait');
    if (!traitDiv) return;

    const dotsContainer = clickedDot.parentElement;
    const allMarkers = dotsContainer.querySelectorAll('.marker');
    const clickedValue = parseInt(clickedDot.dataset.value, 10);
    const nameElement = traitDiv.querySelector('.trait-label') || traitDiv.querySelector('.trait-input');
    const traitName = nameElement.tagName === 'LABEL' ? nameElement.textContent : nameElement.value;

    const { category, group } = traitDiv.dataset;

    const currentValue = Array.from(allMarkers).filter(d => d.classList.contains('filled')).length;
    const newValue = (clickedValue === currentValue) ? clickedValue - 1 : clickedValue;

    // Update UI
    allMarkers.forEach(marker => {
        const markerValue = parseInt(marker.dataset.value, 10);
        marker.classList.toggle('filled', markerValue <= newValue);
    });

    // Update Data Model
    try {
        if (group) {
            // For traits with fixed names (abilities, attributes, resonance)
            if (traitDiv.querySelector('.trait-label')) {
                characterData[category][group][traitName] = newValue;
            } else { // For traits with editable names (backgrounds, merits, flaws)
                const traitNameFromInput = traitDiv.querySelector('.trait-input').value.trim();
                // Only update if the trait has a name. The creation/renaming is handled by handleTraitInputChange.
                if (traitNameFromInput && characterData[category][group].hasOwnProperty(traitNameFromInput)) {
                    characterData[category][group][traitNameFromInput] = newValue;
                }
            }
        } else {
            // Handle traits that are direct children of a category (Arete, Willpower)
            const dataKey = Object.keys(characterData[category]).find(k => k.toLowerCase() === traitName.toLowerCase());
            if (dataKey) {
                characterData[category][dataKey] = newValue;
            }
        }
        console.log('Updated data model:', characterData); // Verify the change
    } catch (e) {
        console.error(`Error updating data model for trait: ${traitName}`, e);
    }
}

/**
 * Creates the health track UI.
 * @param {string} targetId - The ID of the container element.
 * @param {Array<object>} healthLevels - The array of health level data.
 */
function createHealthTrack(targetId, healthLevels) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    healthLevels.forEach((level, index) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'health-level';

        const label = document.createElement('span');
        label.className = 'health-label';
        label.textContent = level.label;

        const penalty = document.createElement('span');
        penalty.className = 'health-penalty';
        penalty.textContent = level.penalty !== null ? `[${level.penalty}]` : '[-]';

        const box = document.createElement('div');
        box.className = 'health-box';
        box.dataset.index = index; // Store index to update data model

        levelDiv.appendChild(label);
        levelDiv.appendChild(penalty);
        levelDiv.appendChild(box);
        fragment.appendChild(levelDiv);
    });

    targetElement.appendChild(fragment);
}

/**
 * Populates the 'História' tab with its specific components.
 */
function initializeHistoriaTab() {
    // History & Goals
    createTitledTextarea('history-awakening-container', 'História / Despertar');
    createTitledTextarea('goals-destiny-container', 'Objetivos / Destino');

    // Seekings & Quiets
    createTitledTextarea('seekings-container', 'Buscas');
    createTitledTextarea('quiets-container', 'Calma');

    // Description
    createTitledSection('description-section', 'Descrição');
    createDescriptionBlock('description-fields-container');
    createTitledTextarea('appearance-avatar-container', 'Aparência / Natureza do Avatar');

    // Visuals
    createTitledSection('visuals-section', 'Visuais');
    createTitledTextarea('cabal-chart-container', 'Círculo');
    createTitledTextarea('character-sketch-container', 'Esboço do Personagem');
}


/**
 * Creates the description block with labels and input fields.
 * @param {string} targetId The ID of the container element.
 */
function createDescriptionBlock(targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const fields = [
        "Idade:", "Idade Aparente:", "Data de Nascimento:", "Idade do Despertar:",
        "Cabelo:", "Olhos:", "Etnia:", "Nacionalidade:", "Altura:", "Peso:", "Sexo:"
    ];

    const fragment = document.createDocumentFragment();

    fields.forEach(label => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'description-field';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'description-input';

        fieldDiv.appendChild(labelElement);
        fieldDiv.appendChild(inputElement);
        fragment.appendChild(fieldDiv);
    });

    container.appendChild(fragment);
}

/**
 * Creates and prepends a titled section header.
 * @param {string} containerId The ID of the container element.
 * @param {string} title The title text.
 */
function createTitledSection(containerId, title) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const titleElement = document.createElement('h2');
    titleElement.className = 'section-title';
    titleElement.textContent = title;

    // Prepend the title to the container
    container.insertBefore(titleElement, container.firstChild);
}

/**
 * Creates a grid of checkboxes.
 * @param {string} targetId - The ID of the container element.
 * @param {number} count - The number of checkboxes to create.
 */
function createCheckboxGrid(targetId, count) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const container = document.createElement('div');
    container.className = 'checkbox-grid';

    for (let i = 0; i < count; i++) {
        const box = document.createElement('div');
        box.className = 'checkbox-marker';
        // Note: These are not connected to the data model for now.
        // They can be made interactive by adding event listeners similar to handleDotClick.
        container.appendChild(box);
    }

    targetElement.appendChild(container);
}

/**
 * Handles clicks on a health box, cycling through damage states.
 * @param {HTMLElement} clickedBox - The health box that was clicked.
 */
function handleHealthBoxClick(clickedBox) {
    const index = parseInt(clickedBox.dataset.index, 10);
    const healthLevel = characterData.health[index];

    // Cycle through states: ok -> bashing -> lethal -> aggravated -> ok
    if (healthLevel.state === 'ok') {
        healthLevel.state = 'bashing';
        clickedBox.classList.add('bashing');
    } else if (healthLevel.state === 'bashing') {
        healthLevel.state = 'lethal';
        clickedBox.classList.remove('bashing');
        clickedBox.classList.add('lethal');
    } else if (healthLevel.state === 'lethal') {
        healthLevel.state = 'aggravated';
        clickedBox.classList.remove('lethal');
        clickedBox.classList.add('aggravated');
    } else if (healthLevel.state === 'aggravated') {
        healthLevel.state = 'ok';
        clickedBox.classList.remove('aggravated');
    }

    console.log(`Updated health level ${healthLevel.label} to ${healthLevel.state}`);
    console.log(characterData.health);
}

/**
 * Handles clicks on the temporary willpower checkboxes.
 * @param {HTMLElement} checkboxElement - The checkbox element that was clicked.
 */
function handleTempCheckboxClick(checkboxElement) {
    checkboxElement.classList.toggle('filled');
}

/**
 * Handles clicks on the Quintessence markers.
 * @param {HTMLElement} element - The marker element that was clicked.
 */
function handleQuintessenceClick(element) {
    // Ensure we are only acting on the markers themselves
    if (!element.classList.contains('marker')) return;

    const index = parseInt(element.dataset.index, 10);
    if (isNaN(index)) return;

    const currentState = characterData.advantages.quintessence[index];
    let nextState;

    // Cycle through states: empty -> quintessence -> paradox -> empty
    if (currentState === 'empty') {
        nextState = 'quintessence';
        element.classList.add('quint-filled');
    } else if (currentState === 'quintessence') {
        nextState = 'paradox';
        element.classList.remove('quint-filled');
        element.classList.add('paradox-filled');
    } else { // currentState is 'paradox'
        nextState = 'empty';
        element.classList.remove('paradox-filled');
    }

    // Update the data model
    characterData.advantages.quintessence[index] = nextState;
    console.log(`Updated Quintessence point ${index} to ${nextState}`);
    console.log(characterData.advantages.quintessence);
}

/**
 * Creates a specified number of blank, underlined fields in a target element.
 * @param {string} targetId - The ID of the container element.
 * @param {number} numberOfLines - The number of blank lines to create.
 */
function createBlankLines(targetId, numberOfLines) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Clear placeholder
    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfLines; i++) {
        const line = document.createElement('div');
        line.className = 'blank-line';
        fragment.appendChild(line);
    }

    targetElement.appendChild(fragment);
}
