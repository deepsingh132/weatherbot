interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number; // Optional, as not always present
    grnd_level?: number; // Optional, as not always present
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number; // Optional, as not always present
  };
  rain?: {
    "1h"?: number; // Optional, as not always present
    "3h"?: number; // Optional, for consistency
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number; // Optional, as not always present
    id?: number; // Optional, as not always present
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

function getWeatherIcon(weatherType: string): string {
  switch (weatherType) {
    // case "Clear":
    //   return "☀️";
    // case "Clouds":
    //   return "☁️";
    // case "Rain":
    //   return "🌧️";
    // case "Snow":
    //   return "❄️";
    // case "Thunderstorm":
    //   return "⛈️";
    // case "Drizzle":
    //   return "🌧️";
    // case "Mist":
    //   return "🌫️";
    // case "Smoke":
    //   return "🌫️";
    // case "Haze":
    //   return "🌫️";
    // default:
    //   return "🌞";
    case "01d":
      return "☀️";
    case "01n":
      return "🌕";
    case "02d":
      return "⛅️";
    case "02n":
      return "⛅️";
    case "03d":
      return "☁️";
    case "03n":
      return "☁️";
    case "04d":
      return "☁️";
    case "04n":
      return "☁️";
    case "09d":
      return "🌧️";
    case "09n":
      return "🌧️";
    case "10d":
      return "🌦️";
    case "10n":
      return "🌦️";
    case "11d":
      return "⛈️";
    case "11n":
      return "⛈️";
    case "13d":
      return "❄️";
    case "13n":
      return "❄️";
    case "50d":
      return "🌫️";
    case "50n":
      return "🌫️";
    default:
      return "🌞";
  }
}

export const fetchWeather = async (location: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    const data = await response.json() as WeatherResponse;
    const { weather, main } = data;


    return `The Weather in ${location} is ${weather[0].main} ${getWeatherIcon(weather[0].icon)} with a temperature of ${main.temp} degrees.`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Error fetching weather data.";
  }
};
