// src/hooks/useLanguage.ts
import { useState, useEffect } from 'react';

// Define the language type based on available languages
type Language = 'en' | 'hi' | 'kn';

// Define the translation map type based on your JSON structure
type TranslationMap = {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
};

// Import your translations (you'll need to adjust the path)
import translations from '../../../map.json';

const useLanguage = () => {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    return savedLanguage || 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translationEntry = (translations as unknown as TranslationMap)[key];
    
    if (!translationEntry) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return the key as fallback
    }

    return translationEntry[language] || translationEntry['en'] || key;
  };

  return {
    language,
    setLanguage,
    t,
  };
};

export default useLanguage;