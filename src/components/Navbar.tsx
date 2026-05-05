'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient, type Profile } from '@/lib/supabase/client';

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setProfile(null); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    }
    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => loadProfile());
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="bg-[#1a3a5f] text-white p-1.5 rounded-lg">
          <Star size={20} fill="currentColor" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#1a3a5f]">
          Screen <span className="text-emerald-600">Entry</span>
        </h1>
      </Link>
      <div className="flex items-center gap-6">
        {profile ? (
          <>
            <Link href="/feed" className="text-sm font-medium text-slate-600 hover:text-[#1a3a5f]">
              Casting Feed
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#1a3a5f]">
              Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-500 capitalize">{profile.role}</p>
              </div>
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#1a3a5f]"
              >
                <UserIcon size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#1a3a5f]">
              Sign In
            </Link>
            <Button asChild className="bg-[#1a3a5f] text-white hover:bg-[#0d2138]">
              <Link href="/signup">Join Now</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
