import { createClient } from '@/lib/supabase/server';
import { BrowseClient } from '@/components/BrowseClient';
import type { Profile } from '@/lib/supabase/client';

export default async function BrowsePage() {
  const supabase = await createClient();

  const { data: actors } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'actor')
    .order('name', { ascending: true });

  return <BrowseClient actors={(actors as Profile[]) ?? []} />;
}
