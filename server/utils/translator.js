// utils/translator.js
import fetch from 'node-fetch';

/**
 * Translate given text from one language to another using MyMemory API.
 * @param {string} text - The original text to translate.
 * @param {string} fromLang - Language code of the source text (e.g. 'en', 'hi').
 * @param {string} toLang - Language code to translate into (e.g. 'es', 'fr').
 * @returns {Promise<string>} - Translated text or original if translation fails.
 */
export async function translateText(text, fromLang, toLang) {
  // No need to translate if text is empty or languages match
  if (!text?.trim() || fromLang === toLang) return text;

  try {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const translated = data?.responseData?.translatedText;

    if (translated) {
      // Optional: Log translation (for debugging)
      // console.log(`🔤 Translated: [${text}] → [${translated}]`);
      return translated;
    }

    return text; // fallback to original if no translation found
  } catch (error) {
    console.error("❌ Failed to translate text:", error.message);
    return text; // fallback if API call fails
  }
}
