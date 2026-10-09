-- Kassentraining: Tische, offene/geschlossene Tisch-Sessions und Bestellpositionen.
--
-- Bewusst keine Policies für anon/authenticated: der Browser bekommt nie
-- direkten Supabase-Zugriff, alle Schreib-/Lesezugriffe laufen über die
-- Server Actions (app/actions.ts) mit dem Service-Role-Key. RLS ist aktiv,
-- aber ohne Policy = kein Zugriff von außen.

do $$ begin
  create type tisch_bereich as enum ('drinnen', 'terrasse');
exception
  when duplicate_object then null;
end $$;

create table if not exists tische (
  id integer primary key,
  name text not null,
  bereich tisch_bereich not null
);

alter table tische enable row level security;

do $$ begin
  create type session_status as enum ('offen', 'geschlossen');
exception
  when duplicate_object then null;
end $$;

create table if not exists tisch_sessions (
  id uuid primary key default gen_random_uuid(),
  tisch_id integer not null references tische(id),
  status session_status not null default 'offen',
  eroeffnet_at timestamptz not null default now(),
  geschlossen_at timestamptz,
  summe numeric(10, 2) not null default 0
);

alter table tisch_sessions enable row level security;

create index if not exists tisch_sessions_offen_idx
  on tisch_sessions (tisch_id)
  where status = 'offen';

create index if not exists tisch_sessions_geschlossen_at_idx
  on tisch_sessions (geschlossen_at);

create table if not exists bestellpositionen (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tisch_sessions(id) on delete cascade,
  name text not null,
  preis numeric(10, 2) not null,
  menge integer not null default 1,
  erstellt_at timestamptz not null default now()
);

alter table bestellpositionen enable row level security;

create index if not exists bestellpositionen_session_idx
  on bestellpositionen (session_id);

-- 24 Tische seeden: 1–15 drinnen, 16–24 Terrasse (wie im echten Lokal).
insert into tische (id, name, bereich)
select i, 'Tisch ' || i, case when i <= 15 then 'drinnen' else 'terrasse' end::tisch_bereich
from generate_series(1, 24) as i
on conflict (id) do nothing;
