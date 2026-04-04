import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Place {
  placeId: string;
  name: string;
  address?: string;
  rating?: number;
  photoUrl?: string;
  category?: string;
  description?: string;
  lat?: number;
  lng?: number;
  distance?: string;
}

export async function getNearbyPlaces(lat: number, lng: number, category: string = "famous and top-rated hotels, restaurants, and cafes"): Promise<Place[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Using Google Search, find at least 20 of the most famous and top-rated ${category} within a 10km radius of latitude ${lat}, longitude ${lng}. 
    Focus on places with exceptional reviews and high popularity.
    For each place, estimate its distance from the coordinates (${lat}, ${lng}) in kilometers.
    Return a JSON array of objects: {placeId, name, address, rating, category, description, lat, lng, distance}.
    The "distance" field should be a string like "2.5 km".
    No markdown, just raw JSON.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      tools: [{ googleSearch: {} }]
    },
  });

  try {
    const text = response.text || "[]";
    const jsonStr = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function searchByLandmark(landmark: string, category: string = "famous and top-rated hotels, restaurants, and cafes"): Promise<Place[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Using Google Search, find at least 20 of the most famous and top-rated ${category} within a 10km radius of ${landmark}. 
    Focus on places with exceptional reviews and high popularity.
    Return a JSON array of objects: {placeId, name, address, rating, category, description, lat, lng}.
    No markdown, just raw JSON.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      tools: [{ googleSearch: {} }]
    },
  });

  try {
    const text = response.text || "[]";
    const jsonStr = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
