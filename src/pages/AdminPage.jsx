import { useState, useEffect, useCallback } from 'react'
import { supabase, uploadFile, deleteFile } from '../lib/supabase'
import { useAuth } from '../hooks/useData'
import { clearCache } from '../hooks/useData'

const BUCKET = 'images'

// ── Main Admin Page ──
export default function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '0.3em', fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
          Loading...
        </p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} />
  }

  return <AdminDashboard user={user} onSignOut={signOut} />
}

// ── Login Screen ──
function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await onSignIn(email, password)
    if (err) {
      setError(err.message || 'Login failed')
    }
    setSubmitting(false)
  }

  return (
    <div
      className="admin-page"
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          padding: '3rem 2.5rem',
          background: '#141414',
          border: '1px solid rgba(212,175,55,0.08)',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.8rem',
              color: 'var(--gold)',
              letterSpacing: '0.15em',
              marginBottom: 4,
            }}
          >
            ART BURGER
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 11, letterSpacing: '0.3em' }}>
            ADMIN PANEL
          </p>
        </div>

        {/* Gold line */}
        <div
          style={{
            width: 40,
            height: 1,
            background: 'linear-gradient(90deg, var(--gold), transparent)',
            margin: '0 auto 2rem',
          }}
        />

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="admin@artburger.com"
          />

          <label style={{ ...labelStyle, marginTop: 16 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="••••••••"
          />

          {error && (
            <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 12 }}>{error}</p>
          )}

          <button type="submit" disabled={submitting} style={btnPrimaryStyle}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Admin Dashboard ──
