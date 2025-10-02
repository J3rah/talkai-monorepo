import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

function parseTherapistFeedback(content: string): string[] {
  // Split by double newlines to get major sections
  const sections = content.split(/\n\s*\n/).filter(section => section.trim().length > 0);
  
  const feedback: string[] = [];
  
  for (const section of sections) {
    const trimmedSection = section.trim();
    
    // Check if this is a section header (like "Temas Clave:", "Patrones Emocionales:", etc.)
    if (trimmedSection.match(/^[A-Za-z\s]+:$/)) {
      // This is a section header, add it as a heading
      feedback.push(trimmedSection);
    } else {
      // This is content, split by lines and clean up
      const lines = trimmedSection
        .split(/\n/)
        .map(line => {
          // Remove bullet points, dashes, and asterisks from the beginning
          return line.replace(/^[\s]*[•\-\*]\s*/, '').trim();
        })
        .filter(line => line.length > 0);
      
      feedback.push(...lines);
    }
  }
  
  return feedback;
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, max_tokens = 800 } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // Build transcript (role: content)
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'Cliente' : 'Terapeuta'}: ${m.content}`)
      .join('\n');

    const prompt = `Eres un terapeuta experimentado revisando tus notas de sesión privadas. Lee la siguiente transcripción de conversación con un cliente. Resume los temas clave que observaste, anota cualquier patrón emocional, y proporciona 3-5 piezas de retroalimentación de apoyo y acción que el cliente puede reflexionar antes de su próxima sesión.\n\nTranscripción:\n${transcript}\n\nNotas del Terapeuta:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens,
      temperature: 0.7,
      messages: [{ role: 'system', content: prompt }],
    });

    const content = completion.choices?.[0]?.message?.content || '';
    
    // Parse the content to extract structured feedback
    const feedback = parseTherapistFeedback(content);

    return NextResponse.json({ feedback });
  } catch (err: any) {
    console.error('generate-feedback error:', err);
    return NextResponse.json({ error: err.message || 'internal error' }, { status: 500 });
  }
}
