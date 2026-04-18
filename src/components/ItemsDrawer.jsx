import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useItems, useCategories } from '../hooks/useData'
import { useCart } from '../context/CartContext'
import SteamEffect from './SteamEffect'

function DrawerSpices() {
  const spices = [
    { type: 'salt', x: 8, y: 12, r: 18, s: 7, o: 0.18 },
    { type: 'salt', x: 88, y: 8, r: -12, s: 5, o: 0.13 },
    { type: 'salt', x: 15, y: 35, r: 30, s: 9, o: 0.12 },
    { type: 'salt', x: 78, y: 42, r: -25, s: 6, o: 0.15 },
    { type: 'salt', x: 55, y: 68, r: 15, s: 8, o: 0.11 },
    { type: 'salt', x: 92, y: 75, r: -8, s: 5, o: 0.14 },
    { type: 'salt', x: 30, y: 88, r: 42, s: 7, o: 0.10 },
    { type: 'rosemary', x: 5, y: 20, r: 55, s: 1, o: 0.13 },
    { type: 'rosemary', x: 82, y: 55, r: -40, s: 1, o: 0.10 },
    { type: 'rosemary', x: 60, y: 82, r: 20, s: 1, o: 0.12 },
    { type: 'rosemary', x: 20, y: 65, r: -60, s: 1, o: 0.09 },
    { type: 'pepper', x: 45, y: 18, r: 0, s: 5, o: 0.20 },
    { type: 'pepper', x: 70, y: 30, r: 0, s: 4, o: 0.17 },
    { type: 'pepper', x: 25, y: 50, r: 0, s: 6, o: 0.15 },
    { type: 'pepper', x: 85, y: 88, r: 0, s: 4, o: 0.18 },
    { type: 'pepper', x: 50, y: 95, r: 0, s: 5, o: 0.14 },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {spices.map((sp, i) => (
        <div key={i} className="absolute" style={{ left: `${sp.x}%`, top: `${sp.y}%`, opacity: sp.o, transform: `rotate(${sp.r}deg)` }}>
          {sp.type === 'salt' && (
            <svg width={sp.s * 2} height={sp.s * 2} viewBox="0 0 10 10">
              <polygon points="5,0.5 9.5,9.5 0.5,9.5" fill="none" stroke="rgba(230,220,210,0.7)" strokeWidth="0.8" />
            </svg>
          )}
          {sp.type === 'rosemary' && (
            <svg width={14} height={38} viewBox="0 0 14 38">
              <line x1="7" y1="0" x2="7" y2="38" stroke="#5a7a4a" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ItemsDrawer({ category, lang, onClose }) {
  const { t } = useTranslation()
  const { categories } = useCategories()

  const subCategories = useMemo(() => {
    if (!category || !categories) return []
    return categories
      .filter(cat => Number(cat.parent_id) === Number(category.id))
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [category, categories])

  const [activeTabId, setActiveTabId] = useState(null)

  useEffect(() => {
    if (subCategories.length > 0) {
      setActiveTabId(subCategories[0].id)
    } else {
      setActiveTabId(null)
    }
  }, [subCategories, category])

useEffect(() => {
  if (!category) return
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.paddingRight = `${scrollBarWidth}px`
  return () => {
    document.documentElement.style.overflow = ''
    document.documentElement.style.paddingRight = ''
  }
}, [category])

  const { items, loading } = useItems(
    subCategories.length > 0 ? activeTabId : category?.id
  )

  const filteredItems = items
  const name = category ? (lang === 'ar' ? category.name_ar : category.name_en) : ''

  return (
    <AnimatePresence>
      {category && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed z-[55]"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100dvh',
            }}
            onClick={onClose} />

          <motion.div key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[60] overflow-y-auto overflow-x-hidden"
            style={{
              width: 'min(580px, 100vw)',
              background: '#0d0d0d',
              borderLeft: '1px solid rgba(212,175,55,0.07)',
              maxWidth: '100vw',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              minHeight: '100dvh',
            }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <DrawerSpices />

            {/* ✅ Header - z-index عالي + isolation عشان الصور ما تطلع فوقه */}
            <div
              className="sticky top-0 px-8 py-5"
              style={{
                background: 'rgba(13,13,13,0.95)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(212,175,55,0.07)',
                zIndex: 100,           // ✅ أعلى من zIndex الصور (كانت 10)
                isolation: 'isolate',  // ✅ يعزل الـ stacking context
                position: 'sticky',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-body text-xs mb-0.5" style={{ color: 'rgba(212,175,55,0.45)', letterSpacing: '0.35em', fontSize: 10, fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : '' }}>
                    {t('categories.heading')}
                  </p>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : '' }}>{name}</h3>
                </div>
                {/* ✅ زر الإغلاق واضح وقابل للكليك دايماً */}
                <button
                  onClick={onClose}
                  className="transition-opacity hover:opacity-50"
                  style={{
                    color: 'var(--text-secondary)',
                    position: 'relative',
                    zIndex: 101,        // ✅ فوق كل شي
                    padding: '8px',     // ✅ مساحة كليك أكبر
                    margin: '-8px',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {subCategories.length > 0 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {subCategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveTabId(sub.id)}
                      className="px-4 py-1.5 rounded-full text-[11px] font-body transition-all whitespace-nowrap"
                      style={{
                        border: `1px solid ${activeTabId === sub.id ? 'var(--gold)' : 'rgba(212,175,55,0.1)'}`,
                        background: activeTabId === sub.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                        color: activeTabId === sub.id ? 'var(--gold)' : 'var(--text-dim)',
                        fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : 'inherit',
                      }}
                    >
                      {lang === 'ar' ? sub.name_ar : sub.name_en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items Area */}
            <div className="relative py-10" style={{ zIndex: 1 }}>
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-xs" style={{ color: 'var(--text-dim)', letterSpacing: '0.3em' }}>
                    {lang === 'ar' ? 'يتم التحميل...' : 'Loading...'}
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-sm" style={{ color: 'var(--text-dim)' }}>
                    {lang === 'ar' ? 'لا توجد أصناف حالياً' : 'No items available'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredItems.map((item, i) => (
                    <ItemRow key={item.id} item={item} index={i} lang={lang} t={t} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ItemRow({ item, index, lang, t }) {
  const name = lang === 'ar' ? item.name_ar : item.name_en
  const desc = lang === 'ar' ? item.desc_ar : item.desc_en
  const isEven = index % 2 === 0
  const isRTL = lang === 'ar'
  const { addToCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const getTranslation = () => {
    if (isEven) return isRTL ? '15%' : '-15%'
    return isRTL ? '-15%' : '15%'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '1.1fr 1fr' : '1fr 1.1fr',
        alignItems: 'center',
        minHeight: '240px',
        marginBottom: '1.5rem',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(212,175,55,0.05)',
        overflow: 'hidden',   // ✅ يقص الصورة اللي تطلع برا الـ row
        width: '100%',
        position: 'relative',
        isolation: 'isolate', // ✅ كل row له stacking context منفصل
      }}
    >
      <div style={{ order: isEven ? 1 : 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <motion.img
          src={item.img_url} alt={name}
          whileHover={{ scale: 1.08 }}
          style={{
            width: '130%',
            maxWidth: '320px',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
            transform: `translateX(${getTranslation()})`,
            zIndex: 2,  // ✅ منخفض - ما بيطلع فوق الـ header (z-index: 100)
          }}
        />
        {item.has_steam && (
          <div style={{ position: 'absolute', bottom: '45%', left: '50%', transform: 'translateX(-50%) translateZ(0)', zIndex: 3, pointerEvents: 'none' }}>
            <SteamEffect />
          </div>
        )}
      </div>

      <div style={{ order: isEven ? 2 : 1, textAlign: isEven ? 'left' : 'right', padding: '0 15px', zIndex: 2, position: 'relative' }}>
        {item.is_chef_pick && (
          <p className="font-body text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>✦ {t('item.chef_pick')}</p>
        )}
        <h4 className="font-display leading-tight mb-1" style={{
          fontSize: '1.25rem', color: 'white',
          fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : 'inherit'
        }}>{name}</h4>
        <p className="font-body mb-4 opacity-60" style={{ fontSize: '0.8rem', lineHeight: '1.4', maxWidth: '200px', marginLeft: isEven ? 0 : 'auto', marginRight: isEven ? 'auto' : 0 }}>{desc}</p>
        <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
          <span className="font-display text-gold" style={{ fontSize: '1.2rem' }}>₪{item.price}</span>
          <motion.button
            onClick={(e) => { e.stopPropagation(); addToCart(item); setJustAdded(true); setTimeout(() => setJustAdded(false), 1000) }}
            animate={{
              borderColor: justAdded ? '#4ade80' : 'rgba(212,175,55,0.3)',
              backgroundColor: justAdded ? 'rgba(74, 222, 128, 0.1)' : 'rgba(212,175,55,0.05)',
              scale: justAdded ? 1.05 : 1
            }}
            className="flex items-center gap-2"
            style={{ padding: '6px 14px', fontSize: '11px', border: '1px solid', color: justAdded ? '#4ade80' : 'var(--gold)', cursor: 'pointer', borderRadius: '4px', whiteSpace: 'nowrap' }}
          >
            {!justAdded && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            )}
            <span>{justAdded ? (isRTL ? 'تمت الإضافة ✓' : 'Added ✓') : (isRTL ? 'أضف للسلة' : 'Add to Cart')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}