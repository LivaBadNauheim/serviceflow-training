-- Einmal bonniert, darf eine Position nicht mehr einfach verschwinden –
-- Küche/Theke hat sie schon gesehen. Ab dann geht nur noch Stornieren statt
-- Löschen: die Zeile bleibt als Beleg erhalten (storniert_at gesetzt) und
-- taucht im Admin-Export als Stornierung auf, statt spurlos aus der
-- Buchung zu verschwinden.

alter table bestellpositionen
  add column if not exists storniert_at timestamptz;
