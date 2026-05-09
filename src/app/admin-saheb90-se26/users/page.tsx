import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, suspended_at, delete_after, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#1a0000] border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
        <Logo size="sm" variant="light" href="/" />
        <div className="flex items-center gap-6">
          <Link href={`/${process.env.ADMIN_URL_SLUG}/dashboard`} className="text-sm text-slate-300 hover:text-amber-400">Dashboard</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/photos`} className="text-sm text-slate-300 hover:text-amber-400">Photo Moderation</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="text-sm text-amber-400 font-medium">Users</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-slate-400 text-sm mb-8">Suspend, reinstate, or permanently delete user accounts.</p>
        <UserManagementTable users={users ?? []} />
      </main>
    </div>
  );
}
