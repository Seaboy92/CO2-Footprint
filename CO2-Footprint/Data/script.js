// Funktion zur Anpassung der Leserichtung basierend auf der Sprache
function adjustDirection(language) {
    let newDir; // Neue Leserichtung
    const body = document.body;
    // Überprüfen, ob die Sprache rtl oder ltr benötigt
    if (language === 'ar') { // wenn Arabisch: rtl
        body.classList.remove('ltr');
        body.classList.add('rtl');
        newDir = 'rtl';
    } else if (language === 'en' || language === 'de') { // wenn Englisch oder Deutsch: ltr
        body.classList.remove('rtl');
        body.classList.add('ltr');
        newDir = 'ltr'; 
    } else {
        body.classList.remove('rtl');
        body.classList.add('ltr');
        newDir = 'ltr'; // Standardfall: ltr
    }

    // Leserichtung auf die HTML-Wurzel anwenden
    document.documentElement.setAttribute('dir', newDir);
    console.log(`Sprache: ${language}, Leserichtung: ${newDir}`);
}

// Globale Variable für Übersetzungen
let translations = {};

// Funktion zum Laden der JSON-Datei
async function loadTranslations() {
    return fetch('./Data/translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Laden der JSON-Datei');
            }
            return response.json();
        })
        .then(data => {
            translations = data.texts; // Übersetzungen speichern
            console.log('Übersetzungen erfolgreich geladen:', translations);
        })
        .catch(error => console.error('Fehler beim Laden der Übersetzungen:', error));
}

// Funktion zum Aktualisieren der Texte
function updateTexts(language) {
    adjustDirection(language);
    // IDs aus der index.html
    const titel = document.getElementById('titel');
    const language_label = document.getElementById('language_label');
    const areas = document.getElementById('areas');
    const impressum = document.getElementById('impressum');
    const ubaLink = document.getElementById('ubaLink');
    const information_titel = document.getElementById('information_titel');
    const information_text = document.getElementById('information_text');
    const country_titel = document.getElementById('country_titel');
    const country_text = document.getElementById('country_text');
    const company_titel = document.getElementById('company_titel');
    const company_text = document.getElementById('company_text');
    const name = document.getElementById('name');
    const adress = document.getElementById('adress');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    if (translations) {
        // Übersetzungen anwenden
        titel.innerHTML = translations.titel[language] || 'Text nicht verfügbar.';
        language_label.innerHTML = translations.language_label[language] || 'Text nicht verfügbar.';
        areas.innerHTML = translations.areas[language] || 'Text nicht verfügbar.';
        impressum.innerHTML = translations.impressum[language] || 'Text nicht verfügbar.';
        ubaLink.innerHTML = translations.ubaLink[language] || 'Text nicht verfügbar.';
        information_titel.innerHTML = translations.information_titel[language] || 'Text nicht verfügbar.';
        information_text.innerHTML = translations.information_text[language] || 'Text nicht verfügbar.';
        country_titel.innerHTML = translations.country_titel[language] || 'Text nicht verfügbar.';
        country_text.innerHTML = translations.country_text[language] || 'Text nicht verfügbar.';
        company_titel.innerHTML = translations.company_titel[language] || 'Text nicht verfügbar.';
        company_text.innerHTML = translations.company_text[language] || 'Text nicht verfügbar.';
        name.innerHTML = translations.name[language] || 'Text nicht verfügbar.';
        adress.innerHTML = translations.adress[language] || 'Text nicht verfügbar.';
        email.innerHTML = translations.email[language] || 'Text nicht verfügbar.';
        phone.innerHTML = translations.phone[language] || 'Text nicht verfügbar.';

    } else {
        console.error('Übersetzungen sind noch nicht geladen.');
    }
    // Alle Elemente mit der Klasse "translate" auswählen
    const elements = document.querySelectorAll('.translate');
    elements.forEach(el => {
        // Den Klassennamen des Elements abrufen (z. B. 'titel', 'about')
        const key = Array.from(el.classList).find(cls => translations[cls]);

        // Übersetzung basierend auf dem Klassennamen
        if (key && translations[key][language]) {
            el.innerHTML = translations[key][language];
        } else {
            // Falls keine Übersetzung vorhanden
            el.innerHTML = 'Text nicht verfügbar';
        }
    });
}
// Event-Listener für Sprachwechsel
document.getElementById('language-select').addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    updateTexts(selectedLanguage); // Texte mit der ausgewählten Sprache laden
});

