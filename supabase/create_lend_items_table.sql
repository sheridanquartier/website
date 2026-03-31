-- Erstelle lend_items Tabelle (Verleihpool), falls sie noch nicht existiert

-- Stelle sicher, dass der community_type existiert
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'community_type') THEN
        CREATE TYPE community_type AS ENUM ('sheridan-junia', 'wagnisshare', 'wogenau');
    END IF;
END $$;

-- Erstelle die Tabelle
CREATE TABLE IF NOT EXISTS lend_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('werkzeug', 'garten', 'haushalt', 'freizeit', 'sonstiges')),
  image_url TEXT,
  community community_type NOT NULL,
  available BOOLEAN DEFAULT true,
  contact TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Alle können lesen, nur Ersteller können bearbeiten
ALTER TABLE lend_items ENABLE ROW LEVEL SECURITY;

-- Lösche existierende Policies (falls vorhanden)
DROP POLICY IF EXISTS "Verleihpool-Artikel sind öffentlich lesbar" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können Verleihpool-Artikel erstellen" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Verleihpool-Artikel bearbeiten" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Verleihpool-Artikel löschen" ON lend_items;

-- Erstelle Policies
CREATE POLICY "Verleihpool-Artikel sind öffentlich lesbar" ON lend_items
  FOR SELECT USING (true);

CREATE POLICY "Nur Ersteller können Verleihpool-Artikel erstellen" ON lend_items
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Nur Ersteller können eigene Verleihpool-Artikel bearbeiten" ON lend_items
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Nur Ersteller können eigene Verleihpool-Artikel löschen" ON lend_items
  FOR DELETE USING (auth.uid() = created_by);

-- Erstelle Indizes (falls noch nicht vorhanden)
CREATE INDEX IF NOT EXISTS lend_items_category_idx ON lend_items(category);
CREATE INDEX IF NOT EXISTS lend_items_community_idx ON lend_items(community);
CREATE INDEX IF NOT EXISTS lend_items_created_by_idx ON lend_items(created_by);
CREATE INDEX IF NOT EXISTS lend_items_available_idx ON lend_items(available);

-- Erstelle update_updated_at Funktion falls noch nicht vorhanden
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für updated_at
DROP TRIGGER IF EXISTS update_lend_items_updated_at ON lend_items;
CREATE TRIGGER update_lend_items_updated_at BEFORE UPDATE ON lend_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Erfolgsmeldung
DO $$
BEGIN
    RAISE NOTICE 'lend_items Tabelle wurde erfolgreich erstellt (oder existierte bereits)';
END $$;
