import { User, ActorProfile, RecruiterProfile, CastingCall, Application, UserRole, BlogPost } from '../types';

// Mock Data
const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'SS Rajamouli Announces Next Mega Project with Mahesh Babu',
    excerpt: 'The visionary director is set to redefine Indian cinema once again with an action-adventure globe-trotting epic.',
    date: '2026-05-01',
    author: 'Cinema Desk',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    category: 'Industry News'
  },
  {
    id: 'b2',
    title: 'Upcoming OTT Releases to Watch Out for this Summer',
    excerpt: 'From intense thrillers to light-hearted rom-coms, here is your definitive guide to Telugu OTT content this month.',
    date: '2026-04-28',
    author: 'Film Hub',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=400',
    category: 'Watchlist'
  },
  {
    id: 'b3',
    title: 'Behind the Scenes: The Magic of VFX in Modern Telugu Films',
    excerpt: 'Exclusive interview with top VFX supervisors on how they created the breathtaking visuals for the latest blockbusters.',
    date: '2026-04-25',
    author: 'Tech Talk',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=400',
    category: 'Behind the Scenes'
  }
];

const INITIAL_CASTING_CALLS: CastingCall[] = [
  {
    id: '1',
    recruiterId: 'r1',
    title: 'Lead Actor for Web Series',
    description: 'Looking for a dynamic male lead for an upcoming Telugu thriller web series.',
    roleDescription: 'Protagonist, intense character, age 25-30.',
    ageRange: '22-32',
    location: 'Hyderabad',
    budget: '₹50,000 - ₹1,00,000',
    deadline: '2026-06-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    recruiterId: 'r1',
    title: 'Supporting Actress (Mother Role)',
    description: 'Emotional character role for a feature film.',
    roleDescription: 'Kind-hearted mother of the lead character.',
    ageRange: '40-55',
    location: 'Hyderabad',
    budget: '₹30,000 per day',
    deadline: '2026-05-20',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    recruiterId: 'r2',
    title: 'Background Dancers - Modern Folk',
    description: 'Energetic group needed for a big-budget song sequence.',
    roleDescription: 'Proficient in Telugu folk and contemporary dance.',
    ageRange: '18-25',
    location: 'Hyderabad',
    budget: 'Competitive',
    deadline: '2026-05-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    recruiterId: 'r2',
    title: 'Twin Sisters for Commercial',
    description: 'National detergent brand advertisement. Looking for identical twins.',
    roleDescription: 'Charming, expressive, age 6-10.',
    ageRange: '6-10',
    location: 'Hyderabad',
    budget: '₹25,000 each',
    deadline: '2026-05-25',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    recruiterId: 'r3',
    title: 'Action Stunt Doubles',
    description: 'High-octane action sequence for a pan-India project.',
    roleDescription: 'Expertise in wirework and bike stunts required.',
    ageRange: '20-40',
    location: 'Ramoji Film City',
    budget: 'Daily basis - High',
    deadline: '2026-05-12',
    createdAt: new Date().toISOString(),
  }
];

