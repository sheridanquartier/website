# Sheridan Quartier – Entwicklungsdokumentation

Dieses Dokument beschreibt, was in diesem Projekt gebaut wurde und wie es technisch umgesetzt ist.

---

## Projektübersicht

Eine passwortgeschützte Nachbarschaftsplattform für das Sheridan Quartier in Augsburg, die drei Baugemeinschaften verbindet:
- **Sheridan Park & Junia**
- **wagnisSHARE**
- **WOGENAU**

---

## Tech-Stack

| Technologie | Zweck |
|---|---|
| Next.js 14 (App Router) | Framework, Routing, Server Components |
| TypeScript | Typsicherheit |
| Tailwind CSS | Styling |
| Supabase (PostgreSQL) | Datenbank + Row Level Security |
| Supabase Auth | Admin-Authentifizierung |
| jose (JWE) | Cookie-basierte Auth für internen Bereich |
| date-fns | Datumsformatierung |
| react-markdown | Markdown-Rendering im Blog |
| Vercel | Deployment |

---

## Projektstruktur

```
/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root Layout (Navigation + Footer)
│   ├── page.tsx                 # Startseite
│   ├── login/page.tsx           # Login für internen Bereich
│   ├── neuigkeiten/             # Blog (öffentlich)
│   │   ├── page.tsx             # Übersicht
│   │   └── [slug]/page.tsx      # Einzelner Beitrag
│   ├── projekte/                # Projektseiten (öffentlich)
│   │   ├── sheridan-junia/
│   │   ├── wagnisshare/
│   │   └── wogenau/
│   ├── datenschutz/page.tsx
│   ├── impressum/page.tsx
│   ├── intern/                  # Interner Bereich (passwortgeschützt)
│   │   ├── layout.tsx           # Auth-Guard für internen Bereich
│   │   ├── dashboard/page.tsx
│   │   ├── schwarzes-brett/page.tsx
│   │   ├── tauschboerse/page.tsx
│   │   ├── verleihpool/page.tsx
│   │   ├── kalender/page.tsx
│   │   └── raumbuchungen/
│   │       ├── page.tsx
│   │       ├── gaesteappartement/page.tsx
│   │       └── gemeinschaftsraum/page.tsx
│   ├── admin/                   # Admin-Bereich (Supabase Auth)
│   │   ├── (auth)/login/page.tsx
│   │   └── (protected)/
│   │       ├── layout.tsx       # Auth-Guard für Admin
│   │       ├── dashboard/page.tsx
│   │       ├── blog/page.tsx
│   │       ├── kalender/page.tsx
│   │       ├── schwarzes-brett/page.tsx
│   │       ├── skills/page.tsx
│   │       └── verleihpool/page.tsx
│   └── api/
│       ├── auth/login/route.ts  # Cookie-Login für internen Bereich
│       ├── auth/logout/route.ts
│       └── admin/logout/route.ts
├── components/                  # Wiederverwendbare UI-Komponenten
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── CalendarView.tsx
│   ├── CommunityBadge.tsx
│   ├── EventCard.tsx
│   ├── ImageUpload.tsx
│   ├── LendItemCard.tsx
│   ├── Modal.tsx
│   ├── PostCard.tsx
│   ├── ProjectCard.tsx
│   └── TradeCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser-Client
│   │   └── server.ts            # Server-Client (für Server Components)
│   ├── auth/
│   │   └── cookies.ts           # JWE Cookie-Logik
│   ├── utils/
│   │   ├── dateFormat.ts
│   │   ├── imageUpload.ts
│   │   └── slugify.ts
│   └── constants.ts
├── supabase/
│   ├── schema.sql               # Haupt-Datenbankschema
│   ├── create_lend_items_table.sql
│   ├── add_image_columns.sql
│   ├── image_upload_setup.sql
│   ├── restructure_schema.sql
│   └── setup_storage_policies.sql
└── middleware.ts                # Route-Schutz für /intern/*
```

---

## Authentifizierung

### Interner Bereich (`/intern/*`)

- **Mechanismus**: Cookie-basiert mit JWE (JSON Web Encryption via `jose`)
- **Passwort**: Gemeinsames Passwort für alle Bewohner (`INTERNAL_PASSWORD` in `.env.local`)
- **Middleware** (`middleware.ts`): Schützt alle `/intern/*`-Routen; leitet nicht eingeloggte Nutzer zu `/login` weiter
- **Login-Flow**:
  1. `POST /api/auth/login` – prüft Passwort, setzt HttpOnly JWE-Cookie
  2. Middleware liest Cookie bei jeder Anfrage und validiert
  3. `POST /api/auth/logout` – löscht Cookie

### Admin-Bereich (`/admin/*`)

- **Mechanismus**: Supabase Auth (Email + Passwort)
- **Community-Isolierung**: Jeder Admin-Account hat `user_metadata.community` gesetzt → RLS-Policies nutzen diesen Wert
- **Auth-Guard**: `app/admin/(protected)/layout.tsx` prüft Session serverseitig

---

## Datenbank (Supabase)

### Tabellen

| Tabelle | Beschreibung |
|---|---|
| `posts` | Schwarzes Brett (Angebote & Gesuche) |
| `trades` | Tauschbörse (Tausch, Skill-Angebote/-Gesuche) |
| `events` | Kalender-Events |
| `blog_posts` | Neuigkeiten (mit `published`-Flag) |
| `lend_items` | Verleihpool-Artikel |

### Enums

```sql
community_type: 'sheridan-junia' | 'wagnisshare' | 'wogenau'
post_type:      'angebot' | 'gesuch'
trade_type:     'tausch' | 'skill-angebot' | 'skill-gesuch'
```

### Row Level Security (RLS)

