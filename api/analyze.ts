// File: /api/analyze.ts

import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This line should be the only source for your API key.
// It reads the key you set in the Vercel dashboard.
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // This will cause the function to fail gracefully if the key is missing.
  throw new Error("GEMINI_API_KEY environment variable not set");
}

// --- CORRECTED INITIALIZATION ---
// Pass the API key within an object.
const genAI = new GoogleGenAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
// --- END OF CORRECTION ---

// The rest of the function remains the same.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { base64Image, mimeType, entranceDirection, propertyType } = req.body;

    if (!base64Image || !mimeType || !entranceDirection || !propertyType) {
        return res.status(400).json({ error: "Missing required fields in request body." });
    }

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const residentialPromptDetails = `- Prioritize critical doshas for a residential space (main entrance, kitchen, master bedroom, toilets, Brahmasthan). Identify at least 5-7 significant Vastu doshas if they exist.`;
    const commercialPromptDetails = `- Prioritize critical doshas for a commercial space (main entrance, owner's/MD's cabin, staff work area, reception, pantry, accounts department, Brahmasthan). Identify at least 5-7 significant Vastu doshas if they exist.`;

    const prompt = `
      Task: Analyze the provided image based on Vastu Shastra for a ${propertyType} property.
      Language for response: English.

      Step 1: Validate the image.
      - Is the image a ${propertyType} floor plan?
      - If NO: Return a JSON object with "is_floor_plan" set to false and an "error" message.
      - If YES: Set "is_floor_plan" to true and proceed.

      Step 2: Vastu Analysis.
      - The main entrance faces: ${entranceDirection}.
      - Analyze the floor plan based on Vastu Shastra principles for a ${propertyType} property.
      ${propertyType === 'commercial' ? commercialPromptDetails : residentialPromptDetails}
      - For each dosha, identify its location, the problem, its impact, and a simple, practical remedy.
      - Provide an encouraging and constructive overall summary.
      - Ensure the entire analysis is in English.
      - Your response MUST be a valid JSON object.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    const reportData = JSON.parse(responseText);

    if (!reportData.is_floor_plan) {
        return res.status(400).json({ error: reportData.error || `The uploaded file does not appear to be a ${propertyType} floor plan.` });
    }

    res.status(200).json(reportData);

  } catch (error) {
    console.error("Error in Vercel function:", error);
    res.status(500).json({ error: 'Failed to generate Vastu analysis.' });
  }
}