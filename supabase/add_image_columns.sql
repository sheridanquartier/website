-- Füge image_url Spalten zu den bestehenden Tabellen hinzu
-- Diese Version fügt nur Spalten zu Tabellen hinzu, die bereits existieren

-- Schwarzes Brett
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
        RAISE NOTICE 'image_url Spalte zu posts hinzugefügt';
    ELSE
        RAISE NOTICE 'Tabelle posts existiert nicht - überspringe';
    END IF;
END $$;

-- Tauschbörse
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trades') THEN
        ALTER TABLE trades ADD COLUMN IF NOT EXISTS image_url TEXT;
        RAISE NOTICE 'image_url Spalte zu trades hinzugefügt';
    ELSE
        RAISE NOTICE 'Tabelle trades existiert nicht - überspringe';
    END IF;
END $$;

-- Verleihpool
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lend_items') THEN
        ALTER TABLE lend_items ADD COLUMN IF NOT EXISTS image_url TEXT;
        RAISE NOTICE 'image_url Spalte zu lend_items hinzugefügt';
    ELSE
        RAISE NOTICE 'Tabelle lend_items existiert nicht - überspringe';
    END IF;
END $$;

-- Blog Posts (Neuigkeiten)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
        RAISE NOTICE 'image_url Spalte zu blog_posts hinzugefügt';
    ELSE
        RAISE NOTICE 'Tabelle blog_posts existiert nicht - überspringe';
    END IF;
END $$;

-- WICHTIG: Nach dem Ausführen dieses Scripts muss noch ein Storage Bucket erstellt werden:
--
-- 1. Gehe zu Supabase Dashboard → Storage
-- 2. Klicke auf "New Bucket"
-- 3. Name: quartier-images
-- 4. Public: true (Häkchen setzen)
-- 5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
-- 6. Max file size: 1 MB (1048576 Bytes)
-- 7. Klicke auf "Save"
--
-- Optional: Storage Policies für den Bucket (erlaubt allen authentifizierten Usern Upload):
--
-- INSERT Policy für Upload (alle eingeloggten User können hochladen):
-- CREATE POLICY "Allow authenticated uploads"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'quartier-images');
--
-- SELECT Policy für öffentlichen Zugriff:
-- CREATE POLICY "Public access"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'quartier-images');
