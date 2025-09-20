import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
  }
  
  const secret = process.env.RECAPTCHA_SECRET_KEY || '6LeWV1crAAAAAPGCVyC_Dp4uUc-azYawv2yiVh4X';
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const googleRes = await fetch(verifyUrl, { method: 'POST' });
  const data = await googleRes.json();
  
  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: data['error-codes'] });
  }
} 