function AdminDashboard({ user, onSignOut }) {
  const [tab, setTab] = useState('categories')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingCat, setEditingCat] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)

  const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (USE_MOCK) {
      const { CATEGORIES } = await import('../data/mockData')
      setCategories(CATEGORIES)
      setLoading(false)
      return
    }
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data) setCategories(data)
    setLoading(false)
  }, [])

  // Fetch items for a category
  const fetchItems = useCallback(async (catId) => {
    if (!catId) { setItems([]); return }
    if (USE_MOCK) {
      const { ITEMS } = await import('../data/mockData')
      setItems(ITEMS[catId] || [])
      return
    }
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('category_id', catId)
      .order('sort_order')
    if (data) setItems(data)
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { fetchItems(selectedCatId) }, [selectedCatId, fetchItems])

  // Category CRUD
  const handleSaveCategory = async (catData, imageFile) => {
    clearCache()
    if (USE_MOCK) {
      alert('Cannot save in mock mode. Connect Supabase first.')
      return
    }

    let imageUrl = catData.image_url || ''
    if (imageFile) {
      const path = `categories/${Date.now()}_${imageFile.name}`
      const { url, error } = await uploadFile(BUCKET, path, imageFile)
      if (error) { alert('Image upload failed: ' + (error.message || error)); return }
      imageUrl = url
    }

    const payload = { ...catData, image_url: imageUrl }
    delete payload.id
    delete payload.created_at

    if (editingCat?.id) {
      await supabase.from('categories').update(payload).eq('id', editingCat.id)
    } else {
      await supabase.from('categories').insert(payload)
    }

    setShowCatForm(false)
    setEditingCat(null)
    fetchCategories()
  }

  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Delete "${cat.name_en}"?`)) return
    clearCache()
    if (USE_MOCK) return
    if (cat.image_url) await deleteFile(BUCKET, cat.image_url)
    await supabase.from('categories').delete().eq('id', cat.id)
    fetchCategories()
  }

  // Item CRUD
  const handleSaveItem = async (itemData, imageFile) => {
    clearCache()
    if (USE_MOCK) {
      alert('Cannot save in mock mode. Connect Supabase first.')
      return
    }

    let imgUrl = itemData.img_url || ''
    if (imageFile) {
      const path = `items/${Date.now()}_${imageFile.name}`
      const { url, error } = await uploadFile(BUCKET, path, imageFile)
      if (error) { alert('Image upload failed: ' + (error.message || error)); return }
      imgUrl = url
    }

    const payload = {
      ...itemData,
      img_url: imgUrl,
      category_id: selectedCatId,
      price: parseFloat(itemData.price) || 0,
    }
    delete payload.id
    delete payload.created_at

    if (editingItem?.id) {
      await supabase.from('items').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('items').insert(payload)
    }

    setShowItemForm(false)
    setEditingItem(null)
    fetchItems(selectedCatId)
  }

  const handleDeleteItem = async (item) => {
    if (!confirm(`Delete "${item.name_en}"?`)) return
    clearCache()
    if (USE_MOCK) return
    if (item.img_url) await deleteFile(BUCKET, item.img_url)
    await supabase.from('items').delete().eq('id', item.id)
    fetchItems(selectedCatId)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Cairo, sans-serif' }}>
      {/* Top bar */}
      <div
        style={{
          background: '#141414',
          borderBottom: '1px solid rgba(212,175,55,0.08)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.2rem',
              color: 'var(--gold)',
              letterSpacing: '0.15em',
            }}
          >
            ART BURGER
          </h1>
          <span style={{ color: 'var(--text-dim)', fontSize: 10, letterSpacing: '0.3em' }}>
            ADMIN
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{user.email}</span>
          <button onClick={onSignOut} style={btnSecondaryStyle}>
            Sign Out
          </button>
          <a
            href="/"
            style={{ ...btnSecondaryStyle, textDecoration: 'none', display: 'inline-block' }}
          >
            View Site
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '2rem' }}>
          {['categories', 'items'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 24px',
                fontFamily: 'Cairo, sans-serif',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: tab === t ? 'rgba(212,175,55,0.1)' : 'transparent',
                border: '1px solid',
                borderColor: tab === t ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)',
                color: tab === t ? 'var(--gold)' : 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {t === 'categories' ? 'Categories' : 'Items'}
            </button>
          ))}
        </div>

        {/* ─── Categories Tab ─── */}
        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Categories
              </h2>
              <button
                onClick={() => { setEditingCat(null); setShowCatForm(true) }}
                style={btnPrimaryStyle}
              >
                + Add Category
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '1rem 1.2rem',
                      background: '#141414',
                      border: '1px solid rgba(212,175,55,0.06)',
                    }}
                  >
                    {cat.image_url && (
                      <img
                        src={cat.image_url}
                        alt=""
                        style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 2, filter: 'brightness(0.7)' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>
                        {cat.name_en}
                      </h3>
                      <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                        {cat.name_ar} • Sort: {cat.sort_order}
                      </p>
                    </div>
                    <button
                      onClick={() => { setEditingCat(cat); setShowCatForm(true) }}
                      style={btnSmallStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      style={{ ...btnSmallStyle, borderColor: 'rgba(231,76,60,0.3)', color: '#e74c3c' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Category Form Modal */}
            {showCatForm && (
              <FormModal
                title={editingCat ? 'Edit Category' : 'Add Category'}
                onClose={() => { setShowCatForm(false); setEditingCat(null) }}
              >
                <CategoryForm
                  initial={editingCat}
                  onSave={handleSaveCategory}
                  onCancel={() => { setShowCatForm(false); setEditingCat(null) }}
                />
              </FormModal>
            )}
          </div>
        )}

        {/* ─── Items Tab ─── */}
        {tab === 'items' && (
          <div>
            {/* Category selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 8, display: 'block' }}>
                Select Category
              </label>
              <select
                value={selectedCatId || ''}
                onChange={(e) => setSelectedCatId(e.target.value ? Number(e.target.value) : null)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">— Choose —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en} / {c.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {selectedCatId && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                    Items
                  </h2>
                  <button
                    onClick={() => { setEditingItem(null); setShowItemForm(true) }}
                    style={btnPrimaryStyle}
                  >
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '1rem 1.2rem',
                        background: '#141414',
                        border: '1px solid rgba(212,175,55,0.06)',
                      }}
                    >
                      {item.img_url && (
                        <img
                          src={item.img_url}
                          alt=""
                          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 2, filter: 'brightness(0.8)' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>
                          {item.name_en}
                        </h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                          {item.name_ar} • ₪{item.price}
                          {item.is_chef_pick && ' • ⭐ Chef Pick'}
                          {!item.is_available && ' • ❌ Unavailable'}
                        </p>
                      </div>
                      <button
                        onClick={() => { setEditingItem(item); setShowItemForm(true) }}
                        style={btnSmallStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        style={{ ...btnSmallStyle, borderColor: 'rgba(231,76,60,0.3)', color: '#e74c3c' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p style={{ color: 'var(--text-dim)', padding: '2rem', textAlign: 'center' }}>
                      No items yet. Add your first item!
                    </p>
                  )}
                </div>

                {/* Item Form Modal */}
                {showItemForm && (
                  <FormModal
                    title={editingItem ? 'Edit Item' : 'Add Item'}
                    onClose={() => { setShowItemForm(false); setEditingItem(null) }}
                  >
                    <ItemForm
                      initial={editingItem}
                      onSave={handleSaveItem}
                      onCancel={() => { setShowItemForm(false); setEditingItem(null) }}
                    />
                  </FormModal>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Modal wrapper ──
function FormModal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
          background: '#141414',
          border: '1px solid rgba(212,175,55,0.1)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Category Form ──
function CategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name_en: initial?.name_en || '',
    name_ar: initial?.name_ar || '',
    desc_en: initial?.desc_en || '',
    desc_ar: initial?.desc_ar || '',
    sort_order: initial?.sort_order || 0,
    image_url: initial?.image_url || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(initial?.image_url || '')
  const [saving, setSaving] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form, imageFile)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Name (EN)</label>
          <input style={inputStyle} value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Name (AR)</label>
          <input style={inputStyle} value={form.name_ar} dir="rtl"
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={labelStyle}>Description (EN)</label>
          <textarea style={{ ...inputStyle, height: 70, resize: 'vertical' }} value={form.desc_en}
            onChange={(e) => setForm({ ...form, desc_en: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Description (AR)</label>
          <textarea style={{ ...inputStyle, height: 70, resize: 'vertical' }} value={form.desc_ar} dir="rtl"
            onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={labelStyle}>Sort Order</label>
        <input type="number" style={{ ...inputStyle, width: 100 }} value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Category Image</label>
        <div
          style={{
            border: '2px dashed rgba(212,175,55,0.15)',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 4,
            position: 'relative',
          }}
          onClick={() => document.getElementById('cat-image-input').click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" style={{ maxHeight: 120, objectFit: 'cover', margin: '0 auto', borderRadius: 2 }} />
          ) : (
            <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>Click to upload image</p>
          )}
          <input
            id="cat-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={btnSecondaryStyle}>Cancel</button>
        <button type="submit" disabled={saving} style={btnPrimaryStyle}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

// ── Item Form ──
function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name_en: initial?.name_en || '',
    name_ar: initial?.name_ar || '',
    desc_en: initial?.desc_en || '',
    desc_ar: initial?.desc_ar || '',
    price: initial?.price || '',
    sort_order: initial?.sort_order || 0,
    has_steam: initial?.has_steam || false,
    is_chef_pick: initial?.is_chef_pick || false,
    is_available: initial?.is_available !== undefined ? initial.is_available : true,
    img_url: initial?.img_url || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(initial?.img_url || '')
  const [saving, setSaving] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form, imageFile)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Name (EN)</label>
          <input style={inputStyle} value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Name (AR)</label>
          <input style={inputStyle} value={form.name_ar} dir="rtl"
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={labelStyle}>Description / Ingredients (EN)</label>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.desc_en}
            onChange={(e) => setForm({ ...form, desc_en: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Description / Ingredients (AR)</label>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.desc_ar} dir="rtl"
            onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={labelStyle}>Price (₪)</label>
          <input type="number" step="0.01" style={inputStyle} value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Sort Order</label>
          <input type="number" style={inputStyle} value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <ToggleSwitch label="Chef Pick" checked={form.is_chef_pick}
          onChange={(v) => setForm({ ...form, is_chef_pick: v })} />
        <ToggleSwitch label="Steam Effect" checked={form.has_steam}
          onChange={(v) => setForm({ ...form, has_steam: v })} />
        <ToggleSwitch label="Available" checked={form.is_available}
          onChange={(v) => setForm({ ...form, is_available: v })} />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Item Image</label>
        <div
          style={{
            border: '2px dashed rgba(212,175,55,0.15)',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 4,
          }}
          onClick={() => document.getElementById('item-image-input').click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" style={{ maxHeight: 100, objectFit: 'contain', margin: '0 auto' }} />
          ) : (
            <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>Click to upload image (PNG preferred)</p>
          )}
          <input
            id="item-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={btnSecondaryStyle}>Cancel</button>
        <button type="submit" disabled={saving} style={btnPrimaryStyle}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

// ── Toggle switch ──
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)',
          position: 'relative',
          transition: 'background 0.3s',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: checked ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            transition: 'all 0.3s',
          }}
        />
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</span>
    </label>
  )
}

// ── Styles ──
const labelStyle = {
  display: 'block',
  color: 'var(--text-dim)',
  fontSize: 11,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: 4,
  fontFamily: 'Cairo, sans-serif',
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(212,175,55,0.1)',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontFamily: 'Cairo, sans-serif',
  outline: 'none',
  transition: 'border-color 0.3s',
}

const btnPrimaryStyle = {
  padding: '10px 24px',
  background: 'rgba(212,175,55,0.12)',
  border: '1px solid rgba(212,175,55,0.3)',
  color: 'var(--gold)',
  fontSize: 12,
  letterSpacing: '0.15em',
  fontFamily: 'Cairo, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.3s',
}

const btnSecondaryStyle = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--text-dim)',
  fontSize: 12,
  fontFamily: 'Cairo, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.3s',
}

const btnSmallStyle = {
  padding: '5px 12px',
  background: 'transparent',
  border: '1px solid rgba(212,175,55,0.15)',
  color: 'var(--gold)',
  fontSize: 11,
  fontFamily: 'Cairo, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.3s',
}
