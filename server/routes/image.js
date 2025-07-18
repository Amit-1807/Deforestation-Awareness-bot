import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  console.log("🖼️ Satellite image uploaded:", req.file.filename);

  // Placeholder logic
  const fakeDetection = Math.random() < 0.5;
  const status = fakeDetection ? "🔥 Forest fire risk detected!" : "✅ No deforestation risk.";

  res.status(200).json({
    filename: req.file.filename,
    detection: status
  });
});

export default router;
