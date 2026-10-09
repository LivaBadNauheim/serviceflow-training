# Serviceflow Training

Internes Trainings-Tool: eine vereinfachte Kassensystem-Simulation für die
Einarbeitung neuer Mitarbeiter. Läuft bewusst nur für ein einzelnes
Smartphone (keine responsive Desktop-Ansicht), mit zwei PIN-geschützten
Rollen (User/Admin) und einem Admin-Finanzbereich (Tages-/Wochen-/
Monatsabschluss).

Die Speise-/Getränkekarte (`lib/menu-data.ts`) ist aus der echten
Liva-Seite übernommen, damit das Training realistisch ist. Es ist aber ein
komplett eigenständiges Projekt mit eigener Datenbank – es greift nicht auf
echte Liva-Daten zu und beeinflusst sie nicht.

## Setup

### 1. Supabase-Projekt anlegen

Ein **neues, separates** Supabase-Projekt erstellen (nicht das der echten
Liva-Seite verwenden). Danach im SQL-Editor die Migration ausführen:

```
supabase/migrations/0001_init.sql
```

Das legt die Tabellen an und seedet 24 Tische (1–15 drinnen, 16–24 Terrasse).

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

### 5. Belegdrucker (optional)

Getestet mit einem Epson TM-m30III. Der Druck läuft über Epsons
**ePOS-Print**-Protokoll direkt aus dem Browser des Handys übers WLAN –
funktioniert deshalb gleich auf iPhone und Android, ohne Bluetooth-Pairing
pro Gerät. Voraussetzung: Handy und Drucker im selben WLAN.

**Einrichtung:**

1. Drucker ins WLAN einbinden (über das Display/die Epson-Dienstprogramm-App)
   und die lokale IP-Adresse notieren (z. B. über einen Selbsttest-Ausdruck
   oder die Geräteliste im Router).
2. `NEXT_PUBLIC_DRUCKER_IP` in Vercel auf diese IP setzen. Ohne gesetzte IP
   wird der "Beleg drucken"-Button einfach nicht angezeigt – das Training
   funktioniert auch ganz ohne Drucker.
3. **Wichtig – Mixed Content:** Unsere Seite läuft über HTTPS, der Drucker
   standardmäßig nur über HTTP im lokalen Netz. Browser blockieren das
   normalerweise. Zwei Möglichkeiten, einmalig pro Handy:
   - Im Browser die Website-Einstellungen für die Kassentraining-Seite
     öffnen → "Unsichere Inhalte" / "Insecure content" → erlauben
     (bei Chrome: Antippen des Schloss-/Info-Symbols neben der Adresse).
   - Oder: SSL in der Drucker-Weboberfläche aktivieren (eigenes/
     selbstsigniertes Zertifikat), dann `NEXT_PUBLIC_DRUCKER_HTTPS=true`
     setzen und die `https://<drucker-ip>`-Adresse einmal im Browser
     öffnen und das Zertifikat bestätigen.
4. **Nicht vorab getestet:** Dieser Teil wurde nach Epsons offizieller
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
  Summe, Abrechnen.
- `app/admin` – nur für Rolle "admin": Tages-/Wochen-/Monatsabschluss,
  Belege löschen, Excel-Export.
- `proxy.ts` – schützt alle Routen, Admin-Routen zusätzlich nach Rolle.
- `lib/menu-data.ts` – Trainings-Speisekarte (generiert aus der echten
  Karte, siehe Kommentar in der Datei).
- `lib/eposPrint.ts` – Belegdruck über Epson ePOS-Print (siehe Setup-Schritt 5).
