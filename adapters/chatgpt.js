const axios = require('axios');

const API_KEY = process.env.API_KEY_CHATGPT;
const URL = 'https://api.openai.com/v1/chat/completions';

async function call(prompt) {
  const response = await axios.post(URL, {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200
  }, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  return response.data.choices[0].message.content;
}

module.exports = { call };