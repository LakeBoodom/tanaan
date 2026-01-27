/**
 * Weather utilities for Open-Meteo API
 * Maps weather codes to Finnish descriptions and icons
 */

export interface WeatherDescription {
  text: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'fog' | 'storm';
}

/**
 * Map Open-Meteo weather code to Finnish description
 * https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): WeatherDescription {
  const descriptions: Record<number, WeatherDescription> = {
    0: { text: 'Selkeä taivas', icon: 'sun' },
    1: { text: 'Melko selkeä', icon: 'sun' },
    2: { text: 'Puolipilvinen', icon: 'cloud' },
    3: { text: 'Pilvinen', icon: 'cloud' },
    45: { text: 'Sumua', icon: 'fog' },
    48: { text: 'Jäätävä sumu', icon: 'fog' },
    51: { text: 'Kevyt tihku', icon: 'rain' },
    53: { text: 'Tihkusade', icon: 'rain' },
    55: { text: 'Voimakas tihku', icon: 'rain' },
    56: { text: 'Jäätävä tihku', icon: 'rain' },
    57: { text: 'Voimakas jäätävä tihku', icon: 'rain' },
    61: { text: 'Kevyt sade', icon: 'rain' },
    63: { text: 'Sade', icon: 'rain' },
    65: { text: 'Voimakas sade', icon: 'rain' },
    66: { text: 'Jäätävä sade', icon: 'rain' },
    67: { text: 'Voimakas jäätävä sade', icon: 'rain' },
    71: { text: 'Kevyt lumisade', icon: 'snow' },
    73: { text: 'Lumisade', icon: 'snow' },
    75: { text: 'Voimakas lumisade', icon: 'snow' },
    77: { text: 'Lumijyväsiä', icon: 'snow' },
    80: { text: 'Heikkoja sadekuuroja', icon: 'rain' },
    81: { text: 'Sadekuuroja', icon: 'rain' },
    82: { text: 'Voimakkaita sadekuuroja', icon: 'rain' },
    85: { text: 'Lumikuuroja', icon: 'snow' },
    86: { text: 'Voimakkaita lumikuuroja', icon: 'snow' },
    95: { text: 'Ukkosta', icon: 'storm' },
    96: { text: 'Ukkosta ja rakeita', icon: 'storm' },
    99: { text: 'Voimakas ukkonen ja rakeita', icon: 'storm' },
  };
  
  return descriptions[code] || { text: 'Tuntematon', icon: 'cloud' };
}

/**
 * Round temperature to nearest integer
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

/**
 * Format wind speed
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} m/s`;
}
