import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PublicActorProfile } from '@/components/PublicActorProfile';
import type { Profile } from '@/lib/supabase/client';

export default async function ActorPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: actor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'actor')
    .single();

  if (!actor) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let viewerRole: string | null = null;
  if (user) {
    const { data: viewerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    viewerRole = viewerProfile?.role ?? null;
  }

  return <PublicActorProfile profile={actor as Profile} viewerRole={viewerRole} />;
}
