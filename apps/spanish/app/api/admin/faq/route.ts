import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const embeddings = new OpenAIEmbeddings();

export async function GET() {
  const { data, error } = await supabase
    .from('faq_embeddings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { question, answer } = await request.json();

  // Generate embedding for the FAQ
  const embedding = await embeddings.embedQuery(question + ' ' + answer);

  const { data, error } = await supabase
    .from('faq_embeddings')
    .insert([
      {
        question,
        answer,
        embedding
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { id, question, answer } = await request.json();

  // Generate new embedding for the updated FAQ
  const embedding = await embeddings.embedQuery(question + ' ' + answer);

  const { data, error } = await supabase
    .from('faq_embeddings')
    .update({ question, answer, embedding })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { error } = await supabase
    .from('faq_embeddings')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 