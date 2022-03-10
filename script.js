let countriesContainer = document.querySelector(".country-display-container");
let searchCountry = document.querySelector(".search-country");
let selectRegion = document.querySelector(".select-filter");
let mainContainer = document.querySelector(".main-container");
let darkMode = document.querySelector(".dark-mode-container");

/**
 * fetch all the countries from a api
 * @returns all the countries from the api
 */
const getCountries = async () => {
    const res = await fetch(`https://restcountries.com/v2/all`);
    const result = await res.json();
    return result
}

/**
 * Display each country from the api on the dom
 * @param {Object} country each country from the api will be passed to this function
 */
const displayCountries = (country) => {
    countriesContainer.insertAdjacentHTML("beforeend", `<div class="country-container" name=${country.name} onClick="getDetailedCountry(event)">
        <img class="country-flag" src="${country.flags.png}" alt="country-flag"/>
        <div class="country-info">
         <h3 class="country-name">${country.name}</h3>
         <p><b>Population:</b> ${country.population}</p>
         <p><b>Region:</b> ${country.region}</p>
         <p><b>Capital:</b> ${country.capital}</p>
        </div>
      </div>`)
}

/**
 * Whne a user clicks on a country a detailed page of that country appears
 * @param {Object} e the event that occurs when clicking on any specific country
 */
const getDetailedCountry = async (e) => {
    const res = await fetch(`https://restcountries.com/v2/name/${e.currentTarget.getAttribute("name")}`)
    const result = await res.json();
    console.log(result);
    mainContainer.innerHTML = "";
    mainContainer.insertAdjacentHTML("beforeend", `<button onClick="refreshPage()" class="go-back-button"><span class="go-back-arrow">&#8592</span> Back</button>`)
    result.forEach(country => {
        mainContainer.insertAdjacentHTML("beforeend", `<div class="detailed-country-container">
            <div class="detailed-country-image-container">
                <img class="detailed-country-image" src="${country.flags.png}" alt="detailed-country-flag"/>
            </div>
            <div class="detailed-country-info-container">
                <h2 class="detailed-country-name">${country.name}</h2>
                <div class="detailed-country-info">
                    <div class="detailed-info-left">
                        <p><b>Native Name:</b> ${country.nativeName}</p>
                        <p><b>Population:</b> ${country.population}</p>
                        <p><b>Region:</b> ${country.region}</p>
                        <p><b>Sub Region:</b> ${country.subregion}</p>
                        <p><b>Capital:</b> ${country.capital ? country.capital : "No capital"}</p>
                    </div>
                    <div class="detailed-info-right">
                        <p><b>Top Level Domain:</b> ${country.topLevelDomain}</p>
                        <p><b>Currencies:</b> ${country.currencies ? country.currencies[0].name : "No currency"}</p>
                        <p><b>Languages:</b> ${country.languages ? country.languages.map(language => `${language.name}`) : ""}</p>
                    </div>
                </div>
                <div class="border-countries">
                    <div style="width: 150px"><b>Border Countries:</b> </div><div>${country.borders ? country.borders.filter((ele, ind) => ind < 6).map(border => `<span class="single-border-country">${border}</span>`).join("") : " No border Countries"}</div>
                </div>
            </div>
        </div>`)
    })
}

/**
 * Refresh page to get the main content back
 */
const refreshPage = () => {
    location.reload();
}

/**
 * search for a specific country by entering the name
 * @param {String} url the url that that we use to fetch for a specific country
 * @returns nothing if the name is not valid
 */
const searchForCountry = async (url) => {
    const res = await fetch(url);
    const result = await res.json();
    console.log(result);
    if (result.status || result.message) {
        alert("Please enter a valid country name");
        const countries = await getCountries();
        console.log(countries)
        countries.forEach(country => {
            displayCountries(country);
        })
        return
    }
    countriesContainer.innerHTML = "";
    result.forEach(country => {
        displayCountries(country);
    })
}

selectRegion.addEventListener("click", function (e) {
    if (e.target.value) {
        searchForCountry(`https://restcountries.com/v2/region/${e.target.value}`)
    }
})



searchCountry.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
        searchForCountry(`https://restcountries.com/v2/name/${e.target.value}`)
    }
})

darkMode.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark-mode");
    if (document.documentElement.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", JSON.stringify(true));
    } else {
        localStorage.removeItem("dark-mode");
    }
})

window.onload = async () => {
    if (localStorage.getItem("dark-mode")) {
        document.documentElement.classList.add("dark-mode")
    }
    const countries = await getCountries();
    console.log(countries)
    countries.forEach(country => {
        displayCountries(country);
    })
}

