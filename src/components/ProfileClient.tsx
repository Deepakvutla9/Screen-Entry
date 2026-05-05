'use client';

import { useState } from 'react';
import { Camera, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient, type Profile } from '@/lib/supabase/client';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ProfileClient({ profile }: { profile: Profile }) {
  const supabase = createClient();

  const [name, setName] = useState(profile.name ?? '');
  const [age, setAge] = useState(String(profile.age ?? ''));
  const [height, setHeight] = useState(profile.height ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [videoReel, setVideoReel] = useState(profile.video_reel ?? '');
  const [skills, setSkills] = useState(profile.skills?.join(', ') ?? '');
  const [languages, setLanguages] = useState(profile.languages?.join(', ') ?? '');
  const [companyName, setCompanyName] = useState(profile.company_name ?? '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    const updates: Partial<Profile> = {
      name: name.trim(),
      location: location.trim(),
    };

    if (profile.role === 'actor') {
      updates.age = age ? parseInt(age) : undefined;
      updates.height = height.trim() || undefined;
      updates.video_reel = videoReel.trim() || undefined;
      updates.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      updates.languages = languages.split(',').map((l) => l.trim()).filter(Boolean);
    } else {
      updates.company_name = companyName.trim() || undefined;
    }

    const { error: dbError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
        <div className="space-y-8">

          {/* Avatar row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-2 border-dashed border-slate-300">
                <AvatarImage src={profile.profile_photo ?? ''} alt={profile.name} />
                <AvatarFallback className="bg-slate-100 text-slate-400 text-3xl">
                  {profile.profile_photo ? initials(profile.name) : <Camera size={40} />}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                title="Upload photo coming soon"
                className="absolute -bottom-2 -right-2 bg-[#1a3a5f] text-white p-2 rounded-xl shadow-lg opacity-60 cursor-not-allowed"
              >
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-slate-500">{profile.email}</p>
              <Badge className="bg-[#1a3a5f] text-white border-none uppercase tracking-widest">
                {profile.role}
              </Badge>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <Label htmlFor="name" className="mb-1.5">Full Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="location" className="mb-1.5">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hyderabad"
              />
            </div>

            {profile.role === 'actor' ? (
              <>
                <div>
                  <Label htmlFor="age" className="mb-1.5">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={1}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="mb-1.5">Height</Label>
                  <Input
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={`e.g. 5'10"`}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="videoReel" className="mb-1.5">YouTube / Vimeo Reel Link</Label>
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-slate-400 flex-shrink-0" />
                    <Input
                      id="videoReel"
                      value={videoReel}
                      onChange={(e) => setVideoReel(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="skills" className="mb-1.5">Skills</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Acting, Dancing, Horse Riding (comma separated)"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="languages" className="mb-1.5">Languages</Label>
                  <Input
                    id="languages"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. Telugu, Hindi, English (comma separated)"
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="companyName" className="mb-1.5">Company / Production Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Mythri Movie Makers"
                />
              </div>
            )}

            {/* Feedback & Submit */}
            <div className="md:col-span-2 pt-2 flex items-center gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="px-10 bg-[#1a3a5f] hover:bg-[#0d2138] h-11"
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Saving…</>
                ) : 'Save Changes'}
              </Button>

              {saved && (
                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 size={16} /> Profile saved successfully!
                </span>
              )}

              {error && (
                <span className="text-red-500 text-sm font-medium">{error}</span>
              )}
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
}
