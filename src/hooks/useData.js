import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, ITEMS } from '../data/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL

// ── In-memory cache for instant repeat loads ──
const cache = {
  categories: null,
  items: {},
}

/**
 * Preload images so they appear instantly when UI renders
 */
function preloadImages(urls) {
  urls.forEach((url) => {
    if (url) {
      const img = new Image()
      img.src = url
    }
  })
}

// ── Categories Hook ──
export function useCategories() {
  const [categories, setCategories] = useState(cache.categories || [])
  const [loading, setLoading] = useState(!cache.categories)

  useEffect(() => {
    if (cache.categories) {
      setCategories(cache.categories)
      setLoading(false)
      return
    }

    if (USE_MOCK) {
      cache.categories = CATEGORIES
      setCategories(CATEGORIES)
      setLoading(false)
      preloadImages(CATEGORIES.map((c) => c.image_url))
      return
    }

    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) {
          cache.categories = data
          setCategories(data)
          preloadImages(data.map((c) => c.image_url))
        }
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}

// ── Items Hook with caching ──
export function useItems(categoryId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryId) {
      setItems([])
      setLoading(false)
      return
    }

    if (cache.items[categoryId]) {
      setItems(cache.items[categoryId])
      setLoading(false)
      return
    }

    if (USE_MOCK) {
      const mockItems = ITEMS[categoryId] || []
      cache.items[categoryId] = mockItems
      setItems(mockItems)
      setLoading(false)
      preloadImages(mockItems.map((it) => it.img_url))
      return
    }

    setLoading(true)
    supabase
      .from('items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) {
          cache.items[categoryId] = data
          setItems(data)
          preloadImages(data.map((it) => it.img_url))
        }
        setLoading(false)
      })
  }, [categoryId])

  return { items, loading }
}

/**
 * Prefetch items for a category (call on hover for instant load)
 */
export function prefetchItems(categoryId) {
  if (!categoryId || cache.items[categoryId]) return

  if (USE_MOCK) {
    const mockItems = ITEMS[categoryId] || []
    cache.items[categoryId] = mockItems
    preloadImages(mockItems.map((it) => it.img_url))
    return
  }

  if (!supabase) return

  supabase
    .from('items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_available', true)
    .order('sort_order')
    .then(({ data, error }) => {
      if (!error && data) {
        cache.items[categoryId] = data
        preloadImages(data.map((it) => it.img_url))
      }
    })
}

/**
 * Clear cache (useful after admin edits)
 */
export function clearCache() {
  cache.categories = null
  cache.items = {}
}

// ── Admin Auth Hook ──
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!supabase) return { error: 'Supabase not configured' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return { user, loading, signIn, signOut }
}
