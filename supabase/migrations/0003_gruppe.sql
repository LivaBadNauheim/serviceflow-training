-- Zwei Drucker im echten Betrieb: einer an der Theke (Getränke), einer in
-- der Küche (Essen). Jede Bestellposition merkt sich ihre Gruppe, damit
-- Bonnieren beim Druck automatisch an den richtigen Drucker schickt – im
-- Interface bleibt trotzdem nur ein einziger Bonnieren-Knopf.

do $$ begin
  create type position_gruppe as enum ('essen', 'trinken');
exception
  when duplicate_object then null;
end $$;

alter table bestellpositionen
  add column if not exists gruppe position_gruppe not null default 'essen';
