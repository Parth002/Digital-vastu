
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'hi');
  };

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2">
      <label htmlFor="language-select" className="sr-only">{t('lang_select_label')}</label>
      <select 
        id="language-select"
        value={language} 
        onChange={handleLanguageChange}
        className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
};

interface HeaderProps {
    showLanguageSelector?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLanguageSelector = true }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center relative">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-2xl font-bold font-serif text-gray-800">{t('header_title')}</span>
        </div>
        {showLanguageSelector && <LanguageSelector />}
      </div>
    </header>
  );
};

export default Header;
