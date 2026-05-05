'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getCastingCalls, applyToCall, getApplicationsForActor } from '@/lib/store';
import type { Profile } from '@/lib/supabase/client';
import type { Application, CastingCall } from '@/types';

export function CastingFeedClient({ profile }: { profile: Profile }) {
  const [calls, setCalls] = useState<CastingCall[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCalls(getCastingCalls());
    setApplications(getApplicationsForActor(profile.id));
  }, [profile.id]);

  const handleApply = (callId: string) => {
    applyToCall(callId, profile.id);
    setApplications(getApplicationsForActor(profile.id));
  };

  const filtered = calls.filter((c) =>
    [c.title, c.location, c.description].join(' ').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Active Casting Calls</h2>
          <p className="text-slate-500 mt-1">Explore current opportunities across the industry.</p>
        </div>
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a3a5f]" />
          <Input
            type="text"
            placeholder="Search roles, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500">No casting calls match your search.</p>
          </div>
        ) : (
          filtered.map((call) => {
            const hasApplied = applications.some((a) => a.castingCallId === call.id);
            return (
              <Card key={call.id} className="hover:border-[#1a3a5f]/30 transition-all group p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1a3a5f] transition-colors">{call.title}</h3>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{call.budget || 'Open Budget'}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {call.location}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> Age: {call.ageRange}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Due: {new Date(call.deadline).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed mb-4">{call.description}</p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role Detail</p>
                      <p className="text-sm text-slate-700">{call.roleDescription}</p>
                    </div>
                  </div>
                  <div className="md:w-40 flex md:flex-col items-center justify-center gap-3">
                    {profile.role === 'actor' ? (
                      <Button
                        className="w-full bg-[#1a3a5f] hover:bg-[#0d2138]"
                        variant={hasApplied ? 'ghost' : 'default'}
                        disabled={hasApplied}
                        onClick={() => handleApply(call.id)}
                      >
                        {hasApplied ? (
                          <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Applied</span>
                        ) : 'Apply Now'}
                      </Button>
                    ) : (
                      <p className="text-xs text-center text-slate-400 italic">Login as Actor to apply</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
