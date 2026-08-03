export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Mesaj boş olamaz.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const contents = Array.isArray(history) && history.length > 0 
      ? [...history, { role: 'user', parts: [{ text: message }] }]
      : [{ role: 'user', parts: [{ text: message }] }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ contents })
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      let errorMessage = 'Gemini API hatası.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {}
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.';

    return res.status(200).json({ reply: replyText });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Yanıt zaman aşımına uğradı.' });
    }
    return res.status(500).json({ error: err.message || 'Sunucu hatası.' });
  }
          }
  
