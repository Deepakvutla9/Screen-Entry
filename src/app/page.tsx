import Link from 'next/link';
import Image from 'next/image';
import { Users, Briefcase, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FEATURED_ACTORS, BLOG_POSTS, SEED_CASTING_CALLS } from '@/lib/data';

export default function LandingPage() {
  const features = [
    { icon: Users, title: 'Build Your Profile', desc: 'Showcase your portfolio, skills, and video reels to thousands of recruiters.' },
    { icon: Search, title: 'Browse Opportunities', desc: 'Real-time feed of calls for web series, features, commercials, and more.' },
    { icon: Briefcase, title: 'Apply with One Click', desc: 'No more physical portfolios. Apply instantly and track your application status.' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative py-20 px-6 bg-gradient-to-br from-[#0D0000] via-[#8B1A1A] to-[#1a0505] text-white flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059')] bg-cover bg-center mix-blend-overlay" />
        </div>
        <div className="max-w-3xl relative z-10">
          <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-1.5 text-sm uppercase tracking-widest">
            Telugu Industry&apos;s #1 Casting Platform
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
            Connecting <span className="text-amber-400">Talent</span> with <span className="text-amber-400">Big Screens</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified casting opportunities in the Telugu film industry. Whether you&apos;re an actor starting out or a veteran recruiter, Screen Entry simplifies your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-500/20">
              <Link href="/signup">Join as Actor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white bg-transparent hover:bg-white hover:text-[#8B1A1A]">
              <Link href="/signup">Post Casting Call</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">How it works</h3>
            <p className="text-slate-600 max-w-xl mx-auto italic">Bridging the gap between production houses and hidden gems across Hyderabad and beyond.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 h-full border-none shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Featured Talent</h3>
            <p className="text-slate-500">Discover rising stars already using Screen Entry.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FEATURED_ACTORS.map((actor) => (
              <Card key={actor.id} className="flex flex-col group h-full hover:border-[#8B1A1A]/30 transition-all overflow-hidden p-0">
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={actor.profilePhoto!}
                    alt={actor.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 flex flex-col flex-grow text-center">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#8B1A1A] transition-colors truncate">{actor.name}</h4>
                  <div className="space-y-0.5 mt-auto">
                    <p className="text-[10px] text-slate-500">{actor.height || 'N/A'}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-1.5 h-[20px] overflow-hidden">
                      {actor.languages?.slice(0, 2).map((lang) => (
                        <span key={lang} className="text-[8px] px-1 py-0 bg-slate-100 text-slate-600 rounded shrink-0">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="px-10 h-12 border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white">
              <Link href="/browse">Browse All Talent →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0D0000] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">Recruitment Portal</Badge>
              <h3 className="text-4xl font-bold tracking-tight mb-4">Casting Calls</h3>
              <p className="text-slate-400">Leading production houses are looking for talent. Browse the latest casting calls and pitch your profile.</p>
            </div>
            <Button asChild className="bg-amber-500 text-white hover:bg-amber-600 border-none">
              <Link href="/signup">Post a Casting Call</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEED_CASTING_CALLS.slice(0, 5).map((call) => (
              <Link key={call.id} href="/signup">
                <Card className="bg-[#1a0505] border-red-900/40 p-6 h-full hover:bg-[#1a0505]/80 hover:border-amber-500/30 transition-all cursor-pointer text-white">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">{call.location}</Badge>
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">{call.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">{call.description}</p>
                  <div className="mt-auto pt-4 border-t border-red-900/30 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Age Range</span>
                      <span className="text-sm font-semibold text-amber-300">{call.ageRange}</span>
                    </div>
                    <ChevronRight size={20} className="text-amber-500/50" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Movie News & Blogs</h3>
            <button className="text-[#8B1A1A] font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <Card key={post.id} className="h-full group cursor-pointer border-none shadow-sm hover:shadow-md transition-all overflow-hidden p-0">
                <div className="aspect-video overflow-hidden relative">
                  <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-slate-100 text-slate-500 border-none px-2 py-0.5">{post.category}</Badge>
                    <span className="text-xs text-slate-400 font-medium">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">{post.title}</h4>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-auto">
                    <span>By {post.author}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
