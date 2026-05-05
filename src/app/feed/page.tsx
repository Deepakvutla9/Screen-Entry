import { requireProfile } from '@/lib/auth';
import { CastingFeedClient } from '@/components/CastingFeedClient';

export default async function FeedPage() {
  const profile = await requireProfile();
  return <CastingFeedClient profile={profile} />;
}
