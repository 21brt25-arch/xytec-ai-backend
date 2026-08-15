export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  // Sadece POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    console.log("XYTEC: POST başladı");

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      console.error("XYTEC: GEMINI_API_KEY bulunamadı");

      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured"
      });
    }

    // Body
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    console.log("XYTEC: Gemini SDK yükleniyor");

    // Gemini SDK
    const { GoogleGenAI } = await import("@google/genai");

    console.log("XYTEC: Gemini SDK hazır");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("XYTEC: Gemini isteği gönderiliyor");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    console.log("XYTEC: Gemini cevap verdi");

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("XYTEC GEMINI ERROR:", error);

    return res.status(500).json({
      error: "Gemini request failed",
      details: error?.message || String(error)
    });
  }
      }
