create table if not exists forms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  questions jsonb not null default '[]',
  welcome text not null default 'Hi there! 👋 Got a minute to answer a few questions?',
  completion text not null default 'Thanks! Your response has been recorded. 🎉',
  color text not null default '#4f46e5',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists responses_form_idx on responses(form_id, created_at desc);
