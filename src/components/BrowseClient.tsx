'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Profile } from '@/lib/supabase/client';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function BrowseClient({
  profiles,
  activeRole,
  currentPage,
  totalPages,
  totalCount,
}: {
  profiles: Profile[];
  activeRole: 'actor' | 'recruiter';
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');

  const allLanguages = Array.from(
    new Set(profiles.flatMap((p) => p.languages ?? []))
  ).sort();

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.location ?? '').toLowerCase().includes(q) ||
      (p.skills ?? []).some((s) => s.toLowerCase().includes(q)) ||
      (p.company_name ?? '').toLowerCase().includes(q);
    const matchLang =
      !filterLang || (p.languages ?? []).includes(filterLang);
    return matchSearch && matchLang;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505] py-14 px-6 text-white text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Browse Talent</h1>
        <p className="text-slate-300 text-lg">
          {totalCount} {activeRole}{totalCount !== 1 ? 's' : ''} on Screen Entry
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Role Tabs */}
        <div className="flex gap-2 mb-8">
          <a
            href="/browse?role=actor"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
              activeRole === 'actor'
                ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#8B1A1A]/40'
            }`}
          >
            <Users size={15} /> Actors
          </a>
          <a
            href="/browse?role=recruiter"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
              activeRole === 'recruiter'
                ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#8B1A1A]/40'
            }`}
          >
            <Briefcase size={15} /> Recruiters
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={activeRole === 'actor' ? 'Search by name, location or skill…' : 'Search by name, company or location…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          {activeRole === 'actor' && (
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
            >
              <option value="">All Languages</option>
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing <span className="font-semibold text-slate-800">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
          {search && <> for &ldquo;<span className="text-[#8B1A1A]">{search}</span>&rdquo;</>}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No {activeRole}s found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : activeRole === 'actor' ? (
          /* Actor Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((actor) => {
              const photo = actor.profile_photo || (actor.photos ?? [])[0];
              return (
                <Link key={actor.id} href={`/actors/${actor.id}`}>
                  <Card className="group overflow-hidden p-0 border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden relative bg-slate-100">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={actor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B1A1A]/10 to-amber-50">
                          <Avatar className="w-20 h-20">
                            <AvatarFallback className="bg-[#8B1A1A] text-white text-2xl font-bold">
                              {initials(actor.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      {actor.age && (
                        <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          {actor.age} yrs
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#8B1A1A] transition-colors">
                        {actor.name}
                      </h4>
                      {actor.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />{actor.location}
                        </p>
                      )}
                      {actor.height && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{actor.height}</p>
                      )}
                      {(actor.languages ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(actor.languages ?? []).slice(0, 2).map((lang) => (
                            <Badge key={lang} variant="secondary" className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-600 border-0">
                              {lang}
                            </Badge>
                          ))}
                          {(actor.languages ?? []).length > 2 && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-500 border-0">
                              +{(actor.languages ?? []).length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      {(actor.skills ?? []).length > 0 && (
                        <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                          {(actor.skills ?? []).slice(0, 3).join(' · ')}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Recruiter Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((recruiter) => {
              const photo = recruiter.profile_photo;
              return (
                <Link key={recruiter.id} href={`/recruiters/${recruiter.id}`}>
                  <Card className="group overflow-hidden p-0 border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer">
                    <div className="p-5 flex items-center gap-4">
                      <div className="shrink-0">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo}
                            alt={recruiter.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                          />
                        ) : (
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="bg-[#8B1A1A] text-white text-lg font-bold">
                              {initials(recruiter.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#8B1A1A] transition-colors">
                          {recruiter.name}
                        </h4>
                        {recruiter.company_name && (
                          <p className="text-[12px] text-slate-600 truncate flex items-center gap-1 mt-0.5">
                            <Briefcase size={10} className="shrink-0" />{recruiter.company_name}
                          </p>
                        )}
                        {recruiter.location && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="shrink-0" />{recruiter.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <a
              href={currentPage > 1 ? `/browse?role=${activeRole}&page=${currentPage - 1}` : undefined}
              aria-disabled={currentPage <= 1}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                currentPage <= 1
                  ? 'border-slate-200 text-slate-300 pointer-events-none'
                  : 'border-slate-300 text-slate-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
              }`}
            >
              ← Previous
            </a>
            <span className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span>
            </span>
            <a
              href={currentPage < totalPages ? `/browse?role=${activeRole}&page=${currentPage + 1}` : undefined}
              aria-disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                currentPage >= totalPages
                  ? 'border-slate-200 text-slate-300 pointer-events-none'
                  : 'border-slate-300 text-slate-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
              }`}
            >
              Next →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
