'use client';

import { Plus, Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/lib/supabase/client';

export function ProfileClient({ profile }: { profile: Profile }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 overflow-hidden">
                <Camera size={40} />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-[#1a3a5f] text-white p-2 rounded-xl shadow-lg">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-slate-500">{profile.email}</p>
              <Badge className="bg-[#1a3a5f] text-white border-none uppercase tracking-widest">{profile.role}</Badge>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="mb-1.5">Full Name</Label>
              <Input id="name" defaultValue={profile.name} />
            </div>
            {profile.role === 'actor' ? (
              <>
                <div>
                  <Label htmlFor="age" className="mb-1.5">Age</Label>
                  <Input id="age" type="number" defaultValue={profile.age} />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-1.5">Location</Label>
                  <Input id="location" defaultValue={profile.location} />
                </div>
                <div>
                  <Label htmlFor="videoReel" className="mb-1.5">YouTube Video Reel Link</Label>
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-slate-400" />
                    <Input id="videoReel" defaultValue={profile.video_reel} placeholder="https://youtube.com/…" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills" className="mb-1.5">Skills (Acting, Dancing, etc.)</Label>
                  <Input id="skills" placeholder="Separate with commas" defaultValue={profile.skills?.join(', ')} />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="companyName" className="mb-1.5">Company / Production Name</Label>
                <Input id="companyName" defaultValue={profile.company_name} />
              </div>
            )}
            <div className="md:col-span-2 pt-4">
              <Button className="w-full md:w-auto px-12 bg-[#1a3a5f] hover:bg-[#0d2138]" disabled>
                Save Changes (coming soon)
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
