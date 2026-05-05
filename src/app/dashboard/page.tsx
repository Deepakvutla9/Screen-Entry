import { requireProfile } from '@/lib/auth';
import { DashboardClient } from '@/components/DashboardClient';

export default async function DashboardPage() {
  const profile = await requireProfile();
  return <DashboardClient profile={profile} />;
}
