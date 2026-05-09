import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, Clock, CheckCircle2, ShieldAlert, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/Logo';

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalActors },
    { count: totalRecruiters },
    { count: suspended },
    { count: pendingPhotos },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'actor'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'recruiter'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
    supabase.from('photo_moderation').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('id, name, email, role, status, created_at').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: 'Total Users', value: totalUsers ?? 0, icon: Users, color: 'text-amber-400' },
    { label: 'Actors', value: totalActors ?? 0, icon: BarChart3, color: 'text-blue-400' },
    { label: 'Recruiters', value: totalRecruiters ?? 0, icon: BarChart3, color: 'text-green-400' },
    { label: 'Suspended', value: suspended ?? 0, icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Photos Pending', value: pendingPhotos ?? 0, icon: Clock, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#1a0000] border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
        <Logo size="sm" variant="light" href="/" />
        <div className="flex items-center gap-6">
          <Link href={`/${process.env.ADMIN_URL_SLUG}/dashboard`} className="text-sm text-amber-400 font-medium">Dashboard</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/photos`} className="text-sm text-slate-300 hover:text-amber-400">Photo Moderation</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="text-sm text-slate-300 hover:text-amber-400">Users</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {stats.map((s) => (
            <Card key={s.label} className="bg-[#1a0000] border-red-900/40 p-5">
              <s.icon size={20} className={`${s.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1a0000] border-red-900/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Signups</h2>
              <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="text-xs text-amber-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentUsers?.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 capitalize">{u.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#1a0000] border-red-900/40 p-6">
            <h2 className="font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href={`/${process.env.ADMIN_URL_SLUG}/photos`} className="flex items-center gap-3 p-3 rounded-lg bg-orange-900/20 border border-orange-900/40 hover:bg-orange-900/30 transition-colors">
                <Clock size={18} className="text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-white">Review Pending Photos</p>
                  <p className="text-xs text-slate-400">{pendingPhotos ?? 0} photos awaiting review</p>
                </div>
              </Link>
              <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/20 border border-blue-900/40 hover:bg-blue-900/30 transition-colors">
                <Users size={18} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Manage Users</p>
                  <p className="text-xs text-slate-400">Suspend, reinstate or delete accounts</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-900/20 border border-green-900/40">
                <CheckCircle2 size={18} className="text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">All Systems Operational</p>
                  <p className="text-xs text-slate-400">screenentry.com is live</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
