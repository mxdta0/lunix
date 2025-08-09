const fetch = require('node-fetch');

const replyWithOpenRouter = async (userInput) => {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'microsoft/mai-ds-r1:free',
      messages: [{ role: 'user', content: userInput }]
    })
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '🤖 No response received.';
};

module.exports = { replyWithOpenRouter };