const FEATURED_ACTORS: ActorProfile[] = [
  {
    id: 'fa1',
    name: 'Vijay Kumar',
    email: 'vijay@example.com',
    role: 'actor',
    age: 26,
    location: 'Hyderabad',
    skills: ['Acting', 'Dancing', 'Horse Riding'],
    height: "5'11\"",
    languages: ['Telugu', 'English', 'Hindi'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fa2',
    name: 'Ananya Rao',
    email: 'ananya@example.com',
    role: 'actor',
    age: 24,
    location: 'Hyderabad',
    skills: ['Acting', 'Classical Dance', 'Singing'],
    height: "5'6\"",
    languages: ['Telugu', 'Tamil', 'English'],
    profilePhoto: 'https://images.unsplash.com/photo-1621184414184-0155f0ce800a?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fa3',
    name: 'Siddharth S.',
    email: 'sid@example.com',
    role: 'actor',
    age: 28,
    location: 'Secunderabad',
    skills: ['Action', 'Martial Arts', 'Acting'],
    height: "6'1\"",
    languages: ['Telugu', 'Hindi', 'English'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fa4',
    name: 'Priya Mani',
    email: 'priya@example.com',
    role: 'actor',
    age: 23,
    location: 'Hyderabad',
    skills: ['Acting', 'Modern Dance'],
    height: "5'5\"",
    languages: ['Telugu', 'Kannada', 'English'],
    profilePhoto: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fa5',
    name: 'Karthik Aryan',
    email: 'karthik@example.com',
    role: 'actor',
    age: 27,
    location: 'Hyderabad',
    skills: ['Comedy', 'Acting', 'Dancing'],
    height: "5'10\"",
    languages: ['Telugu', 'English'],
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  }
];

class MockStore {
  private users: (ActorProfile | RecruiterProfile)[] = [...FEATURED_ACTORS];
  private castingCalls: CastingCall[] = INITIAL_CASTING_CALLS;
  private applications: Application[] = [];
  private currentUser: (ActorProfile | RecruiterProfile) | null = null;

  constructor() {
    this.loadFromStorage();
  }

  getFeaturedActors() {
    return FEATURED_ACTORS;
  }

  getBlogPosts() {
    return INITIAL_BLOG_POSTS;
  }

  private loadFromStorage() {
    const savedUsers = localStorage.getItem('se_users');
    const savedCalls = localStorage.getItem('se_calls');
    const savedApps = localStorage.getItem('se_apps');
    const savedUser = localStorage.getItem('se_current');

    if (savedUsers) this.users = JSON.parse(savedUsers);
    if (savedCalls) this.castingCalls = JSON.parse(savedCalls);
    if (savedApps) this.applications = JSON.parse(savedApps);
    if (savedUser) this.currentUser = JSON.parse(savedUser);
  }

  private save() {
    localStorage.setItem('se_users', JSON.stringify(this.users));
    localStorage.setItem('se_calls', JSON.stringify(this.castingCalls));
    localStorage.setItem('se_apps', JSON.stringify(this.applications));
    localStorage.setItem('se_current', JSON.stringify(this.currentUser));
  }

  register(email: string, name: string, role: UserRole): ActorProfile | RecruiterProfile {
    const newUser: any = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
    };

    if (role === 'actor') {
      newUser.age = 25;
      newUser.location = 'Hyderabad';
      newUser.skills = [];
    }

    this.users.push(newUser);
    this.currentUser = newUser;
    this.save();
    return newUser;
  }

  login(email: string): ActorProfile | RecruiterProfile | null {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      this.save();
      return user;
    }
    return null;
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user: User) {
    this.currentUser = user as ActorProfile | RecruiterProfile;
    this.save();
  }

  updateProfile(updates: Partial<ActorProfile | RecruiterProfile>) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates } as any;
    this.users = this.users.map(u => u.id === this.currentUser?.id ? this.currentUser : u) as any;
    this.save();
  }

  getCastingCalls() {
    return this.castingCalls;
  }

  createCastingCall(call: Omit<CastingCall, 'id' | 'createdAt'>) {
    const newCall = {
      ...call,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    this.castingCalls.unshift(newCall);
    this.save();
    return newCall;
  }

  applyToCall(castingCallId: string) {
    if (!this.currentUser || this.currentUser.role !== 'actor') return;
    
    const existing = this.applications.find(a => a.castingCallId === castingCallId && a.actorId === this.currentUser?.id);
    if (existing) return;

    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      castingCallId,
      actorId: this.currentUser.id,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    this.applications.push(newApp);
    this.save();
    return newApp;
  }

  getApplicationsForActor() {
    if (!this.currentUser || this.currentUser.role !== 'actor') return [];
    return this.applications.filter(a => a.actorId === this.currentUser?.id);
  }

  getApplicationsForRecruiter() {
    if (!this.currentUser || this.currentUser.role !== 'recruiter') return [];
    const myCalls = this.castingCalls.filter(c => c.recruiterId === this.currentUser?.id);
    const myCallIds = myCalls.map(c => c.id);
    return this.applications.filter(a => myCallIds.includes(a.castingCallId));
  }

  getApplicantsForCall(callId: string) {
    const apps = this.applications.filter(a => a.castingCallId === callId);
    return apps.map(app => {
      const actor = this.users.find(u => u.id === app.actorId) as ActorProfile;
      return { ...app, actor };
    });
  }

  updateApplicationStatus(appId: string, status: Application['status']) {
    this.applications = this.applications.map(a => a.id === appId ? { ...a, status } : a);
    this.save();
  }
}

export const store = new MockStore();
