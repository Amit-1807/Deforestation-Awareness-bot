let selectedLang = "en"; // default

document.addEventListener("DOMContentLoaded", () => {
  appendMessage("bot", "👋 Welcome! I'm your AI assistant. Ask me anything about deforestation or the environment.");
  updateLanguageUI();
});

function getSelectedLanguage() {
  return selectedLang;
}

function selectLanguage(langCode) {
  selectedLang = langCode;
  updateLanguageUI();
}

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

async function sendMessage() {
  const input = document.getElementById("userInput");
  const rawMessage = input.value.trim();
  if (!rawMessage) return;

  appendMessage("user", rawMessage);
  input.value = "";
  autoResize(input);
  showTypingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawMessage }),
    });

    const data = await res.json();
    removeTypingIndicator();

    if (data.reply) {
      appendMessage("bot", data.reply);
    } else {
      appendMessage("bot", "Sorry, no response from AI.");
    }
  } catch (err) {
    removeTypingIndicator();
    appendMessage("bot", "Oops! Something went wrong.");
    console.error(err);
  }
}

function appendMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
}

function showTypingIndicator() {
  const chatbox = document.getElementById("chatbox");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = `<span></span><span></span><span></span>`;
  chatbox.appendChild(typingDiv);
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function toggleMenu() {
  const menu = document.getElementById("menuPopup");
  menu.classList.toggle("hidden");
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuPopup");
  const icon = document.querySelector(".menu-icon");
  if (!menu.contains(e.target) && !icon.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

function scrollToTop() {
  document.getElementById("chatbox").scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("chatbox").addEventListener("scroll", () => {
  const btn = document.getElementById("scrollTopBtn");
  const box = document.getElementById("chatbox");
  const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
  btn.classList.toggle("hidden", !atBottom);
});

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function greetUser() {
  appendMessage("bot", "👋 Hello! I'm here to help you protect forests 🌳");
}
