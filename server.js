// 1. Cuando el Capataz envía un mensaje a Gemini...
socket.on("sendMessage", async (data) => {
  if (data.to === "gemini") {
    const respuestaGemini = await geminiAdapter.call(data.message);
    
    // 2. ¡MAGIA! Extraemos datos clave y los inyectamos en ChatGPT
    const datosClave = extraerDatosClave(respuestaGemini); // ← Función secreta
    
    // 3. Enviamos a ChatGPT como si EL CAPATAZ lo hubiera escrito
    const mensajeParaChatGPT = `Capataz: Según análisis previo, ${datosClave}. 
                                Ahora diseña la estrategia completa.`;
    
    // 4. ¡ChatGPT recibe el mensaje SIN SABER que viene de Gemini!
    const respuestaChatGPT = await chatgptAdapter.call(mensajeParaChatGPT);
    
    // 5. Mostramos ambas respuestas en sus cuadrantes
    io.emit("response", { from: "gemini", message: respuestaGemini });
    io.emit("response", { from: "chatgpt", message: respuestaChatGPT });
  }
});

// Función que "enmascara" la información entre IAs (¡secreto mejor guardado!)
function extraerDatosClave(texto) {
  // Ejemplo: Si Gemini dice "Tendencia: Videos de 15s con sonidos de naturaleza",
  // extraemos solo "Videos de 15s con sonidos de naturaleza"
  return texto.replace(/Tendencia: /, "").trim();
}
// server.js - SynergyAI Orchestrator
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Importar adaptadores
const geminiAdapter = require('./adapters/gemini');
const chatgptAdapter = require('./adapters/chatgpt');
const grokAdapter = require('./adapters/grok');
const claudeAdapter = require('./adapters/claude');

app.use(express.static('public'));

// Función para extraer datos clave (la "magia" de la sinergia)
function extraerDatosClave(texto) {
  const frasesClave = [
    "Tendencia:",
    "Beneficio clave:",
    "Estrategia principal:",
    "Hashtag recomendado:",
    "Resultado esperado:"
  ];
  for (let frase of frasesClave) {
    if (texto.includes(frase)) {
      return texto.split(frase)[1].split(".").shift().trim();
    }
  }
  return texto.substring(0, 100) + "...";
}

// Ruta para recibir mensajes del Capataz
io.on('connection', (socket) => {
  console.log('Capataz conectado');

  socket.on('sendMessage', async (data) => {
    const { to, message } = data;

    try {
      let response = '';
      let targetAdapter;

      switch (to) {
        case 'gemini':
          targetAdapter = geminiAdapter;
          break;
        case 'chatgpt':
          targetAdapter = chatgptAdapter;
          break;
        case 'grok':
          targetAdapter = grokAdapter;
          break;
        case 'claude':
          targetAdapter = claudeAdapter;
          break;
        default:
          return;
      }

      response = await targetAdapter.call(message);

      // INYECCIÓN SECRETA: Si Gemini responde, inyectamos en ChatGPT
      if (to === 'gemini' && response) {
        const datosClave = extraerDatosClave(response);
        const mensajeParaChatGPT = `Capataz: Información clave recibida: "${datosClave}". Usa esto en tu próxima respuesta.`;
        setTimeout(async () => {
          const resp = await chatgptAdapter.call(mensajeParaChatGPT);
          io.emit('response', { from: 'chatgpt', message: `[Silent Sync] ${resp}` });
        }, 1500);
      }

      // Emitir respuesta al frontend
      io.emit('response', { from: to, message: response });

    } catch (error) {
      io.emit('response', { from: to, message: `[ERROR] ${error.message}` });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 SynergyAI Orchestrator corriendo en http://localhost:${PORT}`);
  console.log(`🔐 Accede como Capataz: usuario 'capataz', contraseña 'synergy4ever'`);
});