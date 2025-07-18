let selectedLang = "en"; // default selected language

// Dynamically set API endpoint based on environment
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api"
  : "/api";

// On page load, show welcome message and update UI
document.addEventListener("DOMContentLoaded", () => {
  appendMessage("bot", "👋 Welcome! I'm your AI assistant. Ask me anything about deforestation or the environment.");
  updateLanguageUI();
});

// Get selected language
function getSelectedLanguage() {
  return selectedLang;
}

// Set selected language
function selectLanguage(langCode) {
  selectedLang = langCode;
  updateLanguageUI();
}

// Update language button UI
function updateLanguageUI() {
  const buttons = document.querySelectorAll(".language-options button");
  buttons.forEach(btn => {
    const btnLang = btn.dataset.lang;
    if (btnLang === selectedLang) {
      btn.classList.add("active");
      btn.innerHTML = `${capitalize(btnLang)} ✔️`;
    } else {
      btn.classList.remove("active");
      btn.innerHTML = capitalize(btnLang);
    }
  });
}

// Capitalize language codes for display
function capitalize(code) {
  const map = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    hin: "Hinglish"
  };
  return map[code] || code.toUpperCase();
}

// Send message to backend
async function sendMessage() {
  const input = document.getElementById("userInput");
  const rawMessage = input.value.trim();
  if (!rawMessage) return;

  appendMessage("user", rawMessage);
  input.value = "";
  autoResize(input);
  showTypingIndicator();

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: rawMessage,
        sender: "user",
        language: getSelectedLanguage()
      }),
    });

    const data = await res.json();
    removeTypingIndicator();

    if (data.botMessage?.text) {
      appendMessage("bot", data.botMessage.text);
    } else {
      appendMessage("bot", "Sorry, no response from AI.");
    }
  } catch (err) {
    removeTypingIndicator();
    appendMessage("bot", "Oops! Something went wrong.");
    console.error(err);
  }
}

// Append messages to chatbox
function appendMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;

  // ✅ Clean formatting: handle line breaks and bold
  msgDiv.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // bold
    .replace(/\n/g, '<br>');                 // line breaks

  chatbox.appendChild(msgDiv);
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
}

// Show typing animation
function showTypingIndicator() {
  const chatbox = document.getElementById("chatbox");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = `<span></span><span></span><span></span>`;
  chatbox.appendChild(typingDiv);
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
}

// Remove typing animation
function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// Toggle popup menu
function toggleMenu() {
  const menu = document.getElementById("menuPopup");
  menu.classList.toggle("hidden");
}

// Close popup menu when clicking outside
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuPopup");
  const icon = document.querySelector(".menu-icon");
  if (!menu.contains(e.target) && !icon.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Scroll to top button
function scrollToTop() {
  document.getElementById("chatbox").scrollTo({ top: 0, behavior: "smooth" });
}

// Show/hide scroll to top button
document.getElementById("chatbox").addEventListener("scroll", () => {
  const btn = document.getElementById("scrollTopBtn");
  const box = document.getElementById("chatbox");
  const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
  btn.classList.toggle("hidden", !atBottom);
});

// Auto-resize textarea height
function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

// Optional greeting function
function greetUser() {
  appendMessage("bot", "👋 Hello! I'm here to help you protect forests 🌳");
}
