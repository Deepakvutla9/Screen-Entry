'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
        <Card className="p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle2 size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-6">
            We sent a password reset link to <strong>{email}</strong>. Click it to set a new password.
          </p>
          <Link href="/login" className="text-sm text-[#8B1A1A] font-semibold hover:underline flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <Card className="p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Forgot your password?</h2>
            <p className="text-slate-500 mt-2">Enter your email and we&apos;ll send you a reset link.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-1.5">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-[#8B1A1A] hover:bg-[#5C0808]"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </form>
          <p className="text-center mt-6">
            <Link href="/login" className="text-sm text-[#8B1A1A] font-semibold hover:underline flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
