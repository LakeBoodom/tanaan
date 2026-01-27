'use client';

import { useState, useEffect } from 'react';
import municipalities from '@/data/municipalities.json';
import styles from './LocationSelector.module.css';

interface Municipality {
  name: string;
  lat: number;
  lon: number;
}

interface LocationSelectorProps {
  onLocationChange: (location: Municipality) => void;
  currentLocation: Municipality;
}

export default function LocationSelector({ onLocationChange, currentLocation }: LocationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredMunicipalities = municipalities.filter((m: Municipality) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (municipality: Municipality) => {
    onLocationChange(municipality);
    setSearchTerm('');
    setIsOpen(false);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.label}>Sijainti</div>
      
      <div className={styles.selector}>
        <input
          type="text"
          value={isOpen ? searchTerm : currentLocation.name}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={styles.input}
          placeholder="Hae kuntaa..."
        />
        
        {isOpen && filteredMunicipalities.length > 0 && (
          <div className={styles.dropdown}>
            {filteredMunicipalities.slice(0, 10).map((m: Municipality) => (
              <button
                key={m.name}
                onClick={() => handleSelect(m)}
                className={styles.option}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
