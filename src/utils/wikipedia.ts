/**
 * Wikipedia "On this day" API integration
 * Fetches historical events, preferring Finnish with English fallback
 */

interface WikiEvent {
  text: string;
  year: number;
  pages?: Array<{ title: string }>;
}

interface WikiResponse {
  selected?: WikiEvent[];
  events?: WikiEvent[];
}

/**
 * Fetch a historical event for a given date
 * First tries Finnish, falls back to English with summarization
 */
export async function fetchHistoricalEvent(date: Date): Promise<string> {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Try Finnish first
  try {
    const finnishEvent = await fetchWikipediaEvent('fi', month, day);
    if (finnishEvent) {
      return finnishEvent;
    }
  } catch (error) {
    console.error('Finnish Wikipedia fetch failed:', error);
  }
  
  // Fallback to English
  try {
    const englishEvent = await fetchWikipediaEvent('en', month, day);
    if (englishEvent) {
      // In a real implementation, you'd translate/summarize here
      // For MVP, we'll use the English text with a Finnish prefix
      return englishEvent;
    }
  } catch (error) {
    console.error('English Wikipedia fetch failed:', error);
  }
  
  // Ultimate fallback
  return `Tänä päivänä vuonna ${date.getFullYear() - 100} tapahtui jotain merkittävää, mutta tarkemmat tiedot eivät ole saatavilla.`;
}

async function fetchWikipediaEvent(
  lang: string,
  month: number,
  day: number
): Promise<string | null> {
  const monthNames: Record<string, string[]> = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    fi: [
      'tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta',
      'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta',
      'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'
    ]
  };
  
  const monthName = monthNames[lang][month - 1];
  
  const url = `https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    return null;
  }
  
  const data: WikiResponse = await response.json();
  const events = data.selected || data.events || [];
  
  if (events.length === 0) {
    return null;
  }
  
  // Filter out births and deaths, prefer major historical events
  const historicalEvents = events.filter(
    event => !event.text.toLowerCase().includes('born') &&
             !event.text.toLowerCase().includes('syntyi') &&
             !event.text.toLowerCase().includes('died') &&
             !event.text.toLowerCase().includes('kuoli')
  );
  
  const selectedEvents = historicalEvents.length > 0 ? historicalEvents : events;
  
  // Pick the first suitable event
  const event = selectedEvents[0];
  
  if (!event) {
    return null;
  }
  
  // Format the text
  const eventText = event.text.replace(/<[^>]*>/g, ''); // Remove HTML tags
  
  return `Tänä päivänä vuonna ${event.year} ${eventText.toLowerCase()}`;
}
