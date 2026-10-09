-- Bonnieren: merkt pro Bestellposition, ob/wann sie schon an die Küche
-- geschickt (gedruckt) wurde – getrennt von der Abrechnung, wie im echten
-- Betrieb (Orderbird/Orderman + feste Kasse). Erneutes Bonnieren eines
-- Tisches druckt dadurch nur die seither neu hinzugefügten Positionen.

alter table bestellpositionen
  add column if not exists bonniert_at timestamptz;
