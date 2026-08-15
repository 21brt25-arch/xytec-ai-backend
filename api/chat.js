import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Sadece POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    console.log("POST /api/chat başladı");

    const { message } = req.body || {};

    console.log("Mesaj alındı:", message);

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // Gemini istemcisi
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("Gemini istemcisi hazır");

    // Gemini çağrısı
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    console.log("Gemini yanıt verdi");

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
}
