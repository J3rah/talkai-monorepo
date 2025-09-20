import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    // Make request to Hume API for audio reconstruction
    const response = await fetch(`https://api.hume.ai/v0/evi/chats/${chatId}/audio`, {
      method: 'GET',
      headers: {
        'X-Hume-Api-Key': process.env.HUME_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hume API error:', response.status, errorText);
      
      if (response.status === 406) {
        return NextResponse.json(
          { error: 'Chat not found or not accessible. This may be due to permissions or the chat ID not being associated with your API key.' },
          { status: 406 }
        );
      }
      
      return NextResponse.json(
        { error: `Hume API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in audio reconstruction API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 