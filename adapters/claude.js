const axios = require('axios');

const API_KEY = process.env.API_KEY_CLAUDE;
const URL = 'https://api.anthropic.com/v1/messages';

async function call(prompt) {
  const response = await axios.post(URL, {
    model: "claude-3-haiku-20240307",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }
  });
  return response.data.content[0].text;
}

module.exports = { call };