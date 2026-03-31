# Sheridan Quartier - Nachbarschaftsplattform

Eine vollständige Next.js-Webanwendung für das Sheridan Quartier in Augsburg - eine Nachbarschaftsplattform, die drei Baugemeinschaften (Sheridan Park & Junia, wagnisSHARE, WOGENAU) verbindet.

## 🎯 Features

### ✨ Neue Features (inspiriert von fuerstenriedwest.de & prinzeugenpark.de)

**Startseite:**
- **Abwechselndes Bild-Text-Layout**: Gemeinschaften als große Bild-Text-Reihen (60%/40%)
- **Kennzahlen-Sektion**: 260 Wohnungen, 3 Gemeinschaften, 1 Quartier (typografisch)
- **Blog-Vorschau**: Letzte 3 Neuigkeiten aus dem Quartier
- **Events-Vorschau**: Nächste 3 kommende Veranstaltungen
- **Scroll-Rhythmus**: Abwechselnd weiß/hellgrau für visuellen Fluss

**Verleihpool (NEU):**
- Artikel zum Ausleihen aus allen drei Gemeinschaften
- Kategorien: Werkzeug, Garten, Haushalt, Freizeit, Sonstiges
- Verfügbarkeitsstatus mit grünem/grauem Punkt
- Admin-Bereich: CRUD + Toggle für Verfügbarkeit
- Row Level Security für sichere Verwaltung

**Services-Seite:**
- **Gästeappartements**: Aufgewertete Karten mit Beschreibung, Preis, Buchungslink
- Zwei Apartments für Sheridan & Junia mit allen Details
- Übersichtliche Darstellung aller gemeinschaftlichen Services

---

## 🎯 Features

### Öffentliche Seiten
- **Startseite**: Hero-Banner, Quartiersbeschreibung, Projekt-Übersicht
- **Projektseiten**: Detaillierte Informationen zu jeder Baugemeinschaft
- **Blog**: Neuigkeiten aus dem Quartier (öffentlich lesbar)
- **Impressum & Datenschutz**

### Interner Bereich (Passwortgeschützt)
- **Schwarzes Brett**: Angebote und Gesuche aus dem Quartier
- **Tauschbörse**: Gegenstände tauschen und Skills anbieten
- **Verleihpool**: Artikel zum Ausleihen aus den Gemeinschaften (NEU)
- **Kalender**: Kommende Events im Quartier (Listenansicht auf Mobile)
- **Services**: Gästeappartements und gemeinschaftliche Angebote

### Admin-Bereich (Supabase Auth)
- **Event-Verwaltung**: CRUD für Kalender-Events
- **Blog-Verwaltung**: Beiträge erstellen, bearbeiten und veröffentlichen
- **Verleihpool-Verwaltung**: Artikel hinzufügen, bearbeiten, Verfügbarkeit togglen (NEU)
- **Community-basierte RLS**: Jede Community verwaltet nur ihre eigenen Inhalte

## 🛠️ Tech-Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS mit Custom Design System
- **Datenbank**: Supabase (PostgreSQL + Row Level Security)
- **Auth**:
  - Cookie-basiert (jose/JWE) für internen Bereich
  - Supabase Auth für Admin-Bereich
- **Deployment**: Vercel

## 📦 Installation

### 1. Repository klonen

```bash
git clone <repository-url>
cd Quartiersvernetzung
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local` Datei basierend auf `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Füllen Sie die folgenden Variablen aus:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Internal Area Password
INTERNAL_PASSWORD=ihr-sicheres-passwort

# Cookie Secret (mindestens 32 Zeichen)
COOKIE_SECRET=generieren-sie-einen-zufaelligen-string-mit-32-zeichen
```

**Cookie Secret generieren:**
```bash
openssl rand -base64 32
```

### 4. Supabase Setup

#### 4.1 Supabase Projekt erstellen
1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Kopieren Sie URL und Keys aus den Projekteinstellungen

#### 4.2 Datenbank-Schema importieren
1. Öffnen Sie den SQL Editor in Supabase
2. Führen Sie das komplette Schema aus `supabase/schema.sql` aus
3. Verifizieren Sie, dass alle Tabellen erstellt wurden:
   - `posts` (Schwarzes Brett)
   - `trades` (Tauschbörse)
   - `events` (Kalender)
   - `blog_posts` (Neuigkeiten)
   - `lend_items` (Verleihpool - NEU)

#### 4.3 Admin-Accounts anlegen
Für jede Community benötigen Sie einen Admin-Account. Führen Sie folgendes SQL aus:

```sql
-- Admin-Account für Sheridan Park & Junia erstellen
-- (Wiederholen Sie dies für alle drei Communities)

-- 1. Nutzer wird über Supabase Auth Dashboard angelegt:
-- Email: admin-sheridan@example.com
-- Password: sicheres-passwort

-- 2. Nach Erstellung: user_metadata setzen
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('community', 'sheridan-junia')
WHERE email = 'admin-sheridan@example.com';
```

**Communities:**
- `sheridan-junia`: Sheridan Park & Junia
- `wagnisshare`: wagnisSHARE
- `wogenau`: WOGENAU

