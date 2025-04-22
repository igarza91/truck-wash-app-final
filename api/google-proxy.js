export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzUbngknTlb9II9lHzuooKBNtV5nvqKw69cCbsUxt8v1f-qLzxKtFis7760JFy5eGQlXw/exec";

  try {
    const formData = new URLSearchParams();
    for (const key in req.body) {
      formData.append(key, req.body[key]);
    }

    const googleRes = await fetch(googleScriptUrl, {
      method: "POST",
      body: formData,
    });

    const text = await googleRes.text();

    // Try to parse as JSON, otherwise return text
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (e) {
      return res.status(200).json({ message: text });
    }

  } catch (error) {
    return res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
