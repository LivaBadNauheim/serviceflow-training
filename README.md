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

Das legt die Tabellen an und seedet 12 Tische.

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

## Aufbau

- `app/login` – PIN-Eingabe, setzt ein signiertes Cookie mit der Rolle.
- `app/tische` – Übersicht aller Tische (frei/belegt + Summe).
- `app/tisch/[id]` – Kassenbildschirm: Essen/Getränke-Tabs, Bestellung,
  Summe, Abrechnen.
- `app/admin` – nur für Rolle "admin": Tages-/Wochen-/Monatsabschluss.
- `middleware.ts` – schützt alle Routen, Admin-Routen zusätzlich nach Rolle.
- `lib/menu-data.ts` – Trainings-Speisekarte (generiert aus der echten
  Karte, siehe Kommentar in der Datei).
