import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const subscriptionFaqs = [
  {
    question: "What subscription plans are available?",
    answer: "TalkAI offers three subscription plans: Calm, Centered, and Grounded. The Calm plan includes 30 minutes per month of therapy sessions. The Centered plan offers 120 minutes per month with additional features. The Grounded plan provides 300 minutes per month and includes all features, including the ability to resume chat sessions (coming soon)."
  },
  {
    question: "How much do the subscription plans cost?",
    answer: "TalkAI offers a tiered pricing model. The Calm plan is available at no cost with 30 minutes per month. The Centered plan is priced at a competitive rate with 120 minutes per month. The Grounded plan offers the most comprehensive features with 300 minutes per month. All paid plans are billed monthly and can be canceled at any time."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. When you cancel, you'll still have access to your plan until the end of your current billing period. You can manage your subscription through your account settings or contact support for assistance."
  },
  {
    question: "What happens when I reach my monthly time limit?",
    answer: "When you reach your monthly time limit, you'll need to wait until your next billing cycle to continue using the service, or you can upgrade to a higher tier plan for more minutes. The Calm plan includes 30 minutes, Centered plan 120 minutes, and Grounded plan 300 minutes per month."
  },
  {
    question: "How do I upgrade or downgrade my subscription?",
    answer: "You can upgrade or downgrade your subscription at any time through your account settings. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, the change will take effect at the start of your next billing cycle."
  },
  {
    question: "What features are included in each plan?",
    answer: "The Calm plan includes basic therapy sessions with 30 minutes per month. The Centered plan (120 minutes/month) includes all basic features plus additional therapy tools. The Grounded plan (300 minutes/month) includes all features plus the ability to resume chat sessions (coming soon) and priority support."
  }
];

async function addSubscriptionFaqs() {
  try {
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();

    console.log(`Adding ${subscriptionFaqs.length} subscription FAQs to the database...`);
    
    for (const faq of subscriptionFaqs) {
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

    console.log(`\n✅ Subscription FAQ seeding completed!`);
    console.log(`📊 Total FAQs in database: ${count}`);
    console.log('\n🤖 The chatbot is now aware of subscription-related information and can answer questions about:');
    console.log('   • Available subscription plans');
    console.log('   • Pricing and billing');
    console.log('   • Plan features and limits');
    console.log('   • Subscription management');
    
  } catch (error) {
    console.error('❌ Error in subscription FAQ seeding process:', error);
  }
}

// Run the script
addSubscriptionFaqs(); 