'use client';

import type { Application, CastingCall } from '@/types';
import { SEED_CASTING_CALLS } from './data';

const KEY_CALLS = 'se_calls';
const KEY_APPS = 'se_apps';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getCastingCalls(): CastingCall[] {
  if (!isBrowser()) return SEED_CASTING_CALLS;
  const saved = localStorage.getItem(KEY_CALLS);
  return saved ? (JSON.parse(saved) as CastingCall[]) : SEED_CASTING_CALLS;
}

export function createCastingCall(call: Omit<CastingCall, 'id' | 'createdAt'>): CastingCall {
  const newCall: CastingCall = {
    ...call,
    id: Math.random().toString(36).slice(2, 11),
    createdAt: new Date().toISOString(),
  };
  const calls = [newCall, ...getCastingCalls()];
  localStorage.setItem(KEY_CALLS, JSON.stringify(calls));
  return newCall;
}

export function getApplications(): Application[] {
  if (!isBrowser()) return [];
  const saved = localStorage.getItem(KEY_APPS);
  return saved ? (JSON.parse(saved) as Application[]) : [];
}

export function applyToCall(castingCallId: string, actorId: string): Application | null {
  const apps = getApplications();
  if (apps.some((a) => a.castingCallId === castingCallId && a.actorId === actorId)) return null;
  const newApp: Application = {
    id: Math.random().toString(36).slice(2, 11),
    castingCallId,
    actorId,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };
  apps.push(newApp);
  localStorage.setItem(KEY_APPS, JSON.stringify(apps));
  return newApp;
}

export function getApplicationsForActor(actorId: string): Application[] {
  return getApplications().filter((a) => a.actorId === actorId);
}

export function updateApplicationStatus(appId: string, status: Application['status']) {
  const apps = getApplications().map((a) => (a.id === appId ? { ...a, status } : a));
  localStorage.setItem(KEY_APPS, JSON.stringify(apps));
}
