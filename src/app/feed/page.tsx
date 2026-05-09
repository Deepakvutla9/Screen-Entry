import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { CastingFeedClient } from '@/components/CastingFeedClient';

export default async function FeedPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: calls }, { data: applications }] = await Promise.all([
    supabase.from('casting_calls').select('*').order('created_at', { ascending: false }),
    supabase.from('applications').select('casting_call_id').eq('actor_id', profile.id),
  ]);

  const appliedIds = (applications ?? []).map((a) => a.casting_call_id);

  return (
    <CastingFeedClient
      profile={profile}
      initialCalls={calls ?? []}
      appliedIds={appliedIds}
    />
  );
}
