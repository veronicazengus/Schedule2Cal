import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

export const extractScheduleFromFile = async (base64Data: string, mimeType: string): Promise<Course[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze this class schedule ${mimeType === 'application/pdf' ? 'PDF' : 'image'} and extract all courses.
    For each course, find:
    - Course Name
    - Days of the week (e.g., Monday, Tuesday, Wednesday, Thursday, Friday)
    - Start time (HH:mm 24h format)
    - End time (HH:mm 24h format)
    - Location/Room (if available)

    IMPORTANT: Ensure the output is a clean JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
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
      ],
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

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return result.map((c: any, index: number) => ({
      ...c,
      id: `course-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Extraction Error:", error);
    throw new Error("Could not read schedule. Please ensure the image is clear or the PDF is readable.");
  }
};