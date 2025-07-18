import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import chatRoutes from "./routes/chat.js";
import emailRoutes from "./routes/email.js";
import translateRoutes from "./routes/translate.js";
import imageRoutes from "./routes/image.js";

// Optional utility import (if needed)

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/image", imageRoutes);

// Example simple AI route (optional, keep only if needed)
app.post("/api/gemini", async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "No input text provided." });
  try {
    const reply = await generateGeminiReply(text);
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Failed to get AI response." });
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "🚫 Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "⚠️ Internal server error" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
