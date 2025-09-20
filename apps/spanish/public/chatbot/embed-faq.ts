import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { Document } from '@langchain/core/documents';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PRIVATE_KEY!
);

const faqData = [
  {
    question: 'What is TalkAI?',
    answer: 'TalkAI is a conversational AI platform that enables you to talk with emotionally intelligent AI using voice and text.'
  },
  {
    question: 'How does pricing work?',
    answer: 'TalkAI offers a tiered pricing model based on monthly usage, starting with a free tier and moving to Pro and Enterprise plans.'
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. TalkAI does not share or store personal conversation data beyond what is required for functionality.'
  },
  {
    question: 'What are TalkAI’s ethical guidelines?',
    answer: 'TalkAI is built on the ethical use of empathetic voice interfaces (EVI), emphasizing consent, privacy, emotional safety, and transparency.'
  },
  {
    question: 'What is EVI?',
    answer: 'EVI stands for Empathetic Voice Interface. It’s a way of interacting with AI that includes emotional cues, voice tone, and empathetic responses.'
  },
];

async function run() {
  const docs = faqData.map((faq) => new Document({
    pageContent: `${faq.question}\n${faq.answer}`,
    metadata: { source: 'faq' }
  }));

  const embeddings = new OpenAIEmbeddings();

  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client: supabase,
    tableName: 'faq_embeddings',
  });

  console.log('✅ FAQ embedded and stored in Supabase!');
}

run().catch(console.error);
