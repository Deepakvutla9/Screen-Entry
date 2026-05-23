import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const RSS_URL = 'https://www.greatandhra.com/feed/';
const MAX_ARTICLES = 30;

const KEYWORDS = [
  'audio launch', 'trailer', 'producer', 'new release', 'glimpse', 'teaser',
  'premier', 'premiere', 'actor', 'actress', 'box office', 'post production',
  'pre production', 'production', 'heroine', 'hero', 'music director', 'director',
  'release date', 'book my show', 'script', 'writer', 'story', 'screenplay',
  'direction', 'acting', 'nizam', 'exhibitor', 'distributor', 'ott', 'web series',
  'film', 'movie', 'cinema', 'shoot', 'casting', 'audition',
];

function matchesKeywords(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return KEYWORDS.some((kw) => text.includes(kw));
}

async function fetchRSS(): Promise<{ title: string; link: string; description: string; pubDate: string }[]> {
  const res = await fetch(RSS_URL, { next: { revalidate: 0 } });
  const xml = await res.text();

  const items: { title: string; link: string; description: string; pubDate: string }[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ?? block.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
    const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? block.match(/<guid>(.*?)<\/guid>/)?.[1] ?? '';
    const description = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ?? block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '';
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? '';

    if (title && link) items.push({ title, link, description: description.replace(/<[^>]+>/g, '').trim(), pubDate });
    if (items.length >= MAX_ARTICLES) break;
  }

  return items;
}

async function rewriteWithGroq(title: string, content: string): Promise<{ title: string; excerpt: string; body: string; category: string } | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a writer for Screen Entry, a Telugu film industry casting platform.
Rewrite the following Tollywood news article completely in your own words.
Make it engaging, original, and relevant to actors, directors and film enthusiasts.

Original title: ${title}
Original content: ${content}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "title": "Your rewritten headline",
  "excerpt": "2-3 sentence summary for the home page preview",
  "body": "Full rewritten article (3-5 paragraphs)",
  "category": "One of: Industry News, Casting, Behind the Scenes, Watchlist, Interviews, Events"
}`;

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

async function runFetch() {
  const supabase = await createClient();

  // Get already-saved article titles to avoid duplicates
  const { data: existing } = await supabase.from('articles').select('title');
  const existingTitles = new Set((existing ?? []).map((a: { title: string }) => a.title.toLowerCase()));

  const rssItems = await fetchRSS();
  const results = { saved: 0, skipped: 0, failed: 0 };

  for (const item of rssItems) {
    if (existingTitles.has(item.title.toLowerCase())) {
      results.skipped++;
      continue;
    }

    if (!matchesKeywords(item.title, item.description)) {
      results.skipped++;
      continue;
    }

    const rewritten = await rewriteWithGroq(item.title, item.description);
    if (!rewritten) { results.failed++; continue; }

    // Skip if rewritten title already exists
    if (existingTitles.has(rewritten.title.toLowerCase())) {
      results.skipped++;
      continue;
    }

    const { error } = await supabase.from('articles').insert({
      title: rewritten.title,
      excerpt: rewritten.excerpt,
      content: rewritten.body,
      author: 'Screen Entry Desk',
      category: rewritten.category,
      published: true,
    });

    if (error) { results.failed++; } else { results.saved++; }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  return NextResponse.json({ ok: true, ...results });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return runFetch();
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return runFetch();
}
