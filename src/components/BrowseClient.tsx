'use client';

import { useState } from 'react';
import { Search, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile } from '@/lib/supabase/client';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function BrowseClient({ actors }: { actors: Profile[] }) {
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');

  const allLanguages = Array.from(
    new Set(actors.flatMap((a) => a.languages ?? []))
  ).sort();

  const filtered = actors.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      (a.location ?? '').toLowerCase().includes(q) ||
      (a.skills ?? []).some((s) => s.toLowerCase().includes(q));
    const matchLang =
      !filterLang || (a.languages ?? []).includes(filterLang);
    return matchSearch && matchLang;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#1a3a5f] py-14 px-6 text-white text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Browse Talent</h1>
        <p className="text-slate-300 text-lg">
          {actors.length} actor{actors.length !== 1 ? 's' : ''} registered on Screen Entry
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, location or skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a3a5f]/30"
          >
            <option value="">All Languages</option>
            {allLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing <span className="font-semibold text-slate-800">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
          {search && <> for &ldquo;<span className="text-[#1a3a5f]">{search}</span>&rdquo;</>}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No actors found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((actor) => {
              const photo = actor.profile_photo || (actor.photos ?? [])[0];
              return (
                <Card
                  key={actor.id}
                  className="group overflow-hidden p-0 border-slate-200 hover:border-[#1a3a5f]/40 hover:shadow-md transition-all cursor-default"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] overflow-hidden relative bg-slate-100">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a3a5f]/10 to-emerald-50">
                        <Avatar className="w-20 h-20">
                          <AvatarFallback className="bg-[#1a3a5f] text-white text-2xl font-bold">
                            {initials(actor.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {/* Age badge */}
                    {actor.age && (
                      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        {actor.age} yrs
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#1a3a5f] transition-colors">
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

                    {/* Languages */}
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

                    {/* Skills */}
                    {(actor.skills ?? []).length > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                        {(actor.skills ?? []).slice(0, 3).join(' · ')}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
