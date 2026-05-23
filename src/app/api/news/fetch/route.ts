import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const RSS_URL = 'https://www.greatandhra.com/feed/';
const MAX_ARTICLES = 10;

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

async function rewriteWithGemini(title: string, content: string): Promise<{ title: string; excerpt: string; body: string; category: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a writer for Screen Entry, a Telugu film industry casting platform.
Rewrite the following Tollywood news article completely in your own words.
Make it engaging, original, and relevant to actors, directors and film enthusiasts.

Original title: ${title}
Original content: ${content}

Respond in this exact JSON format:
{
  "title": "Your rewritten headline",
  "excerpt": "2-3 sentence summary for the home page preview",
  "body": "Full rewritten article (3-5 paragraphs)",
  "category": "One of: Industry News, Casting, Behind the Scenes, Watchlist, Interviews, Events"
}`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

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

    const rewritten = await rewriteWithGemini(item.title, item.description);
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
