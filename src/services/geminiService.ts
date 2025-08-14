
import { GoogleGenAI, Type } from "@google/genai";
import { type VastuReport, type VastuDosha } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSystemInstruction = `You are an AI expert in Vastu Shastra, an ancient Indian science of architecture. Your task is to analyze residential and commercial floor plans based on authentic Vastu principles.
You will receive an image and must first determine if it's a valid floor plan.
- If it is a floor plan, you will perform a detailed Vastu analysis in English.
- If it is not a floor plan, you will state that clearly in English.
You must always respond in the JSON format defined by the schema. Be precise and base your analysis on established Vastu knowledge, considering factors like the Brahmasthan, elemental zones, and room placements relevant to the property type.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    is_floor_plan: {
      type: Type.BOOLEAN,
      description: "Set to true if the image is a residential or commercial floor plan, false otherwise."
    },
    error: {
      type: Type.STRING,
      description: "If is_floor_plan is false, provide an error message in the requested language explaining that the image is not a floor plan. Otherwise, this should be null."
    },
    overall_summary: {
      type: Type.STRING,
      description: "A brief, encouraging overall summary of the Vastu analysis of the space in 2-3 sentences. Should only be generated if is_floor_plan is true."
    },
    doshas: {
      type: Type.ARRAY,
      description: "A comprehensive array of all significant Vastu doshas (flaws) found in the floor plan. Should only be generated if is_floor_plan is true.",
      items: {
        type: Type.OBJECT,
        properties: {
          location: {
            type: Type.STRING,
            description: "The specific location or room of the dosha (e.g., 'Kitchen in Northeast', 'Main Entrance facing South', 'CEO Cabin in Southwest')."
          },
          problem: {
            type: Type.STRING,
            description: "A concise explanation of the Vastu principle that is violated."
          },
          impact: {
            type: Type.STRING,
            description: "The potential negative impact on residents or business (e.g., financial issues, health problems, lack of peace, employee turnover)."
          },
          remedy: {
            type: Type.OBJECT,
            description: "A simple, actionable remedy that does not require major structural changes.",
            properties: {
              description: {
                type: Type.STRING,
                description: "A short description of the remedy."
              },
              items: {
                type: Type.ARRAY,
                description: "A list of items needed for the remedy.",
                items: {
                  type: Type.STRING
                }
              }
            }
          }
        },
        required: ["location", "problem", "impact", "remedy"]
      }
    }
  },
  required: ["is_floor_plan"]
};

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    overall_summary: {
      type: Type.STRING,
      description: "The translated overall summary of the Vastu report."
    },
    doshas: {
      type: Type.ARRAY,
      description: "The translated array of Vastu doshas.",
      items: {
        type: Type.OBJECT,
        properties: {
          location: {
            type: Type.STRING,
            description: "The translated location of the dosha."
          },
          problem: {
            type: Type.STRING,
            description: "The translated explanation of the Vastu problem."
          },
          impact: {
            type: Type.STRING,
            description: "The translated potential impact of the dosha."
          },
          remedy: {
            type: Type.OBJECT,
            description: "The translated remedy for the dosha.",
            properties: {
              description: {
                type: Type.STRING,
                description: "The translated description of the remedy."
              },
              items: {
                type: Type.ARRAY,
                description: "The translated list of items for the remedy.",
                items: {
                  type: Type.STRING
                }
              }
            },
            required: ["description", "items"]
          }
        },
        required: ["location", "problem", "impact", "remedy"]
      }
    }
  },
  required: ["overall_summary", "doshas"]
};


export const analyzeFloorPlan = async (base64Image: string, mimeType: string, entranceDirection: string, propertyType: 'residential' | 'commercial'): Promise<VastuReport> => {
  try {
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
      - If NO: Set "is_floor_plan" to false. In the "error" field, provide a message in English explaining that the uploaded image is not a valid floor plan. Do not fill any other fields.
      - If YES: Set "is_floor_plan" to true and proceed to Step 2.

      Step 2: Vastu Analysis (only if image is a valid floor plan).
      - The main entrance faces: ${entranceDirection}.
      - Analyze the floor plan based on Vastu Shastra principles for a ${propertyType} property.
      ${propertyType === 'commercial' ? commercialPromptDetails : residentialPromptDetails}
      - For each dosha, identify its location, the problem, its impact on the respective property type, and a simple, practical remedy.
      - Provide an encouraging and constructive overall summary.
      - Ensure the entire analysis (summary, doshas, etc.) is in English.
      
      Follow the provided JSON schema for the response.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        systemInstruction: analysisSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    const jsonText = response.text.trim();
    const reportData = JSON.parse(jsonText) as { is_floor_plan: boolean; error?: string; overall_summary?: string; doshas?: VastuDosha[] };

    if (!reportData.is_floor_plan) {
        throw new Error(reportData.error || `The uploaded file does not appear to be a ${propertyType} floor plan. Please upload a correct file.`);
    }
    
    if (!reportData.overall_summary || !Array.isArray(reportData.doshas)) {
        throw new Error("Invalid response format from AI.");
    }

    return {
      overall_summary: reportData.overall_summary,
      doshas: reportData.doshas,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("floor plan")) {
            throw error;
        }
        throw new Error(`Failed to generate Vastu analysis. Please try again.`);
    }
    throw new Error("An unknown error occurred during Vastu analysis.");
  }
};

export const translateReport = async (report: VastuReport, language: 'hi'): Promise<VastuReport> => {
    try {
        const translationSystemInstruction = `You are an expert translator specializing in spiritual and architectural texts from English to Hindi. Your task is to translate the following JSON object which contains a Vastu Shastra analysis report.
- Translate all string values into accurate, natural-sounding Hindi.
- Preserve the exact JSON structure, including all keys and data types.
- For directional terms (e.g., 'Northeast', 'Kitchen in Northeast'), provide the Hindi equivalent followed by the English in parentheses, for example: 'ईशान (Northeast)', 'ईशान (Northeast) में रसोई'.
- Do not add, remove, or change any information; only translate the text content.
- Respond ONLY with the translated JSON object.`;

        const prompt = JSON.stringify(report);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: translationSystemInstruction,
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            }
        });

        const jsonText = response.text.trim();
        const translatedReportData = JSON.parse(jsonText) as VastuReport;

        if (!translatedReportData.overall_summary || !Array.isArray(translatedReportData.doshas)) {
            throw new Error("Invalid translation response format from AI.");
        }

        return translatedReportData;

    } catch (error) {
        console.error("Error calling Gemini API for translation:", error);
        throw new Error(`Failed to translate the Vastu report. Please try again.`);
    }
};
