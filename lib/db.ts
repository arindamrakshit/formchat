import { Pool } from "pg";

const url = process.env.DATABASE_URL;
const g = globalThis as unknown as { _pool?: Pool; _init?: Promise<unknown> };
const pool =
  g._pool ??
  (g._pool = new Pool({
    connectionString: url,
    ssl: url && !/localhost|127\.0\.0\.1/.test(url) ? { rejectUnauthorized: false } : undefined,
  }));

// Tables are created automatically on first query (same SQL as lib/schema.sql).
const SCHEMA = `
create table if not exists forms (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null,
  questions jsonb not null default '[]',
  welcome text not null default 'Hi there! 👋 Got a minute to answer a few questions?',
  completion text not null default 'Thanks! Your response has been recorded. 🎉',
  color text not null default '#4f46e5', published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  answers jsonb not null, created_at timestamptz not null default now());
create index if not exists responses_form_idx on responses(form_id, created_at desc);`;

export async function query<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!g._init) g._init = pool.query(SCHEMA).catch((e) => { g._init = undefined; throw e; });
  await g._init;
  return (await pool.query(text, params)).rows as T[];
}