// Beim Laden der Seite Übersetzungen laden und Standardtexte anzeigen
loadTranslations().then(() => {
    updateTexts('de'); // Standard: Deutsch
});

// Funktion zum Laden der JSON-Datei und zur Tabellen-Umwandlung
async function loadJSONToTable($tableName) {
    // JSON-Datei laden
    if($tableName === 'country-data-table'){
        $jsonFile = './Data/country.json'
    }
    if ($tableName === 'company-data-table'){
        $jsonFile = './Data/company.json'
    }
    const response = await fetch($jsonFile);
    const data = await response.json();

    // Tabelle und Header-Elemente auswählen
    const table = document.getElementById($tableName);
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Tabellenkopf dynamisch hinzufügen
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        // Event-Listener zum Sortieren
        th.addEventListener('click', () => sortTable($tableName, index));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Tabellenzeilen dynamisch hinzufügen
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    // initiale sortierung nach CO2-Wert
    table.setAttribute('data-sort-direction', 'asc');
    sortTable($tableName, 2);
}

// Funktion zum Sortieren der Tabelle
function sortTable(tableName, columnIndex) {
    const table = document.getElementById(tableName);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.getElementsByTagName('tr')); // HTMLCollection in Array umwandeln

    // Sortierung toggeln (aufsteigend/absteigend)
    const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
    table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');

    // Zeilen sortieren
    rows.sort((rowA, rowB) => {
        const cellA = rowA.getElementsByTagName('td')[columnIndex].textContent.trim().toLowerCase();
        const cellB = rowB.getElementsByTagName('td')[columnIndex].textContent.trim().toLowerCase();

        if (!isNaN(cellA) && !isNaN(cellB)) {
            // Numerische Sortierung
            return isAscending ? cellA - cellB : cellB - cellA;
        } else {
            // Alphabetische Sortierung
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });
    // Sortierte Zeilen wieder einfügen
    rows.forEach(row => tbody.appendChild(row));
}

// Funktion zum Filtern der Tabellen
function filterTable($tableName) {
    if($tableName === 'country-data-table'){
        $elementIdSerach = 'countrySerach'
        $elementIdBody = 'tableBodyCountry'
    }
    if ($tableName === 'company-data-table'){
        $elementIdSerach = 'companySerach'
        $elementIdBody = 'tableBodyCompany'
    }

    // Suchbegriff aus dem Eingabefeld holen
    const searchValue = document.getElementById($elementIdSerach).value.toLowerCase();
    const tableBody = document.getElementById($elementIdBody);
    const rows = tableBody.getElementsByTagName("tr");

    // Durch jede Zeile der Tabelle iterieren
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let rowContainsSearchTerm = false;

        // Überprüfen, ob der Suchbegriff in einer Zelle der aktuellen Zeile vorkommt
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchValue)) {
                rowContainsSearchTerm = true;
                break;
            }
        }

        // Zeile anzeigen, wenn Suchbegriff gefunden wurde, ansonsten ausblenden
        rows[i].style.display = rowContainsSearchTerm ? "" : "none";
    }
}

// Funktion beim Laden der Seite aufrufen
loadJSONToTable('country-data-table');
loadJSONToTable('company-data-table');


// Seitenmenü aus-/ eingeklappen und Kontentbereich anpassen 
// Selektiere die Elemente
const toggleButton = document.getElementById('sidemenu');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

// Event Listener für den Seitenmeü-Button
toggleButton.addEventListener('click', () => {
    // Überprüfen, ob die Sidebar offen ist
    const isOpen = sidebar.classList.toggle('open');

    // Breite von #content anpassen
    if (isOpen) {
        content.style.width = "50%"; // Wenn das Menü geöffnet ist
    } else {
        content.style.width = "90%"; // Wenn das Menü geschlossen ist
    }
});

// Seitentitel ausblenden, wenn auf mobilem Gerät das Menü im Header ausgeklappt wird
const navButton = document.getElementById('navButton');
const titel = document.getElementById('titel');
// Event Listener für Navigationsleisten-Button
navButton.addEventListener('click', () => {
    // Prüfe, ob das Menü aktuell ausgeklappt ist
    const isExpanded = navButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
        // Wenn das Menü ausgeklappt wird
        titel.style.display = 'none'; // Titel ausblenden
    } else {
        // Wenn das Menü eingeklappt wird
        titel.style.display = ''; // Titel wieder einblenden (Standardanzeige)
    }
});
