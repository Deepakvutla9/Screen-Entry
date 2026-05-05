'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCastingCalls, getApplications, updateApplicationStatus } from '@/lib/store';
import { FEATURED_ACTORS } from '@/lib/data';
import type { Profile } from '@/lib/supabase/client';
import type { Application, ActorProfile, CastingCall } from '@/types';

type Applicant = Application & { actor: ActorProfile | undefined };

export function ApplicantsClient({ callId, viewer }: { callId: string; viewer: Profile }) {
  const [call, setCall] = useState<CastingCall | undefined>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  const refresh = () => {
    const calls = getCastingCalls();
    setCall(calls.find((c) => c.id === callId));
    const apps = getApplications().filter((a) => a.castingCallId === callId);
    const enriched = apps.map((a) => ({
      ...a,
      actor: FEATURED_ACTORS.find((x) => x.id === a.actorId),
    }));
    setApplicants(enriched);
  };

  useEffect(() => {
    refresh();
  }, [callId]);

  // Recruiters only — non-recruiters see empty state
  if (viewer.role !== 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <Card className="p-12 text-center">
          <p className="text-slate-500">Only recruiters can view applicants.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Applicants for: {call?.title}</h2>
      <p className="text-slate-500 mb-8">{applicants.length} people have applied to this role.</p>

      {applicants.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">No applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applicants.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[#1a3a5f] text-xl font-bold">
                  {app.actor?.name[0] || '?'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{app.actor?.name || 'Unknown actor'}</h4>
                  <p className="text-sm text-slate-500">{app.actor?.location} • {app.actor?.age} years</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {app.actor?.skills?.map((s) => (
                  <Badge key={s} className="bg-slate-100 text-slate-600 border-slate-200">{s}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-sm py-2">View Reel</Button>
                {app.status === 'shortlisted' ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 flex items-center justify-center flex-1">Shortlisted</Badge>
                ) : (
                  <Button
                    className="flex-1 text-sm py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => { updateApplicationStatus(app.id, 'shortlisted'); refresh(); }}
                  >
                    Shortlist
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
