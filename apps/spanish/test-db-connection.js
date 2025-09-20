const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

console.log('🔌 Testing simple connection...');
console.log('🔍 Using URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('🔍 Using key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);

supabase.from('chat_sessions').select('id').limit(1)
  .then(result => {
    console.log('✅ Connection successful!');
    console.log('🔍 Result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Connection error:', error);
    process.exit(1);
  });

setTimeout(() => {
  console.log('⏰ Connection test timed out after 10 seconds');
  process.exit(1);
}, 10000); 