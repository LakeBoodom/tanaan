import styles from './DaylightTimeline.module.css';

interface DaylightTimelineProps {
  sunrise: Date;
  sunset: Date;
}

export default function DaylightTimeline({ sunrise, sunset }: DaylightTimelineProps) {
  // Calculate positions as percentages of 24 hours
  const sunriseHour = sunrise.getHours() + sunrise.getMinutes() / 60;
  const sunsetHour = sunset.getHours() + sunset.getMinutes() / 60;
  
  const sunrisePercent = (sunriseHour / 24) * 100;
  const sunsetPercent = (sunsetHour / 24) * 100;
  
  return (
    <div className={styles.timeline}>
      {/* Night before sunrise */}
      <div 
        className={styles.night}
        style={{ width: `${sunrisePercent}%` }}
      />
      
      {/* Daylight */}
      <div 
        className={styles.day}
        style={{ width: `${sunsetPercent - sunrisePercent}%` }}
      />
      
      {/* Night after sunset */}
      <div 
        className={styles.night}
        style={{ width: `${100 - sunsetPercent}%` }}
      />
      
      {/* Hour markers */}
      <div className={styles.markers}>
        {[0, 6, 12, 18, 24].map(hour => (
          <div 
            key={hour}
            className={styles.marker}
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            <span className={styles.markerLabel}>
              {hour.toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
