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

  return {
    id: profile.user_id,
    name: profile.full_name ?? profile.username ?? 'User',
    email: user.email ?? '',
    role: profile.role,
    location: profile.location ?? '',
    age: profile.age_range ?? undefined,
    height: profile.height ?? undefined,
    skills: [],
    languages: [],
    video_reel: undefined,
    company_name: undefined,
    profile_photo: undefined,
    photos: [],
    instagram: profile.instagram_url ?? undefined,
    twitter: undefined,
    youtube: undefined,
    website: profile.website ?? undefined,
  } as Profile;
}
