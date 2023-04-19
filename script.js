//For Displaying Information
const airQualityElement = document.querySelector(".air-quality");
const conditionElement = document.querySelector(".condition");
const tempElement = document.querySelector(".temp");
const feelsLikeElement = document.querySelector(".feels-like");
const humidityElement = document.querySelector(".humidity");
const iconElement = document.querySelector(".icon");
const locationElement = document.querySelector(".location");
const countryElement = document.querySelector(".country");
const regionElement = document.querySelector(".region");

// For Changing Units
const unitChange = document.querySelector(".unit-change");

// Initial Display
getWeatherData("New Delhi");

// To take in query and display weather
document.querySelector(".search").addEventListener("click", (e) => {
  e.preventDefault(e);

  const query = document.querySelector(".input").value;
  getWeatherData(query);

  const searchForm = document.querySelector(".search-form");
  searchForm.reset();
});

//fetch weather and display
async function getWeatherData(query) {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.style.display = "block";

  try {
    const response = await fetch(
      "https://api.weatherapi.com/v1/current.json?key=8b42fa8c83b8480685c131553231504&q=" +
        query +
        "&aqi=yes",
      { mode: "cors" }
    );

    loadingIndicator.style.display = "none";

    const WeatherData = await response.json();

    const location = WeatherData.location.name;
    locationElement.textContent = `${location},\u00A0`;

    const country = WeatherData.location.country;
    countryElement.textContent = country;

    const icon = WeatherData.current.condition.icon;
    iconElement.src = icon;

    let tempUnit = "c";
    const tempC = WeatherData.current.temp_c;
    const feelsLikeC = WeatherData.current.feelslike_c;
    const tempF = WeatherData.current.temp_f;
    const feelsLikeF = WeatherData.current.feelslike_f;
    tempElement.textContent = `${tempC} °C`;
    feelsLikeElement.textContent = `Feels Like: ${feelsLikeC} °C`;

    unitChange.disabled = false;
    unitChange.addEventListener("click", () => {
      tempUnit = tempUnit === "c" ? "f" : "c";
      changeUnit(
        tempC,
        feelsLikeC,
        tempF,
        feelsLikeF,
        tempUnit,
        tempElement,
        feelsLikeElement
      );
    });

    const condition = WeatherData.current.condition.text;
    conditionElement.textContent = condition;
    fetchImage(condition);

    let airQuality = WeatherData.current.air_quality.co;
    airQuality = airQuality.toFixed(0);
    airQualityElement.textContent = `AQI: ${airQuality}`;

    const humidity = WeatherData.current.humidity;
    humidityElement.textContent = `Humidity: ${humidity}`;
  } catch {
    locationElement.textContent = "NO SUCH CITY EXIST";
    iconElement.src = "./image/logo.png";
    conditionElement.textContent = "Try Again";

    countryElement.textContent = "";
    tempElement.textContent = "";
    feelsLikeElement.textContent = "";
    airQualityElement.textContent = "";
    humidityElement.textContent = "";

    unitChange.disabled = true;
  }
}

//to change unit
function changeUnit(
  tempC,
  feelsLikeC,
  tempF,
  feelsLikeF,
  tempUnit,
  tempElement,
  feelsLikeElement
) {
  if (tempUnit === "c") {
    tempElement.textContent = `${tempC} °C`;
    feelsLikeElement.textContent = `Feels Like: ${feelsLikeC} °C`;
  } else if (tempUnit === "f") {
    tempElement.textContent = `${tempF} °F`;
    feelsLikeElement.textContent = `Feels Like: ${feelsLikeF} °F`;
  }
}

// to fetch and display background
async function fetchImage(query) {
  const main = document.querySelector("main");
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=35539165-a862cf47d26a657dc3cdc222d&q=Weather+${query}&image_type=photo&pretty=true`,
      { mode: "cors" }
    );
    const image = await response.json();
    main.style.backgroundImage = `url(${image.hits[3].largeImageURL})`;
  } catch {
    main.style.backgroundImage = `url("/image/weather-image.png")`;
  }
}
