import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useItems, useCategories } from '../hooks/useData'
import { useCart } from '../context/CartContext'
import SteamEffect from './SteamEffect'

/* =========================
   Decorative Background
========================= */
function DrawerSpices() {
  const spices = [
    { x: 8, y: 12, r: 18, s: 7, o: 0.18 },
    { x: 88, y: 8, r: -12, s: 5, o: 0.13 },
    { x: 15, y: 35, r: 30, s: 9, o: 0.12 },
    { x: 78, y: 42, r: -25, s: 6, o: 0.15 },
    { x: 55, y: 68, r: 15, s: 8, o: 0.11 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {spices.map((sp, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            opacity: sp.o,
            transform: `rotate(${sp.r}deg)`,
          }}
        >
          <svg width={sp.s * 2} height={sp.s * 2} viewBox="0 0 10 10">
            <polygon
              points="5,0.5 9.5,9.5 0.5,9.5"
              fill="none"
              stroke="rgba(230,220,210,0.6)"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

/* =========================
   Main Drawer
========================= */
export default function ItemsDrawer({ category, lang, onClose }) {
  const { t } = useTranslation()
  const { categories } = useCategories()

  const subCategories = useMemo(() => {
    if (!category) return []

    return categories
      ?.filter(cat => Number(cat.parent_id) === Number(category.id))
      ?.sort((a, b) => a.sort_order - b.sort_order)
  }, [categories, category])

  const [activeTabId, setActiveTabId] = useState(null)

  useEffect(() => {
    setActiveTabId(subCategories?.[0]?.id || null)
  }, [subCategories])

  useEffect(() => {
    if (!category) return

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.paddingRight = ''
    }
  }, [category])

  const currentCategoryId =
    subCategories.length > 0 ? activeTabId : category?.id

  const { items, loading } = useItems(currentCategoryId)

  const title =
    lang === 'ar' ? category?.name_ar : category?.name_en

  if (!category) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[55]"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
        }}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 bottom-0 z-[60] overflow-y-auto"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        style={{
          width: 'min(580px,100vw)',
          background: '#0d0d0d',
          borderLeft: '1px solid rgba(212,175,55,0.07)',
          minHeight: '100dvh',
        }}
      >
        <DrawerSpices />

        {/* Header */}
        <div
          className="sticky top-0 px-8 py-5"
          style={{
            background: 'rgba(13,13,13,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(212,175,55,0.07)',
            zIndex: 100,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color: 'rgba(212,175,55,0.45)' }}>
                {t('categories.heading')}
              </p>
              <h3 className="text-xl text-white">{title}</h3>
            </div>

            <button
              onClick={onClose}
              style={{ fontSize: 20, zIndex: 200 }}
              className="p-2 hover:opacity-60"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-10">
          {loading ? (
            <CenteredText>{lang === 'ar' ? 'يتم التحميل...' : 'Loading...'}</CenteredText>
          ) : items.length === 0 ? (
            <CenteredText>{lang === 'ar' ? 'لا توجد أصناف حالياً' : 'No items available'}</CenteredText>
          ) : (
            items.map((item, i) => (
              <ItemRow key={item.id} item={item} index={i} lang={lang} t={t} />
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* =========================
   Item Row FIXED
========================= */
function ItemRow({ item, index, lang, t }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const isEven = index % 2 === 0
  const isRTL = lang === 'ar'

  const name = isRTL ? item.name_ar : item.name_en
  const desc = isRTL ? item.desc_ar : item.desc_en

  const handleAdd = e => {
    e.stopPropagation()
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '1.1fr 1fr' : '1fr 1.1fr',
        alignItems: 'center',
        minHeight: '240px',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(212,175,55,0.05)',
        width: '100%',
        position: 'relative',
        overflow: 'visible', // ✅ FIX IMPORTANT
      }}
    >
      {/* Image */}
      <div
        style={{
          order: isEven ? 1 : 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}
      >
        <motion.img
          src={item.img_url}
          alt={name}
          whileHover={{ scale: 1.05 }}
          style={{
            maxWidth: '290px',
            transform: 'scale(1.12)',
            position: 'relative',
            zIndex: 3, // ✅ FIX SHADOW CUT
            filter:
              'drop-shadow(0 12px 24px rgba(212,175,55,0.15))',
          }}
        />

        {item.has_steam && (
          <div style={{ position: 'absolute' }}>
            <SteamEffect />
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ zIndex: 2 }}>
        <h4 style={{ color: '#fff' }}>{name}</h4>
        <p style={{ opacity: 0.6 }}>{desc}</p>

        <div className={`flex gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
          <span style={{ color: 'var(--gold)' }}>₪{item.price}</span>

          <button
            onClick={handleAdd}
            style={{
              zIndex: 5, // ✅ IMPORTANT FIX
              padding: '7px 14px',
              border: '1px solid rgba(212,175,55,0.3)',
              background: added
                ? 'rgba(74,222,128,0.08)'
                : 'rgba(212,175,55,0.05)',
              color: added ? '#4ade80' : 'var(--gold)',
            }}
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CenteredText({ children }) {
  return (
    <div className="flex justify-center items-center py-32 text-sm opacity-60">
      {children}
    </div>
  )
}