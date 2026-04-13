// Unsplash image IDs chosen for dark, editorial, isolated-on-black food feel
export const CATEGORIES = [
  {
    id: 1,
    name_en: 'Signature Burgers',
    name_ar: 'البرغر المميّز',
    desc_en: 'Handcrafted compositions — each one a chef\'s thesis.',
    desc_ar: 'تركيبات يدوية الصنع — كلّ منها أطروحة الشيف.',
    sort_order: 1,
    bg_texture: 'charcoal',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80&fit=crop',
    item_count: 6,
  },
  {
    id: 2,
    name_en: 'Wagyu & Steaks',
    name_ar: 'الواغيو والستيك',
    desc_en: 'Premium cuts. Aged in silence. Finished over live fire.',
    desc_ar: 'قطع فاخرة. معتّقة في هدوء. مطهوّة على نار حية.',
    sort_order: 2,
    bg_texture: 'marble',
    image_url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=900&q=80&fit=crop',
    item_count: 4,
  },
  {
    id: 3,
    name_en: 'Cold Craft',
    name_ar: 'المشروبات الباردة',
    desc_en: 'Artisan beverages. Steeped in intention.',
    desc_ar: 'مشروبات حرفية. مُعدَّة بعناية فائقة.',
    sort_order: 3,
    bg_texture: 'wood',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=80&fit=crop',
    item_count: 5,
  },
  {
    id: 4,
    name_en: 'The Sides',
    name_ar: 'المرافقات',
    desc_en: 'Never an afterthought. Always a statement.',
    desc_ar: 'ليست إضافة. بل تصريح بالذوق.',
    sort_order: 4,
    bg_texture: 'wood',
    image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=900&q=80&fit=crop',
    item_count: 7,
  },
  {
    id: 5,
    name_en: 'Dessert',
    name_ar: 'الحلويات',
    desc_en: 'The final note. Sweet, precise, unforgettable.',
    desc_ar: 'النغمة الأخيرة. حلو، دقيق، لا يُنسى.',
    sort_order: 5,
    bg_texture: 'charcoal',
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=900&q=80&fit=crop',
    item_count: 4,
  },
]

export const ITEMS = {
  1: [
    {
      id: 101,
      name_en: 'The Obsidian',
      name_ar: 'الأوبسيديان',
      desc_en: 'Double smash patty, black brioche, truffle aioli, aged cheddar, caramelised shallots.',
      desc_ar: 'باتي مضغوط مزدوج، بريوش أسود، أيولي الكمأة، شيدر معتّق، كراث مكرمل.',
      price: 85,
      has_steam: true,
      is_chef_pick: true,
      img_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=85&fit=crop',
    },
    {
      id: 102,
      name_en: 'The Gold Standard',
      name_ar: 'المعيار الذهبي',
      desc_en: 'Wagyu blend, saffron mayo, crispy shallots, micro greens, brioche.',
      desc_ar: 'خلطة واغيو، مايونيز الزعفران، كراث مقرمش، خضروات صغيرة، بريوش.',
      price: 95,
      has_steam: true,
      is_chef_pick: false,
      img_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=85&fit=crop',
    },
    {
      id: 103,
      name_en: 'Noir Classic',
      name_ar: 'الكلاسيكي الأسود',
      desc_en: 'Prime beef, black garlic, smoked gouda, iceberg, house pickles.',
      desc_ar: 'لحم بقري فاخر، ثوم أسود، غودا مدخّن، خس جبل الجليد، مخللات البيت.',
      price: 72,
      has_steam: false,
      is_chef_pick: false,
      img_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=85&fit=crop',
    },
  ],
  2: [
    {
      id: 201,
      name_en: 'Wagyu Ribeye A5',
      name_ar: 'ريب آي واغيو A5',
      desc_en: '200g A5 Wagyu, herb butter, maldon salt, jus.',
      desc_ar: '٢٠٠ غرام واغيو A5، زبدة الأعشاب، ملح مالدون، جس.',
      price: 245,
      has_steam: true,
      is_chef_pick: true,
      img_url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&q=85&fit=crop',
    },
  ],
}

export const SUPABASE_SQL = `
-- =============================================
-- Art Burger — Supabase Schema
-- =============================================

-- Categories Table
CREATE TABLE categories (
  id          BIGSERIAL PRIMARY KEY,
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  desc_ar     TEXT,
  desc_en     TEXT,
  bg_texture_url TEXT,             -- URL to subtle bg texture image
  image_url   TEXT,                -- Hero image for category card
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Items Table
CREATE TABLE items (
  id            BIGSERIAL PRIMARY KEY,
  category_id   BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  desc_ar       TEXT,
  desc_en       TEXT,
  price         NUMERIC(10, 2) NOT NULL,
  img_url       TEXT,              -- Isolated PNG preferred
  has_steam     BOOLEAN DEFAULT FALSE,
  is_chef_pick  BOOLEAN DEFAULT FALSE,
  sort_order    INT DEFAULT 0,
  is_available  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- Row Level Security (read-only for anon)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read items" ON items FOR SELECT USING (is_available = true);
`
