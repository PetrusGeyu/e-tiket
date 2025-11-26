// pages/api/transactions.js
export default async function handler(req, res) {
  const API_URL = "https://lapakjarubackend.xyz/transactions";

  try {
    const response = await fetch(API_URL, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Terjadi error saat mengirim ke server" });
  }
}
