import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { Profile } from '@/lib/supabase/client';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default async function RecruiterPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recruiter } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'recruiter')
    .single();

  if (!recruiter) notFound();

  const profile = recruiter as Profile;

  // Check if viewer is logged in
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/browse?role=recruiter" className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Recruiters
          </Link>

          <div className="flex items-center gap-6">
            <div className="shrink-0">
              {profile.profile_photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-[#8B1A1A] text-white text-3xl font-bold border-4 border-white/20">
                    {initials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              {profile.company_name && (
                <p className="text-amber-400 font-medium mt-1 flex items-center gap-2">
                  <Briefcase size={15} /> {profile.company_name}
                </p>
              )}
              {profile.location && (
                <p className="text-slate-300 text-sm mt-1 flex items-center gap-1">
                  <MapPin size={13} /> {profile.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {profile.bio && (
          <Card className="p-6">
            <h2 className="font-bold text-slate-800 mb-2">About</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{profile.bio}</p>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="font-bold text-slate-800 mb-4">Details</h2>
          <div className="space-y-3 text-sm">
            {profile.company_name && (
              <div className="flex items-center gap-3 text-slate-600">
                <Briefcase size={16} className="text-slate-400 shrink-0" />
                <span>{profile.company_name}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Contact — only shown to logged-in users */}
        {user && (profile.email || profile.phone) && (
          <Card className="p-6">
            <h2 className="font-bold text-slate-800 mb-4">Contact</h2>
            <div className="space-y-3 text-sm">
              {profile.email && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-[#8B1A1A]">{profile.email}</a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <a href={`tel:${profile.phone}`} className="hover:text-[#8B1A1A]">{profile.phone}</a>
                </div>
              )}
            </div>
          </Card>
        )}

        {!user && (
          <p className="text-center text-sm text-slate-400">
            <Link href="/login" className="text-[#8B1A1A] hover:underline font-medium">Sign in</Link> to view contact details
          </p>
        )}
      </div>
    </div>
  );
}
