'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Invalid or expired reset link. Please request a new one.');
      setReady(true);
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setError('This reset link has expired or already been used. Please request a new one.');
      }
      setReady(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  if (!ready) {
    return (
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <Loader2 size={32} className="animate-spin text-[#1a3a5f]" />
        <p className="text-sm">Verifying your reset link…</p>
      </div>
    );
  }

  if (done) {
    return (
      <Card className="p-10 max-w-md w-full text-center shadow-2xl">
        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Password updated!</h2>
        <p className="text-slate-500">Redirecting you to your dashboard…</p>
      </Card>
    );
  }

  return (
    <div className="max-w-md w-full">
      <Card className="p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
          <p className="text-slate-500 mt-2">Choose a strong password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="password" className="mb-1.5">New Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm" className="mb-1.5">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              required
              minLength={6}
              placeholder="Repeat your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
              {(error.includes('expired') || error.includes('Invalid')) && (
                <p className="mt-2">
                  <a href="/forgot-password" className="font-semibold underline">
                    Request a new reset link →
                  </a>
                </p>
              )}
            </div>
          )}
          {!error && (
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-[#1a3a5f] hover:bg-[#0d2138]"
            >
              {loading ? 'Updating…' : 'Update Password'}
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={32} className="animate-spin text-[#1a3a5f]" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
