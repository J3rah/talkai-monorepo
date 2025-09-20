import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testVectorSearch() {
  try {
    console.log('Testing vector search...');
    
    // Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings();
    
    // Test query
    const query = 'How does this service work?';
    console.log('Query:', query);
    
    // Get embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    console.log('Generated embedding for query');
    
    // Call the match_faq function
    const { data: results, error } = await supabase.rpc('match_faq', {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.5,
      match_count: 1
    });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('\nResults:');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testVectorSearch(); 