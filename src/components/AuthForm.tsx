'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, User as UserIcon, Briefcase, KeyRound, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const supabase = useRef(createClient()).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'actor' | 'recruiter' | 'director'>('actor');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role, inviteCode }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? 'Signup failed.'); setLoading(false); return; }
        setSignupDone(true);
        setLoading(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { setError(signInError.message); setLoading(false); return; }
        window.location.href = '/dashboard';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (signupDone) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
        <Card className="p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle2 size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Logo size="md" variant="dark" />
        </div>
        <Card className="p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {mode === 'login' ? (
                <>Don&apos;t have an account?{' '}
                  <a href="/signup" className="text-[#8B1A1A] font-semibold hover:underline">Sign up</a>
                </>
              ) : (
                <>Already have an account?{' '}
                  <a href="/login" className="text-[#8B1A1A] font-semibold hover:underline">Sign in</a>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="name" className="mb-1.5">Full Name</Label>
                <Input id="name" type="text" required placeholder="e.g. Rahul Verma" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-1.5">Email Address</Label>
              <Input id="email" type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <a href="/forgot-password" className="text-xs text-[#8B1A1A] font-medium hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <Input id="password" type="password" required minLength={6} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <Label className="mb-1.5">I am joining as</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button type="button" onClick={() => setRole('actor')} className={cn('py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all', role === 'actor' ? 'border-[#8B1A1A] bg-[#8B1A1A]/5' : 'border-slate-100 hover:border-slate-200')}>
                      <UserIcon size={20} className={role === 'actor' ? 'text-[#8B1A1A]' : 'text-slate-400'} />
                      <span className={cn('text-sm font-bold', role === 'actor' ? 'text-[#8B1A1A]' : 'text-slate-600')}>Actor</span>
                    </button>
                    <button type="button" onClick={() => setRole('director')} className={cn('py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all', role === 'director' ? 'border-purple-600 bg-purple-50' : 'border-slate-100 hover:border-slate-200')}>
                      <Film size={20} className={role === 'director' ? 'text-purple-600' : 'text-slate-400'} />
                      <span className={cn('text-sm font-bold', role === 'director' ? 'text-purple-600' : 'text-slate-600')}>Director</span>
                    </button>
                    <button type="button" onClick={() => setRole('recruiter')} className={cn('py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all', role === 'recruiter' ? 'border-amber-600 bg-amber-50' : 'border-slate-100 hover:border-slate-200')}>
                      <Briefcase size={20} className={role === 'recruiter' ? 'text-amber-600' : 'text-slate-400'} />
                      <span className={cn('text-sm font-bold', role === 'recruiter' ? 'text-amber-600' : 'text-slate-600')}>Recruiter</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="inviteCode" className="mb-1.5 flex items-center gap-1.5">
                    <KeyRound size={14} className="text-amber-600" /> Invite Code
                  </Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    required
                    placeholder="Enter your invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="font-mono tracking-widest"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">Screen Entry is currently invite-only. Contact us to get access.</p>
                </div>
              </>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-12 text-lg mt-4 bg-[#8B1A1A] hover:bg-[#5C0808] shadow-lg shadow-[#8B1A1A]/10">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Get Started'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
