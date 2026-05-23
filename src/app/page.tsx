import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Star, CheckCircle, Clapperboard, Users, Film, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FEATURED_ACTORS, SEED_CASTING_CALLS } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';

const STATS = [
  { value: '2,400+', label: 'Registered Actors' },
  { value: '180+', label: 'Active Casting Calls' },
  { value: '340+', label: 'Production Houses' },
  { value: '96%', label: 'Satisfaction Rate' },
];

const STEPS = [
  { n: '01', title: 'Create your profile', desc: 'Upload photos, a video reel, and your credits. Your profile is your digital portfolio — visible to casting directors across the industry.' },
  { n: '02', title: 'Discover casting calls', desc: 'Browse a live feed of verified roles: features, web series, commercials, and more. Filter by location, age range, or language.' },
  { n: '03', title: 'Apply in one click', desc: 'Submit your profile directly to the casting director. Track your application status in real time and get notified when you\'re shortlisted.' },
];

const TRUST = [
  { icon: CheckCircle, text: 'Verified casting directors only' },
  { icon: Film, text: 'Telugu & pan-India productions' },
  { icon: Users, text: 'No agents or middlemen' },
  { icon: TrendingUp, text: 'Direct recruiter contact' },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const blogPosts = articles ?? [];

  return (
    <div className="flex flex-col bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#0D0000]">
        {/* Gradient orbs — use inline style filter to guarantee blur renders correctly */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8B1A1A]/30 pointer-events-none" style={{filter:'blur(140px)'}} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-600/15 pointer-events-none" style={{filter:'blur(120px)'}} />
        <div className="absolute top-[30%] right-[20%] w-[250px] h-[250px] bg-[#8B1A1A]/10 pointer-events-none" style={{filter:'blur(100px)'}} />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'60px 60px'}} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">Telugu Industry&apos;s #1 Casting Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95] mb-8">
            Where&nbsp;<span className="text-amber-400">Talent</span>
            <br />
            Meets the&nbsp;<span className="text-amber-400">Screen</span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-12">
            The casting platform built for the Telugu film industry. Actors get discovered. Recruiters find the perfect fit. No middlemen, no hassle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="h-14 px-8 text-base font-semibold bg-amber-500 hover:bg-amber-400 text-black border-none shadow-2xl shadow-amber-500/25 transition-all hover:scale-[1.02]">
              <Link href="/signup" className="flex items-center gap-2">
                Start for free <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              <Link href="/explore" className="flex items-center gap-2">
                <Play size={16} fill="currentColor" /> Explore Feed
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-white/40">
            <div className="flex -space-x-2">
              {FEATURED_ACTORS.slice(0, 4).map((a, i) => (
                <div key={a.id} className="w-8 h-8 rounded-full border-2 border-[#0D0000] overflow-hidden relative" style={{zIndex: 4-i}}>
                  <Image src={a.profilePhoto!} alt={a.name} fill className="object-cover" sizes="32px" />
                </div>
              ))}
            </div>
            <span>Joined by <strong className="text-white/70">2,400+ actors</strong> across Hyderabad</span>
          </div>
        </div>

      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-[#8B1A1A] tracking-tight mb-1">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">How it works</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
                Three steps to your next role
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Screen Entry removes every barrier between you and the director. Build once, apply everywhere.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {TRUST.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2">
                    <Icon size={14} className="text-amber-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div key={step.n} className="flex gap-5 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1A1A] to-[#5C0808] text-white font-black text-sm flex items-center justify-center shadow-lg shadow-[#8B1A1A]/20 group-hover:scale-110 transition-transform">
                      {step.n}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-6 bg-slate-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED TALENT ── */}
      <section className="py-28 px-6 bg-[#0D0000] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Featured Talent</p>
              <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
                Rising stars on<br />Screen Entry
              </h2>
            </div>
            <Button asChild variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10 flex-shrink-0">
              <Link href="/browse" className="flex items-center gap-2">Browse all talent <ArrowRight size={16} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FEATURED_ACTORS.map((actor, i) => (
              <Link key={actor.id} href="/browse" className={`group relative rounded-2xl overflow-hidden bg-slate-900 cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[3/4] md:aspect-auto md:h-full min-h-[320px]' : 'aspect-[3/4]'}`}>
                  <Image
                    src={actor.profilePhoto!}
                    alt={actor.name}
                    fill
                    sizes={i === 0 ? '(max-width: 768px) 50vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-bold text-white text-sm truncate">{actor.name}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {actor.languages?.slice(0, 2).map((lang) => (
                        <span key={lang} className="text-[9px] px-1.5 py-0.5 bg-white/15 text-white/80 rounded-full">{lang}</span>
                      ))}
                    </div>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-full">
                        <Star size={9} fill="currentColor" /> Featured
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASTING CALLS ── */}
      <section className="py-28 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Live Opportunities</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Latest casting<br />calls
              </h2>
            </div>
            <Button asChild className="bg-[#8B1A1A] hover:bg-[#5C0808] text-white flex-shrink-0">
              <Link href="/signup" className="flex items-center gap-2">Post a Casting Call <Clapperboard size={16} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEED_CASTING_CALLS.slice(0, 6).map((call, i) => (
              <Link key={call.id} href="/signup" className="group">
                <div className={`relative rounded-2xl p-6 h-full border transition-all duration-300 flex flex-col
                  ${i === 0
                    ? 'bg-gradient-to-br from-[#8B1A1A] to-[#5C0808] border-transparent text-white shadow-xl shadow-[#8B1A1A]/20 group-hover:shadow-2xl group-hover:shadow-[#8B1A1A]/30 group-hover:-translate-y-1'
                    : 'bg-white border-slate-200 group-hover:border-[#8B1A1A]/30 group-hover:shadow-md group-hover:-translate-y-0.5'
                  }`}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
                      ${i === 0 ? 'bg-white/15 text-white/80' : 'bg-amber-50 text-amber-700'}`}>
                      {call.location}
                    </span>
                    <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${i === 0 ? 'text-white/50' : 'text-slate-300 group-hover:text-[#8B1A1A]'}`} />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 leading-snug ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{call.title}</h4>
                  <p className={`text-sm line-clamp-2 mb-6 leading-relaxed flex-1 ${i === 0 ? 'text-white/65' : 'text-slate-500'}`}>{call.description}</p>
                  <div className={`pt-4 border-t flex items-center justify-between ${i === 0 ? 'border-white/15' : 'border-slate-100'}`}>
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${i === 0 ? 'text-white/40' : 'text-slate-400'}`}>Age Range</p>
                      <p className={`text-sm font-bold ${i === 0 ? 'text-amber-300' : 'text-[#8B1A1A]'}`}>{call.ageRange}</p>
                    </div>
                    {call.budget && (
                      <p className={`text-xs font-semibold ${i === 0 ? 'text-white/60' : 'text-slate-500'}`}>{call.budget}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG / NEWS ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Industry Buzz</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Movie News &amp; Blogs</h2>
            </div>
            <button className="text-sm font-semibold text-[#8B1A1A] flex items-center gap-1.5 hover:gap-2.5 transition-all">
              View all <ArrowRight size={16} />
            </button>
          </div>
          {blogPosts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No articles published yet. Check back soon.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl relative mb-5 bg-slate-100">
                    {post.image_url
                      ? <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full bg-gradient-to-br from-[#8B1A1A]/20 to-amber-900/20 flex items-center justify-center"><Film size={32} className="text-slate-300" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 px-2.5 py-1 rounded-full">{post.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-2">{new Date(post.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</p>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2 leading-snug">{post.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-3">By {post.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 bg-[#0D0000] relative overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8B1A1A]/20 pointer-events-none" style={{filter:'blur(140px)'}} />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-600/8 pointer-events-none" style={{filter:'blur(120px)'}} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-5">Ready to begin?</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-8">
            Your next role<br />
            <span className="text-amber-400">starts here</span>
          </h2>
          <p className="text-white/50 text-lg mb-12 leading-relaxed">
            Join thousands of actors already on Screen Entry. Create your profile in minutes and get discovered by top Telugu productions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black border-none shadow-2xl shadow-amber-500/20 hover:scale-[1.02] transition-all">
              <Link href="/signup" className="flex items-center gap-2">
                Create free profile <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-base font-semibold border-white/15 text-white bg-transparent hover:bg-white/5">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <p className="text-white/25 text-xs mt-6">No credit card required &middot; Free for actors forever</p>
        </div>
      </section>

    </div>
  );
}
