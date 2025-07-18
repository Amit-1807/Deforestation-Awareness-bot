// utils/ollama.js

// Function to get a clean, engaging AI reply using Ollama (local LLM)
export async function generateOllamaReply(userPrompt) {
  try {
    // Instruction prompt for general audience
    const fullPrompt = `
You are a helpful, engaging AI assistant 🌍.

✅ Your job is to answer user questions in a friendly, professional, and easy-to-understand way.

✅ Guidelines for your reply:
- Use short paragraphs with proper **line breaks**.
- Use **bullet points (•)** or **numbered lists** for multiple points.
- Add **relevant emojis** to make responses engaging (but avoid overusing).
- Provide **real-world examples** where possible.
- **End with a useful summary or motivational note** when applicable.
- Keep responses useful for people of **any age group** (not overly childish).

💡 Here is the user's question or message:
"${userPrompt}"

✅ Now, provide a clean, well-structured, engaging response:
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:2b",  // Replace with your model name if different
        prompt: fullPrompt,
        stream: false,
      }),
    });

    const data = await response.json();

    return data.response?.trim() || "Sorry, I couldn't generate a response right now.";
  } catch (err) {
    console.error("❌ Ollama error:", err.message);
    return "Oops! Something went wrong while generating a reply. Please try again later.";
  }
}
