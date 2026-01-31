
import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

export const extractScheduleFromFile = async (base64Data: string, mimeType: string): Promise<Course[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `
    Analyze this class schedule ${mimeType === 'application/pdf' ? 'PDF' : 'image'} and extract all courses.
    For each course, find:
    - Course Name
    - Days of the week (Monday, Tuesday, etc.)
    - Start time (HH:mm 24h)
    - End time (HH:mm 24h)
    - Location/Room

    Return a clean JSON array of course objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data.split(',')[1] || base64Data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              days: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              location: { type: Type.STRING },
            },
            required: ["name", "days", "startTime", "endTime"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || '[]');
    return result.map((c: any, index: number) => ({
      ...c,
      id: `course-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Extraction Error:", error);
    throw new Error("Could not read file. Ensure it's a clear image or standard PDF schedule.");
  }
};
