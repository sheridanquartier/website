-- Sheridan Quartier Datenbank Schema

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE community_type AS ENUM ('sheridan-junia', 'wagnisshare', 'wogenau');
CREATE TYPE post_type AS ENUM ('angebot', 'gesuch', 'tausch');
CREATE TYPE trade_type AS ENUM ('tausch', 'skill-angebot', 'skill-gesuch');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND COALESCE(OLD.published, false) = false THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POSTS (Schwarzes Brett)
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type post_type NOT NULL,
  category TEXT NOT NULL,
  offer TEXT,
  seek TEXT,
  image_url TEXT,
  community community_type NOT NULL,
  contact_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  creator_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX posts_expires_at_idx ON posts(expires_at);
CREATE INDEX posts_community_idx ON posts(community);
CREATE INDEX posts_type_idx ON posts(type);
CREATE INDEX posts_created_by_idx ON posts(created_by);

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRADES (Tauschboerse + Skills)
-- ============================================
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type trade_type NOT NULL,
  offer TEXT,
  seek TEXT,
  image_url TEXT,
  community community_type NOT NULL,
  contact_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  creator_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX trades_expires_at_idx ON trades(expires_at);
CREATE INDEX trades_community_idx ON trades(community);
CREATE INDEX trades_type_idx ON trades(type);
CREATE INDEX trades_created_by_idx ON trades(created_by);

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  community community_type NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX events_starts_at_idx ON events(starts_at);
CREATE INDEX events_community_idx ON events(community);
CREATE INDEX events_created_by_idx ON events(created_by);

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  community community_type NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_published_idx ON blog_posts(published);
CREATE INDEX blog_posts_community_idx ON blog_posts(community);
CREATE INDEX blog_posts_created_by_idx ON blog_posts(created_by);
CREATE INDEX blog_posts_published_at_idx ON blog_posts(published_at);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_blog_post_published_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================
-- LEND ITEMS
-- ============================================
CREATE TABLE lend_items (
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

ALTER TABLE lend_items ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX lend_items_category_idx ON lend_items(category);
CREATE INDEX lend_items_community_idx ON lend_items(community);
CREATE INDEX lend_items_created_by_idx ON lend_items(created_by);
CREATE INDEX lend_items_available_idx ON lend_items(available);

CREATE TRIGGER update_lend_items_updated_at BEFORE UPDATE ON lend_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
