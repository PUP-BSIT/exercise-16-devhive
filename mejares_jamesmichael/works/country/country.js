document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('countrySearch');
    const searchBtn = document.getElementById('searchBtn');
    const countryDetails = document.getElementById('countryDetails');
    const regionCountries = document.getElementById('regionCountries');
    const loading = document.querySelector('.loading');
    const errorMessage = document.getElementById('errorMessage');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCountry();
        }
    });
    
    searchBtn.addEventListener('click', searchCountry);
    
    function searchCountry() {
        const country = searchInput.value.trim();
        
        if (!country) {
            showError('Please enter a valid country name');
            return;
        }
        
        countryDetails.classList.remove('visible');
        regionCountries.classList.remove('visible');
        errorMessage.classList.remove('visible');
        loading.classList.add('visible');
        
        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Country not found, please try again.');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('No result, country does not exist!');
                }
            
                displayCountryDetails(data[0]);
                const region = data[0].region;
                return fetch(`https://restcountries.com/v3.1/region/${region}`);
            })
            .then(response => response.json())
            .then(regionData => {
                displayRegionCountries(regionData);
                loading.classList.remove('visible');
            })
            .catch(error => {
                loading.classList.remove('visible');
                showError(error.message);
            });
    }
    
    function displayCountryDetails(country) {
        document.getElementById('countryFlag').src = country.flags.svg;
        document.getElementById('countryName').textContent = country.name.common;
        
        document.getElementById('capital').textContent = 
            country.capital ? country.capital.join(', ') : 'N/A';
        document.getElementById('region').textContent = 
            `${country.region} (${country.subregion || 'N/A'})`;
        document.getElementById('population').textContent = 
            formatNumber(country.population);
        document.getElementById('area').textContent = country.area ? 
            `${formatNumber(country.area)} km²` : 'N/A';
        
        let languagesText = 'N/A';
        if (country.languages) {
            languagesText = Object.values(country.languages).join(', ');
        }
        document.getElementById('languages').textContent = languagesText;

        let currenciesText = 'N/A';
        if (country.currencies) {
            const currencyList = [];
            for (const code in country.currencies) {
                currencyList.push(`${country.currencies[code].name} 
                    (${country.currencies[code].symbol || code})`);
            }
            currenciesText = currencyList.join(', ');
        }
        document.getElementById('currencies').textContent = currenciesText;
        
        document.getElementById('timezones').textContent = country.timezones ? 
            country.timezones.join(', ') : 'N/A';
        
        countryDetails.classList.add('visible');
    }
    
    function displayRegionCountries(countries) {
        if (countries.length > 0) { 
            document.getElementById('regionName').textContent = 
                countries[0].region;
        }
        
        const grid = document.getElementById('countriesGrid');
        grid.innerHTML = '';
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            
            const img = document.createElement('img');
            img.src = country.flags.svg;
            img.alt = `${country.name.common} flag`;
            card.appendChild(img);
            
            const countryName = document.createElement('h3');
            countryName.textContent = country.name.common;
            card.appendChild(countryName);
            
            card.addEventListener('click', function() {
                searchInput.value = country.name.common;
                searchCountry();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            grid.appendChild(card);
        });
        
        regionCountries.classList.add('visible');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
    }
    
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});