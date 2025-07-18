import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: "en"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Message", MessageSchema);
