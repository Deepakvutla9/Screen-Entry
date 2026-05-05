'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Briefcase, ChevronRight, Camera, Film, Tv, Theater,
  Mic, Music, Star, GraduationCap, Globe, Instagram, Youtube,
  MapPin, User as UserIcon, Edit3, ExternalLink, Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getCastingCalls, createCastingCall, getApplicationsForActor } from '@/lib/store';
import type { Profile } from '@/lib/supabase/client';
import type { Application, CastingCall } from '@/types';

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    // youtube.com/shorts/ID
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.replace('/shorts/', '').split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // vimeo.com/ID
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {
    // fall through
  }
  return url;
}

type Credit = { id: string; year: string; role: string; production: string; director: string; location: string };
type Education = { id: string; year: string; degree: string; institution: string; trainer: string };
type Highlight = { id: string; text: string };

const CREDIT_TABS = [
  { value: 'television', label: 'Television', icon: Tv },
  { value: 'film', label: 'Film', icon: Film },
  { value: 'theater', label: 'Theater', icon: Theater },
  { value: 'commercials', label: 'Commercials', icon: Star },
  { value: 'voiceover', label: 'Voiceover', icon: Mic },
  { value: 'music', label: 'Music', icon: Music },
];

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function AddCreditDialog({ category, onAdd }: { category: string; onAdd: (c: Credit) => void }) {
  const [open, setOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onAdd({
      id: Math.random().toString(36).slice(2, 9),
      year: fd.get('year') as string,
      role: fd.get('role') as string,
      production: fd.get('production') as string,
      director: fd.get('director') as string,
      location: fd.get('location') as string,
    });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 text-[#8B1A1A] border-[#8B1A1A]/30 hover:bg-[#8B1A1A]/5">
          <Plus size={14} /> Add {category} Credit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">Add {category} Credit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1">Year</Label>
              <Input name="year" placeholder="2024" required />
            </div>
            <div>
              <Label className="text-xs mb-1">Role / Character</Label>
              <Input name="role" placeholder="Lead Actor" required />
            </div>
            <div className="col-span-2">
              <Label className="text-xs mb-1">Production / Show Name</Label>
              <Input name="production" placeholder="Film or show title" required />
            </div>
            <div>
              <Label className="text-xs mb-1">Director</Label>
              <Input name="director" placeholder="Director name" />
            </div>
            <div>
              <Label className="text-xs mb-1">Location</Label>
              <Input name="location" placeholder="Hyderabad, India" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-[#8B1A1A] hover:bg-[#5C0808]">Add Credit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActorDashboard({ profile }: { profile: Profile }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [calls, setCalls] = useState<CastingCall[]>([]);
  const [credits, setCredits] = useState<Record<string, Credit[]>>({
    television: [], film: [], theater: [], commercials: [], voiceover: [], music: [],
  });
  const [educations, setEducations] = useState<Education[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showEduDialog, setShowEduDialog] = useState(false);
  const [showHighlightDialog, setShowHighlightDialog] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mediaItems: Array<{ type: 'photo' | 'video'; url: string; label?: string }> = [
    ...(profile.video_reel ? [{ type: 'video' as const, url: profile.video_reel, label: 'Acting Reel' }] : []),
    ...(profile.photos ?? []).map((url) => ({ type: 'photo' as const, url })),
  ];

  const openLightbox = (url: string) => {
    const idx = mediaItems.findIndex((m) => m.url === url);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prevMedia = () => setLightboxIndex((i) => (i !== null ? (i - 1 + mediaItems.length) % mediaItems.length : 0));
  const nextMedia = () => setLightboxIndex((i) => (i !== null ? (i + 1) % mediaItems.length : 0));
  const currentMedia = lightboxIndex !== null ? mediaItems[lightboxIndex] : null;

  useEffect(() => {
    setCalls(getCastingCalls());
    setApplications(getApplicationsForActor(profile.id));
  }, [profile.id]);

  const addCredit = (category: string, credit: Credit) => {
    setCredits((prev) => ({ ...prev, [category]: [credit, ...prev[category]] }));
  };

  const addEducation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setEducations((prev) => [{
      id: Math.random().toString(36).slice(2, 9),
      year: fd.get('year') as string,
      degree: fd.get('degree') as string,
      institution: fd.get('institution') as string,
      trainer: fd.get('trainer') as string,
    }, ...prev]);
    setShowEduDialog(false);
  };

  const addHighlight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setHighlights((prev) => [{ id: Math.random().toString(36).slice(2, 9), text: fd.get('text') as string }, ...prev]);
    setShowHighlightDialog(false);
  };

  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative h-40 bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-2 ring-[#8B1A1A]/10">
              <AvatarImage src={profile.profile_photo ?? ''} alt={profile.name} />
              <AvatarFallback className="bg-[#8B1A1A] text-white text-3xl font-bold">
                {initials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <Camera size={14} className="text-slate-600" />
            </button>
          </div>

          {/* Name & Meta */}
          <div className="pb-2 flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{profile.name}</h1>
              <p className="text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[#8B1A1A]">Actor</span>
                {profile.location && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1"><MapPin size={13} />{profile.location}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href="/profile"><Edit3 size={14} /> Edit Profile</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#8B1A1A] hover:bg-[#5C0808] gap-1.5">
                <Link href="/feed"><ChevronRight size={14} /> Browse Roles</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center border-slate-200">
            <p className="text-2xl font-bold text-[#8B1A1A]">{applications.length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Applications</p>
          </Card>
          <Card className="p-4 text-center border-slate-200">
            <p className="text-2xl font-bold text-amber-600">{shortlisted}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Shortlisted</p>
          </Card>
          <Card className="p-4 text-center border-slate-200">
            <p className="text-2xl font-bold text-amber-500">{Object.values(credits).flat().length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Credits</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
          {/* -- LEFT SIDEBAR -- */}
          <div className="lg:col-span-1 space-y-6">

            {/* Appearance */}
            <Card className="p-5 border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Appearance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Playing Age</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {profile.age ? `${Math.max(18, profile.age - 5)}–${profile.age + 5}` : '—'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Height</span>
                  <span className="text-sm font-semibold text-slate-800">{profile.height ?? '—'}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Age</span>
                  <span className="text-sm font-semibold text-slate-800">{profile.age ?? '—'}</span>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full mt-4 text-[#8B1A1A] text-xs hover:bg-[#8B1A1A]/5">
                <Link href="/profile"><Edit3 size={12} className="mr-1" /> Update Appearance</Link>
              </Button>
            </Card>

            {/* Languages */}
            <Card className="p-5 border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Languages</h3>
              {profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">{lang}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No languages added</p>
              )}
              <Button asChild variant="ghost" size="sm" className="w-full mt-3 text-[#8B1A1A] text-xs hover:bg-[#8B1A1A]/5">
                <Link href="/profile"><Plus size={12} className="mr-1" /> Add Language</Link>
              </Button>
            </Card>

            {/* Applications summary */}
            <Card className="p-5 border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applications</h3>
                <Link href="/feed" className="text-[10px] font-semibold text-[#8B1A1A] flex items-center gap-0.5">
                  Find more <ChevronRight size={12} />
                </Link>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-4">
                  <Briefcase size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">No applications yet</p>
                  <Button asChild variant="ghost" size="sm" className="mt-2 text-xs text-[#8B1A1A]">
                    <Link href="/feed">Browse Roles</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {applications.slice(0, 4).map((app) => {
                    const call = calls.find((c) => c.id === app.castingCallId);
                    return (
                      <div key={app.id} className="flex items-center justify-between">
                        <p className="text-xs text-slate-700 truncate max-w-[130px]">{call?.title ?? 'Unknown Role'}</p>
                        <Badge className={cn('text-[10px] px-1.5 py-0',
                          app.status === 'pending' && 'bg-red-50 text-blue-700 border-blue-200',
                          app.status === 'shortlisted' && 'bg-amber-50 text-amber-800 border-emerald-200',
                          app.status === 'rejected' && 'bg-red-50 text-red-700 border-red-200',
                        )}>
                          {app.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* -- MAIN CONTENT -- */}
          <div className="lg:col-span-3 space-y-8">

            {/* Media — Backstage layout: large photo left + 2×2 grid right */}
            <Card className="p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Media</h3>
                <Link href="/profile" className="text-xs text-[#8B1A1A] font-semibold hover:underline flex items-center gap-1">
                  <Edit3 size={12} /> Edit
                </Link>
              </div>

              {(() => {
                const photos = profile.photos ?? [];
                const hasVideo = !!profile.video_reel;
                const hasAnyMedia = photos.length > 0 || hasVideo;

                // Build grid items: video first, then photos
                const gridItems: Array<{ type: 'video' | 'photo'; url: string; label?: string }> = [];
                if (hasVideo) gridItems.push({ type: 'video', url: profile.video_reel!, label: 'Acting Reel' });
                photos.forEach((url) => gridItems.push({ type: 'photo', url }));

                if (!hasAnyMedia) {
                  return (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                      <Camera size={32} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-700 mb-1">No media yet</p>
                      <p className="text-xs text-slate-400 mb-4">Add photos and a video reel to your profile</p>
                      <Button asChild variant="outline" size="sm" className="gap-1.5 text-[#8B1A1A] border-[#8B1A1A]/30">
                        <Link href="/profile"><Plus size={14} /> Add Media</Link>
                      </Button>
                    </div>
                  );
                }

                const featuredPhoto = photos[0];
                const remainingItems = featuredPhoto
                  ? [hasVideo && { type: 'video' as const, url: profile.video_reel!, label: 'Acting Reel' }, ...photos.slice(1).map((url) => ({ type: 'photo' as const, url }))].filter(Boolean)
                  : gridItems;

                return (
                  <div>
                    <div className="flex gap-3">
                      {/* Left — large featured photo */}
                      {featuredPhoto ? (
                        <button
                          onClick={() => openLightbox(featuredPhoto)}
                          className="flex-shrink-0 w-[45%] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-zoom-in"
                          style={{ aspectRatio: '2/3' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={featuredPhoto} alt="Featured" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openLightbox(profile.video_reel!)}
                          className="flex-shrink-0 w-[45%] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative group"
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors z-10">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                              <Play size={22} className="text-slate-900 ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <span className="absolute bottom-3 left-3 text-white text-xs font-semibold z-10">Acting Reel</span>
                        </button>
                      )}

                      {/* Right — 2×2 grid */}
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {(remainingItems as Array<{ type: 'video' | 'photo'; url: string; label?: string }>).slice(0, 4).map((item, i) => (
                          <button
                            key={i}
                            onClick={() => openLightbox(item.url)}
                            className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square group cursor-pointer"
                          >
                            {item.type === 'video' ? (
                              <>
                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play size={16} className="text-slate-900 ml-0.5" fill="currentColor" />
                                  </div>
                                </div>
                                {item.label && (
                                  <span className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-semibold truncate text-left">{item.label}</span>
                                )}
                              </>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                          </button>
                        ))}
                        {/* Empty add slots */}
                        {Array.from({ length: Math.max(0, 4 - (remainingItems as unknown[]).length) }).map((_, i) => (
                          <Link key={`add-${i}`} href="/profile" className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-300 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors">
                            <Plus size={16} />
                            <span className="text-[10px] font-medium">Add</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* View More / Add More */}
                    <div className="mt-3 text-center">
                      <Link href="/profile" className="text-xs text-slate-500 hover:text-[#8B1A1A] font-medium flex items-center justify-center gap-1">
                        <ChevronRight size={14} /> View &amp; Manage Media
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </Card>

            {/* Credits & Experience */}
            <Card className="p-6 border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Credits &amp; Experience</h3>
              <Tabs defaultValue="television">
                <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100/80 p-1 rounded-lg mb-5">
                  {CREDIT_TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value} className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B1A1A] data-[state=active]:shadow-sm">
                      <Icon size={12} />{label}
                      {credits[value].length > 0 && (
                        <span className="ml-1 bg-[#8B1A1A] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                          {credits[value].length}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {CREDIT_TABS.map(({ value, label }) => (
                  <TabsContent key={value} value={value}>
                    {credits[value].length > 0 ? (
                      <div className="mb-4">
                        <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-100 mb-2">
                          <span className="col-span-1 text-[10px] font-bold text-slate-400 uppercase">Year</span>
                          <span className="col-span-3 text-[10px] font-bold text-slate-400 uppercase">Role</span>
                          <span className="col-span-4 text-[10px] font-bold text-slate-400 uppercase">Production</span>
                          <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">Director</span>
                          <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">Location</span>
                        </div>
                        {credits[value].map((c) => (
                          <div key={c.id} className="grid grid-cols-12 gap-2 py-2.5 border-b border-slate-50 hover:bg-slate-50/80 rounded-lg px-1 transition-colors">
                            <span className="col-span-1 text-xs text-slate-500">{c.year}</span>
                            <span className="col-span-3 text-xs font-semibold text-slate-800">{c.role}</span>
                            <span className="col-span-4 text-xs text-slate-600">{c.production}</span>
                            <span className="col-span-2 text-xs text-slate-500">{c.director}</span>
                            <span className="col-span-2 text-xs text-slate-400">{c.location}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-slate-400 mb-3">No {label} credits yet</p>
                      </div>
                    )}
                    <AddCreditDialog category={label} onAdd={(c) => addCredit(value, c)} />
                  </TabsContent>
                ))}
              </Tabs>
            </Card>

            {/* Skills */}
            <Card className="p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Skills</h3>
                <Button asChild variant="ghost" size="sm" className="text-xs text-[#8B1A1A] gap-1 hover:bg-[#8B1A1A]/5">
                  <Link href="/profile"><Plus size={12} /> Add Skill</Link>
                </Button>
              </div>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm px-3 py-1 border-slate-200 text-slate-700 bg-white hover:border-[#8B1A1A]/30 hover:text-[#8B1A1A] transition-colors cursor-default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 mb-2">No skills added yet</p>
                  <p className="text-xs text-slate-300">e.g. Acting Techniques, Guitar, Bharatanatyam, Dubbing</p>
                </div>
              )}
            </Card>

            {/* Education & Training */}
            <Card className="p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Education &amp; Training</h3>
                <Dialog open={showEduDialog} onOpenChange={setShowEduDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-[#8B1A1A] gap-1 hover:bg-[#8B1A1A]/5">
                      <Plus size={12} /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Education / Training</DialogTitle></DialogHeader>
                    <form onSubmit={addEducation} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs mb-1">Year</Label>
                          <Input name="year" placeholder="2022" required />
                        </div>
                        <div>
                          <Label className="text-xs mb-1">Degree / Course</Label>
                          <Input name="degree" placeholder="Acting Diploma" required />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs mb-1">Institution</Label>
                          <Input name="institution" placeholder="Film & TV Institute" required />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs mb-1">Trainer / Professor</Label>
                          <Input name="trainer" placeholder="Name of trainer" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowEduDialog(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1 bg-[#8B1A1A] hover:bg-[#5C0808]">Add</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              {educations.length > 0 ? (
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#8B1A1A]/10 flex items-center justify-center">
                        <GraduationCap size={18} className="text-[#8B1A1A]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{edu.degree}</p>
                        <p className="text-xs text-slate-500">{edu.institution}{edu.trainer ? ` · ${edu.trainer}` : ''}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <GraduationCap size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Add your acting training and education</p>
                </div>
              )}
            </Card>

            {/* Highlights */}
            <Card className="p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Highlights</h3>
                <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-[#8B1A1A] gap-1 hover:bg-[#8B1A1A]/5">
                      <Plus size={12} /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Highlight</DialogTitle></DialogHeader>
                    <form onSubmit={addHighlight} className="space-y-3 pt-2">
                      <div>
                        <Label className="text-xs mb-1">Highlight / Award / Achievement</Label>
                        <Textarea name="text" placeholder="e.g. Winner of Best Actor at IIFA 2023" required rows={3} />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowHighlightDialog(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1 bg-[#8B1A1A] hover:bg-[#5C0808]">Add</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              {highlights.length > 0 ? (
                <ul className="space-y-2">
                  {highlights.map((h) => (
                    <li key={h.id} className="flex gap-2 text-sm text-slate-700">
                      <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      {h.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Star size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Add awards, festival selections, or notable achievements</p>
                </div>
              )}
            </Card>

            {/* Social Media / Websites */}
            <Card className="p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Social Media &amp; Websites</h3>
                <Button asChild variant="ghost" size="sm" className="text-xs text-[#8B1A1A] gap-1 hover:bg-[#8B1A1A]/5">
                  <Link href="/profile"><Plus size={12} /> Add Link</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Instagram, label: 'Instagram', color: 'hover:border-pink-300 hover:text-pink-600' },
                  { icon: Youtube, label: 'YouTube', color: 'hover:border-red-300 hover:text-red-600' },
                  { icon: Globe, label: 'Website', color: 'hover:border-blue-300 hover:text-blue-600' },
                  { icon: ExternalLink, label: 'IMDB', color: 'hover:border-amber-300 hover:text-amber-600' },
                ].map(({ icon: Icon, label, color }) => (
                  <Link key={label} href="/profile" className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 text-slate-400 transition-all',
                    color,
                  )}>
                    <Icon size={20} />
                    <span className="text-xs font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {currentMedia && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-lg transition-colors z-10"
          >
            ?
          </button>

          {/* Counter */}
          {mediaItems.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
              {(lightboxIndex ?? 0) + 1} / {mediaItems.length}
            </div>
          )}

          {/* Prev */}
          {mediaItems.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevMedia(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xl transition-colors z-10"
            >
              ‹
            </button>
          )}

          {/* Media */}
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.type === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentMedia.url}
                alt="Full photo"
                className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={`${toEmbedUrl(currentMedia.url)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentMedia.label ?? 'Video'}
                />
              </div>
            )}
            {currentMedia.label && (
              <p className="text-center text-white/70 text-sm mt-3">{currentMedia.label}</p>
            )}
          </div>

          {/* Next */}
          {mediaItems.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextMedia(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xl transition-colors z-10"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RecruiterDashboard({ profile }: { profile: Profile }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [calls, setCalls] = useState<CastingCall[]>([]);

  useEffect(() => { setCalls(getCastingCalls()); }, []);

  const myPosts = calls.filter((c) => c.recruiterId === profile.id);

  const handleCreateCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createCastingCall({
      recruiterId: profile.id,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      roleDescription: fd.get('roleDescription') as string,
      ageRange: fd.get('ageRange') as string,
      location: fd.get('location') as string,
      budget: fd.get('budget') as string,
      deadline: fd.get('deadline') as string,
    });
    setShowCreateModal(false);
    setCalls(getCastingCalls());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505]" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Company Header */}
        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-amber-800 text-white text-3xl font-bold">
                {initials(profile.company_name ?? profile.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="pb-2 flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{profile.company_name ?? profile.name}</h1>
              <p className="text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="font-medium text-amber-800">Casting Director / Recruiter</span>
                {profile.location && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1"><MapPin size={13} />{profile.location}</span>
                  </>
                )}
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="bg-[#8B1A1A] hover:bg-[#5C0808] gap-2 shadow-lg">
              <Plus size={16} /> Post Casting Call
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center border-slate-200">
            <p className="text-2xl font-bold text-[#8B1A1A]">{myPosts.length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Active Posts</p>
          </Card>
          <Card className="p-4 text-center border-slate-200">
            <p className="text-2xl font-bold text-amber-600">0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Total Applicants</p>
          </Card>
          <Card className="p-4 text-center border-slate-200 sm:col-span-1 col-span-2">
            <p className="text-2xl font-bold text-amber-500">0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Shortlisted</p>
          </Card>
        </div>

        {/* Casting Calls */}
        <div className="pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Your Casting Calls</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-[#8B1A1A]">
              <Link href="/feed">View Feed <ChevronRight size={13} /></Link>
            </Button>
          </div>

          {myPosts.length === 0 ? (
            <Card className="p-16 text-center border-2 border-dashed border-slate-200 bg-white">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium mb-1">No casting calls posted yet</p>
              <p className="text-sm text-slate-400 mb-4">Start posting to find the perfect talent for your production</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-[#8B1A1A] hover:bg-[#5C0808] gap-2">
                <Plus size={16} /> Post Your First Casting Call
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((call) => (
                <Card key={call.id} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-900 truncate">{call.title}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />{call.location}
                      </p>
                    </div>
                    <Badge className="ml-3 bg-amber-50 text-amber-800 border-emerald-200 text-xs flex-shrink-0">Active</Badge>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{call.roleDescription}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span>Age: {call.ageRange}</span>
                      {call.budget && <span>· {call.budget}</span>}
                    </div>
                    <Button asChild variant="outline" size="sm" className="text-xs border-[#8B1A1A]/30 text-[#8B1A1A] hover:bg-[#8B1A1A]/5">
                      <Link href={`/applicants/${call.id}`}>View Applicants <ChevronRight size={12} /></Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Casting Call</h2>
              <form className="space-y-4" onSubmit={handleCreateCall}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="mb-1">Title</Label>
                    <Input id="title" name="title" required placeholder="e.g. Lead Hero for Feature Film" />
                  </div>
                  <div>
                    <Label htmlFor="location" className="mb-1">Location</Label>
                    <Input id="location" name="location" required placeholder="Hyderabad" />
                  </div>
                  <div>
                    <Label htmlFor="budget" className="mb-1">Budget</Label>
                    <Input id="budget" name="budget" placeholder="?50k – ?1L" />
                  </div>
                  <div>
                    <Label htmlFor="ageRange" className="mb-1">Age Range</Label>
                    <Input id="ageRange" name="ageRange" required placeholder="18–25" />
                  </div>
                  <div>
                    <Label htmlFor="deadline" className="mb-1">Deadline</Label>
                    <Input id="deadline" name="deadline" type="date" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="roleDescription" className="mb-1">Role Description</Label>
                    <Textarea id="roleDescription" name="roleDescription" required rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="mb-1">Overall Project Description</Label>
                    <Textarea id="description" name="description" required rows={3} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-[#8B1A1A] hover:bg-[#5C0808]">Post Call</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardClient({ profile }: { profile: Profile }) {
  return profile.role === 'actor'
    ? <ActorDashboard profile={profile} />
    : <RecruiterDashboard profile={profile} />;
}
