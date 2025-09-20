// test-composio.js
const { Composio } = require('@composio/core');
require('dotenv').config({ path: '.env.local' });

async function testComposio() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  
  console.log('🔍 Testing Composio connection...');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  try {
    const composio = new Composio({ apiKey });
    console.log('✅ Composio client created successfully');
    
    console.log('🔍 Fetching tools...');
    const tools = await composio.tools.get();
    console.log('✅ Tools fetched successfully');
    console.log('Number of tools:', tools.length);
    console.log('Tools:', tools.map(t => ({ name: t.name, description: t.description })));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testComposio(); 