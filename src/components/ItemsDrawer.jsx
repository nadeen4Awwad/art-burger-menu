import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useItems, useCategories } from '../hooks/useData' // أضفنا useCategories
import { useCart } from '../context/CartContext'
import SteamEffect from './SteamEffect'

// ── Decorative spices (كما هي في كودك) ──────────────────
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

// ... (بقيت الاستيرادات و DrawerSpices كما هي)

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
    if (category) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      // نستخدم paddingRight فقط إذا كان هناك سكرول بار فعلياً
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [category]);

  const { items, loading } = useItems(
    subCategories.length > 0 ? activeTabId : category?.id
  )

  const name = category ? (lang === 'ar' ? category.name_ar : category.name_en) : ''

  return (
    <AnimatePresence>
      {category && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={onClose} />

          <motion.div key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[60] overflow-y-auto"
            style={{
              width: 'min(580px, 100vw)',
              background: '#0d0d0d',
              borderLeft: '1px solid rgba(212,175,55,0.07)',
              maxWidth: '100vw',
              // إضافة هذه الخصائص لمنع السكرول الجانبي في الـ Drawer نفسه
              overflowX: 'hidden', 
              boxSizing: 'border-box'
            }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            <DrawerSpices />

            {/* Header - تم إضافة width: 100% و left: 0 لضمان الثبات */}
            <div className="sticky top-0 z-[70] px-8 py-5 w-full left-0"
              style={{ 
                background: 'rgba(13,13,13,0.95)', 
                backdropFilter: 'blur(16px)', 
                borderBottom: '1px solid rgba(212,175,55,0.1)',
                boxSizing: 'border-box' 
              }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="font-body text-xs mb-0.5" style={{ color: 'rgba(212,175,55,0.45)', letterSpacing: '0.35em', fontSize: 10, fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : ''}}>
                    {t('categories.heading')}
                  </p>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : '' }}>{name}</h3>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 transition-opacity hover:opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
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
            <div className="relative z-10 py-10 w-full overflow-x-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-xs" style={{ color: 'var(--text-dim)', letterSpacing: '0.3em' }}>{lang === 'ar' ? 'يتم التحميل...' : 'Loading...'}</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-sm" style={{ color: 'var(--text-dim)' }}>{lang === 'ar' ? 'لا توجد أصناف حالياً' : 'No items available'}</p>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  {items.map((item, i) => (
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
    // تقليل الإزاحة قليلاً لضمان عدم خروج الصورة بشكل مبالغ فيه يسبب سكرول
    if (isEven) return isRTL ? '10%' : '-10%';
    return isRTL ? '-10%' : '10%';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '1fr 1.1fr' : '1.1fr 1fr',
        alignItems: 'center',
        minHeight: '220px',
        marginBottom: '1rem',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(212,175,55,0.05)',
        width: '100%',
        position: 'relative',
        overflow: 'visible' // السماح بتداخل الصور مع الهوامش ولكن الحاوية الأب تغلقها
      }}
    >
      {/* Image Container */}
      <div style={{ order: isEven ? 1 : 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <motion.img
          src={item.img_url} alt={name}
          whileHover={{ scale: 1.05 }}
          style={{ 
            width: '140%', 
            maxWidth: '280px', 
            height: 'auto', 
            objectFit: 'contain', 
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))', 
            transform: `translateX(${getTranslation()})`, 
            zIndex: 10 
          }}
        />
        {item.has_steam && (
          <div style={{ position: 'absolute', bottom: '45%', left: '50%', transform: 'translateX(-50%) translateZ(0)', zIndex: 30, pointerEvents: 'none' }}>
            <SteamEffect />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div style={{ order: isEven ? 2 : 1, textAlign: isEven ? 'left' : 'right', padding: '0 20px', zIndex: 5 }}>
        {item.is_chef_pick && (
          <p className="font-body text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>✦ {t('item.chef_pick')}</p>
        )}
        <h4 className="font-display leading-tight mb-1" style={{
          fontSize: '1.15rem', color: 'white', fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : 'inherit'
        }}>{name}</h4>
        <p className="font-body mb-4 opacity-60" style={{ fontSize: '0.75rem', lineHeight: '1.4', maxWidth: '180px', marginLeft: isEven ? 0 : 'auto', marginRight: isEven ? 'auto' : 0 }}>{desc}</p>
        <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
          <span className="font-display text-gold" style={{ fontSize: '1.1rem' }}>₪{item.price}</span>
          <motion.button
            onClick={(e) => { e.stopPropagation(); addToCart(item); setJustAdded(true); setTimeout(() => setJustAdded(false), 1000); }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
            style={{ 
              padding: '5px 12px', 
              fontSize: '10px', 
              border: '1px solid', 
              borderColor: justAdded ? '#4ade80' : 'rgba(212,175,55,0.3)',
              backgroundColor: justAdded ? 'rgba(74, 222, 128, 0.1)' : 'rgba(212,175,55,0.05)',
              color: justAdded ? '#4ade80' : 'var(--gold)', 
              borderRadius: '4px',
              fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : 'inherit'
            }}
          >
            <span>{justAdded ? (isRTL ? 'تمت الإضافة ✓' : 'Added ✓') : (isRTL ? 'أضف' : 'Add')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}