import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type UserRole = 'actor' | 'recruiter' | 'director';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  age?: number;
  height?: string;
  skills: string[];
  languages: string[];
  video_reel?: string;
  company_name?: string;
  profile_photo?: string;
  photos?: string[];
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}
