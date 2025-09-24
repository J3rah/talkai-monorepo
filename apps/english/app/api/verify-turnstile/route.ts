import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json();
  
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
  }
  
  const secret = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return NextResponse.json({ success: false, error: 'Turnstile not configured' }, { status: 500 });
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Turnstile verification failed:', data['error-codes']);
      return NextResponse.json({ 
        success: false, 
        error: data['error-codes'] || ['Unknown error'] 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Verification service unavailable' 
    }, { status: 500 });
  }
}
