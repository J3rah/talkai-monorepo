// multiAgentChat.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const agents = [
  { name: 'Agent Alice', role: 'Curious Researcher' },
  { name: 'Agent Bob', role: 'Skeptical Analyst' },
];

async function chatBetweenAgents({ rounds = 5, initialPrompt = "Let's discuss the future of AI." }) {
  let messages = [
    { role: 'system', content: `You are ${agents[0].name}, a ${agents[0].role}.` },
    { role: 'user', content: initialPrompt },
  ];

  for (let i = 0; i < rounds; i++) {
    const currentAgent = agents[i % 2];
    messages.push({ role: 'system', content: `You are ${currentAgent.name}, a ${currentAgent.role}.` });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 150,
    });
    const reply = completion.choices[0].message.content;
    messages.push({ role: 'assistant', content: reply });
    console.log(`\n${currentAgent.name}: ${reply}\n`);
  }
}

chatBetweenAgents({ rounds: 6 }).catch(console.error); 