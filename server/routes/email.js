import express from "express";
const router = express.Router();

router.post("/send", (req, res) => {
  const { subject, message } = req.body;
  console.log("📭 Email alert received (skipped):", { subject, message });
  return res.status(200).json({ success: true, msg: "Email skipped (dev mode)" });
});

export default router;
