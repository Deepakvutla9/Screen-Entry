'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Clock, ArrowRight, Clapperboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CastingCall {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  role_description: string;
  age_range: string;
  location: string;
  budget?: string;
  deadline: string;
  created_at: string;
}

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'Closed';
  if (diff === 0) return 'Last day';
  return `${diff}d left`;
}

export function PublicFeedClient({ initialCalls }: { initialCalls: CastingCall[] }) {
  const [search, setSearch] = useState('');
  const [selectedCall, setSelectedCall] = useState<CastingCall | null>(null);

  const filtered = initialCalls.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.role_description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="relative py-20 px-6 text-center overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0000] via-[#1a0505] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Live Casting Feed</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">
            Open <span className="text-amber-400">Auditions</span>
          </h1>
          <p className="text-white/40 text-lg mb-8">
            Browse real casting calls from directors and producers. Sign up to apply in one click.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Search by role, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Clapperboard size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-medium">No casting calls found</p>
            <p className="text-white/20 text-sm mt-1">Try a different search or check back later</p>
          </div>
        ) : (
          <>
            <p className="text-white/30 text-sm mb-6">{filtered.length} casting call{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((call, i) => {
                const days = daysLeft(call.deadline);
                const isClosed = days === 'Closed';
                return (
                  <div
                    key={call.id}
                    onClick={() => !isClosed && setSelectedCall(call)}
                    className={`group relative rounded-2xl p-6 border flex flex-col transition-all duration-300 cursor-pointer
                      ${i === 0
                        ? 'bg-gradient-to-br from-[#8B1A1A] to-[#5C0808] border-transparent shadow-xl shadow-[#8B1A1A]/20 hover:shadow-2xl hover:shadow-[#8B1A1A]/30 hover:-translate-y-1'
                        : 'bg-white/[0.04] border-white/[0.07] hover:border-white/20 hover:-translate-y-0.5'
                      }
                      ${isClosed ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1
                          ${i === 0 ? 'bg-white/15 text-white/80' : 'bg-amber-500/10 text-amber-400'}`}>
                          <MapPin size={9} />{call.location}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1
                          ${isClosed
                            ? 'bg-red-500/10 text-red-400'
                            : i === 0 ? 'bg-white/10 text-white/60' : 'bg-white/[0.06] text-white/40'
                          }`}>
                          <Clock size={9} />{days}
                        </span>
                      </div>
                      <ArrowRight size={15} className={`transition-transform group-hover:translate-x-1 flex-shrink-0 mt-0.5
                        ${i === 0 ? 'text-white/40' : 'text-white/20 group-hover:text-amber-400'}`} />
                    </div>

                    <h3 className={`text-lg font-bold mb-2 leading-snug ${i === 0 ? 'text-white' : 'text-white/90'}`}>
                      {call.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 mb-5 leading-relaxed flex-1 ${i === 0 ? 'text-white/60' : 'text-white/40'}`}>
                      {call.role_description}
                    </p>

                    <div className={`pt-4 border-t flex items-center justify-between ${i === 0 ? 'border-white/15' : 'border-white/[0.07]'}`}>
                      <div>
                        <p className={`text-[9px] uppercase font-bold tracking-wider mb-0.5 ${i === 0 ? 'text-white/35' : 'text-white/25'}`}>Age Range</p>
                        <p className={`text-sm font-bold ${i === 0 ? 'text-amber-300' : 'text-amber-400'}`}>{call.age_range}</p>
                      </div>
                      {call.budget && (
                        <span className={`text-xs font-semibold ${i === 0 ? 'text-white/50' : 'text-white/35'}`}>{call.budget}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA for visitors */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#8B1A1A]/20 to-amber-900/10 border border-white/[0.07] p-10 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Want to apply for these roles?</h2>
          <p className="text-white/40 mb-8">Create your free actor profile and apply in one click. Directors will find you directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-12 px-8">
              <Link href="/signup">Create Free Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 text-white bg-transparent hover:bg-white/5 h-12 px-8">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setSelectedCall(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCall(null)} className="absolute top-5 right-5 text-white/30 hover:text-white">
              <X size={20} />
            </button>

            <Badge className="mb-4 bg-amber-500/15 text-amber-400 border-amber-500/20 uppercase tracking-widest text-[10px]">
              {selectedCall.location}
            </Badge>
            <h2 className="text-2xl font-black text-white mb-2">{selectedCall.title}</h2>
            <p className="text-white/40 text-sm mb-6 flex items-center gap-3">
              <span>Age: <strong className="text-amber-400">{selectedCall.age_range}</strong></span>
              {selectedCall.budget && <span>· Budget: <strong className="text-white/60">{selectedCall.budget}</strong></span>}
              <span>· Deadline: <strong className="text-white/60">{new Date(selectedCall.deadline).toLocaleDateString('en-IN')}</strong></span>
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1.5">Role Description</p>
                <p className="text-white/70 text-sm leading-relaxed">{selectedCall.role_description}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1.5">Project Details</p>
                <p className="text-white/70 text-sm leading-relaxed">{selectedCall.description}</p>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 text-center">
              <p className="text-white/50 text-sm mb-4">Sign up to apply for this role</p>
              <Button asChild className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-11">
                <Link href="/signup">Apply Now — It&apos;s Free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
