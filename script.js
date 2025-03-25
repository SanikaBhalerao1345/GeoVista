let favoriteCountries = [];
let comparisonCountries = [];

async function fetchCountries() {
    const searchQuery = document.getElementById('country-search').value;
    const region = document.getElementById('region-filter').value;
    const languageFilter = document.getElementById('language-filter').value;

    let url = 'https://restcountries.com/v3.1/all';
    if (searchQuery) {
        url = `https://restcountries.com/v3.1/name/${searchQuery}`;
    } else if (region) {
        url = `https://restcountries.com/v3.1/region/${region}`;
    }

    try {
        const response = await fetch(url);
        let data = await response.json();

        if (languageFilter) {
            data = data.filter(country =>
                country.languages && Object.values(country.languages).includes(languageFilter)
            );
        }

        displayCountries(data);
        populateLanguageDropdown(data);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function displayCountries(countries) {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}" width="100%">
            <h3>${country.name.common}</h3>
            <p>Population: ${country.population.toLocaleString()}</p>
            <p>Languages: ${Object.values(country.languages || {}).join(', ')}</p>
            <button class="favorite-button" onclick="addToFavorites('${country.name.common}')">🌟</button>
            <button onclick="addToComparison('${country.name.common}')">Compare</button>
        `;
        container.appendChild(card);
    });
}

function addToFavorites(countryName) {
    if (!favoriteCountries.includes(countryName)) {
        favoriteCountries.push(countryName);
        updateFavorites();
    }
}

function updateFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = favoriteCountries.map(name => `<p>${name}</p>`).join('');
}

async function addToComparison(countryName) {
    if (comparisonCountries.some(c => c.name === countryName)) return;

    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    const country = data[0];

    if (comparisonCountries.length < 2) {
        comparisonCountries.push({
            name: country.name.common,
            flag: country.flags.png,
            population: country.population,
            languages: Object.values(country.languages || {}).join(', '),
            area: country.area
        });

        updateComparisonTable();
        document.getElementById('comparison-container').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("You can only compare 2 countries at a time.");
    }
}

function updateComparisonTable() {
    const table = document.getElementById('comparison-table');
    table.innerHTML = comparisonCountries.map(c => `
        <tr>
            <td><img src="${c.flag}" width="50"></td>
            <td>${c.name}</td>
            <td>${c.population.toLocaleString()}</td>
            <td>${c.languages}</td>
            <td>${c.area.toLocaleString()} km²</td>
        </tr>
    `).join('');
}

function populateLanguageDropdown(countries) {
    const languageDropdown = document.getElementById('language-filter');
    const allLanguages = new Set();

    countries.forEach(country => {
        if (country.languages) {
            Object.values(country.languages).forEach(lang => allLanguages.add(lang));
        }
    });

    languageDropdown.innerHTML = '<option value="">All Languages</option>';
    allLanguages.forEach(lang => {
        languageDropdown.innerHTML += `<option value="${lang}">${lang}</option>`;
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

fetchCountries();
