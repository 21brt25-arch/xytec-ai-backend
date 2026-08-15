export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("XYTEC API CALLED");
  console.log("METHOD:", req.method);

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      method: req.method
    });
  }

  console.log("POST REACHED");

  return res.status(200).json({
    reply: "TEST BAŞARILI. POST /api/chat çalışıyor."
  });
}
