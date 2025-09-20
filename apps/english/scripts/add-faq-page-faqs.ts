import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const faqPageFaqs = [
  // Health & Safety Section
  {
    question: "Is this service suitable for my mental health needs?",
    answer: "Our AI therapy service is designed to provide support for daily stress and anxiety management, emotional support and venting, general mental wellness conversations, and non-crisis situations. However, this service is not a replacement for professional mental health care. If you're experiencing severe mental health issues, please contact a licensed mental health professional or emergency services."
  },
  {
    question: "What should I do in case of a mental health emergency?",
    answer: "If you're experiencing a mental health emergency, call emergency services (911) immediately, contact the National Suicide Prevention Lifeline at 988, reach out to a licensed mental health professional, or visit your nearest emergency room. Our AI therapy service is not designed for crisis situations. Please seek immediate professional help if you're experiencing thoughts of self-harm or other mental health emergencies."
  },

  // Privacy & Data Section
  {
    question: "How private are my therapy sessions?",
    answer: "We prioritize your privacy and data security. By default, we don't save your conversation content. You can choose to save sessions with a subscription. All saved data is encrypted and securely stored. You can delete your saved sessions at any time. We never share your personal information with third parties."
  },
  {
    question: "How is my privacy protected?",
    answer: "We take your privacy seriously. All conversations are encrypted and securely stored. Emotion metrics are only accessible to you. You can delete your account and all associated data at any time. We never share your personal information with third parties."
  },
  {
    question: "Can I access transcripts of my past conversations?",
    answer: "Yes! With a subscription plan, you can access your conversation history, view full transcripts of past therapy sessions, access emotion measurements and conversation analytics, track your progress and emotional patterns over time, and export your data for personal records. Calm tier users have limited history retention. Upgrade to a paid plan for full conversation history and analytics."
  },
  {
    question: "Can the AI remember our past conversations?",
    answer: "Yes, with subscription plans, our AI can maintain context across sessions. The AI remembers important details from previous conversations, can refer back to your progress and ongoing topics, and allows you to pick up right where you left off in previous sessions. Memory is preserved across different devices when logged in. This feature helps create more meaningful and continuous therapeutic relationships, allowing for deeper support over time."
  },

  // Usage & Plans Section
  {
    question: "How often can I use the service?",
    answer: "You can use our service based on your subscription plan. Calm users get 30 minutes per month. Centered subscribers get 120 minutes per month. Grounded subscribers get 300 minutes per month. You can start a session anytime, 24/7. No appointment needed - just start when you're ready."
  },
  {
    question: "How is session time calculated?",
    answer: "Session time is calculated based on your actual conversation duration. Time is only counted when you're actively speaking with the AI therapist. The timer pauses automatically when the registration prompt appears. Time is rounded up to the nearest minute for billing purposes. You can see your remaining minutes in your dashboard."
  },
  {
    question: "What subscription plans are available?",
    answer: "We offer three subscription tiers: Calm: 30 minutes per month - $0; Centered: 120 minutes per month - $12.99/mn; Grounded: 300 minutes per month - $29.99/mn. You can upgrade your plan at any time from your dashboard or the pricing page."
  },
  {
    question: "Can I pause or interrupt the AI during conversations?",
    answer: "Yes, you have full control during conversations. You can interrupt the AI at any time by speaking. The AI will pause and listen to what you want to say. Use the pause button to temporarily stop responses. Sessions can be ended at any time with the stop button. This ensures you always feel in control of the conversation pace and direction."
  },

  // Technology & Features Section
  {
    question: "How are emotion scores calculated?",
    answer: "Our emotion scores are calculated using Hume AI's advanced voice analysis technology. The system analyzes your voice during conversations and detects various emotions and cognitive states. Each emotion is assigned a confidence score between 0 and 100%. The system tracks 57 different emotions, including basic emotions (joy, sadness, anger, fear), complex emotions (admiration, gratitude, empathy), and cognitive states (concentration, contemplation). In your dashboard, you can see both individual message emotions and average emotional scores across your conversations. You can toggle between viewing your emotions and the AI therapist's emotions using the 'Show Agent Emotions & Dialog' button."
  }
];

async function addFaqPageFaqs() {
  console.log("Initializing OpenAI embeddings...");
  const embeddings = new OpenAIEmbeddings();

  for (const faq of faqPageFaqs) {
    console.log(`Processing: "${faq.question}"`);
    
    // Check if FAQ exists
    const { data: existingFaqs } = await supabase
      .from('faq_embeddings')
      .select('id, question, answer')
      .eq('question', faq.question)
      .single();

    if (existingFaqs) {
      console.log(`  - Updating existing FAQ: "${faq.question}"`);
      // Generate new embedding for the updated answer
      const embedding = await embeddings.embedQuery(faq.answer);
      
      // Update the existing FAQ
      const { error: updateError } = await supabase
        .from('faq_embeddings')
        .update({
          answer: faq.answer,
          embedding: embedding
        })
        .eq('id', existingFaqs.id);

      if (updateError) {
        console.error(`  ❌ Error updating FAQ: ${updateError.message}`);
      } else {
        console.log(`  ✅ Successfully updated FAQ`);
      }
    } else {
      console.log(`  - Adding new FAQ: "${faq.question}"`);
      // Generate embedding for new FAQ
      const embedding = await embeddings.embedQuery(faq.answer);
      
      // Insert new FAQ
      const { error: insertError } = await supabase
        .from('faq_embeddings')
        .insert({
          question: faq.question,
          answer: faq.answer,
          embedding: embedding
        });

      if (insertError) {
        console.error(`  ❌ Error adding FAQ: ${insertError.message}`);
      } else {
        console.log(`  ✅ Successfully added FAQ`);
      }
    }
  }

  // Get total count of FAQs
  const { count } = await supabase
    .from('faq_embeddings')
    .select('*', { count: 'exact', head: true });

  console.log("\n✅ FAQ page seeding completed!");
  console.log(`📊 Total FAQs in database: ${count}`);

  console.log("\n🤖 The chatbot is now aware of all FAQ page information and can answer questions about:");
  console.log("   • Health & Safety");
  console.log("   • Privacy & Data");
  console.log("   • Usage & Subscription Plans");
  console.log("   • Technology & Features");
}

// Run the script
addFaqPageFaqs(); 