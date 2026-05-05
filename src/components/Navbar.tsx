'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { createClient, type Profile } from '@/lib/supabase/client';

export function Navbar() {
  const supabase = createClient();
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
    try {
      await supabase.auth.signOut();
    } catch (_) {
      // ignore errors — proceed to redirect regardless
    }
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0000]/95 backdrop-blur-md border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
      <Logo size="sm" variant="light" href="/" />
      <div className="flex items-center gap-6">
        {profile ? (
          <>
            <Link href="/feed" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Casting Feed
            </Link>
            <Link href="/browse" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Browse Talent
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              My Profile
            </Link>
            <div className="h-6 w-px bg-red-900/40" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{profile.name}</p>
                <p className="text-xs text-slate-400 capitalize">{profile.role}</p>
              </div>
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center text-amber-400"
              >
                <UserIcon size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-900/40 transition-colors"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Sign In
            </Link>
            <Button asChild className="bg-amber-500 text-white hover:bg-amber-600 border-none">
              <Link href="/signup">Join Now</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
