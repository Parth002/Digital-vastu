
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const handleScrollToForm = () => {
    const formElement = document.getElementById('vastu-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="text-center py-16 md:py-24">
      <div className="bg-teal-100/50 text-teal-800 font-semibold py-1 px-4 rounded-full inline-block mb-4 text-sm border border-teal-200">
        {t('hero_tagline')}
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{t('hero_title')}</h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
        {t('hero_subtitle')}
      </p>
      <button 
        onClick={handleScrollToForm}
        className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-transform hover:scale-105 transform cursor-pointer"
      >
        {t('hero_button')}
      </button>
    </section>
  );
};

export default Hero;