- **Posts / Trades**: Jeder kann lesen und erstellen (kein Admin erforderlich)
- **Events**: Alle können lesen; nur Ersteller können eigene Events bearbeiten/löschen
- **Blog-Posts**: Nur `published=true` ist öffentlich; Ersteller sehen alle eigenen Posts
- **Lend-Items**: Community-basiert – Admins verwalten nur Artikel ihrer Community

### Bild-Upload (Supabase Storage)

- Bilder werden in Supabase Storage hochgeladen
- `lib/utils/imageUpload.ts` – Utility für Upload-Logik
- `components/ImageUpload.tsx` – Wiederverwendbare Upload-Komponente
- `supabase/image_upload_setup.sql` + `setup_storage_policies.sql` – Storage-Bucket-Konfiguration und Policies

---

## Features im Detail

### Öffentliche Seiten

**Startseite (`/`)**
- Abwechselndes Bild-Text-Layout für die drei Gemeinschaften (60%/40%)
- Kennzahlen-Sektion: 260 Wohnungen, 3 Gemeinschaften, 1 Quartier
- Vorschau der letzten 3 Blog-Beiträge
- Vorschau der nächsten 3 Events
- Abwechselnd weiß/hellgrau Sektionen für visuellen Rhythmus

**Projektseiten (`/projekte/...`)**
- Detailseiten für jede der drei Baugemeinschaften
- Galerie, Beschreibungen, Kennzahlen

**Blog (`/neuigkeiten`)**
- Listenansicht aller veröffentlichten Beiträge
- Einzelansicht mit Markdown-Rendering

### Interner Bereich

**Schwarzes Brett (`/intern/schwarzes-brett`)**
- Angebote und Gesuche der Bewohner
- Kategorisierung nach Typ
- Einträge haben Ablaufdatum; abgelaufene werden ausgeblendet
- Community-Badge zeigt Herkunft

**Tauschbörse (`/intern/tauschboerse`)**
- Tausch von Gegenständen
- Skill-Angebote und Skill-Gesuche
- Kontaktinformationen sichtbar für eingeloggte Nutzer

**Verleihpool (`/intern/verleihpool`)**
- Gegenstände zum Ausleihen aus allen drei Gemeinschaften
- Kategorien: Werkzeug, Garten, Haushalt, Freizeit, Sonstiges
- Verfügbarkeitsstatus (grün = verfügbar, grau = ausgeliehen)
- Komponente: `LendItemCard.tsx`

**Kalender (`/intern/kalender`)**
- Events aus dem Quartier
- Kalenderansicht + Listenansicht (Listenansicht als Standard auf Mobile)
- Komponente: `CalendarView.tsx`

**Raumbuchungen (`/intern/raumbuchungen`)**
- Übersicht der buchbaren Räume
- Gästeappartement (mit Beschreibung, Preis, Buchungslink)
- Gemeinschaftsraum

### Admin-Bereich (`/admin`)

- **Dashboard**: Übersicht und Navigation
- **Blog verwalten**: Beiträge erstellen, bearbeiten, veröffentlichen (Entwurf-System)
- **Kalender verwalten**: Events erstellen und löschen
- **Schwarzes Brett**: Admin-Verwaltung von Posts
- **Skills**: Verwaltung
- **Verleihpool verwalten**: Artikel hinzufügen, bearbeiten, Verfügbarkeit togglen

---

## Umgebungsvariablen

```env
NEXT_PUBLIC_SUPABASE_URL=       # Supabase Projekt-URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase Anon Key
SUPABASE_SERVICE_ROLE_KEY=      # Supabase Service Role Key (nur Server)
INTERNAL_PASSWORD=              # Passwort für internen Bereich
COOKIE_SECRET=                  # Min. 32 Zeichen, für JWE-Verschlüsselung
```

---

## Deployment

- **Plattform**: Vercel
- **Automatisch**: Bei jedem Push auf `main` wird neu deployed
- Umgebungsvariablen müssen in den Vercel Project Settings hinterlegt werden

---

## Wichtige Designentscheidungen

1. **Zwei getrennte Auth-Systeme**: Cookie-Auth für Bewohner (einfach, shared password) vs. Supabase Auth für Admins (sicher, individuell, community-isoliert). Dies verhindert, dass Bewohner Admin-Funktionen sehen.

2. **Server Components by default**: Daten werden serverseitig geladen (Supabase Server Client) – keine unnötigen Client-seitigen Fetches.

3. **RLS als Sicherheitsschicht**: Alle Datenbankzugriffe sind durch RLS-Policies abgesichert, auch wenn die API kompromittiert wäre.

4. **Community-Metadata in Supabase Auth**: `user_metadata.community` auf dem Auth-User ermöglicht RLS-Policies, die automatisch nach Community filtern, ohne dass der Admin selbst angeben muss, welcher Community ein Inhalt gehört.

5. **Ablaufdatum auf Posts/Trades**: Einträge im Schwarzen Brett und der Tauschbörse haben ein `expires_at`-Feld. Die Abfragen filtern automatisch auf `expires_at > NOW()`.

---

## Supabase-Setup (Reihenfolge)

1. `schema.sql` ausführen (Basis-Tabellen, Enums, RLS-Policies, Indizes)
2. `create_lend_items_table.sql` ausführen (Verleihpool-Tabelle)
3. `add_image_columns.sql` ausführen (Bild-Spalten zu Tabellen hinzufügen)
4. `image_upload_setup.sql` ausführen (Storage-Bucket erstellen)
5. `setup_storage_policies.sql` ausführen (Storage-Zugriffspolicies)
6. Admin-Accounts über Supabase Auth Dashboard anlegen + `community` in `user_metadata` setzen

---

*Letzte Aktualisierung: März 2026*
