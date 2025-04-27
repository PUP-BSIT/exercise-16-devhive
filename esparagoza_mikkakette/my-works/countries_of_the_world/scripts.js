document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("country-search");
    const searchBtn = document.getElementById("search-btn");
    const countryResult = document.getElementById("country-result");
    const countryDetails = document.getElementById("country-details");
    const regionCountries = document.getElementById("region-countries");
    const regionDetails = document.getElementById("region-details");
    const countryName = document.getElementById("country-name");

    searchBtn.addEventListener("click", searchCountry);
    searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
    searchCountry();
    }
    });

    function searchCountry() {
    const query = searchInput.value.trim();
    
    if (!query) {
    showError(countryDetails, "Please enter a country name");
    return;
    }

    countryResult.classList.remove("hidden");
    countryName.textContent = "Searching...";
    countryDetails.innerHTML = `<div class="loader">Loading country data...</div>`;
    regionCountries.classList.add("hidden");

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`)
    .then(response => {
    if (!response.ok) {
        throw new Error("Country not found");
    }
    return response.json();
    })
    .then(countries => {
    const country = countries[0];
    countryName.textContent = country.name.common;
    displayCountryDetails(country);
    const region = country.region;
    return fetch(`https://restcountries.com/v3.1/region/${encodeURIComponent(region)}`);
    })
    .then(response => response.json())
    .then(regionData => {
    regionCountries.classList.remove("hidden");
    displayRegionCountries(regionData);
    })
    .catch(error => {
    showError(countryDetails, error.message);
    regionCountries.classList.add("hidden");
    });
    }

    function displayCountryDetails(country) {
    const capital = country.capital && country.capital.length > 0 ? 
    country.capital[0] : "N/A";
    const population = country.population ? 
    country.population.toLocaleString() : "N/A";
    const languages = country.languages ? 
    Object.values(country.languages).join(", ") : "N/A";
    
    let currencies = "N/A";
    if (country.currencies) {
    currencies = Object.values(country.currencies)
    .map(c => `${c.name} ${c.symbol ? `(${c.symbol})` : ""}`)
    .join(", ");
    }
    
    const area = country.area ? 
    `${country.area.toLocaleString()} km²` : "N/A";
    
    countryDetails.innerHTML = `
    <div class="country-info">
    <img class="country-flag" src="${country.flags.png}" 
        alt="${country.name.common} flag">
    <div class="country-data">
        <div class="data-item">
        <span class="data-label">Capital</span>
        <span class="data-value">${capital}</span>
        </div>
        <div class="data-item">
        <span class="data-label">Region</span>
        <span class="data-value">${country.region} 
        ${country.subregion ? `(${country.subregion})` : ""}</span>
        </div>
        <div class="data-item">
        <span class="data-label">Population</span>
        <span class="data-value">${population}</span>
        </div>
        <div class="data-item">
        <span class="data-label">Languages</span>
        <span class="data-value">${languages}</span>
        </div>
        <div class="data-item">
        <span class="data-label">Currencies</span>
        <span class="data-value">${currencies}</span>
        </div>
        <div class="data-item">
        <span class="data-label">Area</span>
        <span class="data-value">${area}</span>
        </div>
    </div>
    </div>
    `;
    }

    function displayRegionCountries(countries) {
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    
    const currentCountry = countryName.textContent;
    
    regionDetails.innerHTML = `
    <h3>Region: ${countries[0].region}</h3>
    <div class="region-countries-grid">
    ${countries.map(country => {
        if (country.name.common === currentCountry) return '';
        
        return `
        <div class="region-country-card" 
        data-country="${country.name.common}">
        <img class="region-country-flag" 
        src="${country.flags.png}" 
        alt="${country.name.common} flag">
        <div class="region-country-name">
        ${country.name.common}</div>
        </div>
        `;
    }).join('')}
    </div>
    `;
    
    const countryCards = document.querySelectorAll('.region-country-card');
    countryCards.forEach(card => {
    card.addEventListener('click', () => {
    const countryName = card.dataset.country;
    searchInput.value = countryName;
    searchCountry();
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    });
    });
    }

    function showError(container, message) {
    container.innerHTML = `
    <div class="error-message">
    <p>${message}</p>
    </div>
    `;
    }
});
