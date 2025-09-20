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

    console.log('🔚 Attempting to close chat group:', chatGroupId);

    // First, try to get the chat group details to see if it exists and is active
    const checkResponse = await fetch(`https://api.hume.ai/v0/evi/chat_groups/${chatGroupId}`, {
      method: 'GET',
      headers: {
        'X-Hume-Api-Key': process.env.HUME_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    if (!checkResponse.ok) {
      console.log('❌ Chat group not found or already closed:', checkResponse.status);
      if (checkResponse.status === 404) {
        return NextResponse.json(
          { success: true, message: 'Chat group not found (likely already closed)' },
          { status: 200 }
        );
      }
      
      const errorText = await checkResponse.text();
      console.error('Hume API error checking chat group:', checkResponse.status, errorText);
      return NextResponse.json(
        { error: `Failed to check chat group status: ${checkResponse.status}` },
        { status: checkResponse.status }
      );
    }

    const chatGroupData = await checkResponse.json();
    console.log('📊 Chat group status:', chatGroupData);

    // If the chat group exists, try to close it by ending any active chats
    // Note: Hume doesn't have a direct "close chat group" endpoint, but we can try to end active chats
    
    // Get all chats in this chat group
    const chatsResponse = await fetch(`https://api.hume.ai/v0/evi/chats?chat_group_id=${chatGroupId}`, {
      method: 'GET',
      headers: {
        'X-Hume-Api-Key': process.env.HUME_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    if (chatsResponse.ok) {
      const chatsData = await chatsResponse.json();
      console.log('💬 Found chats in group:', chatsData);
      
      // Handle the pagination structure from Hume API
      const chats = chatsData.chats_page || chatsData || [];
      
      // Check if there are any active chats
      const activeChats = Array.isArray(chats) ? 
        chats.filter((chat: any) => chat.status === 'ACTIVE' || !chat.end_timestamp) : 
        [];
      
      if (activeChats.length > 0) {
        console.log('⚠️ Found active chats that may be preventing resumption:', activeChats.length);
        // Unfortunately, Hume doesn't provide a direct way to force-close active chats
        // The best we can do is wait for them to timeout naturally
        return NextResponse.json({
          success: false,
          message: 'Chat group has active chats that need to timeout naturally',
          activeChats: activeChats.length,
          recommendation: 'Wait 60-120 seconds for server cleanup, then retry'
        });
      } else {
        console.log('✅ No active chats found in group');
        return NextResponse.json({
          success: true,
          message: 'Chat group appears to be properly closed'
        });
      }
    } else {
      console.log('⚠️ Could not fetch chats for group, but group exists');
      return NextResponse.json({
        success: true,
        message: 'Chat group exists but chat details unavailable - may be safe to resume'
      });
    }

  } catch (error) {
    console.error('Error in close chat group API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 