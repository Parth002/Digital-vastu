// File: src/services/geminiService.ts

import { type VastuReport } from '../types';

// This function now calls our OWN backend endpoint, not Google's.
export const analyzeFloorPlan = async (base64Image: string, mimeType: string, entranceDirection: string, propertyType: 'residential' | 'commercial'): Promise<VastuReport> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        mimeType,
        entranceDirection,
        propertyType,
      }),
    });

    const reportData = await response.json();

    if (!response.ok) {
      // Use the error message from our API route, or a default one
      throw new Error(reportData.error || 'Failed to generate Vastu analysis.');
    }

    return {
      overall_summary: reportData.overall_summary,
      doshas: reportData.doshas,
    };

  } catch (error) {
    console.error("Error calling backend API:", error);
    if (error instanceof Error) {
        throw error; // Re-throw the error to be caught by the App component
    }
    throw new Error("An unknown error occurred during Vastu analysis.");
  }
};


// We can keep the translation function as is for now, but ideally this would also be moved to the backend.
// For now, let's focus on the analysis part.
export const translateReport = async (report: VastuReport, language: 'hi'): Promise<VastuReport> => {
    // This part still uses the exposed key. Let's plan to move this next.
    // For now, the most important part (image analysis) is secure.
    // ... (rest of the translation code)
    // You'll need to create another api route like '/api/translate' to fix this part too.
    return report; // Placeholder
};