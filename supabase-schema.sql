-- =============================================
-- Art Burger — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1) Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id          BIGSERIAL PRIMARY KEY,
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  desc_ar     TEXT,
  desc_en     TEXT,
  image_url   TEXT,
  item_count  INT DEFAULT 0,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Items Table
CREATE TABLE IF NOT EXISTS items (
  id            BIGSERIAL PRIMARY KEY,
  category_id   BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  desc_ar       TEXT,
  desc_en       TEXT,
  price         NUMERIC(10, 2) NOT NULL,
  img_url       TEXT,
  has_steam     BOOLEAN DEFAULT FALSE,
  is_chef_pick  BOOLEAN DEFAULT FALSE,
  sort_order    INT DEFAULT 0,
  is_available  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_available ON items(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- 4) Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Public read access (for the menu website)
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public read items"
  ON items FOR SELECT
  USING (is_available = true);

-- Authenticated users can do everything (for admin)
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access items"
  ON items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5) Auto-update item_count on categories
CREATE OR REPLACE FUNCTION update_category_item_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE categories
    SET item_count = (
      SELECT COUNT(*) FROM items
      WHERE category_id = NEW.category_id AND is_available = true
    )
    WHERE id = NEW.category_id;
  END IF;

  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE categories
    SET item_count = (
      SELECT COUNT(*) FROM items
      WHERE category_id = OLD.category_id AND is_available = true
    )
    WHERE id = OLD.category_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_item_count
AFTER INSERT OR UPDATE OR DELETE ON items
FOR EACH ROW EXECUTE FUNCTION update_category_item_count();

-- =============================================
-- Storage Setup (do this in Supabase Dashboard):
-- 
-- 1. Go to Storage → Create bucket "images"
-- 2. Set bucket to PUBLIC
-- 3. Add policy: Allow public read (SELECT)
-- 4. Add policy: Allow authenticated upload (INSERT)
-- 5. Add policy: Allow authenticated delete (DELETE)
-- =============================================
