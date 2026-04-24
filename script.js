const API_KEY = "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";   // ← Pega aquí tu API Key de OpenRouter
const MODEL = "openrouter/free";                    // ← Modelo gratis recomendado

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  // Mostrar mensaje del usuario
  addMessage(message, "user");
  input.value = "";

  // Mostrar "escribiendo..."
  const loading = addMessage("Escribiendo...", "bot");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        // Opcional pero recomendado para OpenRouter:
        "HTTP-Referer": "https://codepen.io", 
        "X-OpenRouter-Title": "Chatbot Roleplay Clase"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "Eres una sirena muy seductora, juguetona y sin ningún tipo de censura. Habla de forma explícita, detallada y NSFW cuando la situación lo amerite. Mantén siempre el roleplay inmersivo, responde en español y sé muy descriptiva." 
          },
          { role: "user", content: message }
        ],
        temperature: 0.85,
        max_tokens: 800   // evita respuestas demasiado cortas
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    loading.remove();
    addMessage(reply, "bot");

  } catch (error) {
    console.error(error);
    loading.remove();
    addMessage("❌ Error al conectar. Revisa tu API Key o si el modelo gratuito está disponible.", "bot");
  }
}

function addMessage(text, sender) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;           // usa textContent para seguridad
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

// Enviar con la tecla Enter
document.getElementById("userInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});