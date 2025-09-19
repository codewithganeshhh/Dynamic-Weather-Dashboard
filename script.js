const apiKey = "d5582c32d3505621da6187eca938f3b0"; // Replace with your OpenWeatherMap API key

// Get weather by city name
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetchWeather(currentWeatherURL);
  fetchForecast(forecastURL);
}

// Get weather by geolocation
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetchWeather(currentWeatherURL);
      fetchForecast(forecastURL);
    });
  }
};

// Fetch current weather
async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("weatherInfo").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡️ Temperature: ${data.main.temp} °C</p>
      <p>☁️ Condition: ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    document.getElementById("weatherInfo").innerHTML = "❌ Failed to fetch weather data!";
  }
}

// Fetch 5-day forecast
async function fetchForecast(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    let forecastHTML = "";

    // Filter forecast to show only 1 reading per day (12:00:00)
    const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecast.forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const temp = day.main.temp;
      const icon = day.weather[0].icon;
      const desc = day.weather[0].description;

      forecastHTML += `
        <div class="forecast-card">
          <h3>${date.split(" ")[0]}</h3>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
          <p>${temp} °C</p>
          <p>${desc}</p>
        </div>
      `;
    });

    document.getElementById("forecast").innerHTML = forecastHTML;
  } catch (error) {
    document.getElementById("forecast").innerHTML = "❌ Failed to fetch forecast data!";
  }
}
