import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const coreFaqs = [
  {
    question: "Is this service suitable for my mental health needs?",
    answer: "Our AI therapy service is designed to provide support for:\n\n- Daily stress and anxiety management\n- Emotional support and venting\n- General mental wellness conversations\n- Non-crisis situations\n\nHowever, this service is not a replacement for professional mental health care. If you're experiencing severe mental health issues, please contact a licensed mental health professional or emergency services."
  },
  {
    question: "What is TalkAI and how does it work?",
    answer: "TalkAI is an AI-powered therapy service that provides emotional support and mental wellness conversations. Our service uses advanced AI technology to engage in meaningful conversations, offering support for daily stress, anxiety management, and general mental wellness. You can chat with our AI therapist through text or voice, and the service is available 24/7. We offer different subscription plans to suit various needs, from basic support to more comprehensive features."
  },
  {
    question: "Is my conversation with TalkAI private and secure?",
    answer: "Yes, we take your privacy and security very seriously. All conversations with TalkAI are encrypted and stored securely. We do not share your personal information or conversation content with third parties. However, please note that while we maintain high security standards, no online service can guarantee 100% security. We recommend not sharing extremely sensitive personal information during your sessions."
  },
  {
    question: "What should I do in case of a mental health emergency?",
    answer: "If you're experiencing a mental health emergency, please:\n\n1. Call emergency services (911 in the US)\n2. Contact a crisis hotline\n3. Visit your nearest emergency room\n\nTalkAI is not designed for crisis situations and cannot provide emergency assistance. Our service is meant for non-crisis support and general mental wellness."
  }
];

async function addCoreFaqs() {
  try {
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();

    console.log(`Adding ${coreFaqs.length} core FAQs to the database...`);
    
    for (const faq of coreFaqs) {
      console.log(`Processing: "${faq.question}"`);
      
      // Check if this FAQ already exists
      const { data: existing } = await supabase
        .from('faq_embeddings')
        .select('question')
        .eq('question', faq.question)
        .single();
      
      if (existing) {
        console.log(`  - FAQ already exists, skipping: "${faq.question}"`);
        continue;
      }

      // Generate embedding for the combined question and answer
      const text = `${faq.question} ${faq.answer}`;
      const embedding = await embeddings.embedQuery(text);

      // Insert into database
      const { error } = await supabase
        .from('faq_embeddings')
        .insert({
          question: faq.question,
          answer: faq.answer,
          embedding
        });

      if (error) {
        console.error(`  - Error inserting FAQ: ${error.message}`);
      } else {
        console.log(`  ✓ Successfully added FAQ: "${faq.question}"`);
      }
    }

    // Get final count
    const { count } = await supabase
      .from('faq_embeddings')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Core FAQ seeding completed!`);
    console.log(`📊 Total FAQs in database: ${count}`);
    console.log('\n🤖 The chatbot is now aware of core service information and can answer questions about:');
    console.log('   • Service suitability and purpose');
    console.log('   • Privacy and security');
    console.log('   • Emergency situations');
    console.log('   • How the service works');
    
  } catch (error) {
    console.error('❌ Error in core FAQ seeding process:', error);
  }
}

// Run the script
addCoreFaqs(); 