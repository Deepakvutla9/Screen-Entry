'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, ChevronRight, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getCastingCalls, createCastingCall, getApplicationsForActor } from '@/lib/store';
import type { Profile } from '@/lib/supabase/client';
import type { Application, CastingCall } from '@/types';

export function DashboardClient({ profile }: { profile: Profile }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [calls, setCalls] = useState<CastingCall[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const isActor = profile.role === 'actor';

  useEffect(() => {
    setCalls(getCastingCalls());
    setApplications(getApplicationsForActor(profile.id));
  }, [profile.id]);

  const handleCreateCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createCastingCall({
      recruiterId: profile.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      roleDescription: formData.get('roleDescription') as string,
      ageRange: formData.get('ageRange') as string,
      location: formData.get('location') as string,
      budget: formData.get('budget') as string,
      deadline: formData.get('deadline') as string,
    });
    setShowCreateModal(false);
    setCalls(getCastingCalls());
  };

  const myPosts = calls.filter((c) => c.recruiterId === profile.id);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Hi, {profile.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 text-lg mt-1">Here&apos;s what&apos;s happening today in your network.</p>
        </div>
        {!isActor && (
          <Button onClick={() => setShowCreateModal(true)} className="h-12 px-6 flex items-center gap-2 bg-[#1a3a5f] hover:bg-[#0d2138] shadow-lg shadow-blue-500/10">
            <Plus size={20} /> Post Casting Call
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <Card className="p-6 bg-[#1a3a5f] text-white border-none">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
                <UserIcon size={32} />
              </div>
              <div>
                <h3 className="font-bold text-xl">{profile.name}</h3>
                <p className="text-white/60 text-sm capitalize">{profile.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-white/60 text-sm">Location</span>
                <span className="text-sm font-medium">{profile.location || 'Hyderabad'}</span>
              </div>
              <Button asChild variant="outline" className="w-full border-white/20 text-white bg-transparent hover:bg-white hover:text-[#1a3a5f]">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-[#1a3a5f]">{isActor ? applications.length : myPosts.length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{isActor ? 'Applications' : 'Posts'}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {isActor ? applications.filter((a) => a.status === 'shortlisted').length : 0}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{isActor ? 'Shortlisted' : 'Total Applicants'}</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isActor ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Your Applications</h3>
                <Link href="/feed" className="text-sm font-semibold text-[#1a3a5f] flex items-center gap-1">
                  Find More <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Briefcase className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-slate-500">You haven&apos;t applied to any roles yet.</p>
                    <Button asChild variant="ghost" className="mt-2">
                      <Link href="/feed">Browse Feed</Link>
                    </Button>
                  </div>
                ) : (
                  applications.map((app) => {
                    const call = calls.find((c) => c.id === app.castingCallId);
                    return (
                      <Card key={app.id} className="p-4 flex items-center justify-between flex-row">
                        <div>
                          <h4 className="font-bold text-slate-900">{call?.title}</h4>
                          <p className="text-sm text-slate-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <Badge className={cn(app.status === 'pending' ? 'bg-blue-50 text-blue-700' : app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                          {app.status}
                        </Badge>
                      </Card>
                    );
                  })
                )}
              </div>
            </section>
          ) : (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Your Posts</h3>
              <div className="space-y-4">
                {myPosts.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Plus className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-slate-500">You haven&apos;t posted any casting calls yet.</p>
                  </div>
                ) : (
                  myPosts.map((call) => (
                    <Card key={call.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{call.title}</h4>
                          <p className="text-sm text-slate-500">{call.location}</p>
                        </div>
                        <Button asChild variant="outline" className="text-sm px-3 py-1 h-auto">
                          <Link href={`/applicants/${call.id}`}>View Applicants</Link>
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-2xl">
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
                    <Input id="budget" name="budget" placeholder="₹50k - ₹1L" />
                  </div>
                  <div>
                    <Label htmlFor="ageRange" className="mb-1">Age Range</Label>
                    <Input id="ageRange" name="ageRange" required placeholder="18-25" />
                  </div>
                  <div>
                    <Label htmlFor="deadline" className="mb-1">Deadline</Label>
                    <Input id="deadline" name="deadline" type="date" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="roleDescription" className="mb-1">Role Description</Label>
                    <textarea id="roleDescription" name="roleDescription" required rows={2} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="mb-1">Overall Project Description</Label>
                    <textarea id="description" name="description" required rows={3} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-[#1a3a5f] hover:bg-[#0d2138]">Post Call</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
