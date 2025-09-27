import { NextResponse } from 'next/server';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('🔑 Access token route called');
    console.log('🔍 Environment check:', {
      hasApiKey: !!process.env.HUME_API_KEY,
      hasSecretKey: !!process.env.HUME_SECRET_KEY,
      apiKeyLength: process.env.HUME_API_KEY?.length || 0,
      secretKeyLength: process.env.HUME_SECRET_KEY?.length || 0
    });

    if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
      console.error('❌ Missing API credentials');
      return NextResponse.json({ 
        error: 'Missing API credentials. Please check your environment variables.' 
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    console.log('📡 Getting Hume access token using official SDK...');
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
      console.error('❌ Failed to get access token - returned null');
      return NextResponse.json({ 
        error: 'Failed to get access token from Hume. Please try again.' 
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    console.log('✅ Successfully got access token');
    return NextResponse.json({ accessToken }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('❌ Error in access token API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error. Please try again.' 
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 