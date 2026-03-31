-- Füge image_url Spalten zu den bestehenden Tabellen hinzu

-- Schwarzes Brett
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Tauschbörse
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verleihpool
ALTER TABLE lend_items
ADD COLUMN IF NOT EXISTS image_url TEXT;

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
