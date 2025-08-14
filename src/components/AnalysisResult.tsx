// File: src/components/AnalysisResult.tsx

// 1. IMPORT THE FONT DATA and jsPDF type
import React, { useRef, useState } from 'react';
import { type VastuReport, type VastuDosha } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { hindRegularBase64 } from '../assets/fonts'; // <-- ADD THIS IMPORT
import { jsPDF } from 'jspdf'; // <-- CHANGE THIS IMPORT if you have it, or add it.

// ... (DoshaCard component remains the same) ...

interface AnalysisResultProps {
  report: VastuReport;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report, onReset }) => {
  const { t, language } = useTranslation(); // <-- ADD `language` here
  const summaryRef = useRef<HTMLDivElement>(null);
  const doshasContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 2. REPLACE THE ENTIRE handleDownloadPdf FUNCTION WITH THIS NEW VERSION
  const handleDownloadPdf = async () => {
    if (isDownloading || !window.html2canvas) {
        return;
    }
    setIsDownloading(true);

    try {
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
        // --- Font Embedding Logic ---
        // Only embed the font if the language is Hindi
        if (language === 'hi') {
          // Add the font file to the virtual file system
          pdf.addFileToVFS('Hind-Regular.ttf', hindRegularBase64);
          // Add the font to jsPDF
          pdf.addFont('Hind-Regular.ttf', 'Hind', 'normal');
          // Set the font for the document
          pdf.setFont('Hind');
        }
        // --- End of Font Logic ---

        const contentWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margin
        let yPos = 15; // Initial Y position for content

        // Add a title to the PDF
        pdf.setFontSize(22);
        pdf.text(t('result_title'), 10, yPos);
        yPos += 15;

        const addCanvasToPdfPage = (canvas: HTMLCanvasElement, pdfInstance: jsPDF, startY: number) => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdfInstance.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
            
            // Check if there is enough space on the current page
            if (startY + imgHeight > pdfInstance.internal.pageSize.getHeight() - 10) {
              pdfInstance.addPage();
              startY = 15; // Reset Y position on new page
            }

            pdfInstance.addImage(imgData, 'PNG', 10, startY, contentWidth, imgHeight);
            return startY + imgHeight;
        };

        // 1. Capture and add summary page
        if (summaryRef.current) {
            const canvas = await window.html2canvas(summaryRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            yPos = addCanvasToPdfPage(canvas, pdf, yPos);
        }

        // 2. Capture and add each dosha
        const doshaNodes = doshasContainerRef.current?.children;
        if (doshaNodes) {
            for (const node of Array.from(doshaNodes)) {
                const canvas = await window.html2canvas(node as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                // Each dosha gets its own new page for better formatting
                pdf.addPage();
                addCanvasToPdfPage(canvas, pdf, 15); 
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
    // ... (The rest of your component's JSX remains the same, but ensure the refs are attached correctly)
    <div className="max-w-4xl mx-auto relative">
        <div id="report-content">
            {/* Make sure the ref is attached to the parent div of the summary */}
            <div ref={summaryRef}> 
                <div className="text-center mb-10">
                    {/* This title is what will appear on the webpage, not the PDF title */}
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