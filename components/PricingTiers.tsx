
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const PricingTiers: React.FC = () => {
    const { t } = useTranslation();

    const handleScrollToForm = () => {
        const formElement = document.getElementById('vastu-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="pricing" className="py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('pricing_title')}</h2>
                    <p className="text-lg text-gray-600 mb-8">{t('pricing_subtitle')}</p>
                    
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
                        <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-6">
                            <span className="text-5xl font-bold text-gray-900">{t('pricing_price')}</span>
                            <p className="text-gray-700 font-medium mt-1">{t('pricing_payment_type')}</p>
                        </div>

                        <ul className="text-left space-y-3 text-gray-700 max-w-sm mx-auto my-8">
                            <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>{t('pricing_feature1')}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>{t('pricing_feature2')}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>{t('pricing_feature3')}</span>
                            </li>
                            <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>{t('pricing_feature4')}</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleScrollToForm}
                            className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-transform hover:scale-105 transform inline-block cursor-pointer"
                        >
                            {t('pricing_button')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingTiers;
