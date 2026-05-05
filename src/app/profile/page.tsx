import { requireProfile } from '@/lib/auth';
import { ProfileClient } from '@/components/ProfileClient';

export default async function ProfilePage() {
  const profile = await requireProfile();
  return <ProfileClient profile={profile} />;
}
