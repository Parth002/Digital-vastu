
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import VastuForm from './components/VastuForm';
import AnalysisResult from './components/AnalysisResult';
import Footer from './components/Footer';
import { type VastuReport } from './types';
import { analyzeFloorPlan, translateReport } from './services/geminiService';
import { useTranslation } from './hooks/useTranslation';

type AppState = 'form' | 'loading' | 'result' | 'error';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

function App() {
  const [appState, setAppState] = useState<AppState>('form');
  const [reports, setReports] = useState<{ en: VastuReport | null, hi: VastuReport | null }>({ en: null, hi: null });
  const [lastAnalysisRequest, setLastAnalysisRequest] = useState<{
    base64Image: string;
    mimeType: string;
    entranceDirection: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { language } = useTranslation();

  const report = reports[language];

  useEffect(() => {
    const savedReports = sessionStorage.getItem('vastuReports');
    const savedRequest = sessionStorage.getItem('lastAnalysisRequest');

    if (savedReports && savedRequest) {
      setReports(JSON.parse(savedReports));
      setLastAnalysisRequest(JSON.parse(savedRequest));
      setAppState('result');
    }
  }, []);

  useEffect(() => {
    const fetchTranslatedReport = async () => {
      // If language is switched to Hindi, and we have a base English report but no Hindi report yet.
      if (appState === 'result' && language === 'hi' && reports.en && !reports.hi) {
        setAppState('loading');
        setErrorMessage('');
        try {
          const hindiReport = await translateReport(reports.en, 'hi');
          setReports(prev => {
            const newReports = { ...prev, hi: hindiReport };
            sessionStorage.setItem('vastuReports', JSON.stringify(newReports));
            return newReports;
          });
          setAppState('result');
        } catch (error) {
          const message = error instanceof Error ? error.message : "An unexpected error occurred.";
          setErrorMessage(message);
          setAppState('error');
        }
      }
    };

    fetchTranslatedReport();
  }, [language, appState, reports]);

  const handleAnalysisSubmit = useCallback(async (file: File, entranceDirection: string) => {
    setAppState('loading');
    setReports({ en: null, hi: null });
    setLastAnalysisRequest(null);
    setErrorMessage('');
    sessionStorage.removeItem('vastuReports');
    sessionStorage.removeItem('lastAnalysisRequest');

    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type;
      
      // Always analyze in English first for a consistent base report
      const englishReport = await analyzeFloorPlan(base64Image, mimeType, entranceDirection);
      
      const newReports = { en: englishReport, hi: null };
      const newRequest = { base64Image, mimeType, entranceDirection };

      setReports(newReports);
      setLastAnalysisRequest(newRequest);
      
      sessionStorage.setItem('vastuReports', JSON.stringify(newReports));
      sessionStorage.setItem('lastAnalysisRequest', JSON.stringify(newRequest));

      setAppState('result');
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('form');
    setReports({ en: null, hi: null });
    setLastAnalysisRequest(null);
    setErrorMessage('');
    sessionStorage.removeItem('vastuReports');
    sessionStorage.removeItem('lastAnalysisRequest');
  }, []);

  const renderContent = () => {
    switch(appState) {
        case 'form':
            return (
                <>
                    <Hero />
                    <HowItWorks />
                    <VastuForm 
                      onFormSubmit={handleAnalysisSubmit}
                    />
                    <Testimonials />
                </>
            );
        case 'loading':
        case 'error':
             return (
                <div className="max-w-4xl mx-auto py-16">
                    <VastuForm
                      onFormSubmit={handleAnalysisSubmit}
                      initialState={appState}
                      errorMessage={errorMessage}
                      onReset={handleReset}
                    />
                </div>
             );
        case 'result':
            return report && (
                <AnalysisResult 
                    report={report} 
                    onReset={handleReset}
                />
            );
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
