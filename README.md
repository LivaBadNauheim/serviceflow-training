# Serviceflow Training

Internes Trainings-Tool: eine vereinfachte Kassensystem-Simulation für die
Einarbeitung neuer Mitarbeiter. Läuft bewusst nur für ein einzelnes
Smartphone (keine responsive Desktop-Ansicht), mit zwei PIN-geschützten
Rollen (User/Admin) und einem Admin-Finanzbereich (Tages-/Wochen-/
Monatsabschluss).

Die Speise-/Getränkekarte startete als Übernahme aus der echten Liva-Seite,
damit das Training realistisch ist. Es ist aber ein komplett eigenständiges
Projekt mit eigener Datenbank – es greift nicht auf echte Liva-Daten zu und
beeinflusst sie nicht. Der Katalog (Artikelgruppen, Artikel, Preise,
Extras) liegt inzwischen in der Datenbank und lässt sich im Admin-Bereich
unter „Artikel verwalten" (`/admin/artikel`) anlegen, bearbeiten und
löschen – ohne Code anzufassen.

## Setup

### 1. Supabase-Projekt anlegen

Ein **neues, separates** Supabase-Projekt erstellen (nicht das der echten
Liva-Seite verwenden). Danach im SQL-Editor der Reihe nach beide Migrationen
ausführen:

```
supabase/migrations/0001_init.sql
supabase/migrations/0002_bonniert.sql
supabase/migrations/0003_gruppe.sql
supabase/migrations/0004_artikel_katalog.sql
supabase/migrations/0005_artikel_seed.sql
```

Das legt die Tabellen an, seedet 24 Tische (1–15 drinnen, 16–24 Terrasse),
ergänzt die Bonnieren-Nachverfolgung, merkt sich pro Position, ob es Essen
oder ein Getränk ist (für die Drucker-Zuordnung, siehe Schritt 5), legt den
Artikel-Katalog (Gruppen/Artikel/Extras) an und füllt ihn einmalig mit dem
bisherigen Trainingsmenü als Startbestand.

### 2. Umgebungsvariablen

`.env.example` kopieren nach `.env.local` und ausfüllen:

- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` – aus den
  Supabase-Projekteinstellungen (API).
- `POS_USER_PIN` / `POS_ADMIN_PIN` – frei wählbare PINs für die beiden
  Rollen. Unterschiedlich halten.
- `SESSION_SECRET` – langer Zufallsstring, z. B. `openssl rand -hex 32`.

### 3. Lokal starten

```
npm install
npm run dev
```

### 4. Deployment (Vercel)

- Eigenes Vercel-Projekt für dieses Repo anlegen, **nicht** den Default-Namen
  übernehmen, der auf "Liva" oder "Kasse" hindeutet – ein neutraler,
  unauffälliger Projektname sorgt dafür, dass niemand zufällig auf die
  vercel.app-URL stößt. Nirgendwo von der echten Liva-Seite aus verlinken.
- Die vier Umgebungsvariablen oben in den Vercel-Projekteinstellungen
  eintragen (Production + Preview).
- Die App selbst ist zusätzlich durch den PIN-Login geschützt und sendet
  `noindex` (keine Suchmaschinen-Indexierung).

### 5. Belegdrucker / Bonnieren (optional)

Wie im echten Betrieb gibt es zwei getrennte Schritte: **Bonnieren** (die
Bestellung drucken) und **Abrechnen** (den Tisch schließen). Das bildet
den tatsächlichen Ablauf mit Orderbird/Orderman + fester Kasse nach – nur
Bonnieren löst einen Druck aus.

Es gibt **zwei physische Drucker** wie im echten Betrieb: einen an der
Theke für Getränke, einen in der Küche für Essen (beide Epson TM-m30III).
Im Interface gibt es trotzdem nur **einen** Bonnieren-Knopf – das System
schickt jede Position automatisch an den passenden Drucker, je nachdem ob
der Artikel als `essen` oder `trinken` angelegt ist. Sind
auf einem Bon beide Gruppen dabei (z. B. ein Essen und ein Getränk am
selben Tisch), wird automatisch an beide Drucker gedruckt.

Der Druck läuft über Epsons **ePOS-Print**-Protokoll direkt aus dem
Browser des Handys übers WLAN – funktioniert deshalb gleich auf iPhone und
Android, ohne Bluetooth-Pairing pro Gerät. Voraussetzung: Handy und beide
Drucker im selben WLAN.

Der Bon ist bewusst ein Küchen-/Thekenbon, kein Rechnungsbeleg: er enthält
Gericht/Getränk und die Tischnummer gut lesbar, dazu klein einen
Zeitstempel – ohne Preise. Bonnieren druckt dabei nur die seit dem letzten
Mal neu hinzugefügten Positionen (nachverfolgt über `bonniert_at` in
`bestellpositionen`, siehe Migration `0002_bonniert.sql`).

**Einrichtung:**

1. Beide Drucker ins WLAN einbinden (über das Display/die
   Epson-Dienstprogramm-App) und jeweils die lokale IP-Adresse notieren
   (z. B. über einen Selbsttest-Ausdruck oder die Geräteliste im Router).
2. `NEXT_PUBLIC_DRUCKER_IP_ESSEN` (Küche) und
   `NEXT_PUBLIC_DRUCKER_IP_GETRAENKE` (Theke) in Vercel auf die jeweilige
   IP setzen. Ohne beide IPs wird der "Bonnieren"-Button einfach nicht
   angezeigt – das Training funktioniert auch ganz ohne Drucker. Ist nur
   eine der beiden gesetzt, erscheint der Knopf trotzdem, aber Bonnieren
   meldet für die Gruppe ohne konfigurierten Drucker einen Fehler.
3. **Wichtig – nach dem Setzen/Ändern der IPs in Vercel neu deployen.**
   `NEXT_PUBLIC_*`-Variablen werden bei Next.js fest in den Browser-Code
   eingebaut (Build-Zeit, nicht Laufzeit) – nur Eintragen reicht nicht,
   es braucht danach einen Redeploy (z. B. "Redeploy" im Vercel-Dashboard,
   ohne Cache).
4. **Wichtig – Mixed Content:** Unsere Seite läuft über HTTPS, die Drucker
   standardmäßig nur über HTTP im lokalen Netz. Browser blockieren das
   normalerweise. Zwei Möglichkeiten, einmalig pro Handy:
   - Im Browser die Website-Einstellungen für die Kassentraining-Seite
     öffnen → "Unsichere Inhalte" / "Insecure content" → erlauben
     (bei Chrome: Antippen des Schloss-/Info-Symbols neben der Adresse).
   - Oder: SSL in der Drucker-Weboberfläche aktivieren (eigenes/
     selbstsigniertes Zertifikat), dann `NEXT_PUBLIC_DRUCKER_HTTPS=true`
     setzen und die `https://<drucker-ip>`-Adresse von jedem der beiden
     Drucker einmal im Browser öffnen und das Zertifikat bestätigen.
5. **Nicht vorab getestet:** Dieser Teil wurde nach Epsons offizieller
   ePOS-Print-Spezifikation gebaut, aber nicht gegen die echte Hardware
   geprüft (kein Zugriff auf das lokale Netz von hier aus möglich). Beim
   ersten echten Testdruck prüfen, ob Formatierung/Zeilenbreite
   (`ZEILENBREITE` in `lib/eposPrint.ts`, aktuell 48 Zeichen für 80mm-
   Papier) und die Geräte-ID (`devid=local_printer`) passen – beides lässt
   sich in der Drucker-Weboberfläche unter den ePOS-Print-Einstellungen
   nachsehen und bei Bedarf anpassen.

## Aufbau

- `app/login` – PIN-Eingabe, setzt ein signiertes Cookie mit der Rolle.
- `app/tische` – Übersicht aller Tische (frei/belegt + Summe).
- `app/tisch/[id]` – Kassenbildschirm: Essen/Getränke-Tabs, Bestellung,
  Summe, Bonnieren, Abrechnen.
- `app/admin` – nur für Rolle "admin": Tages-/Wochen-/Monatsabschluss,
  Belege löschen, Excel-Export (zwei Blätter: "Abschluss" pro Tisch und
  "Verkaufte Artikel" als Menge/Einzelpreis/Summe je Artikel).
- `app/admin/artikel` – Artikelgruppen, Artikel und Extras anlegen,
  bearbeiten und löschen.
- `proxy.ts` – schützt alle Routen, Admin-Routen zusätzlich nach Rolle.
- `lib/katalog.ts` – lädt den Artikel-Katalog aus der Datenbank (für
  Kasse und Admin-Verwaltung gemeinsam genutzt).
- `lib/eposPrint.ts` – Küchenbon-Druck über Epson ePOS-Print beim Bonnieren
  (siehe Setup-Schritt 5).
