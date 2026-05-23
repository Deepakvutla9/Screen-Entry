import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AdminArticlesClient } from '@/components/AdminArticlesClient';

export default async function AdminArticlesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#1a0000] border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
        <Logo size="sm" variant="light" href="/" />
        <div className="flex items-center gap-6">
          <Link href={`/${process.env.ADMIN_URL_SLUG}/dashboard`} className="text-sm text-slate-300 hover:text-amber-400">Dashboard</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/photos`} className="text-sm text-slate-300 hover:text-amber-400">Photo Moderation</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/users`} className="text-sm text-slate-300 hover:text-amber-400">Users</Link>
          <Link href={`/${process.env.ADMIN_URL_SLUG}/articles`} className="text-sm text-amber-400 font-medium">Articles</Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <AdminArticlesClient articles={articles ?? []} />
      </main>
    </div>
  );
}
