
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; stepNumber: number }> = ({ icon, title, description, stepNumber }) => (
  <div className="relative text-center md:text-left">
    <div className="flex justify-center md:justify-start items-center mb-4">
      <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full border-2 border-teal-200 text-teal-600">
        {icon}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 md:top-8 w-8 h-8 flex items-center justify-center bg-teal-600 text-white font-bold rounded-full text-sm">
        {stepNumber}
      </div>
    </div>
    <h3 className="text-xl font-bold font-serif mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-white rounded-2xl shadow-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('howitworks_title')}</h2>
          <p className="text-lg text-gray-600 mt-2">{t('howitworks_subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <Step
            stepNumber={1}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
            title={t('howitworks_step1_title')}
            description={t('howitworks_step1_desc')}
          />
          <Step
            stepNumber={2}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            title={t('howitworks_step2_title')}
            description={t('howitworks_step2_desc')}
          />
          <Step
            stepNumber={3}
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            title={t('howitworks_step3_title')}
            description={t('howitworks_step3_desc')}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
