
import React, { useRef, useState } from 'react';
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
  const summaryRef = useRef<HTMLDivElement>(null);
  const doshasContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (isDownloading || !window.jspdf || !window.html2canvas) {
        return;
    }
    setIsDownloading(true);

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const contentWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margin on each side

        const addCanvasToPdfPage = (canvas: HTMLCanvasElement, pdfInstance: any) => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdfInstance.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
            pdfInstance.addImage(imgData, 'PNG', 10, 10, contentWidth, imgHeight);
        };

        // 1. Capture and add summary page
        if (summaryRef.current) {
            const canvas = await window.html2canvas(summaryRef.current, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' });
            addCanvasToPdfPage(canvas, pdf);
        }

        // 2. Capture and add a new page for each dosha
        const doshaNodes = doshasContainerRef.current?.children;
        if (doshaNodes) {
            for (const node of Array.from(doshaNodes)) {
                const canvas = await window.html2canvas(node as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' });
                pdf.addPage();
                addCanvasToPdfPage(canvas, pdf);
            }
        }

        pdf.save('Vastu_Report.pdf');

    } catch (error) {
        console.error("Failed to generate PDF:", error);
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto relative">
        <div id="report-content">
            <div ref={summaryRef} className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-900">{t('result_title')}</h2>
                    <p className="text-lg text-gray-600 mt-2">{t('result_subtitle')}</p>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold font-serif text-gray-800 mb-3">{t('result_summary_title')}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{report.overall_summary}</p>
                </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-3xl font-bold font-serif text-gray-800 mb-6 text-center">{t('result_doshas_title')}</h3>
                <div ref={doshasContainerRef}>
                    {report.doshas.map((dosha, index) => (
                        <DoshaCard key={index} dosha={dosha} index={index} />
                    ))}
                </div>
            </div>
        </div>
        
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-800 transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-wait"
            >
                {isDownloading ? t('result_button_downloading') : t('result_button_download')}
            </button>
            <button
                onClick={onReset}
                className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-colors w-full sm:w-auto"
            >
                {t('result_button_another')}
            </button>
        </div>
    </div>
  );
};

export default AnalysisResult;