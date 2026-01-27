/**
 * Generates a deterministic mood line based on date and day length
 * Same date + same location = same mood line (no AI, fully offline)
 */

interface MoodLine {
  text: string;
  gradient: { from: string; via: string; to: string };
}

const moodLines: Record<string, MoodLine[]> = {
  // Deep winter (December, January, February)
  winter_dark: [
    {
      text: "Hiljainen talvipäivä tammikuun lopussa.",
      gradient: { from: "#1e3a5f", via: "#2d5480", to: "#4a7ba7" }
    },
    {
      text: "Lyhyt päivä, pitkä hämärä.",
      gradient: { from: "#1a2f4a", via: "#2b4566", to: "#3d5e82" }
    },
    {
      text: "Talviyö laskeutuu aikaisin.",
      gradient: { from: "#203550", via: "#344d6c", to: "#486788" }
    },
    {
      text: "Luminen hiljaisuus ympäröi.",
      gradient: { from: "#d4e4f7", via: "#b8d4f0", to: "#9ec4e8" }
    }
  ],
  
  // Late winter, early spring (March)
  winter_light: [
    {
      text: "Valo palaa pikkuhiljaa.",
      gradient: { from: "#e8f2fb", via: "#d0e5f7", to: "#b8d8f2" }
    },
    {
      text: "Kevään ensimmäiset merkit.",
      gradient: { from: "#f0f7fc", via: "#deedf8", to: "#cce3f4" }
    },
    {
      text: "Aurinko nousee korkeammalle.",
      gradient: { from: "#fef9f3", via: "#fdf3e8", to: "#fceddd" }
    }
  ],
  
  // Spring (April, May)
  spring: [
    {
      text: "Kevätpäivä venyy illassa.",
      gradient: { from: "#fffdf9", via: "#fffaef", to: "#fff7e6" }
    },
    {
      text: "Valo kasvaa päivä päivältä.",
      gradient: { from: "#f7fbff", via: "#eff7ff", to: "#e7f3ff" }
    },
    {
      text: "Luonto herää hiljaa henkiin.",
      gradient: { from: "#f9fcf7", via: "#f2f9ef", to: "#ebf5e7" }
    },
    {
      text: "Pitkä kevätilta.",
      gradient: { from: "#fffcf7", via: "#fff9f0", to: "#fff6e9" }
    }
  ],
  
  // Early summer (June)
  early_summer: [
    {
      text: "Valoisa kesäpäivä alkaa varhain.",
      gradient: { from: "#fffff9", via: "#fffff2", to: "#ffffeb" }
    },
    {
      text: "Yö ei laske pimeää.",
      gradient: { from: "#f8fbff", via: "#f0f7ff", to: "#e8f3ff" }
    },
    {
      text: "Valoisa kesäyö.",
      gradient: { from: "#fffef8", via: "#fffdf0", to: "#fffce8" }
    }
  ],
  
  // Midsummer (June-July)
  midsummer: [
    {
      text: "Keskikesän valoisuus.",
      gradient: { from: "#ffffff", via: "#fffffa", to: "#fffff5" }
    },
    {
      text: "Aurinko ei laske.",
      gradient: { from: "#fffffe", via: "#fffffc", to: "#fffffa" }
    },
    {
      text: "Juhannuksen valkea yö.",
      gradient: { from: "#fffef9", via: "#fffdf3", to: "#fffced" }
    }
  ],
  
  // Late summer (August)
  late_summer: [
    {
      text: "Loppukesän kultainen valo.",
      gradient: { from: "#fff9f0", via: "#fff3e0", to: "#ffedd0" }
    },
    {
      text: "Päivä lyhenee huomaamatta.",
      gradient: { from: "#fef8f1", via: "#fdf2e3", to: "#fcecd5" }
    },
    {
      text: "Elokuun rauhallinen ilta.",
      gradient: { from: "#fffcf7", via: "#fff9f0", to: "#fff6e9" }
    }
  ],
  
  // Autumn (September, October)
  autumn: [
    {
      text: "Syyspäivä lyhenee silmissä.",
      gradient: { from: "#f5ece0", via: "#ead9c5", to: "#dfc6aa" }
    },
    {
      text: "Lokakuun hämärä laskeutuu aikaisemmin.",
      gradient: { from: "#e8ddd0", via: "#d9c9b8", to: "#cab5a0" }
    },
    {
      text: "Syksyn hiljainen viesti.",
      gradient: { from: "#f0e6d8", via: "#e3d4c0", to: "#d6c2a8" }
    },
    {
      text: "Pimeä tulee nopeasti.",
      gradient: { from: "#dfd2c0", via: "#d0bea8", to: "#c1aa90" }
    }
  ],
  
  // Early winter (November)
  early_winter: [
    {
      text: "Marraskuun harmaa valo.",
      gradient: { from: "#d8dce0", via: "#c5cbd3", to: "#b2bac6" }
    },
    {
      text: "Talvi lähestyy hiljaa.",
      gradient: { from: "#dce0e4", via: "#cbd2d9", to: "#bac4ce" }
    },
    {
      text: "Lyhyt päivä, pitkä ilta.",
      gradient: { from: "#d0d8e0", via: "#bdc8d4", to: "#aab8c8" }
    }
  ],
  
  // Deep winter darkness (mid-December to mid-January)
  winter_darkest: [
    {
      text: "Vuoden pimein aika.",
      gradient: { from: "#1a2838", via: "#253648", to: "#304458" }
    },
    {
      text: "Talvipäivä on lyhyt hetki.",
      gradient: { from: "#1e2f42", via: "#2a3e54", to: "#364d66" }
    },
    {
      text: "Pimeä hallitsee.",
      gradient: { from: "#182530", via: "#243340", to: "#304150" }
    }
  ]
};

/**
 * Determines season category based on month and day length
 */
function getSeasonCategory(month: number, dayLengthHours: number): string {
  // December 15 - January 15: Darkest period
  if ((month === 12 && dayLengthHours < 6.5) || (month === 1 && dayLengthHours < 7)) {
    return 'winter_darkest';
  }
  
  // January - February: Deep winter
  if (month === 1 || month === 2) {
    return 'winter_dark';
  }
  
  // March: Transitioning to spring
  if (month === 3) {
    return 'winter_light';
  }
  
  // April - May: Spring
  if (month === 4 || month === 5) {
    return 'spring';
  }
  
  // Early June: Early summer
  if (month === 6 && dayLengthHours < 19) {
    return 'early_summer';
  }
  
  // Mid June - Mid July: Midsummer
  if ((month === 6 && dayLengthHours >= 19) || (month === 7 && dayLengthHours >= 18)) {
    return 'midsummer';
  }
  
  // Late July - August: Late summer
  if ((month === 7 && dayLengthHours < 18) || month === 8) {
    return 'late_summer';
  }
  
  // September - October: Autumn
  if (month === 9 || month === 10) {
    return 'autumn';
  }
  
  // November: Early winter
  if (month === 11) {
    return 'early_winter';
  }
  
  // December (before darkest period): Early winter
  return 'early_winter';
}

/**
 * Generate a deterministic mood line for a given date and day length
 * Uses simple hash to select from available options
 */
export function generateMoodLine(date: Date, dayLengthHours: number): MoodLine {
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  
  const category = getSeasonCategory(month, dayLengthHours);
  const options = moodLines[category];
  
  // Simple deterministic selection: use day of month modulo array length
  const index = dayOfMonth % options.length;
  
  return options[index];
}
