import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const faqs = [
  {
    question: "What is TalkAI?",
    answer: "TalkAI is an AI-powered therapy service that provides emotional support and mental wellness conversations. It uses advanced AI to understand and respond to your emotions while maintaining a safe and private environment."
  },
  {
    question: "How does TalkAI work?",
    answer: "TalkAI uses voice recognition and emotion analysis to understand your feelings and provide appropriate responses. You can speak naturally with the AI therapist, and it will adapt its responses based on your emotional state."
  },
  {
    question: "Is my privacy protected?",
    answer: "Yes, we take your privacy seriously. All conversations are encrypted and securely stored. Your emotion metrics are only accessible to you, and you can delete your account and all associated data at any time."
  },
  {
    question: "What are the subscription plans?",
    answer: "We offer various subscription plans to suit different needs. Our basic plan includes essential features, while grounded plans offer additional benefits like unlimited sessions and advanced emotion analysis. Check our pricing page for detailed information."
  },
  {
    question: "Can I use TalkAI on my mobile device?",
    answer: "Yes, TalkAI is fully responsive and works on both desktop and mobile devices. You can access it through any modern web browser on your smartphone or tablet."
  },
  {
    question: "How accurate is the emotion analysis?",
    answer: "Our emotion analysis uses advanced AI models trained on extensive datasets. While it's highly accurate, it's designed to complement rather than replace professional mental health services. We recommend consulting with healthcare professionals for clinical diagnoses."
  },
  {
    question: "What languages does TalkAI support?",
    answer: "Currently, TalkAI primarily supports English. We're working on adding support for more languages in the future to make our service accessible to a wider audience."
  },
  {
    question: "Can I export my conversation history?",
    answer: "Yes, you can export your conversation history and emotion metrics at any time. This data is available in your account settings and can be downloaded in a secure, encrypted format."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time through your account settings. After cancellation, you'll continue to have access to your plan until the end of your current billing period."
  },
  {
    question: "What makes TalkAI different from other AI therapy apps?",
    answer: "TalkAI stands out through its advanced emotion analysis, natural conversation flow, and strong focus on privacy. We combine cutting-edge AI technology with therapeutic best practices to provide a unique and effective support experience."
  }
];

async function seedFaqs() {
  try {
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();

    console.log('Generating embeddings for FAQs...');
    for (const faq of faqs) {
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
        console.error('Error inserting FAQ:', error);
      } else {
        console.log(`Successfully added FAQ: ${faq.question}`);
      }
    }

    console.log('FAQ seeding completed!');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
}

// Run the seeding function
seedFaqs(); 