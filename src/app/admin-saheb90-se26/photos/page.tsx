import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { PhotoModerationQueue } from '@/components/admin/PhotoModerationQueue';

export default async function AdminPhotosPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from('photo_moderation')
    .select('*, profiles(name, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#1a0000] border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
        <Logo size="sm" variant="light" href="/" />
        <div className="flex items-center gap-6">
          <Link href={`/${process.env.ADMIN_URL_SLUG}/dashboard`} className="text-sm text-slate-300 hover:text-amber-400">Dashboard</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/photos`} className="text-sm text-amber-400 font-medium">Photo Moderation</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="text-sm text-slate-300 hover:text-amber-400">Users</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Photo Moderation</h1>
        <p className="text-slate-400 text-sm mb-8">Review and approve or reject photos uploaded by users. Must be reviewed within 36 hours (IT Rules 2021).</p>
        <PhotoModerationQueue pending={pending ?? []} />
      </main>
    </div>
  );
}
