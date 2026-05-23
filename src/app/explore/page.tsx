import { createClient } from '@/lib/supabase/server';
import { PublicFeedClient } from '@/components/PublicFeedClient';

export default async function ExplorePage() {
  const supabase = await createClient();

  const { data: calls } = await supabase
    .from('casting_calls')
    .select('*')
    .order('created_at', { ascending: false });

  return <PublicFeedClient initialCalls={calls ?? []} />;
}
