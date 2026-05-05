'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, User as UserIcon, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'actor' | 'recruiter'>('actor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      if (data.user) setSignupDone(true);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  if (signupDone) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
        <Card className="p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
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
        <Card className="p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {mode === 'login' ? (
                <>Don&apos;t have an account?{' '}
                  <a href="/signup" className="text-[#1a3a5f] font-semibold hover:underline">Sign up</a>
                </>
              ) : (
                <>Already have an account?{' '}
                  <a href="/login" className="text-[#1a3a5f] font-semibold hover:underline">Sign in</a>
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
                  <a href="/forgot-password" className="text-xs text-[#1a3a5f] font-medium hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <Input id="password" type="password" required minLength={6} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {mode === 'signup' && (
              <div>
                <Label className="mb-1.5">I am joining as</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button type="button" onClick={() => setRole('actor')} className={cn('py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all', role === 'actor' ? 'border-[#1a3a5f] bg-[#1a3a5f]/5' : 'border-slate-100 hover:border-slate-200')}>
                    <UserIcon size={20} className={role === 'actor' ? 'text-[#1a3a5f]' : 'text-slate-400'} />
                    <span className={cn('text-sm font-bold', role === 'actor' ? 'text-[#1a3a5f]' : 'text-slate-600')}>Actor</span>
                  </button>
                  <button type="button" onClick={() => setRole('recruiter')} className={cn('py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all', role === 'recruiter' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 hover:border-slate-200')}>
                    <Briefcase size={20} className={role === 'recruiter' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className={cn('text-sm font-bold', role === 'recruiter' ? 'text-emerald-600' : 'text-slate-600')}>Recruiter</span>
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-12 text-lg mt-4 bg-[#1a3a5f] hover:bg-[#0d2138] shadow-lg shadow-[#1a3a5f]/10">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Get Started'}
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full h-12 flex items-center justify-center gap-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-50">
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
