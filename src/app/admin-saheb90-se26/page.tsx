'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRef } from 'react';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const supabase = useRef(createClient()).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [step, setStep] = useState<'login' | 'key'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError(signInError.message); setLoading(false); return; }
    setStep('key');
    setLoading(false);
  };

  const handleKeyVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: adminKey }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Invalid key'); setLoading(false); return; }
    window.location.href = data.redirect;
  };

  return (
    <div className="min-h-screen bg-[#0D0000] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="md" variant="light" href="/" />
        </div>
        <Card className="p-8 bg-[#1a0000] border-red-900/40">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-amber-400" />
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
          </div>

          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300 mb-1.5">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/40 border-red-900/40 text-white" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300 mb-1.5">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/40 border-red-900/40 text-white" placeholder="••••••••" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleKeyVerify} className="space-y-4">
              <p className="text-slate-400 text-sm">Enter your admin secret key to proceed.</p>
              <div>
                <Label htmlFor="adminKey" className="text-slate-300 mb-1.5">Admin Secret Key</Label>
                <Input id="adminKey" type="password" required value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="bg-black/40 border-red-900/40 text-white font-mono" placeholder="••••••••••••••••••" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Enter Admin Panel'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
