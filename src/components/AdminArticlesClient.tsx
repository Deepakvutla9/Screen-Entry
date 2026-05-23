'use client';
// v2
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Eye, EyeOff, X, RefreshCw } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

const CATEGORIES = ['Industry News', 'Casting', 'Behind the Scenes', 'Watchlist', 'Interviews', 'Events'];

export function AdminArticlesClient({ articles: initial }: { articles: Article[] }) {
  const supabase = createClient();
  const [articles, setArticles] = useState<Article[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', author: 'Cinema Desk',
    category: 'Industry News', image_url: '',
  });

  const handleFetchNews = async () => {
    setFetching(true);
    setFetchResult(null);
    const res = await fetch('/api/news/fetch', {
      method: 'POST',
      headers: { 'x-cron-secret': 'ScreenEntryAdmin1' },
    });
    const data = await res.json();
    setFetchResult(`Done — ${data.saved} saved, ${data.skipped} skipped, ${data.failed} failed`);
    setFetching(false);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data } = await supabase.from('articles').insert({
      ...form,
      image_url: form.image_url || null,
      published: true,
    }).select().single();
    if (data) setArticles([data, ...articles]);
    setForm({ title: '', excerpt: '', content: '', author: 'Cinema Desk', category: 'Industry News', image_url: '' });
    setShowForm(false);
    setSaving(false);
  };

  const togglePublish = async (article: Article) => {
    await supabase.from('articles').update({ published: !article.published }).eq('id', article.id);
    setArticles(articles.map(a => a.id === article.id ? { ...a, published: !a.published } : a));
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await supabase.from('articles').delete().eq('id', id);
    setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Movie News & Articles</h1>
          <p className="text-slate-400 text-sm mt-1">{articles.length} articles · shown on home page</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleFetchNews} disabled={fetching} variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 gap-2">
            <RefreshCw size={16} className={fetching ? 'animate-spin' : ''} />
            {fetching ? 'Fetching...' : 'Fetch Latest News'}
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2">
            <Plus size={16} /> New Article
          </Button>
        </div>
      </div>

      {fetchResult && (
        <div className="mb-6 p-4 rounded-xl bg-green-900/20 border border-green-900/40 text-green-400 text-sm">{fetchResult}</div>
      )}

      {/* New Article Form */}
      {showForm && (
        <Card className="bg-[#1a0000] border-red-900/40 p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">New Article</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-slate-300 mb-1.5">Title</Label>
                <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Article headline..." className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5">Author</Label>
                <Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                  className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5">Category</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a0000]">{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-slate-300 mb-1.5">Cover Image URL</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..." className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-slate-300 mb-1.5">Excerpt <span className="text-slate-500">(shown on home page)</span></Label>
                <Textarea required rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short summary..." className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-slate-300 mb-1.5">Full Content</Label>
                <Textarea required rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Full article body..." className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                {saving ? 'Publishing...' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length === 0 && (
          <div className="text-center py-16 text-slate-500">No articles yet. Create your first one.</div>
        )}
        {articles.map(article => (
          <Card key={article.id} className="bg-[#1a0000] border-red-900/40 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{article.category}</span>
                  {!article.published && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/30">Draft</span>}
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-1">{article.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{article.excerpt}</p>
                <p className="text-slate-500 text-xs mt-2">By {article.author} · {new Date(article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(article)} title={article.published ? 'Unpublish' : 'Publish'}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-colors">
                  {article.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => deleteArticle(article.id)} title="Delete"
                  className="p-2 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
