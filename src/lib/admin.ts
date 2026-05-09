import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

const ADMIN_SLUG = process.env.ADMIN_URL_SLUG!;
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY!;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim());

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/');
  }

  const cookieStore = await cookies();
  const verified = cookieStore.get('admin_verified')?.value;
  if (verified !== 'true') {
    redirect(`/${ADMIN_SLUG}`);
  }

  return user;
}

export function verifyAdminKey(key: string) {
  return key === ADMIN_KEY;
}

export { ADMIN_SLUG, ADMIN_EMAILS };
