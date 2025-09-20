import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const testFaq = {
  question: "Can this service help with my mental health?",
  answer: "Yes, our service is designed for daily stress, anxiety management, emotional support, and general mental wellness. It is not a replacement for professional mental health care. For severe issues, please contact a licensed mental health professional or emergency services."
};

async function addTestFaq() {
  try {
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();

    console.log(`Adding test FAQ to the database...`);
    console.log(`Question: "${testFaq.question}"`);
    
    // Check if this FAQ already exists
    const { data: existing } = await supabase
      .from('faq_embeddings')
      .select('question')
      .eq('question', testFaq.question)
      .single();
    
    if (existing) {
      console.log(`  - FAQ already exists, skipping: "${testFaq.question}"`);
      return;
    }

    // Generate embedding for the combined question and answer
    const text = `${testFaq.question} ${testFaq.answer}`;
    const embedding = await embeddings.embedQuery(text);

    // Insert into database
    const { error } = await supabase
      .from('faq_embeddings')
      .insert({
        question: testFaq.question,
        answer: testFaq.answer,
        embedding
      });

    if (error) {
      console.error(`  - Error inserting FAQ: ${error.message}`);
    } else {
      console.log(`  ✓ Successfully added FAQ: "${testFaq.question}"`);
    }

    // Get final count
    const { count } = await supabase
      .from('faq_embeddings')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Test FAQ added!`);
    console.log(`📊 Total FAQs in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error in test FAQ seeding process:', error);
  }
}

// Run the script
addTestFaq(); 