### 5. Bilder integrieren

Die Bilder befinden sich im Ordner `../Bilder`. Kopieren Sie diese nach `public/images/`:

```bash
mkdir -p public/images
cp -r ../Bilder/* public/images/
```

**Erwartete Struktur:**
```
public/images/
├── SheridanParkUndJunia/
│   ├── IMG_9669_hero.jpg
│   ├── IMG_8623_hero.jpg
│   ├── IMG_8623_gallery1.jpg
│   ├── IMG_8624_gallery2.jpg
│   └── IMG_9669_gallery3.jpg
├── Wagnis/
│   └── (Bilder für wagnisSHARE)
└── Wogenau/
    └── (Bilder für WOGENAU)
```

### 6. Development Server starten

```bash
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.

## 🚀 Deployment

### Vercel Deployment

1. **GitHub Repository verbinden**
   - Pushen Sie Ihren Code zu GitHub
   - Verbinden Sie das Repository mit Vercel

2. **Umgebungsvariablen setzen**
   - Gehen Sie zu Project Settings > Environment Variables
   - Fügen Sie alle Variablen aus `.env.local` hinzu

3. **Deploy**
   - Vercel deployt automatisch bei jedem Push zu `main`
   - Custom Domain kann in den Vercel-Einstellungen konfiguriert werden

### Build-Test (lokal)

```bash
npm run build
npm run start
```

## 📱 Mobile-First Design

Die Anwendung ist vollständig responsive und mobile-optimiert:

- **Touch-Targets**: Mindestens 44x44px für alle interaktiven Elemente
- **Kalender**: Listenansicht als Standard auf Mobile
- **Navigation**: Hamburger-Menü auf kleinen Bildschirmen
- **Formulare**: Optimiert für Touch-Eingabe
- **Typography**: Lesbar ohne Zoom (min. 14-16px)

## 🔐 Sicherheit

### Cookie-basierte Auth (Interner Bereich)
- Signierte JWT-Cookies (jose/JWE)
- HttpOnly, Secure, SameSite=Strict
- 7 Tage Gültigkeit

### Supabase Auth (Admin-Bereich)
- Email/Password Authentication
- Row Level Security (RLS) für Daten-Isolation
- Community-basierte Zugriffskontrollen

### Passwort-Empfehlungen
- **Interner Bereich**: Mindestens 12 Zeichen, allen Bewohnern bekannt
- **Admin-Accounts**: Individuelle, sichere Passwörter pro Community

## 📝 Inhalte verwalten

### Als Admin einloggen
1. Gehen Sie zu `/admin/login`
2. Melden Sie sich mit Ihrem Community-Account an
3. Sie sehen nur Inhalte Ihrer eigenen Community

### Events erstellen
1. Dashboard > Kalender verwalten
2. Neues Event erstellen
3. Event erscheint automatisch im internen Kalender

### Blog-Posts erstellen
1. Dashboard > Blog verwalten
2. Neuer Beitrag
3. Als Entwurf speichern ODER direkt veröffentlichen
4. Markdown-Syntax wird unterstützt

## 🤝 Beitragsregeln

### Schwarzes Brett & Tauschbörse
- Alle eingeloggten Nutzer können Einträge erstellen
- Einträge haben eine konfigurierbare Gültigkeitsdauer
- Abgelaufene Einträge werden automatisch ausgeblendet

### Kalender
- Nur Admins können Events erstellen
- Alle eingeloggten Nutzer können Events sehen
- Mobile-Nutzer sehen standardmäßig die Listenansicht

## 🐛 Troubleshooting

### Build-Fehler

**Problem**: TypeScript-Fehler beim Build
```bash
npm run build
```
**Lösung**: Prüfen Sie die TypeScript-Konfiguration und stellen Sie sicher, dass alle Types korrekt sind.

### Supabase-Verbindung schlägt fehl

**Problem**: "Invalid JWT" oder Connection Errors
**Lösung**:
- Überprüfen Sie die Supabase-URLs und Keys in `.env.local`
- Stellen Sie sicher, dass RLS-Policies korrekt konfiguriert sind

### Bilder werden nicht angezeigt

**Problem**: 404 für Bilder
**Lösung**:
- Prüfen Sie, ob `public/images/` existiert und Bilder enthält
- Restart des Dev-Servers nach Hinzufügen neuer Bilder

### Login funktioniert nicht

**Interner Bereich:**
- Prüfen Sie `INTERNAL_PASSWORD` in `.env.local`
- Prüfen Sie `COOKIE_SECRET` (muss gesetzt sein)

**Admin-Bereich:**
- Verifizieren Sie, dass `user_metadata.community` im Supabase Dashboard gesetzt ist
- Prüfen Sie Supabase Auth-Logs

## 📚 Weitere Ressourcen

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 Lizenz

Dieses Projekt ist für das Sheridan Quartier Augsburg entwickelt worden.

## 👥 Kontakt

Bei Fragen oder Problemen wenden Sie sich bitte an die Quartiersverwaltung.
