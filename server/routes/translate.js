import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.post("/", async (req, res) => {
  const { text, fromLang, toLang } = req.body;
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
    const data = await response.json();
    res.json({ translated: data.responseData.translatedText });
  } catch {
    res.status(500).json({ translated: text });
  }
});

export default router;
