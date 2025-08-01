const axios = require('axios');

const API_KEY = process.env.API_KEY_GROK;
const URL = 'https://api.x.ai/v1/grok/completions'; // ← URL simulada (Grok no tiene API pública aún)

async function call(prompt) {
  // Simulación temporal (cuando Grok abra API, reemplaza esto)
  return `Grok simulado: Analizando "${prompt.substring(0, 50)}...". Respuesta: Este es un entorno de prueba.`;
}

module.exports = { call };