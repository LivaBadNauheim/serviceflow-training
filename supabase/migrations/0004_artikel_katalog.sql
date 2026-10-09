-- Artikel-Katalog in der Datenbank statt in lib/menu-data.ts, damit der
-- Admin Artikelgruppen, Artikel und Extras direkt in der App anlegen,
-- bearbeiten und löschen kann, ohne Code anzufassen.
--
-- bestellpositionen speichert weiterhin Name/Preis als Text/Zahl (keine
-- Fremdschlüssel auf artikel) – ändert der Admin später Preis oder Namen
-- eines Artikels, bleiben bereits gebuchte/abgerechnete Positionen
-- unverändert so, wie sie zum Zeitpunkt der Buchung aussahen.

create table if not exists artikel_gruppen (
  id uuid primary key default gen_random_uuid(),
  gruppe position_gruppe not null,
  name text not null,
  sortierung integer not null default 0,
  unique (gruppe, name)
);

alter table artikel_gruppen enable row level security;

create table if not exists artikel (
  id uuid primary key default gen_random_uuid(),
  gruppen_id uuid not null references artikel_gruppen(id) on delete cascade,
  name text not null,
  preis numeric(10, 2) not null,
  sortierung integer not null default 0
);

alter table artikel enable row level security;

create index if not exists artikel_gruppen_id_idx on artikel (gruppen_id);

create table if not exists artikel_extras (
  id uuid primary key default gen_random_uuid(),
  artikel_id uuid not null references artikel(id) on delete cascade,
  name text not null,
  aufpreis numeric(10, 2) not null default 0,
  sortierung integer not null default 0
);

alter table artikel_extras enable row level security;

create index if not exists artikel_extras_artikel_idx on artikel_extras (artikel_id);
