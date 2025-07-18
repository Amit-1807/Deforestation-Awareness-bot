// routes/chat.js
import express from "express";
import Message from "../models/Message.js";
import { translateText } from "../utils/translator.js";
import { generateOllamaReply } from "../utils/ollama.js";

const router = express.Router();

// ✅ Predefined casual replies to avoid unnecessary API calls
const casualReplies = {
  "thank you": "You're very welcome! 😊 Let me know if you have more questions!",
  "thanks": "You're welcome! 🌟",
  "hi": "Hello there! 👋 Ask me anything about deforestation or nature.",
  "hello": "Hi! 🌿 I'm here to help you learn about nature and forests.",
  "good morning": "Good morning! ☀️ Ready to learn about our beautiful planet?",
  "good night": "Good night! 🌙 Sweet dreams and don't forget to protect nature! 🌳",
};

// POST: Chat interaction
router.post("/", async (req, res) => {
  const { text, language, sender } = req.body;

  if (!text || !sender || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 1. Save user message
    const userMessage = await Message.create({ sender, text, language });

    // ✅ Small Talk Detection (before translation & AI call)
    const lowerText = text.trim().toLowerCase();
    if (casualReplies[lowerText]) {
      const finalReply = casualReplies[lowerText];
      const botMessage = await Message.create({ sender: "bot", text: finalReply, language });

      return res.status(200).json({
        success: true,
        reply: finalReply,
        userMessage,
        botMessage
      });
    }

    // 2. Translate to English
    const messageInEnglish = await translateText(text, language, "en");

    if (messageInEnglish.trim() === text.trim() && language !== "en") {
      console.warn(`⚠️ Translation failed or skipped for language: ${language}`);
    }

    // 3. Get AI response
    const aiResponseEnglish = await generateOllamaReply(messageInEnglish);
    console.log("🔍 Gemini English reply:", aiResponseEnglish);

    // 4. Translate AI reply back to user's language
    const aiReplyTranslated = await translateText(aiResponseEnglish, "en", language);

    let finalReply = aiReplyTranslated;
    if (aiReplyTranslated.trim() === aiResponseEnglish.trim() && language !== "en") {
      finalReply += `\n\n⚠️ Note: Response is in English due to translation limit.`;
      console.warn(`⚠️ Translation back to ${language} failed, sending English response.`);
    }

    // 5. Save bot reply
    const botMessage = await Message.create({ sender: "bot", text: finalReply, language });

    // 6. Final API response
    res.status(200).json({
      success: true,
      reply: finalReply,
      userMessage,
      botMessage
    });

  } catch (error) {
    console.error("❌ Chat error:", error.stack);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET: Retrieve chat history
router.get("/history", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ History fetch error:", error.stack);
    res.status(500).json({ error: "Failed to load chat history." });
  }
});

export default router;
