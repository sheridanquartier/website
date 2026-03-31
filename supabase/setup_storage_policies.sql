-- Storage Policies für den quartier-images Bucket
-- Diese Policies erlauben authentifizierten Benutzern das Hochladen und allen das Lesen

-- ============================================
-- 1. Lösche existierende Policies (falls vorhanden)
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- ============================================
-- 2. Erstelle neue Policies
-- ============================================

-- INSERT Policy: Authentifizierte Benutzer können Bilder hochladen
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quartier-images');

-- SELECT Policy: Jeder kann Bilder lesen (auch nicht-angemeldete Benutzer)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'quartier-images');

-- DELETE Policy: Authentifizierte Benutzer können Bilder löschen
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'quartier-images');

-- ============================================
-- Erfolgsmeldung
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Storage Policies für quartier-images Bucket erfolgreich erstellt!';
    RAISE NOTICE 'Authentifizierte Benutzer können jetzt Bilder hochladen und löschen.';
    RAISE NOTICE 'Alle Benutzer (auch nicht-angemeldete) können Bilder ansehen.';
END $$;
