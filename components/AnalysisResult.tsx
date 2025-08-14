import React from 'react';
import { type VastuReport, type VastuDosha } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const DoshaCard: React.FC<{ dosha: VastuDosha, index: number }> = ({ dosha, index }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden break-inside-avoid mb-6">
            <div className="p-6">
                <h4 className="text-xl font-bold font-serif text-teal-800 mb-2">{t('result_dosha_card_title', { index: index + 1 })}: {dosha.location}</h4>
                <div className="space-y-4">
                    <div>
                        <h5 className="font-semibold text-gray-700">{t('result_dosha_problem')}</h5>
                        <p className="text-gray-600">{dosha.problem}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-700">{t('result_dosha_impact')}</h5>
                        <p className="text-gray-600">{dosha.impact}</p>
                    </div>
                    <div className="bg-teal-50/70 p-4 rounded-lg border border-teal-200">
                        <h5 className="font-semibold text-teal-900">{t('result_dosha_remedy')}</h5>
                        <p className="text-teal-800 mb-2">{dosha.remedy.description}</p>
                        {dosha.remedy.items.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-teal-700">
                                {dosha.remedy.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AnalysisResultProps {
  report: VastuReport;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto relative">
        <div>
            <div className="text-center mb-10 px-6 pt-8">
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-900">{t('result_title')}</h2>
                <p className="text-lg text-gray-600 mt-2">{t('result_subtitle')}</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8 mx-6">
                <h3 className="text-2xl font-bold font-serif text-gray-800 mb-3">{t('result_summary_title')}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{report.overall_summary}</p>
            </div>

            <div>
                <h3 className="text-3xl font-bold font-serif text-gray-800 mb-6 text-center">{t('result_doshas_title')}</h3>
                <div className="px-6 pb-8">
                    {report.doshas.map((dosha, index) => (
                        <DoshaCard key={index} dosha={dosha} index={index} />
                    ))}
                </div>
            </div>
        </div>
        
        <div className="text-center mt-12">
            <button
                onClick={onReset}
                className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-colors"
            >
                {t('result_button_another')}
            </button>
        </div>
    </div>
  );
};

export default AnalysisResult;