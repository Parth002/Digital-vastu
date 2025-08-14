
import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';

type Language = 'en' | 'hi';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<Language, Translations>>({ en: {}, hi: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, hiRes] = await Promise.all([
          fetch('/src/i18n/en.json'),
          fetch('/src/i18n/hi.json')
        ]);
        if (!enRes.ok || !hiRes.ok) {
            throw new Error('Failed to fetch translation files');
        }
        const enData = await enRes.json();
        const hiData = await hiRes.json();
        setTranslations({ en: enData, hi: hiData });
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to empty to avoid crashing the app, it will just show keys
        setTranslations({ en: {}, hi: {} });
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []); // Empty dependency array ensures this runs only once on mount

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [language, translations]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  if (loading) {
    return null; // Or a loading spinner, but null is fine to prevent flash of untranslated content
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};