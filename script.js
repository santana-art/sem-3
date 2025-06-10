// Configuração do WebSocket - SUBSTITUA pelo IP do seu ESP32
const esp32Ip = "192.168.1.100"; // Altere para o IP do seu ESP32
const wsPort = "81";
const ws = new WebSocket(`ws://${esp32Ip}:${wsPort}/ws`);

// Elementos da interface
const messageInput = document.getElementById("message");
const outputDiv = document.getElementById("output");
const statusDiv = document.getElementById("connectionStatus");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");

// Event Listeners
sendButton.addEventListener("click", sendMessage);
clearButton.addEventListener("click", clearMessage);

// Evento ao pressionar Enter
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Funções
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg && ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
        addToOutput(`Você: ${msg}`);
        messageInput.value = "";
    } else if (!msg) {
        alert("Por favor, digite uma mensagem!");
    }
}

function clearMessage() {
    messageInput.value = "";
    if (ws.readyState === WebSocket.OPEN) {
        ws.send("clear");
        addToOutput("Sistema: Mensagem limpa");
    }
}

function addToOutput(message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    outputDiv.innerHTML += `<span style="color: #666;">[${timeString}]</span> ${message}<br>`;
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// WebSocket Events
ws.onopen = () => {
    statusDiv.textContent = "Conectado ao ESP32";
    statusDiv.className = "status connected";
    addToOutput("Sistema: Conectado ao ESP32");
};

ws.onmessage = (event) => {
    addToOutput(`ESP32: ${event.data}`);
};

ws.onerror = (error) => {
    statusDiv.textContent = "Erro na conexão";
    statusDiv.className = "status disconnected";
    addToOutput("Sistema: Erro na conexão");
    console.error("WebSocket error:", error);
};

ws.onclose = () => {
    statusDiv.textContent = "Desconectado do ESP32";
    statusDiv.className = "status disconnected";
    addToOutput("Sistema: Conexão fechada");
};