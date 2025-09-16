/**
 * Gathers all character data and triggers a download of a JSON file.
 */
function saveJSON() {
    // 1. Create a deep copy of the characterData to avoid side effects
    const dataToSave = JSON.parse(JSON.stringify(characterData));

    // 2. Get the values from the header input fields
    const characterInfoInputs = {
        'char-name': 'name',
        'player': 'player',
        'chronicle': 'chronicle',
        'nature': 'nature',
        'demeanor': 'demeanor',
        'essence': 'essence',
        'affiliation': 'affiliation',
        'faction': 'faction',
        'concept': 'concept'
    };

    for (const [inputId, dataKey] of Object.entries(characterInfoInputs)) {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            dataToSave.info[dataKey] = inputElement.value;
        }
    }

    // 3. Convert the data object to a JSON string
    const jsonString = JSON.stringify(dataToSave, null, 2);

    // 4. Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 5. Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);

    // 6. Set the download attribute with a filename
    const characterName = dataToSave.info.name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'character';
    a.download = `${characterName}.json`;

    // 7. Programmatically click the <a> element and then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(a.href);
}
