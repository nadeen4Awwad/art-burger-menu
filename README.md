# Art Burger — A Culinary Exhibition

Dark luxury restaurant menu with Supabase backend, admin panel, and cart system.

## Features

- **Dynamic Menu** — Categories and items loaded from Supabase API
- **Fast Loading** — In-memory caching + image preloading + prefetch on hover
- **Admin Panel** — Login, manage categories & items, upload images to Supabase Storage
- **Shopping Cart** — Add items, adjust quantities, order via WhatsApp
- **Bilingual** — Arabic & English with RTL support
- **Luxury Design** — Dark theme with gold accents, animations, decorative elements

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Storage** → Create a bucket called `images` → Set it to **Public**
4. Add Storage policies:
   - Public read (SELECT) for everyone
   - Authenticated upload (INSERT) and delete (DELETE)

### 2. Create Admin User

In Supabase **Authentication** → **Users** → **Add User**:
- Email: `admin@artburger.com`
- Password: (your choice)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase URL and anon key (from Project Settings → API).

### 4. Run

```bash
npm install
npm run dev
```

### 5. Access

- **Menu**: `http://localhost:5173`
- **Admin**: `http://localhost:5173/#/admin`

## Architecture

```
src/
├── components/
│   ├── CartDrawer.jsx        # Shopping cart drawer
│   ├── CategoriesSection.jsx # Category grid with prefetch
│   ├── ItemsDrawer.jsx       # Items panel with Add to Cart
│   ├── Navbar.jsx             # Navigation with cart badge
│   ├── DecorativeLayer.jsx   # Floating spice decorations
│   ├── Hero.jsx               # Landing section
│   ├── Footer.jsx
│   ├── SteamEffect.jsx
│   └── WhatsAppButton.jsx
├── context/
│   └── CartContext.jsx       # Cart state management
├── hooks/
│   └── useData.js            # Data fetching with cache + auth
├── lib/
│   └── supabase.js           # Supabase client + storage helpers
├── pages/
│   └── AdminPage.jsx         # Full admin dashboard
├── data/
│   └── mockData.js           # Fallback data (when no Supabase)
├── i18n/                      # Translations (ar/en)
└── App.jsx                    # Root with routing
```

## Performance Optimizations

- **In-memory cache**: Categories and items cached after first load
- **Prefetch on hover**: Items data fetched when user hovers over a category
- **Image preloading**: All images preloaded via `new Image()` on data fetch
- **Supabase Storage CDN**: Images served with 1-year cache headers
- **No refetch**: Cached data returned instantly on subsequent visits
