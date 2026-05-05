import { requireProfile } from '@/lib/auth';
import { ApplicantsClient } from '@/components/ApplicantsClient';

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile();
  const { id } = await params;
  return <ApplicantsClient callId={id} viewer={profile} />;
}
