import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt, buildUserPrompt } from '../../../lib/blinkPersona';

// In-memory token bucket for simple rate limiting per IP
const RATE_LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
interface Bucket { tokens: number; last: number; }
const buckets = new Map<string, Bucket>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { tokens: RATE_LIMIT, last: now };
    buckets.set(ip, bucket);
  }
  // Refill tokens after window
  if (now - bucket.last > WINDOW_MS) {
    bucket.tokens = RATE_LIMIT;
    bucket.last = now;
  }
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try later.' }, { status: 429 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }

  const { text } = await req.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  const lower = text.toLowerCase();
  if (lower.includes('terrorism') || lower.includes('illegal')) {
    return NextResponse.json({ error: 'Request refused.' }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(text) }
      ]
    });
    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'AI request failed.' }, { status: 500 });
  }
}
