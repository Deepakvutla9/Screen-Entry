import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Briefcase,
  Plus,
  Search,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Video,
  Camera,
  Star
} from 'lucide-react';
import { store } from './lib/store';
import { supabase } from './lib/supabase';
import { User, ActorProfile, RecruiterProfile, CastingCall, Application } from './types';
import { cn } from './lib/utils';

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-[#1a3a5f] text-white hover:bg-[#0d2138]',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border-2 border-[#1a3a5f] text-[#1a3a5f] hover:bg-[#1a3a5f] hover:text-white',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden', className)} {...props}>
    {children}
  </div>
);

const Badge = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100', className)} {...props}>
    {children}
  </span>
);

const Navbar = ({ currentUser, onNavigate, onLogout }: { currentUser: User | null; onNavigate: (page: string) => void; onLogout: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-6 py-4 flex items-center justify-between">
    <div 
      className="flex items-center gap-2 cursor-pointer" 
      onClick={() => onNavigate('home')}
    >
      <div className="bg-[#1a3a5f] text-white p-1.5 rounded-lg">
        <Star size={20} fill="currentColor" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-[#1a3a5f]">Screen <span className="text-emerald-600">Entry</span></h1>
    </div>
    <div className="flex items-center gap-6">
      {currentUser ? (
        <>
          <button 
            onClick={() => onNavigate('feed')}
            className="text-sm font-medium text-slate-600 hover:text-[#1a3a5f]"
          >
            Casting Feed
          </button>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-medium text-slate-600 hover:text-[#1a3a5f]"
          >
            Dashboard
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
            </div>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#1a3a5f]"
            >
              <UserIcon size={18} />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <Button onClick={() => onNavigate('signup')}>Join Now</Button>
        </div>
      )}
    </div>
  </nav>
);

// --- Pages ---

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const featuredActors = store.getFeaturedActors();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-[#1a3a5f] text-white flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059')] bg-cover bg-center mix-blend-overlay" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl relative z-10"
        >
          <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-1.5 text-sm uppercase tracking-widest">
            Telugu Industry's #1 Casting Platform
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
            Connecting <span className="text-emerald-400">Talent</span> with <span className="text-emerald-400">Big Screens</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified casting opportunities in the Telugu film industry. Whether you're an actor starting out or a veteran recruiter, Screen Entry simplifies your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="h-14 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20"
              onClick={() => onNavigate('signup')}
            >
              Join as Actor
            </Button>
            <Button 
              variant="outline" 
              className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-[#1a3a5f]"
              onClick={() => onNavigate('signup')}
            >
              Post Casting Call
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">How it works</h3>
            <p className="text-slate-600 max-w-xl mx-auto italic">Bridging the gap between production houses and hidden gems across Hyderabad and beyond.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Build Your Profile', desc: 'Showcase your portfolio, skills, and video reels to thousands of recruiters.' },
              { icon: Search, title: 'Browse Opportunities', desc: 'Real-time feed of calls for web series, features, commercials, and more.' },
              { icon: Briefcase, title: 'Apply with One Click', desc: 'No more physical portfolios. Apply instantly and track your application status.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full border-none shadow-lg hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3a5f] mb-6">
                    <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Actors Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Featured Talent</h3>
            <p className="text-slate-500">Discover rising stars already using Screen Entry.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {featuredActors.map((actor, i) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="flex flex-col group h-full hover:border-[#1a3a5f]/30 transition-all">
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={actor.profilePhoto} 
                      alt={actor.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-[10px] font-medium truncate">{actor.skills.slice(0, 1).join(', ')}</p>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-grow text-center">
                    <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#1a3a5f] transition-colors truncate">{actor.name}</h4>
                    <div className="space-y-0.5 mt-auto">
                      <p className="text-[10px] text-slate-500">
                         {actor.height || "N/A"}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1.5 h-[20px] overflow-hidden">
                        {actor.languages?.slice(0, 2).map(lang => (
                          <span key={lang} className="text-[8px] px-1 py-0 bg-slate-100 text-slate-600 rounded shrink-0">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="px-10 h-12" onClick={() => onNavigate('signup')}>
              Join to browse all talent
            </Button>
          </div>
        </div>
      </section>

      {/* Production Needs / Casting Calls Section */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none mb-4">Recruitment Portal</Badge>
              <h3 className="text-4xl font-bold tracking-tight mb-4">Casting Calls</h3>
              <p className="text-slate-400">Leading production houses are looking for talent. Browse the latest casting calls and pitch your profile.</p>
            </div>
            <Button 
              className="bg-white text-slate-900 hover:bg-slate-200"
              onClick={() => onNavigate('signup')}
            >
              Post a Casting Call
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.getCastingCalls().slice(0, 5).map((call, i) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="bg-slate-800 border-slate-700 p-6 h-full hover:bg-slate-800/80 transition-all cursor-pointer"
                  onClick={() => onNavigate('signup')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px]">{call.location}</Badge>
                    <span className="text-[10px] text-slate-500 font-medium">Applied {Math.floor(Math.random() * 50) + 10}+</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">{call.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {call.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-700 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Age Range</span>
                      <span className="text-sm font-semibold">{call.ageRange}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-500" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => onNavigate('signup')}
              className="text-emerald-400 font-bold flex items-center gap-2 mx-auto hover:underline"
            >
              View all 200+ casting opportunities <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Movie News Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Movie News & Blogs</h3>
            <button className="text-[#1a3a5f] font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {store.getBlogPosts().map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full group cursor-pointer border-none shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-slate-100 text-slate-500 border-none px-2 py-0.5">{post.category}</Badge>
                      <span className="text-xs text-slate-400 font-medium">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#1a3a5f] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-auto">
                      <span>By {post.author}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AuthPage = ({ mode, onAuthSuccess }: { mode: 'login' | 'signup', onAuthSuccess: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'actor' | 'recruiter'>('actor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },  // passed to trigger via raw_user_meta_data
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }

      if (data.user) {
        // Profile is created automatically by the database trigger
        setSignupDone(true);
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            profilePhoto: profile.profile_photo,
          };
          store.setCurrentUser(user);
          onAuthSuccess(user);
        }
      }
    }
    setLoading(false);
  };

  if (signupDone) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
        <Card className="p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 mt-2">
              Join the future of Telugu cinema casting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am joining as</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setRole('actor')}
                    className={cn(
                      "py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                      role === 'actor' ? "border-[#1a3a5f] bg-[#1a3a5f]/5" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <UserIcon size={20} className={role === 'actor' ? "text-[#1a3a5f]" : "text-slate-400"} />
                    <span className={cn("text-sm font-bold", role === 'actor' ? "text-[#1a3a5f]" : "text-slate-600")}>Actor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={cn(
                      "py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                      role === 'recruiter' ? "border-emerald-600 bg-emerald-50" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <Briefcase size={20} className={role === 'recruiter' ? "text-emerald-600" : "text-slate-400"} />
                    <span className={cn("text-sm font-bold", role === 'recruiter' ? "text-emerald-600" : "text-slate-600")}>Recruiter</span>
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <Button
              className="w-full h-12 text-lg mt-4 shadow-lg shadow-[#1a3a5f]/10"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Get Started'}
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

const CastingFeed = ({ onApply }: { onApply: (id: string) => void }) => {
  const calls = store.getCastingCalls();
  const currentUser = store.getCurrentUser();
  const applications = store.getApplicationsForActor();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Active Casting Calls</h2>
          <p className="text-slate-500 mt-1">Explore current opportunities across the industry.</p>
        </div>
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a3a5f]" />
          <input 
            type="text" 
            placeholder="Search roles, locations..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="space-y-6">
        {calls.map((call, i) => {
          const hasApplied = applications.some(a => a.castingCallId === call.id);
          
          return (
            <motion.div 
              key={call.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-[#1a3a5f]/30 transition-all group p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1a3a5f] transition-colors">{call.title}</h3>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{call.budget || 'Open Budget'}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {call.location}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> Age: {call.ageRange}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Due: {new Date(call.deadline).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed mb-4">{call.description}</p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role Detail</p>
                      <p className="text-sm text-slate-700">{call.roleDescription}</p>
                    </div>
                  </div>
                  <div className="md:w-40 flex md:flex-col items-center justify-center gap-3">
                    {currentUser?.role === 'actor' ? (
                      <Button 
                        className="w-full" 
                        variant={hasApplied ? 'ghost' : 'primary'}
                        disabled={hasApplied}
                        onClick={() => onApply(call.id)}
                      >
                        {hasApplied ? (
                          <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Applied</span>
                        ) : 'Apply Now'}
                      </Button>
                    ) : (
                      <p className="text-xs text-center text-slate-400 italic">Login as Actor to apply</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const user = store.getCurrentUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  if (!user) return null;

  const isActor = user.role === 'actor';
  
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Hi, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 text-lg mt-1">Here's what's happening today in your network.</p>
        </div>
        {!isActor && (
          <Button 
            className="h-12 px-6 flex items-center gap-2 shadow-lg shadow-blue-500/10"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} /> Post Casting Call
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Profile Summary */}
        <div className="space-y-8">
          <Card className="p-6 bg-[#1a3a5f] text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={32} />
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <p className="text-white/60 text-sm capitalize">{user.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-white/60 text-sm">Location</span>
                <span className="text-sm font-medium">{(user as any).location || 'Hyderabad'}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white hover:text-[#1a3a5f]"
                onClick={() => onNavigate('profile')}
              >
                Edit Profile
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-[#1a3a5f]">
                {isActor ? store.getApplicationsForActor().length : store.getCastingCalls().filter(c => c.recruiterId === user.id).length}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isActor ? 'Applications' : 'Posts'}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {isActor ? store.getApplicationsForActor().filter(a => a.status === 'shortlisted').length : store.getApplicationsForRecruiter().length}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isActor ? 'Shortlisted' : 'Total Applicants'}
              </p>
            </Card>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {isActor ? (
            <>
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Your Applications</h3>
                  <button onClick={() => onNavigate('feed')} className="text-sm font-semibold text-[#1a3a5f] flex items-center gap-1">
                    Find More <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {store.getApplicationsForActor().length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <Briefcase className="mx-auto text-slate-300 mb-4" size={40} />
                      <p className="text-slate-500">You haven't applied to any roles yet.</p>
                      <Button variant="ghost" className="mt-2" onClick={() => onNavigate('feed')}>Browse Feed</Button>
                    </div>
                  ) : (
                    store.getApplicationsForActor().map(app => {
                      const call = store.getCastingCalls().find(c => c.id === app.castingCallId);
                      return (
                        <Card key={app.id} className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">{call?.title}</h4>
                            <p className="text-sm text-slate-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                          <Badge 
                            className={cn(
                              app.status === 'pending' ? 'bg-blue-50 text-blue-700' :
                              app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-red-50 text-red-700'
                            )}
                          >
                            {app.status}
                          </Badge>
                        </Card>
                      );
                    })
                  )}
                </div>
              </section>
            </>
          ) : (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Your Posts</h3>
              <div className="space-y-4">
                {store.getCastingCalls().filter(c => c.recruiterId === user.id).length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Plus className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-slate-500">You haven't posted any casting calls yet.</p>
                  </div>
                ) : (
                  store.getCastingCalls().filter(c => c.recruiterId === user.id).map(call => {
                    const applicants = store.getApplicantsForCall(call.id);
                    return (
                      <Card key={call.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{call.title}</h4>
                            <p className="text-sm text-slate-500">{call.location} • {applicants.length} Applicants</p>
                          </div>
                          <Button variant="outline" className="text-sm px-3 py-1 h-auto" onClick={() => onNavigate(`applicants-${call.id}`)}>
                            View Applicants
                          </Button>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          {applicants.slice(0, 5).map((app, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {app.actor.name[0]}
                            </div>
                          ))}
                          {applicants.length > 5 && (
                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              +{applicants.length - 5}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <Card className="p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Casting Call</h2>
                <form 
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    store.createCastingCall({
                      recruiterId: user.id,
                      title: formData.get('title') as string,
                      description: formData.get('description') as string,
                      roleDescription: formData.get('roleDescription') as string,
                      ageRange: formData.get('ageRange') as string,
                      location: formData.get('location') as string,
                      budget: formData.get('budget') as string,
                      deadline: formData.get('deadline') as string,
                    });
                    setShowCreateModal(false);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                      <input name="title" required placeholder="e.g. Lead Hero for Feature Film" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                      <input name="location" required placeholder="Hyderabad" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Budget</label>
                      <input name="budget" placeholder="₹50k - ₹1L" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Age Range</label>
                      <input name="ageRange" required placeholder="18-25" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Deadline</label>
                      <input name="deadline" type="date" required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Role Description</label>
                      <textarea name="roleDescription" required rows={2} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Overall Project Description</label>
                      <textarea name="description" required rows={3} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1">Post Call</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApplicantList = ({ callId }: { callId: string }) => {
  const applicants = store.getApplicantsForCall(callId);
  const call = store.getCastingCalls().find(c => c.id === callId);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Applicants for: {call?.title}</h2>
      <p className="text-slate-500 mb-8">{applicants.length} people have applied to this role.</p>

      {applicants.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">No applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applicants.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[#1a3a5f] text-xl font-bold">
                    {app.actor.name[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{app.actor.name}</h4>
                    <p className="text-sm text-slate-500">{app.actor.location} • {app.actor.age} years</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.actor.skills?.map((s, si) => (
                    <Badge key={si} className="bg-slate-100 text-slate-600 border-slate-200">{s}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-sm py-2">View Reel</Button>
                  {app.status === 'shortlisted' ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 flex items-center justify-center flex-1">Shortlisted</Badge>
                  ) : (
                    <Button 
                      variant="secondary" 
                      className="flex-1 text-sm py-2"
                      onClick={() => {
                        store.updateApplicationStatus(app.id, 'shortlisted');
                        window.location.reload(); // Quick refresh for mock
                      }}
                    >
                      Shortlist
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const user = store.getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 overflow-hidden">
                {user.profilePhoto ? <img src={user.profilePhoto} className="w-full h-full object-cover" /> : <Camera size={40} />}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-[#1a3a5f] text-white p-2 rounded-xl shadow-lg">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-slate-500">{user.email}</p>
              <Badge className="bg-[#1a3a5f] text-white border-none uppercase tracking-widest">{user.role}</Badge>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input defaultValue={user.name} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            {user.role === 'actor' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                  <input type="number" defaultValue={(user as any).age} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input defaultValue={(user as any).location} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">YouTube Video Reel Link</label>
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-slate-400" />
                    <input defaultValue={(user as any).videoReel} placeholder="https://youtube.com/..." className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skills (Acting, Dancing, etc.)</label>
                  <input placeholder="Separate with commas" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company / Production Name</label>
                <input defaultValue={(user as any).companyName} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            )}
            <div className="md:col-span-2 pt-4">
              <Button className="w-full md:w-auto px-12">Save Changes</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());

  useEffect(() => {
    // Restore session on page load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            profilePhoto: profile.profile_photo,
          };
          store.setCurrentUser(user);
          setCurrentUser(user);
        }
      }
    });

    // Listen for auth changes — handles Google OAuth redirect and logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            profilePhoto: profile.profile_photo,
          };
          store.setCurrentUser(user);
          setCurrentUser(user);
          setPage('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        store.logout();
        setCurrentUser(null);
        setPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setPage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    store.logout();
    setCurrentUser(null);
    setPage('home');
  };

  const handleApply = (id: string) => {
    store.applyToCall(id);
    // Visual feedback handled by state in Feed
    setPage('feed'); 
  };

  const renderPage = () => {
    if (page.startsWith('applicants-')) {
      const callId = page.split('-')[1];
      return <ApplicantList callId={callId} />;
    }

    switch(page) {
      case 'home': return <LandingPage onNavigate={setPage} />;
      case 'login': return <AuthPage mode="login" onAuthSuccess={handleAuthSuccess} />;
      case 'signup': return <AuthPage mode="signup" onAuthSuccess={handleAuthSuccess} />;
      case 'feed': return <CastingFeed onApply={handleApply} />;
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
      case 'profile': return <ProfilePage />;
      default: return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        currentUser={currentUser} 
        onNavigate={setPage} 
        onLogout={handleLogout} 
      />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#1a3a5f]">Screen <span className="text-emerald-600">Entry</span></h1>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Screen Entry. Empowering the Telugu film fraternity.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Privacy</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Terms</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
