function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatLanguages(languageObject) {
  return languageObject ? Object.values(languageObject).join(", ") : "N/A";
}

function formatCurrencies(currencyObject) {
  if (!currencyObject) return "N/A";
  return Object.values(currencyObject)
    .map(
      (currency) =>
        `${currency.name} ${currency.symbol ? `(${currency.symbol})` : ""}`
    )
    .join(", ");
}

function displayCountryDetails(
  country,
  countryNameHeading,
  countryDetailsContainer,
  countryResultCard
) {
  countryNameHeading.textContent = country.name.common;
  countryDetailsContainer.innerHTML = `
    <img src="${country.flags.svg || country.flags.png}"
         alt="Flag of ${country.name.common}" class="flag" />
    <ul class="details-list">
      <li><strong>Official Name:</strong> ${country.name.official}</li>
      <li><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</li>
      <li><strong>Region:</strong> ${
        country.subregion
          ? `${country.region} (${country.subregion})`
          : country.region
      }</li>
      <li><strong>Population:</strong> ${formatNumber(country.population)}</li>
      <li><strong>Area:</strong> ${
        country.area ? `${formatNumber(country.area)} km²` : "N/A"
      }</li>
      <li><strong>Languages:</strong> ${formatLanguages(country.languages)}</li>
      <li><strong>Currencies:</strong> ${formatCurrencies(
        country.currencies
      )}</li>
    </ul>
  `;
  countryResultCard.classList.remove("hidden");
}

function displayRegionCountries(
  regionCountryList,
  excludeCountryCode,
  regionName,
  regionDetailsContainer,
  regionCountriesCard,
  searchInput,
  fetchCountryDataFunc
) {
  regionDetailsContainer.innerHTML = "";
  const regionTitle = regionCountriesCard.querySelector("h2");
  regionTitle.textContent = `Other Countries in ${regionName}`;

  const otherCountries = regionCountryList
    .filter((country) => country.cca3 !== excludeCountryCode)
    .slice(0, 5);

  const countriesGridContainer = document.createElement("div");
  countriesGridContainer.className = "countries-grid";

  otherCountries.forEach((country) => {
    const countryCardElement = document.createElement("div");
    countryCardElement.className = "country-card";
    countryCardElement.innerHTML = `
      <img src="${country.flags.svg || country.flags.png}" alt="Flag of ${
      country.name.common
    }" />
      <h3>${country.name.common}</h3>
    `;
    countryCardElement.addEventListener("click", () => {
      searchInput.value = country.name.common;
      fetchCountryDataFunc(country.name.common);
    });
    countriesGridContainer.appendChild(countryCardElement);
  });

  regionDetailsContainer.appendChild(countriesGridContainer);
  regionCountriesCard.classList.remove("hidden");
}

function fetchCountryData(
  countryName,
  errorElement,
  countryResultCard,
  regionCountriesCard,
  countryDetailsContainer,
  displayCountryDetailsFunc,
  displayRegionCountriesFunc
) {
  errorElement.classList.add("hidden");
  countryResultCard.classList.add("hidden");
  regionCountriesCard.classList.add("hidden");
  countryDetailsContainer.innerHTML = `<div class="loader">Loading...</div>`;
  countryResultCard.classList.remove("hidden");

  let countryData;

  fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
  )
    .then((result) => {
      if (!result.ok) throw new Error("Country not found.");
      return result.json();
    })
    .then((countryDataList) => {
      countryData = countryDataList[0];
      displayCountryDetailsFunc(countryData);

      return fetch(
        `https://restcountries.com/v3.1/region/${countryData.region}`
      );
    })
    .then((result) => {
      if (!result.ok) throw new Error("Region data failed.");
      return result.json();
    })
    .then((regionDataList) => {
      displayRegionCountriesFunc(
        regionDataList,
        countryData.cca3,
        countryData.region
      );
    })
    .catch((error) => {
      errorElement.textContent = error.message;
      errorElement.classList.remove("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("country-search");
  const searchButton = document.getElementById("search-btn");
  const countryResultCard = document.getElementById("country-result");
  const countryDetailsContainer = document.getElementById("country-details");
  const regionCountriesCard = document.getElementById("region-countries");
  const regionDetailsContainer = document.getElementById("region-details");
  const countryNameHeading = document.getElementById("country-name");

  let errorElement = document.getElementById("error");
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = "error";
    errorElement.className = "error hidden";
    document.getElementById("search-card").appendChild(errorElement);
  }

  const displayCountryDetailsWrapper = (country) => {
    displayCountryDetails(
      country,
      countryNameHeading,
      countryDetailsContainer,
      countryResultCard
    );
  };

  const fetchCountryDataWrapper = (countryName) => {
    fetchCountryData(
      countryName,
      errorElement,
      countryResultCard,
      regionCountriesCard,
      countryDetailsContainer,
      displayCountryDetailsWrapper,
      displayRegionCountriesWrapper
    );
  };

  const displayRegionCountriesWrapper = (
    regionCountryList,
    excludeCountryCode,
    regionName
  ) => {
    displayRegionCountries(
      regionCountryList,
      excludeCountryCode,
      regionName,
      regionDetailsContainer,
      regionCountriesCard,
      searchInput,
      fetchCountryDataWrapper
    );
  };

  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchCountryDataWrapper(query);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchCountryDataWrapper(query);
  });
});
