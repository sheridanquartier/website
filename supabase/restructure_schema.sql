-- Umstrukturierung: Schwarzes Brett + Tauschbörse zusammenführen, Skills separieren

-- ============================================
-- 1. Erweitere posts (Schwarzes Brett) um 'tausch' type
-- ============================================

-- Füge 'tausch' zum post_type enum hinzu
ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'tausch';

-- Füge Felder für Tauschen hinzu (wie bei trades)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS offer TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seek TEXT;

-- ============================================
-- 2. Migrationsskript: Verschiebe 'tausch' Einträge von trades zu posts
-- ============================================

-- Kopiere alle Tausch-Einträge von trades nach posts
INSERT INTO posts (
  id,
  title,
  description,
  type,
  category,
  offer,
  seek,
  image_url,
  community,
  contact_name,
  contact_info,
  expires_at,
  created_at,
  updated_at
)
SELECT
  id,
  title,
  description,
  'tausch'::post_type,
  'Sonstiges', -- Default-Kategorie für migrierte Einträge
  offer,
  seek,
  image_url,
  community,
  contact_name,
  contact_info,
  expires_at,
  created_at,
  updated_at
FROM trades
WHERE type = 'tausch'
ON CONFLICT (id) DO NOTHING;

-- Lösche die migrierten Tausch-Einträge aus trades
DELETE FROM trades WHERE type = 'tausch';

-- ============================================
-- 3. Benenne trades Tabelle um in skills (für Skills)
-- ============================================

-- Die trades Tabelle wird jetzt nur noch für Skills verwendet
-- Sie enthält jetzt nur noch 'skill-angebot' und 'skill-gesuch'

-- Optional: Tabelle umbenennen (Achtung: bricht bestehende Queries!)
-- ALTER TABLE trades RENAME TO skills;

-- Falls du die Tabelle NICHT umbenennen willst, bleibt trades bestehen
-- und wird weiterhin für Skills verwendet

-- ============================================
-- 4. Admin-Löschrechte: Policies anpassen
-- ============================================

-- Posts (Schwarzes Brett): Admins können alles löschen
DROP POLICY IF EXISTS "Admins können Posts löschen" ON posts;
CREATE POLICY "Admins können Posts löschen" ON posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Trades/Skills: Admins können alles löschen
DROP POLICY IF EXISTS "Admins können Trades löschen" ON trades;
CREATE POLICY "Admins können Trades löschen" ON trades
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Lend Items (Verleihpool): Policy existiert bereits (nur Ersteller)
-- Zusätzliche Policy für Admins
DROP POLICY IF EXISTS "Admins können Lend Items löschen" ON lend_items;
CREATE POLICY "Admins können Lend Items löschen" ON lend_items
  FOR DELETE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- 5. Admin-Rolle für Benutzer setzen
-- ============================================

-- WICHTIG: Passe die E-Mail-Adressen an deine Admin-Accounts an!
-- Beispiel für einen Admin:

-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'::jsonb
-- )
-- WHERE email = 'dein-admin@example.com';

-- ============================================
-- Erfolgsmeldung
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Schema-Umstrukturierung abgeschlossen!';
    RAISE NOTICE '- Posts (Schwarzes Brett) unterstützt jetzt auch "tausch"';
    RAISE NOTICE '- Tausch-Einträge von trades nach posts migriert';
    RAISE NOTICE '- trades Tabelle enthält nur noch Skills';
    RAISE NOTICE '- Admin-Löschrechte hinzugefügt';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  WICHTIG: Setze die Admin-Rolle für deine Admin-Accounts!';
    RAISE NOTICE 'Siehe Kommentare am Ende des Scripts.';
END $$;
