'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Briefcase, ChevronRight, Film, Tv, Theater,
  Mic, Music, Star, GraduationCap, Globe, Instagram, Youtube,
  MapPin, Edit3, ExternalLink, Play, X, Twitter,
  Clapperboard, Languages, Sparkles, Award,
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
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/client';
import type { Application } from '@/types';

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

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v'))
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/'))
      return `https://www.youtube.com/embed/${u.pathname.replace('/shorts/', '').split('?')[0]}`;
    if (u.hostname === 'youtu.be')
      return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes('vimeo.com'))
      return `https://player.vimeo.com/video${u.pathname}`;
  } catch { /* fall through */ }
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
        <Button variant="outline" size="sm" className="gap-1.5 text-[#8B1A1A] border-[#8B1A1A]/30 hover:bg-[#8B1A1A]/5">
          <Plus size={14} /> Add {category} Credit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">Add {category} Credit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs mb-1">Year</Label><Input name="year" placeholder="2024" required /></div>
            <div><Label className="text-xs mb-1">Role / Character</Label><Input name="role" placeholder="Lead Actor" required /></div>
            <div className="col-span-2"><Label className="text-xs mb-1">Production / Show Name</Label><Input name="production" placeholder="Film or show title" required /></div>
            <div><Label className="text-xs mb-1">Director</Label><Input name="director" placeholder="Director name" /></div>
            <div><Label className="text-xs mb-1">Location</Label><Input name="location" placeholder="Hyderabad, India" /></div>
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
    ...(profile.profile_photo ? [{ type: 'photo' as const, url: profile.profile_photo, label: 'Profile Photo' }] : []),
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
    const supabase = createClient();
    supabase.from('casting_calls').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setCalls(data ?? []));
    supabase.from('applications').select('*').eq('actor_id', profile.id)
      .then(({ data }) => setApplications((data ?? []) as Application[]));
  }, [profile.id]);

  const addCredit = (category: string, credit: Credit) =>
    setCredits((prev) => ({ ...prev, [category]: [credit, ...prev[category]] }));

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
  const totalCredits = Object.values(credits).flat().length;

  const socialLinks = [
    { href: profile.instagram, icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400 hover:border-pink-500/40', activeColor: 'text-pink-400 border-pink-500/40 bg-pink-500/10' },
    { href: profile.twitter, icon: Twitter, label: 'Twitter / X', color: 'hover:text-sky-400 hover:border-sky-500/40', activeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10' },
    { href: profile.youtube, icon: Youtube, label: 'YouTube', color: 'hover:text-red-400 hover:border-red-500/40', activeColor: 'text-red-400 border-red-500/40 bg-red-500/10' },
    { href: profile.website, icon: Globe, label: 'Website', color: 'hover:text-blue-400 hover:border-blue-500/40', activeColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Cinematic Banner ── */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0000] via-[#3d0808] to-[#0D0000]" />
        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
        {/* Amber spotlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)', filter: 'blur(40px)' }} />
        {/* Film strip decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-8 flex">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-white/5 flex flex-col justify-between py-1">
              <div className="h-1.5 bg-white/10 mx-0.5 rounded-sm" />
              <div className="h-1.5 bg-white/10 mx-0.5 rounded-sm" />
            </div>
          ))}
        </div>
        {/* Clapperboard watermark */}
        <Clapperboard size={120} className="absolute right-12 top-1/2 -translate-y-1/2 text-white/[0.04]" />
      </div>

      {/* ── Profile Header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-20 mb-8 flex flex-col sm:flex-row sm:items-end gap-5">

          {/* Avatar with amber ring */}
          <button
            type="button"
            onClick={() => profile.profile_photo && openLightbox(profile.profile_photo)}
            className={profile.profile_photo ? 'cursor-zoom-in flex-shrink-0' : 'cursor-default flex-shrink-0'}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-[#8B1A1A] opacity-80 blur-sm" />
              <Avatar className="relative w-32 h-32 border-4 border-[#0a0a0a] shadow-2xl">
                <AvatarImage src={profile.profile_photo ?? ''} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#8B1A1A] to-[#3d0808] text-white text-3xl font-bold">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </button>

          {/* Name / meta */}
          <div className="flex-1 pb-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] uppercase tracking-widest font-bold px-2">
                  Actor
                </Badge>
                {totalCredits > 0 && (
                  <Badge className="bg-white/5 text-white/50 border-white/10 text-[10px] uppercase tracking-widest px-2">
                    {totalCredits} Credits
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">{profile.name}</h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {profile.location && (
                  <span className="flex items-center gap-1 text-sm text-white/50">
                    <MapPin size={13} className="text-amber-500/70" />{profile.location}
                  </span>
                )}
                {profile.age && (
                  <span className="text-sm text-white/50">Age {profile.age}</span>
                )}
                {profile.height && (
                  <span className="text-sm text-white/50">{profile.height}</span>
                )}
              </div>
              {/* Social icons inline */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {socialLinks.map(({ href, icon: Icon, label, activeColor }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={cn('w-8 h-8 rounded-lg border flex items-center justify-center transition-all', activeColor)}
                      title={label}
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 pb-1">
              <Button asChild variant="outline" size="sm"
                className="gap-1.5 border-white/15 text-white/70 hover:text-white hover:border-white/30 bg-white/5 hover:bg-white/10">
                <Link href="/profile"><Edit3 size={14} /> Edit Profile</Link>
              </Button>
              <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-1.5 shadow-lg shadow-amber-500/20">
                <Link href="/feed"><Sparkles size={14} /> Browse Roles</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: applications.length, label: 'Applications', color: 'text-white' },
            { value: shortlisted, label: 'Shortlisted', color: 'text-amber-400' },
            { value: totalCredits, label: 'Credits', color: 'text-amber-300' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-center backdrop-blur-sm">
              <p className={cn('text-3xl font-bold', color)}>{value}</p>
              <p className="text-[11px] text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Appearance */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Appearance</h3>
              <div className="space-y-3">
                {[
                  { label: 'Age', value: profile.age ? String(profile.age) : null },
                  { label: 'Height', value: profile.height ?? null },
                  { label: 'Playing Age', value: profile.age ? `${Math.max(18, profile.age - 5)}–${profile.age + 5}` : null },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-white/40 uppercase tracking-wide">{label}</span>
                      <span className="text-sm font-semibold text-white/80">{value ?? <span className="text-white/20 italic text-xs">not set</span>}</span>
                    </div>
                    <Separator className="mt-2 bg-white/[0.06]" />
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full mt-4 text-amber-400/70 text-xs hover:text-amber-400 hover:bg-amber-400/5">
                <Link href="/profile"><Edit3 size={11} className="mr-1" /> Update</Link>
              </Button>
            </div>

            {/* Languages */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Languages size={13} className="text-amber-400/60" />
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Languages</h3>
              </div>
              {(profile.languages ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.languages.map((lang) => (
                    <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70">{lang}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/25 italic">No languages added</p>
              )}
              <Button asChild variant="ghost" size="sm" className="w-full mt-3 text-amber-400/70 text-xs hover:text-amber-400 hover:bg-amber-400/5">
                <Link href="/profile"><Plus size={11} className="mr-1" /> Add Language</Link>
              </Button>
            </div>

            {/* Social Links */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Social & Links</h3>
              {socialLinks.length > 0 ? (
                <div className="space-y-2">
                  {socialLinks.map(({ href, icon: Icon, label, activeColor }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium', activeColor)}>
                      <Icon size={15} />
                      <span className="truncate text-xs">{label}</span>
                      <ExternalLink size={11} className="ml-auto opacity-50 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/25 italic mb-3">No social links added</p>
              )}
              <Button asChild variant="ghost" size="sm" className="w-full mt-3 text-amber-400/70 text-xs hover:text-amber-400 hover:bg-amber-400/5">
                <Link href="/profile"><Plus size={11} className="mr-1" /> {socialLinks.length > 0 ? 'Edit Links' : 'Add Links'}</Link>
              </Button>
            </div>

            {/* Applications */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Applications</h3>
                <Link href="/feed" className="text-[10px] font-semibold text-amber-400/70 hover:text-amber-400 flex items-center gap-0.5">
                  Find more <ChevronRight size={11} />
                </Link>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-4">
                  <Briefcase size={22} className="mx-auto text-white/20 mb-2" />
                  <p className="text-xs text-white/30">No applications yet</p>
                  <Button asChild variant="ghost" size="sm" className="mt-2 text-xs text-amber-400/70 hover:text-amber-400">
                    <Link href="/feed">Browse Roles</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {applications.slice(0, 4).map((app) => {
                    const call = calls.find((c) => c.id === (app as unknown as { casting_call_id: string }).casting_call_id);
                    return (
                      <div key={app.id} className="flex items-center justify-between gap-2">
                        <p className="text-xs text-white/60 truncate">{call?.title ?? 'Unknown Role'}</p>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0',
                          app.status === 'pending' && 'bg-blue-500/20 text-blue-300',
                          app.status === 'shortlisted' && 'bg-amber-500/20 text-amber-300',
                          app.status === 'rejected' && 'bg-red-500/20 text-red-300',
                        )}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Media */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Media</h3>
                <Link href="/profile" className="text-xs text-amber-400/70 hover:text-amber-400 font-semibold flex items-center gap-1">
                  <Edit3 size={11} /> Manage
                </Link>
              </div>

              {(() => {
                const photos = profile.photos ?? [];
                const hasVideo = !!profile.video_reel;
                if (photos.length === 0 && !hasVideo) {
                  return (
                    <div className="border border-dashed border-white/10 rounded-xl p-12 text-center">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <Clapperboard size={24} className="text-white/20" />
                      </div>
                      <p className="text-sm font-medium text-white/40 mb-1">No media yet</p>
                      <p className="text-xs text-white/20 mb-4">Add photos and a video reel to your profile</p>
                      <Button asChild variant="outline" size="sm"
                        className="gap-1.5 border-amber-500/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-500/60 bg-transparent">
                        <Link href="/profile"><Plus size={13} /> Add Media</Link>
                      </Button>
                    </div>
                  );
                }

                const featuredPhoto = photos[0];
                const gridItems: Array<{ type: 'video' | 'photo'; url: string; label?: string }> = [];
                if (hasVideo) gridItems.push({ type: 'video', url: profile.video_reel!, label: 'Acting Reel' });
                photos.slice(1).forEach((url) => gridItems.push({ type: 'photo', url }));
                if (!featuredPhoto && hasVideo) {
                  gridItems.shift();
                }

                return (
                  <div className="flex gap-3">
                    {/* Large featured */}
                    {featuredPhoto ? (
                      <button onClick={() => openLightbox(featuredPhoto)}
                        className="flex-shrink-0 w-[42%] rounded-xl overflow-hidden border border-white/10 bg-black cursor-zoom-in group"
                        style={{ aspectRatio: '2/3' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={featuredPhoto} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </button>
                    ) : hasVideo ? (
                      <button onClick={() => openLightbox(profile.video_reel!)}
                        className="flex-shrink-0 w-[42%] rounded-xl overflow-hidden border border-white/10 bg-black relative group"
                        style={{ aspectRatio: '2/3' }}>
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#8B1A1A]/40 to-black/60 group-hover:from-[#8B1A1A]/60 transition-colors z-10">
                          <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play size={22} className="text-white ml-1" fill="currentColor" />
                          </div>
                        </div>
                        <span className="absolute bottom-3 left-3 text-white/80 text-xs font-semibold z-10 bg-black/40 px-2 py-0.5 rounded-md">Acting Reel</span>
                      </button>
                    ) : null}

                    {/* Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {(featuredPhoto ? [hasVideo && { type: 'video' as const, url: profile.video_reel!, label: 'Acting Reel' }, ...photos.slice(1).map((url) => ({ type: 'photo' as const, url }))].filter(Boolean) : gridItems).slice(0, 4).map((item, i) => {
                        const it = item as { type: 'video' | 'photo'; url: string; label?: string };
                        return (
                          <button key={i} onClick={() => openLightbox(it.url)}
                            className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-square group cursor-pointer">
                            {it.type === 'video' ? (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/30 to-black/60 flex items-center justify-center">
                                  <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                                  </div>
                                </div>
                                {it.label && <span className="absolute bottom-2 left-2 text-white/70 text-[10px] font-medium">{it.label}</span>}
                              </>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={it.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                          </button>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 4 - (featuredPhoto ? [hasVideo, ...photos.slice(1)].filter(Boolean).length : gridItems.length)) }).map((_, i) => (
                        <Link key={`add-${i}`} href="/profile"
                          className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-white/20 hover:border-amber-500/30 hover:text-amber-400/60 transition-colors">
                          <Plus size={16} />
                          <span className="text-[10px] font-medium">Add</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Skills */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Skills</h3>
                <Button asChild variant="ghost" size="sm" className="text-xs text-amber-400/70 gap-1 hover:text-amber-400 hover:bg-amber-400/5">
                  <Link href="/profile"><Plus size={11} /> Add Skill</Link>
                </Button>
              </div>
              {(profile.skills ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill}
                      className="text-sm px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:border-amber-500/30 hover:text-amber-400 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-sm text-white/30 mb-1">No skills added yet</p>
                  <p className="text-xs text-white/15">e.g. Acting Techniques, Guitar, Bharatanatyam, Dubbing</p>
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">Credits &amp; Experience</h3>
              <Tabs defaultValue="television">
                <TabsList className="flex flex-wrap h-auto gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl mb-5">
                  {CREDIT_TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value}
                      className="flex items-center gap-1.5 text-xs text-white/40 data-[state=active]:bg-[#8B1A1A] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg">
                      <Icon size={11} />{label}
                      {credits[value].length > 0 && (
                        <span className="ml-1 bg-amber-400 text-black rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
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
                        <div className="grid grid-cols-12 gap-2 pb-2 border-b border-white/[0.06] mb-1">
                          {['Year', 'Role', 'Production', 'Director', 'Location'].map((h, i) => (
                            <span key={h} className={cn('text-[10px] font-bold text-white/20 uppercase',
                              i === 0 && 'col-span-1', i === 1 && 'col-span-3', i === 2 && 'col-span-4', i === 3 && 'col-span-2', i === 4 && 'col-span-2'
                            )}>{h}</span>
                          ))}
                        </div>
                        {credits[value].map((c) => (
                          <div key={c.id} className="grid grid-cols-12 gap-2 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.03] rounded-lg px-1 transition-colors">
                            <span className="col-span-1 text-xs text-white/40">{c.year}</span>
                            <span className="col-span-3 text-xs font-semibold text-white/80">{c.role}</span>
                            <span className="col-span-4 text-xs text-white/60">{c.production}</span>
                            <span className="col-span-2 text-xs text-white/40">{c.director}</span>
                            <span className="col-span-2 text-xs text-white/30">{c.location}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-white/25 mb-3">No {label} credits yet</p>
                      </div>
                    )}
                    <AddCreditDialog category={label} onAdd={(c) => addCredit(value, c)} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Education */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Education &amp; Training</h3>
                <Dialog open={showEduDialog} onOpenChange={setShowEduDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400/70 gap-1 hover:text-amber-400 hover:bg-amber-400/5">
                      <Plus size={11} /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Education / Training</DialogTitle></DialogHeader>
                    <form onSubmit={addEducation} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs mb-1">Year</Label><Input name="year" placeholder="2022" required /></div>
                        <div><Label className="text-xs mb-1">Degree / Course</Label><Input name="degree" placeholder="Acting Diploma" required /></div>
                        <div className="col-span-2"><Label className="text-xs mb-1">Institution</Label><Input name="institution" placeholder="Film & TV Institute" required /></div>
                        <div className="col-span-2"><Label className="text-xs mb-1">Trainer / Professor</Label><Input name="trainer" placeholder="Name of trainer" /></div>
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
                    <div key={edu.id} className="flex gap-4 py-3 border-b border-white/[0.05] last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <GraduationCap size={16} className="text-amber-400/70" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/80">{edu.degree}</p>
                        <p className="text-xs text-white/40">{edu.institution}{edu.trainer ? ` · ${edu.trainer}` : ''}</p>
                        <p className="text-xs text-white/25 mt-0.5">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                  <GraduationCap size={26} className="mx-auto text-white/15 mb-2" />
                  <p className="text-sm text-white/30">Add your acting training and education</p>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Highlights &amp; Awards</h3>
                <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400/70 gap-1 hover:text-amber-400 hover:bg-amber-400/5">
                      <Plus size={11} /> Add
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
                    <li key={h.id} className="flex gap-3 items-start">
                      <Award size={14} className="text-amber-400/70 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/70">{h.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                  <Award size={26} className="mx-auto text-white/15 mb-2" />
                  <p className="text-sm text-white/30">Add awards, festival selections, or notable achievements</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {currentMedia && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
            <X size={18} />
          </button>
          {mediaItems.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/70 text-xs font-medium px-3 py-1 rounded-full">
              {(lightboxIndex ?? 0) + 1} / {mediaItems.length}
            </div>
          )}
          {mediaItems.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prevMedia(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10">
              ‹
            </button>
          )}
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {currentMedia.type === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentMedia.url} alt="Full photo" className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            ) : (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                <iframe src={`${toEmbedUrl(currentMedia.url)}?autoplay=1`} className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title={currentMedia.label ?? 'Video'} />
              </div>
            )}
            {currentMedia.label && <p className="text-center text-white/40 text-sm mt-3">{currentMedia.label}</p>}
          </div>
          {mediaItems.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextMedia(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10">
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

  const supabase = useRef(createClient()).current;

  useEffect(() => {
    supabase.from('casting_calls').select('*').eq('recruiter_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setCalls(data ?? []));
  }, [profile.id, supabase]);

  const myPosts = calls;

  const handleCreateCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { data } = await supabase.from('casting_calls').insert({
      recruiter_id: profile.id,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      role_description: fd.get('roleDescription') as string,
      age_range: fd.get('ageRange') as string,
      location: fd.get('location') as string,
      budget: fd.get('budget') as string,
      deadline: fd.get('deadline') as string,
    }).select().single();
    if (data) setCalls((prev) => [data, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0000] via-[#2a0808] to-[#0D0000]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[160px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <Clapperboard size={100} className="absolute right-10 top-1/2 -translate-y-1/2 text-white/[0.04]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Company Header */}
        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-600 to-[#8B1A1A] opacity-70 blur-sm" />
            <Avatar className="relative w-28 h-28 border-4 border-[#0a0a0a] shadow-2xl">
              <AvatarFallback className="bg-gradient-to-br from-amber-800 to-[#3d0808] text-white text-3xl font-bold">
                {initials(profile.company_name ?? profile.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="pb-1 flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Badge className="mb-1 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] uppercase tracking-widest font-bold px-2">
                Recruiter
              </Badge>
              <h1 className="text-3xl font-bold text-white">{profile.company_name ?? profile.name}</h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                Casting Director / Recruiter
                {profile.location && <><span className="text-white/20">·</span><span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span></>}
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 shadow-lg shadow-amber-500/20">
              <Plus size={16} /> Post Casting Call
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: myPosts.length, label: 'Active Posts', color: 'text-white' },
            { value: 0, label: 'Total Applicants', color: 'text-amber-400' },
            { value: 0, label: 'Shortlisted', color: 'text-amber-300' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-center">
              <p className={cn('text-3xl font-bold', color)}>{value}</p>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Casting Calls */}
        <div className="pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Your Casting Calls</h2>
            <Link href="/feed" className="text-xs text-amber-400/70 hover:text-amber-400 flex items-center gap-1 font-medium">
              View Feed <ChevronRight size={13} />
            </Link>
          </div>

          {myPosts.length === 0 ? (
            <div className="bg-white/[0.04] border border-dashed border-white/10 rounded-2xl p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={26} className="text-white/20" />
              </div>
              <p className="text-white/50 font-medium mb-1">No casting calls posted yet</p>
              <p className="text-sm text-white/25 mb-5">Start posting to find the perfect talent for your production</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-[#8B1A1A] hover:bg-[#5C0808] gap-2">
                <Plus size={16} /> Post Your First Casting Call
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((call) => (
                <div key={call.id} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-white/90 truncate">{call.title}</h4>
                      <p className="text-sm text-white/40 flex items-center gap-1 mt-0.5"><MapPin size={11} />{call.location}</p>
                    </div>
                    <span className="ml-3 text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium flex-shrink-0">Active</span>
                  </div>
                  <p className="text-xs text-white/40 line-clamp-2 mb-4">{call.role_description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-white/30">
                      <span>Age: {call.age_range}</span>
                      {call.budget && <span>· {call.budget}</span>}
                    </div>
                    <Button asChild variant="outline" size="sm"
                      className="text-xs border-white/15 text-white/60 hover:text-white hover:border-white/30 bg-transparent">
                      <Link href={`/applicants/${call.id}`}>View Applicants <ChevronRight size={11} /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Casting Call</h2>
              <form className="space-y-4" onSubmit={handleCreateCall}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><Label htmlFor="title" className="mb-1">Title</Label><Input id="title" name="title" required placeholder="e.g. Lead Hero for Feature Film" /></div>
                  <div><Label htmlFor="location" className="mb-1">Location</Label><Input id="location" name="location" required placeholder="Hyderabad" /></div>
                  <div><Label htmlFor="budget" className="mb-1">Budget</Label><Input id="budget" name="budget" placeholder="₹50k – ₹1L" /></div>
                  <div><Label htmlFor="ageRange" className="mb-1">Age Range</Label><Input id="ageRange" name="ageRange" required placeholder="18–25" /></div>
                  <div><Label htmlFor="deadline" className="mb-1">Deadline</Label><Input id="deadline" name="deadline" type="date" required /></div>
                  <div className="md:col-span-2"><Label htmlFor="roleDescription" className="mb-1">Role Description</Label><Textarea id="roleDescription" name="roleDescription" required rows={2} /></div>
                  <div className="md:col-span-2"><Label htmlFor="description" className="mb-1">Overall Project Description</Label><Textarea id="description" name="description" required rows={3} /></div>
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
