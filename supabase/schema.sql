create extension if not exists "pgcrypto";

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  favorites text[] not null,
  avoid_list text not null,
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists draw_results (
  id uuid primary key default gen_random_uuid(),
  giver_id uuid not null references participants(id) on delete cascade,
  receiver_id uuid not null references participants(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint different_ids check (giver_id <> receiver_id)
);

create unique index if not exists draw_unique_giver on draw_results(giver_id);
create unique index if not exists draw_unique_receiver on draw_results(receiver_id);
