/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'actor' | 'recruiter';

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
  created_at: string;
  updated_at: string;
}
