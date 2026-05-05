'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Video, CheckCircle2, Loader2, ArrowLeft, X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient, type Profile } from '@/lib/supabase/client';

const BUCKET = 'Screen Entry';
const MAX_PHOTOS = 5;

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ProfileClient({ profile }: { profile: Profile }) {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState(profile.name ?? '');
  const [age, setAge] = useState(String(profile.age ?? ''));
  const [height, setHeight] = useState(profile.height ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [videoReel, setVideoReel] = useState(profile.video_reel ?? '');
  const [skills, setSkills] = useState(profile.skills?.join(', ') ?? '');
  const [languages, setLanguages] = useState(profile.languages?.join(', ') ?? '');
  const [companyName, setCompanyName] = useState(profile.company_name ?? '');

  const [profilePhoto, setProfilePhoto] = useState<string>(profile.profile_photo ?? '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<string[]>(profile.photos ?? []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= MAX_PHOTOS) {
      setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo must be under 5 MB.');
      return;
    }
    setPhotoError('');
    setUploadingPhoto(true);
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });
    if (uploadError) {
      setPhotoError(uploadError.message);
      setUploadingPhoto(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const newPhotos = [...photos, publicUrl];
    setPhotos(newPhotos);
    await supabase.from('profiles').update({ photos: newPhotos }).eq('id', profile.id);
    setUploadingPhoto(false);
    // reset input so same file can be re-selected
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo must be under 5 MB.');
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setPhotoError(uploadError.message);
      setUploadingAvatar(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    // bust cache
    const url = `${publicUrl}?t=${Date.now()}`;
    setProfilePhoto(url);
    await supabase.from('profiles').update({ profile_photo: url }).eq('id', profile.id);
    setUploadingAvatar(false);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleRemovePhoto = async (url: string) => {
    const newPhotos = photos.filter((p) => p !== url);
    setPhotos(newPhotos);
    await supabase.from('profiles').update({ photos: newPhotos }).eq('id', profile.id);
    // extract path from URL and delete from storage
    const path = url.split(`${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  };

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
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#8B1A1A] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
        </div>
        <div className="space-y-8">

          {/* Avatar row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-2 border-slate-200">
                <AvatarImage src={profilePhoto || profile.profile_photo || ''} alt={profile.name} />
                <AvatarFallback className="bg-[#8B1A1A]/10 text-[#8B1A1A] text-3xl font-bold">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                title="Upload profile photo"
                className="absolute -bottom-2 -right-2 bg-[#8B1A1A] hover:bg-[#5C0808] text-white p-2 rounded-xl shadow-lg transition-colors disabled:opacity-60"
              >
                {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-slate-500">{profile.email}</p>
              <Badge className="bg-[#8B1A1A] text-white border-none uppercase tracking-widest">
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

            {/* Photos */}
            <div className="md:col-span-2 pt-2">
              <Label className="mb-3 block">
                Photos <span className="text-slate-400 font-normal">({photos.length}/{MAX_PHOTOS})</span>
              </Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((url) => (
                  <div key={url} className="relative w-28 h-28 rounded-xl overflow-hidden group border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Portfolio photo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors disabled:opacity-50"
                  >
                    {uploadingPhoto
                      ? <Loader2 size={20} className="animate-spin" />
                      : <><ImagePlus size={20} /><span className="text-xs font-medium">Add Photo</span></>
                    }
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              {photoError && <p className="text-red-500 text-xs mt-2">{photoError}</p>}
              <p className="text-xs text-slate-400 mt-2">Upload up to 5 photos (JPG, PNG, WebP · max 5 MB each)</p>
            </div>

            {/* Feedback & Submit */}
            <div className="md:col-span-2 pt-2 flex items-center gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="px-10 bg-[#8B1A1A] hover:bg-[#5C0808] h-11"
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Saving…</>
                ) : 'Save Changes'}
              </Button>

              {saved && (
                <span className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
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
