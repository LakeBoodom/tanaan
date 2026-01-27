'use client';

import { useState, useEffect } from 'react';
import LocationSelector from '@/components/LocationSelector';
import DaylightTimeline from '@/components/DaylightTimeline';
import { getWeatherIcon } from '@/components/WeatherIcons';
import { DayData, fetchDayData } from '@/utils/openMeteo';
import { fetchHistoricalEvent } from '@/utils/wikipedia';
import { formatFinnishDate, formatTime, formatDuration, getDateKey, getMillisecondsUntilMidnight } from '@/utils/dateTime';
import { getWeatherDescription, formatTemperature, formatWindSpeed } from '@/utils/weather';
import { generateMoodLine } from '@/utils/moodLines';
import namedaysFinnish from '@/data/namedays-finnish.json';
import namedaysOrthodox from '@/data/namedays-orthodox.json';
import namedaysSwedish from '@/data/namedays-swedish.json';
import styles from './TanaanClient.module.css';

interface Municipality {
  name: string;
  lat: number;
  lon: number;
}

interface TanaanClientProps {
  initialDayData: DayData;
  initialHistoricalEvent: string;
  initialLocation: Municipality;
  currentDate: Date;
}

export default function TanaanClient({ 
  initialDayData, 
  initialHistoricalEvent,
  initialLocation,
  currentDate: initialDate
}: TanaanClientProps) {
  const [location, setLocation] = useState<Municipality>(initialLocation);
  const [dayData, setDayData] = useState<DayData>(initialDayData);
  const [historicalEvent, setHistoricalEvent] = useState(initialHistoricalEvent);
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  
  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('tanaan-location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch (e) {
        console.error('Failed to parse saved location');
      }
    }
  }, []);
  
  // Save location to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tanaan-location', JSON.stringify(location));
  }, [location]);
  
  // Fetch new data when location changes
  useEffect(() => {
    async function updateData() {
      try {
        const newDayData = await fetchDayData(location.lat, location.lon, currentDate);
        setDayData(newDayData);
      } catch (error) {
        console.error('Failed to fetch day data:', error);
      }
    }
    
    updateData();
  }, [location, currentDate]);
  
  // Set up midnight refresh
  useEffect(() => {
    const msUntilMidnight = getMillisecondsUntilMidnight();
    
    const timer = setTimeout(() => {
      window.location.reload();
    }, msUntilMidnight);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate derived data
  const sunrise = new Date(dayData.sun.sunrise);
  const sunset = new Date(dayData.sun.sunset);
  const weatherDesc = getWeatherDescription(dayData.weather.weatherCode);
  const WeatherIconComponent = getWeatherIcon(weatherDesc.icon);
  const moodLine = generateMoodLine(currentDate, dayData.sun.daylightDuration);
  
  const dateKey = getDateKey(currentDate);
  const namedayFinnish = (namedaysFinnish as Record<string, string>)[dateKey] || '—';
  const namedayOrthodox = (namedaysOrthodox as Record<string, string>)[dateKey] || '—';
  const namedaySwedish = (namedaysSwedish as Record<string, string>)[dateKey] || '—';
  
  return (
    <main className={styles.main}>
      {/* Mood line with gradient background */}
      <section 
        className={styles.moodSection}
        style={{
          background: `linear-gradient(135deg, ${moodLine.gradient.from}, ${moodLine.gradient.via}, ${moodLine.gradient.to})`
        }}
      >
        <p className={styles.moodText}>{moodLine.text}</p>
      </section>
      
      {/* Date */}
      <section className={styles.dateSection}>
        <h1 className={styles.date}>{formatFinnishDate(currentDate)}</h1>
      </section>
      
      {/* Sun & Daylight */}
      <section className={styles.sunSection}>
        <h2 className={styles.sectionTitle}>VALO</h2>
        
        <div className={styles.sunTimes}>
          <div className={styles.sunTime}>
            <span className={styles.sunLabel}>AURINGONNOUSU</span>
            <span className={styles.sunValue}>{formatTime(sunrise)}</span>
          </div>
          
          <div className={styles.sunTime}>
            <span className={styles.sunLabel}>AURINGONLASKU</span>
            <span className={styles.sunValue}>{formatTime(sunset)}</span>
          </div>
          
          <div className={styles.sunTime}>
            <span className={styles.sunLabel}>PÄIVÄN PITUUS</span>
            <span className={styles.sunValue}>{formatDuration(dayData.sun.daylightDuration)}</span>
          </div>
        </div>
        
        <DaylightTimeline sunrise={sunrise} sunset={sunset} />
      </section>
      
      {/* Weather */}
      <section className={styles.weatherSection}>
        <h2 className={styles.sectionTitle}>SÄÄ TÄNÄÄN</h2>
        
        <div className={styles.weatherContent}>
          <WeatherIconComponent className={styles.weatherIcon} />
          
          <div className={styles.weatherDetails}>
            <p className={styles.weatherDescription}>{weatherDesc.text}</p>
            <p className={styles.weatherTemp}>
              {formatTemperature(dayData.weather.temperatureMin)}…{formatTemperature(dayData.weather.temperatureMax)}
            </p>
            <p className={styles.weatherWind}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.weatherWindIcon}>
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
              </svg>
              {formatWindSpeed(dayData.weather.windSpeed)}
            </p>
          </div>
        </div>
        
        <div className={styles.weatherTimes}>
          <div className={styles.weatherTime}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.weatherTimeIcon}>
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            Aamu
          </div>
          <div className={styles.weatherTime}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.weatherTimeIcon}>
              <circle cx="12" cy="12" r="4"/>
            </svg>
            Päivä
          </div>
          <div className={styles.weatherTime}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.weatherTimeIcon}>
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            Ilta
          </div>
        </div>
      </section>
      
      {/* Name days */}
      <section className={styles.namedaysSection}>
        <h2 className={styles.sectionTitle}>NIMIPÄIVÄT</h2>
        
        <div className={styles.namedaysList}>
          <div className={styles.nameday}>
            <span className={styles.namedayLabel}>Suomi</span>
            <span className={styles.namedayValue}>{namedayFinnish}</span>
          </div>
          
          <div className={styles.nameday}>
            <span className={styles.namedayLabel}>Ortodoksi</span>
            <span className={styles.namedayValue}>{namedayOrthodox}</span>
          </div>
          
          <div className={styles.nameday}>
            <span className={styles.namedayLabel}>Ruotsi</span>
            <span className={styles.namedayValue}>{namedaySwedish}</span>
          </div>
        </div>
      </section>
      
      {/* Today in history */}
      <section className={styles.historySection}>
        <h2 className={styles.sectionTitle}>
          TÄNÄ PÄIVÄNÄ {currentDate.getDate()}.{currentDate.getMonth() + 1}.
        </h2>
        <p className={styles.historyText}>{historicalEvent}</p>
      </section>
      
      {/* Location selector */}
      <section className={styles.locationSection}>
        <LocationSelector 
          onLocationChange={setLocation}
          currentLocation={location}
        />
      </section>
    </main>
  );
}
