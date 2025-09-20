import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { chatGroupId } = await request.json();

    if (!chatGroupId) {
      return NextResponse.json(
        { error: 'Chat Group ID is required' },
        { status: 400 }
      );
    }

    // Make request to Hume API for chat group audio reconstruction
    const response = await fetch(`https://api.hume.ai/v0/evi/chat_groups/${chatGroupId}/audio`, {
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
          { error: 'Chat Group not found or not accessible. This may be due to permissions or the chat group ID not being associated with your API key.' },
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
    console.error('Error in chat group audio reconstruction API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 