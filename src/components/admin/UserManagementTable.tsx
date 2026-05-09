'use client';

import { useState } from 'react';
import { Loader2, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  suspended_at: string | null;
  delete_after: string | null;
  created_at: string;
}

export function UserManagementTable({ users }: { users: User[] }) {
  const [items, setItems] = useState(users);
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAction = async (action: string, userId: string) => {
    setLoading(userId);
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, targetId: userId }),
    });
    if (res.ok) {
      if (action === 'delete_user') {
        setItems((prev) => prev.filter((u) => u.id !== userId));
      } else if (action === 'suspend_user') {
        setItems((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'suspended' } : u));
      } else if (action === 'reinstate_user') {
        setItems((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'active' } : u));
      }
    }
    setLoading(null);
    setConfirmDelete(null);
  };

  return (
    <div className="bg-[#1a0000] border border-red-900/40 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-red-900/40 text-slate-400 text-xs uppercase tracking-wider">
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Role</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Joined</th>
            <th className="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id} className="border-b border-red-900/20 hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-medium text-white">{user.name}</td>
              <td className="px-4 py-3 text-slate-400">{user.email}</td>
              <td className="px-4 py-3">
                <Badge className="text-xs capitalize bg-slate-700 text-slate-200 border-none">{user.role}</Badge>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.status === 'active' ? 'bg-green-900/40 text-green-400' :
                  user.status === 'suspended' ? 'bg-red-900/40 text-red-400' :
                  'bg-orange-900/40 text-orange-400'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">{new Date(user.created_at).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {user.status === 'active' ? (
                    <Button
                      size="sm"
                      onClick={() => handleAction('suspend_user', user.id)}
                      disabled={loading === user.id}
                      className="h-7 text-xs bg-orange-800 hover:bg-orange-700 text-white"
                    >
                      {loading === user.id ? <Loader2 size={12} className="animate-spin" /> : <><ShieldOff size={12} className="mr-1" />Suspend</>}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAction('reinstate_user', user.id)}
                      disabled={loading === user.id}
                      className="h-7 text-xs bg-green-800 hover:bg-green-700 text-white"
                    >
                      {loading === user.id ? <Loader2 size={12} className="animate-spin" /> : <><ShieldCheck size={12} className="mr-1" />Reinstate</>}
                    </Button>
                  )}
                  {confirmDelete === user.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleAction('delete_user', user.id)} disabled={loading === user.id} className="h-7 text-xs bg-red-700 hover:bg-red-600 text-white">
                        {loading === user.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                      </Button>
                      <Button size="sm" onClick={() => setConfirmDelete(null)} className="h-7 text-xs bg-slate-700 hover:bg-slate-600 text-white">Cancel</Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setConfirmDelete(user.id)} className="h-7 text-xs bg-red-900/60 hover:bg-red-800 text-red-300">
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
