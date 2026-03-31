-- Migration fuer bestehende Instanzen:
-- Bewohner behalten Besitzrechte ueber creator_session_id.
-- Admins erhalten Community- oder Superadmin-Rechte ueber role/community Metadata.

ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'tausch';

ALTER TABLE posts ADD COLUMN IF NOT EXISTS offer TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seek TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS creator_session_id TEXT;

ALTER TABLE trades ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS creator_session_id TEXT;

ALTER TABLE lend_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role'
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth_community()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'community',
    auth.jwt() -> 'user_metadata' ->> 'community'
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT auth_role() = 'superadmin';
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION can_manage_community(target_community community_type)
RETURNS BOOLEAN AS $$
  SELECT is_superadmin() OR (
    auth_role() = 'community_admin' AND auth_community() = target_community::text
  );
$$ LANGUAGE sql STABLE;

DROP POLICY IF EXISTS "Posts sind öffentlich lesbar" ON posts;
DROP POLICY IF EXISTS "Jeder kann Posts erstellen" ON posts;
DROP POLICY IF EXISTS "Admins können Posts löschen" ON posts;
DROP POLICY IF EXISTS "Posts sind lesbar" ON posts;
DROP POLICY IF EXISTS "Admins koennen Posts bearbeiten" ON posts;
DROP POLICY IF EXISTS "Admins koennen Posts loeschen" ON posts;

CREATE POLICY "Posts sind lesbar" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Admins koennen Posts bearbeiten" ON posts
  FOR UPDATE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

CREATE POLICY "Admins koennen Posts loeschen" ON posts
  FOR DELETE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

DROP POLICY IF EXISTS "Trades sind öffentlich lesbar" ON trades;
DROP POLICY IF EXISTS "Jeder kann Trades erstellen" ON trades;
DROP POLICY IF EXISTS "Admins können Trades löschen" ON trades;
DROP POLICY IF EXISTS "Trades sind lesbar" ON trades;
DROP POLICY IF EXISTS "Admins koennen Trades bearbeiten" ON trades;
DROP POLICY IF EXISTS "Admins koennen Trades loeschen" ON trades;

CREATE POLICY "Trades sind lesbar" ON trades
  FOR SELECT USING (true);

CREATE POLICY "Admins koennen Trades bearbeiten" ON trades
  FOR UPDATE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

CREATE POLICY "Admins koennen Trades loeschen" ON trades
  FOR DELETE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

DROP POLICY IF EXISTS "Events sind öffentlich lesbar" ON events;
DROP POLICY IF EXISTS "Nur Ersteller können Events erstellen" ON events;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Events bearbeiten" ON events;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Events löschen" ON events;
DROP POLICY IF EXISTS "Events sind lesbar" ON events;
DROP POLICY IF EXISTS "Admins koennen Events erstellen" ON events;
DROP POLICY IF EXISTS "Events koennen bearbeitet werden" ON events;
DROP POLICY IF EXISTS "Events koennen geloescht werden" ON events;

CREATE POLICY "Events sind lesbar" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins koennen Events erstellen" ON events
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND can_manage_community(community)
  );

CREATE POLICY "Events koennen bearbeitet werden" ON events
  FOR UPDATE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

CREATE POLICY "Events koennen geloescht werden" ON events
  FOR DELETE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

DROP POLICY IF EXISTS "Veröffentlichte Blog-Posts sind öffentlich lesbar" ON blog_posts;
DROP POLICY IF EXISTS "Ersteller können alle eigenen Posts sehen" ON blog_posts;
DROP POLICY IF EXISTS "Nur Ersteller können Blog-Posts erstellen" ON blog_posts;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Blog-Posts bearbeiten" ON blog_posts;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Blog-Posts löschen" ON blog_posts;
DROP POLICY IF EXISTS "Veroeffentlichte Blog Posts sind lesbar" ON blog_posts;
DROP POLICY IF EXISTS "Admins koennen Blog Posts erstellen" ON blog_posts;
DROP POLICY IF EXISTS "Blog Posts koennen bearbeitet werden" ON blog_posts;
DROP POLICY IF EXISTS "Blog Posts koennen geloescht werden" ON blog_posts;

CREATE POLICY "Veroeffentlichte Blog Posts sind lesbar" ON blog_posts
  FOR SELECT USING (
    published = true
    OR created_by = auth.uid()
    OR can_manage_community(community)
  );

CREATE POLICY "Admins koennen Blog Posts erstellen" ON blog_posts
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND can_manage_community(community)
  );

CREATE POLICY "Blog Posts koennen bearbeitet werden" ON blog_posts
  FOR UPDATE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

CREATE POLICY "Blog Posts koennen geloescht werden" ON blog_posts
  FOR DELETE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

DROP POLICY IF EXISTS "Verleihpool-Artikel sind öffentlich lesbar" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können Verleihpool-Artikel erstellen" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Verleihpool-Artikel bearbeiten" ON lend_items;
DROP POLICY IF EXISTS "Nur Ersteller können eigene Verleihpool-Artikel löschen" ON lend_items;
DROP POLICY IF EXISTS "Admins können Lend Items löschen" ON lend_items;
DROP POLICY IF EXISTS "Lend Items sind lesbar" ON lend_items;
DROP POLICY IF EXISTS "Admins koennen Lend Items erstellen" ON lend_items;
DROP POLICY IF EXISTS "Lend Items koennen bearbeitet werden" ON lend_items;
DROP POLICY IF EXISTS "Lend Items koennen geloescht werden" ON lend_items;

CREATE POLICY "Lend Items sind lesbar" ON lend_items
  FOR SELECT USING (true);

CREATE POLICY "Admins koennen Lend Items erstellen" ON lend_items
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND can_manage_community(community)
  );

CREATE POLICY "Lend Items koennen bearbeitet werden" ON lend_items
  FOR UPDATE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );

CREATE POLICY "Lend Items koennen geloescht werden" ON lend_items
  FOR DELETE USING (
    (created_by = auth.uid())
    OR can_manage_community(community)
  );
