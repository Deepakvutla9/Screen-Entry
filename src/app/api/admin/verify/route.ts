import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminKey, ADMIN_EMAILS, ADMIN_SLUG } from '@/lib/admin';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { key } = await request.json();
  if (!verifyAdminKey(key)) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true, redirect: `/${ADMIN_SLUG}/dashboard` });
  response.cookies.set('admin_verified', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return response;
}
