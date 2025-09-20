import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QueryRequest {
  query: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as QueryRequest;
    const { query } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('Processing query:', query);

    const embeddings = new OpenAIEmbeddings();
    console.log('Initialized OpenAI embeddings');

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
      client: supabase,
      tableName: 'faq_embeddings',
      queryName: 'match_faq'
    });
    console.log('Initialized vector store');

    // Get the embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    console.log('Generated query embedding');

    // Call the match_faq function directly
    const { data: results, error } = await supabase.rpc('match_faq', {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.5,
      match_count: 1
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw error;
    }

    console.log('Search results:', results);

    if (!results || results.length === 0) {
      return NextResponse.json({ 
        match: "I'm sorry, I couldn't find a specific answer to your question. Could you please try rephrasing your question or ask something else?",
        noMatch: true
      });
    }

    const match = results[0].answer;
    return NextResponse.json({ 
      match,
      question: results[0].question,
      similarity: results[0].similarity
    });
  } catch (error: any) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search FAQs',
        details: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
} 