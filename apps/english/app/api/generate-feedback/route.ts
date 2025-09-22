import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, max_tokens = 800 } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // Build transcript (role: content)
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'Client' : 'Therapist'}: ${m.content}`)
      .join('\n');

    const prompt = `You are an experienced therapist reviewing your private session notes. Read the following conversation transcript with a client. Summarize key themes you observed, note any emotional patterns, and provide 3-5 supportive, actionable pieces of feedback the client can reflect on before their next session.\n\nTranscript:\n${transcript}\n\nTherapist Notes:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens,
      temperature: 0.7,
      messages: [{ role: 'system', content: prompt }],
    });

    const content = completion.choices?.[0]?.message?.content || '';
    const lines = content
      .split(/\n|•|-|\*/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return NextResponse.json({ feedback: lines });
  } catch (err: any) {
    console.error('generate-feedback error:', err);
    return NextResponse.json({ error: err.message || 'internal error' }, { status: 500 });
  }
}
