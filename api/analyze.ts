import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
// The path to your types file might need to be adjusted based on the final structure
import { VastuData } from '../src/types'; 

/**
 * This function handles the Vastu analysis by calling the Gemini API.
 * It's kept self-contained within the API route for clarity and to ensure
 * it only runs on the server.
 * @param imageData The base64 encoded image string.
 * @param data The Vastu data from the form.
 * @param language The language for the response.
 * @returns A detailed Vastu analysis as a string.
 */
async function getAnalysis(imageData: string, data: VastuData, language: string): Promise<string> {
    // --- IMPORTANT FIX ---
    // Get the API key from server-side environment variables on Vercel.
    // Do NOT use import.meta.env here.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not defined in the environment variables");
        // Don't expose the internal error reason to the client.
        throw new Error("Server configuration error.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Helper to create the image part for the API request
    const imagePart = {
        inlineData: {
            data: imageData.split(',')[1],
            mimeType: imageData.split(',')[0].split(':')[1].split(';')[0],
        },
    };

    // The detailed prompt for the AI model
    const prompt = `
    Analyze the following home layout based on Vastu Shastra principles.
    Language for response: ${language}
    Property facing: ${data.propertyFacing}
    Main entrance location: ${data.mainEntrance}
    Kitchen location: ${data.kitchen}
    Master bedroom location: ${data.masterBedroom}
    Pooja room location: ${data.poojaRoom}
    Toilets location: ${data.toilets}
    Staircase location: ${data.staircase}

    Based on the provided image and data, provide a detailed Vastu analysis.
    Identify positive aspects and Vastu defects (doshas).
    For each defect, suggest simple and practical remedies.
    Structure the response clearly with headings for "Positive Aspects", "Vastu Defects", and "Remedies".
    The analysis should be easy to understand for a homeowner.
  `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
}


/**
 * The main Vercel serverless function handler.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { image, language, ...vastuData } = req.body;

    // Validate the incoming request body
    if (!image || !language || !vastuData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call the analysis function and send the result
    const analysis = await getAnalysis(image, vastuData as VastuData, language);
    res.status(200).json({ analysis });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in Vastu analysis handler:', error);
    // Send a generic error message to the client
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
}
