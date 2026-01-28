import { Suspense } from 'react';
import TanaanClient from './TanaanClient';
import { fetchDayData } from '@/utils/openMeteo';
import { fetchHistoricalEvent } from '@/utils/wikipedia';
import { getCurrentHelsinkiDate } from '@/utils/dateTime';
import municipalities from '@/data/municipalities.json';
// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
/**
 * Main server component
 * Fetches data and passes to client component
 */
export default async function Home() {
  const date = getCurrentHelsinkiDate();
  
  // Default location: Helsinki
  const defaultLocation = municipalities[0];
  
  // Fetch data in parallel
  const [dayData, historicalEvent] = await Promise.all([
    fetchDayData(defaultLocation.lat, defaultLocation.lon, date),
    fetchHistoricalEvent(date),
  ]);
  
  return (
    <Suspense fallback={null}>
      <TanaanClient 
        initialDayData={dayData}
        initialHistoricalEvent={historicalEvent}
        initialLocation={defaultLocation}
        currentDate={date}
      />
    </Suspense>
  );
}
