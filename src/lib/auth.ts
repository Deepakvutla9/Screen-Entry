import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import type { Profile } from './supabase/client';

export async function requireProfile(): Promise<Profile> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/login');
  return profile as Profile;
}
