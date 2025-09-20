import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const newFaqs = [
  // Health & Safety
  {
    question: "Is this service suitable for my mental health needs?",
    answer: "Our AI therapy service is designed to provide support for daily stress and anxiety management, emotional support and venting, general mental wellness conversations, and non-crisis situations. However, this service is not a replacement for professional mental health care. If you're experiencing severe mental health issues, please contact a licensed mental health professional or emergency services."
  },
  {
    question: "What should I do in case of a mental health emergency?",
    answer: "If you're experiencing a mental health emergency: Call emergency services (911) immediately, contact the National Suicide Prevention Lifeline at 988, reach out to a licensed mental health professional, or visit your nearest emergency room. Our AI therapy service is not designed for crisis situations. Please seek immediate professional help if you're experiencing thoughts of self-harm or other mental health emergencies."
  },
  
  // Privacy & Data
  {
    question: "How private are my therapy sessions?",
    answer: "We prioritize your privacy and data security. By default, we don't save your conversation content. You can choose to save sessions with a subscription. All saved data is encrypted and securely stored. You can delete your saved sessions at any time. We never share your personal information with third parties."
  },
  {
    question: "Can I access transcripts of my past conversations?",
    answer: "Yes! With a subscription plan, you can access your conversation history. You can view full transcripts of past therapy sessions, access emotion measurements and conversation analytics, track your progress and emotional patterns over time, and export your data for personal records. Calm tier users have limited history retention. Upgrade to a paid plan for full conversation history and analytics."
  },
  {
    question: "Can the AI remember our past conversations?",
    answer: "Yes, with subscription plans, our AI can maintain context across sessions. The AI remembers important details from previous conversations, can refer back to your progress and ongoing topics, allows you to pick up right where you left off in previous sessions, and memory is preserved across different devices when logged in. This feature helps create more meaningful and continuous therapeutic relationships, allowing for deeper support over time."
  },
  
  // Usage & Plans
  {
    question: "How often can I use the service?",
    answer: "You can use our service based on your subscription plan: Calm users get 30 minutes per month, Centered subscribers get 120 minutes per month, Grounded subscribers get 300 minutes per month. You can start a session anytime, 24/7, with no appointment needed - just start when you're ready."
  },
  {
    question: "How is session time calculated?",
    answer: "Session time is calculated based on your actual conversation duration. Time is only counted when you're actively speaking with the AI therapist. The timer pauses automatically when the registration prompt appears. Time is rounded up to the nearest minute for billing purposes. You can see your remaining minutes in your dashboard."
  },
  {
    question: "What subscription plans are available?",
    answer: "We offer three subscription tiers: Calm (30 minutes per month), Centered (120 minutes per month), and Grounded (300 minutes per month). You can upgrade your plan at any time from your dashboard or the pricing page."
  },
  {
    question: "Can I pause or interrupt the AI during conversations?",
    answer: "Yes, you have full control during conversations. You can interrupt the AI at any time by speaking, the AI will pause and listen to what you want to say, use the pause button to temporarily stop responses, and sessions can be ended at any time with the stop button. This ensures you always feel in control of the conversation pace and direction."
  },
  
  // Technology & Features
  {
    question: "How are emotion scores calculated?",
    answer: "Our emotion scores are calculated using Hume AI's advanced voice analysis technology. The system analyzes your voice during conversations and detects various emotions and cognitive states. Each emotion is assigned a confidence score between 0 and 100%. The system tracks 57 different emotions, including basic emotions (joy, sadness, anger, fear), complex emotions (admiration, gratitude, empathy), and cognitive states (concentration, contemplation). In your dashboard, you can see both individual message emotions and average emotional scores across your conversations."
  },
  {
    question: "What do the emotion labels and scores actually mean?",
    answer: "Our emotion analysis reflects confidence levels that specific emotions are being expressed in your voice and language. Expression labels are categories like 'amusement' or 'sadness' that represent emotional expressions that most people recognize in vocal patterns. Expression scores are numbers indicating how likely it is that your voice would be interpreted as expressing that emotion by human listeners. These represent vocal and linguistic patterns, not necessarily what you're feeling internally. The AI uses this information to respond more empathetically and appropriately. This technology is based on extensive research in emotional expression and helps create more natural, supportive conversations."
  },
  {
    question: "Does TalkAI support multiple languages?",
    answer: "Currently, TalkAI supports English, with expanded language support coming soon. Currently available: English. Coming soon: Spanish, French, German, Italian, and Japanese. All emotion analysis and voice features work in supported languages. New languages are being actively developed based on user demand. We're committed to making mental health support accessible across language barriers."
  },
  {
    question: "Why does TalkAI respond so quickly compared to other AI?",
    answer: "TalkAI's fast response time comes from our advanced AI architecture. We use Hume's specialized speech-language model that processes voice and text simultaneously. The AI generates initial responses independently, without waiting for external language models. Voice synthesis and emotion processing happen in real-time. Our system is optimized specifically for conversational therapy, not general text generation. This creates a more natural, flowing conversation that feels closer to talking with a human therapist."
  },
  {
    question: "How does the voice analysis work during conversations?",
    answer: "Our voice analysis technology works in real-time during your therapy sessions. The AI transcribes your speech and extracts emotional cues from your voice tone. Prosody (tone-of-voice) patterns are analyzed to understand your emotional state. The AI adjusts its responses based on both your words and how you say them. Voice characteristics like speaking rate, pitch, and expressiveness are considered. This multimodal approach allows the AI to provide more empathetic and contextually appropriate support."
  },
  
  // Getting Started
  {
    question: "How do I get started?",
    answer: "Getting started is easy: Create an account or log in if you already have one, allow microphone access when prompted, click 'Start Session' to begin your conversation, speak naturally with the AI therapist, and view your emotion metrics and progress in your dashboard."
  },
  {
    question: "What are the technical requirements?",
    answer: "To use our service, you need: A modern web browser (Chrome, Firefox, Safari, or Edge), a working microphone, a stable internet connection, and JavaScript enabled in your browser."
  },
  {
    question: "How many people can use TalkAI at the same time?",
    answer: "TalkAI is designed to handle multiple users simultaneously. Our platform supports hundreds of concurrent therapy sessions. Each user gets a private, isolated conversation experience. Performance remains consistent even during peak usage times. Sessions are processed in real-time without delays or queues. We've built our infrastructure to scale and provide reliable service 24/7."
  },
  {
    question: "How is my privacy protected?",
    answer: "We take your privacy seriously. All conversations are encrypted and securely stored. Emotion metrics are only accessible to you. You can delete your account and all associated data at any time. We never share your personal information with third parties."
  }
];

async function addNewFaqs() {
  try {
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();

    console.log(`Adding ${newFaqs.length} new FAQs to the database...`);
    
    for (const faq of newFaqs) {
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

    console.log(`\n✅ FAQ seeding completed!`);
    console.log(`📊 Total FAQs in database: ${count}`);
    console.log('\n🤖 The chatbot is now fully aware of all new FAQ entries and can answer questions about:');
    console.log('- Health & Safety guidelines');
    console.log('- Privacy & Data protection');
    console.log('- Usage & Subscription plans');
    console.log('- Technology & Features');
    console.log('- Getting Started information');
    
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
  }
}

// Run the function
addNewFaqs(); 