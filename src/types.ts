export type UserRole = 'actor' | 'recruiter';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  profilePhoto?: string;
}

export interface ActorProfile extends User {
  role: 'actor';
  age: number;
  location: string;
  skills: string[];
  videoReel?: string;
  height?: string;
  languages?: string[];
}

export interface RecruiterProfile extends User {
  role: 'recruiter';
  companyName?: string;
}

export interface CastingCall {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  roleDescription: string;
  ageRange: string;
  genderPreference?: string;
  location: string;
  budget?: string;
  deadline: string;
  createdAt: string;
}

export interface Application {
  id: string;
  castingCallId: string;
  actorId: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  appliedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
}
