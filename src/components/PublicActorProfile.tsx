'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, MapPin, Film, Tv, Theater, Mic, Music, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Profile } from '@/lib/supabase/client';

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.replace('/shorts/', '').split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {
    // fall through
  }
  return url;
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const CREDIT_TABS = [
  { value: 'television', label: 'Television', icon: Tv },
  { value: 'film', label: 'Film', icon: Film },
  { value: 'theater', label: 'Theater', icon: Theater },
  { value: 'commercials', label: 'Commercials', icon: Star },
  { value: 'voiceover', label: 'Voiceover', icon: Mic },
  { value: 'music', label: 'Music', icon: Music },
];

export function PublicActorProfile({ profile }: { profile: Profile }) {
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

  const photos = profile.photos ?? [];
  const hasVideo = !!profile.video_reel;
  const hasAnyMedia = photos.length > 0 || hasVideo;

  const featuredPhoto = photos[0];
  const gridItems: Array<{ type: 'video' | 'photo'; url: string; label?: string }> = [];
  if (hasVideo) gridItems.push({ type: 'video', url: profile.video_reel!, label: 'Acting Reel' });
  photos.forEach((url) => gridItems.push({ type: 'photo', url }));

  const remainingItems = featuredPhoto
    ? [hasVideo && { type: 'video' as const, url: profile.video_reel!, label: 'Acting Reel' }, ...photos.slice(1).map((url) => ({ type: 'photo' as const, url }))].filter(Boolean)
    : gridItems;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative h-40 bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <Link
          href="/browse"
          className="absolute top-4 left-6 flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-32 h-32 flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-2 ring-[#8B1A1A]/10">
              <AvatarImage src={profile.profile_photo ?? ''} alt={profile.name} />
              <AvatarFallback className="bg-[#8B1A1A] text-white text-3xl font-bold">
                {initials(profile.name)}
              </AvatarFallback>
            </Avatar>
          </div>

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
            <Button asChild className="bg-[#8B1A1A] hover:bg-[#5C0808]">
              <Link href="/signup">Contact / Apply</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
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
            </Card>

            {(profile.languages ?? []).length > 0 && (
              <Card className="p-5 border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.languages ?? []).map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">{lang}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {(profile.skills ?? []).length > 0 && (
              <Card className="p-5 border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills ?? []).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs border-slate-200 text-slate-700">{skill}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Media */}
            {hasAnyMedia && (
              <Card className="p-6 border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Media</h3>
                <div className="flex gap-3">
                  {/* Left — large featured */}
                  {featuredPhoto ? (
                    <button
                      onClick={() => openLightbox(featuredPhoto)}
                      className="flex-shrink-0 w-[45%] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-zoom-in"
                      style={{ aspectRatio: '2/3' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featuredPhoto} alt="Featured" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </button>
                  ) : hasVideo ? (
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
                  ) : null}

                  {/* Right — 2×2 grid */}
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {(remainingItems as Array<{ type: 'video' | 'photo'; url: string; label?: string }>).slice(0, 4).map((item, i) => (
                      <button
                        key={i}
                        onClick={() => openLightbox(item.url)}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square group cursor-pointer"
                      >
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={16} className="text-slate-900 ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Credits */}
            <Card className="p-6 border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Credits &amp; Experience</h3>
              <Tabs defaultValue="television">
                <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100/80 p-1 rounded-lg mb-5">
                  {CREDIT_TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value} className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B1A1A] data-[state=active]:shadow-sm">
                      <Icon size={12} />{label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {CREDIT_TABS.map(({ value, label }) => (
                  <TabsContent key={value} value={value}>
                    <div className="py-8 text-center">
                      <p className="text-sm text-slate-400">No {label} credits listed yet</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
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
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-lg transition-colors z-10"
          >
            ?
          </button>

          {mediaItems.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
              {(lightboxIndex ?? 0) + 1} / {mediaItems.length}
            </div>
          )}

          {mediaItems.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevMedia(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xl transition-colors z-10"
            >
              ‹
            </button>
          )}

          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
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
          </div>

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
