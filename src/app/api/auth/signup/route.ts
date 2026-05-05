import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password, name, role, inviteCode } = await request.json();

  const validCode = process.env.INVITE_CODE;
  if (!validCode || inviteCode?.trim() !== validCode.trim()) {
    return NextResponse.json({ error: 'Invalid invite code. Please contact us to get access.' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user: data.user });
}
