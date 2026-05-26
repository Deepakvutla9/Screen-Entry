import { createClient } from '@/lib/supabase/server';
import { BrowseClient } from '@/components/BrowseClient';
import type { Profile } from '@/lib/supabase/client';

const PAGE_SIZE = 20;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? '1'));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data: actors, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'actor')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <BrowseClient
      actors={(actors as Profile[]) ?? []}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={count ?? 0}
    />
  );
}
