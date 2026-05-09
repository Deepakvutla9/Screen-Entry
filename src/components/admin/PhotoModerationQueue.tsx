'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PendingPhoto {
  id: string;
  photo_url: string;
  created_at: string;
  profiles: { name: string; email: string } | null;
}

export function PhotoModerationQueue({ pending }: { pending: PendingPhoto[] }) {
  const [items, setItems] = useState(pending);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve_photo' | 'reject_photo') => {
    setLoading(id);
    await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, targetId: id }),
    });
    setItems((prev) => prev.filter((p) => p.id !== id));
    setLoading(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
        <p className="text-lg font-medium text-white">All caught up!</p>
        <p className="text-sm mt-1">No photos pending review.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((photo) => (
        <div key={photo.id} className="bg-[#1a0000] border border-red-900/40 rounded-xl overflow-hidden">
          <div className="relative w-full h-64">
            <Image src={photo.photo_url} alt="Pending photo" fill className="object-cover" unoptimized />
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-white">{photo.profiles?.name ?? 'Unknown'}</p>
            <p className="text-xs text-slate-400 mb-1">{photo.profiles?.email}</p>
            <p className="text-xs text-slate-500 mb-4">Uploaded {new Date(photo.created_at).toLocaleDateString('en-IN')}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAction(photo.id, 'approve_photo')}
                disabled={loading === photo.id}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white text-sm h-9"
              >
                {loading === photo.id ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle2 size={14} className="mr-1" /> Approve</>}
              </Button>
              <Button
                onClick={() => handleAction(photo.id, 'reject_photo')}
                disabled={loading === photo.id}
                className="flex-1 bg-red-800 hover:bg-red-700 text-white text-sm h-9"
              >
                {loading === photo.id ? <Loader2 size={14} className="animate-spin" /> : <><XCircle size={14} className="mr-1" /> Reject</>}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
