import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_EMAILS } from '@/lib/admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const cookieStore = await cookies();
  if (cookieStore.get('admin_verified')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { action, targetId, notes } = await request.json();

  // Log the action
  async function log(a: string, id: string, n?: string) {
    await supabase.from('admin_audit_log').insert({
      admin_email: user!.email,
      action: a,
      target_id: id,
      notes: n,
    });
  }

  if (action === 'approve_photo') {
    await supabase.from('photo_moderation').update({
      status: 'approved',
      reviewed_by: user.email,
      reviewed_at: new Date().toISOString(),
    }).eq('id', targetId);
    await log('approve_photo', targetId);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reject_photo') {
    const { data: photo } = await supabase.from('photo_moderation').select('photo_url, profile_id').eq('id', targetId).single();
    if (photo) {
      const path = photo.photo_url.split('/Screen Entry/')[1];
      if (path) await supabase.storage.from('Screen Entry').remove([path]);
      // Remove from profile photos array
      const { data: profile } = await supabase.from('profiles').select('photos').eq('id', photo.profile_id).single();
      if (profile?.photos) {
        const updated = profile.photos.filter((u: string) => u !== photo.photo_url);
        await supabase.from('profiles').update({ photos: updated }).eq('id', photo.profile_id);
      }
    }
    await supabase.from('photo_moderation').update({
      status: 'rejected',
      reviewed_by: user.email,
      reviewed_at: new Date().toISOString(),
    }).eq('id', targetId);
    await log('reject_photo', targetId, notes);
    return NextResponse.json({ ok: true });
  }

  if (action === 'suspend_user') {
    const deleteAfter = new Date();
    deleteAfter.setDate(deleteAfter.getDate() + 90);
    await supabase.from('profiles').update({
      status: 'suspended',
      suspended_at: new Date().toISOString(),
      delete_after: deleteAfter.toISOString(),
    }).eq('id', targetId);
    await log('suspend_user', targetId, notes);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reinstate_user') {
    await supabase.from('profiles').update({
      status: 'active',
      suspended_at: null,
      delete_after: null,
    }).eq('id', targetId);
    await log('reinstate_user', targetId);
    return NextResponse.json({ ok: true });
  }

  if (action === 'delete_user') {
    // Delete storage files
    const { data: profile } = await supabase.from('profiles').select('photos, profile_photo').eq('id', targetId).single();
    if (profile) {
      const files: string[] = [];
      if (profile.profile_photo) {
        const p = profile.profile_photo.split('/Screen Entry/')[1]?.split('?')[0];
        if (p) files.push(p);
      }
      if (profile.photos) {
        profile.photos.forEach((u: string) => {
          const p = u.split('/Screen Entry/')[1]?.split('?')[0];
          if (p) files.push(p);
        });
      }
      if (files.length > 0) await supabase.storage.from('Screen Entry').remove(files);
    }
    await log('delete_user', targetId, notes);
    // Delete auth user (cascades to profile)
    await supabase.auth.admin.deleteUser(targetId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
