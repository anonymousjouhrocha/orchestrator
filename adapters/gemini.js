const axios = require('axios');

const API_KEY = process.env.API_KEY_GEMINI;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function call(prompt) {
  const response = await axios.post(URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data.candidates[0].content.parts[0].text;
}

module.exports = { call };