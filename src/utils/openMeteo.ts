/**
 * Open-Meteo API integration for weather and sun data
 * https://open-meteo.com/en/docs
 */

export interface SunData {
  sunrise: string; // ISO datetime
  sunset: string; // ISO datetime
  daylightDuration: number; // hours
}

export interface WeatherData {
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DayData {
  sun: SunData;
  weather: WeatherData;
}

/**
 * Fetch sun and weather data for a location and date
 */
export async function fetchDayData(
  latitude: number,
  longitude: number,
  date: Date
): Promise<DayData> {
  const dateStr = date.toISOString().split('T')[0];
  
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('start_date', dateStr);
  url.searchParams.set('end_date', dateStr);
  url.searchParams.set('timezone', 'Europe/Helsinki');
  url.searchParams.set('daily', [
    'sunrise',
    'sunset',
    'daylight_duration',
    'temperature_2m_max',
    'temperature_2m_min',
    'weather_code',
    'wind_speed_10m_max'
  ].join(','));
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    sun: {
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      daylightDuration: data.daily.daylight_duration[0] / 3600, // Convert seconds to hours
    },
    weather: {
      temperatureMin: data.daily.temperature_2m_min[0],
      temperatureMax: data.daily.temperature_2m_max[0],
      weatherCode: data.daily.weather_code[0],
      windSpeed: data.daily.wind_speed_10m_max[0],
    },
  };
}
