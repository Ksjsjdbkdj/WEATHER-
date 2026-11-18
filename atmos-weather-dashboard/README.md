# ATMOS — Weather Dashboard

A responsive live weather dashboard built for Web Technology Assignment 3 (Option A).

## Features
- Search a city and retrieve its coordinates using the Open-Meteo Geocoding API
- Fetch current weather and a five-day forecast using the Open-Meteo Forecast API
- Uses Fetch API with async/await and response.json()
- Loading state and friendly error handling for empty input, unknown cities, HTTP errors and network failures
- Dynamic DOM rendering using JavaScript
- Current temperature, feels-like temperature, humidity, wind speed and precipitation
- Five-day forecast with weather icons and daily high/low temperatures
- Celsius/Fahrenheit switch
- Recent searches saved in localStorage
- Persistent dark/light mode
- Responsive CSS Grid layout for desktop and mobile

## Run locally
1. Extract the project folder.
2. Open it in Visual Studio Code.
3. Open `index.html` with Live Server, or open it directly in a modern browser.
4. Internet access is required because weather data comes from Open-Meteo.

## APIs used
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

No API key is required. See https://open-meteo.com/ for API documentation.

## Project structure
- `index.html` — page structure
- `css/style.css` — styling and responsive layout
- `js/script.js` — API requests, error handling, rendering and localStorage
