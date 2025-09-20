// app/api/agent/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import composioClient from '@/lib/composio';
import openai from '@/lib/openai';
import { get_faq_privacy_terms_disclaimer } from '@/lib/composioCustomTools';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';

const faqToolSchema = {
  type: 'function' as const,
  function: {
    name: 'get_faq_privacy_terms_disclaimer',
    description: 'Returns the official and up-to-date information about TalkAI, including what TalkAI is, its FAQ, Privacy Policy, Terms of Service, and Disclaimer, directly from the website. Use this tool to answer any questions about TalkAI, its company, its services, or its policies.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
};

const SYSTEM_PROMPT = `
You are a helpful assistant for TalkAI. If the user asks anything about TalkAI, its company, what it is, its FAQ, privacy policy, terms of service, or disclaimer, always use the get_faq_privacy_terms_disclaimer tool to answer. Do not answer from your own knowledge if the tool is available.`;

export async function POST(req: NextRequest) {
  try {
    const { userId, messages: history } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json(
        { error: 'Conversation history ("messages") is required and must be a non-empty array.' },
        { status: 400 }
      );
    }

    // Ensure the last message is from the user so we can reference it later (especially for the FAQ follow-up)
    const lastUserMessage = [...history].reverse().find((m: any) => m?.role === 'user');

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'The last user message could not be determined from the provided history.' },
        { status: 400 }
      );
    }

    // 1. Fetch composio tools for the user (e.g., Gmail)
    const allTools = await composioClient.tools.get();
    const composioTools = allTools.filter((tool: any) => tool.toolkit.slug === 'GMAIL') as ChatCompletionTool[];

    // 2. Add the custom FAQ tool to the tools array
    const tools: ChatCompletionTool[] = [
      ...composioTools,
      faqToolSchema as ChatCompletionTool,
    ];

    // 3. Prepare the OpenAI chat completion call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        // append the conversation history as-is so that GPT retains context
        ...history,
      ],
      tools,
    });

    // 4. If OpenAI requests the custom tool, call it and return the result
    const toolCalls = completion.choices?.[0]?.message?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      for (const call of toolCalls) {
        if ((call as any).function?.name === 'get_faq_privacy_terms_disclaimer') {
          const result = await get_faq_privacy_terms_disclaimer();
          // Compose a context string from the markdown content
          const context =
            'FAQ:\n' + result.faq + '\n\n' +
            'Privacy Policy:\n' + result.privacy + '\n\n' +
            'Terms of Service:\n' + result.terms + '\n\n' +
            'Disclaimer:\n' + result.disclaimer;
          // Ask OpenAI to answer the user's question using only this context
          const followup = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant for TalkAI. Answer the user\'s question using ONLY the following official information. Be concise, friendly, and conversational. If the answer is not in the info, say you don\'t know.\n\n' + context,
              },
              {
                role: 'user',
                content: lastUserMessage.content,
              },
            ],
          });
          const contentRaw = followup.choices?.[0]?.message?.content || '(no response)';
          const fallback = [
            "I don't know",
            "I'm not sure",
            "Sorry, I don't have that information",
            "(no response)",
          ];
          const content = fallback.some(f => contentRaw?.toLowerCase().includes(f.toLowerCase()))
            ? "I'm sorry, I don't have information about that yet. If you have a specific question, feel free to ask, or contact our support team for more details!"
            : contentRaw;
          return NextResponse.json({
            completion: {
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content,
                  },
                },
              ],
            },
          });
        }
      }
    }

    // 5. Return the LLM’s response
    return NextResponse.json({ completion });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}