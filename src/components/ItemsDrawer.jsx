import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useItems } from '../hooks/useData'
import { useCart } from '../context/CartContext'
import SteamEffect from './SteamEffect'

// ── Decorative spices scattered on the drawer background ──────────────────
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
        <div key={i} className="absolute"
          style={{
            left: `${sp.x}%`, top: `${sp.y}%`, opacity: sp.o,
            transform: `rotate(${sp.r}deg)`
          }}>
          {sp.type === 'salt' && (
            <svg width={sp.s * 2} height={sp.s * 2} viewBox="0 0 10 10">
              <polygon points="5,0.5 9.5,9.5 0.5,9.5"
                fill="none" stroke="rgba(230,220,210,0.7)" strokeWidth="0.8" />
              <polygon points="5,2.5 7.8,7.8 2.2,7.8"
                fill="rgba(230,220,210,0.12)" />
            </svg>
          )}
          {sp.type === 'rosemary' && (
            <svg width={14} height={38} viewBox="0 0 14 38">
              <line x1="7" y1="0" x2="7" y2="38"
                stroke="#5a7a4a" strokeWidth="1.1" strokeLinecap="round" />
              {[5, 10, 15, 20, 25, 30, 35].map((y, j) => (
                <g key={j}>
                  <line x1="7" y1={y} x2={j % 2 === 0 ? 2 : 12} y2={y + 3}
                    stroke="#5a7a4a" strokeWidth="0.9" strokeLinecap="round" />
                  <line x1="7" y1={y} x2={j % 2 === 0 ? 12 : 2} y2={y + 3}
                    stroke="#5a7a4a" strokeWidth="0.9" strokeLinecap="round" />
                </g>
              ))}
            </svg>
          )}
          {sp.type === 'pepper' && (
            <svg width={sp.s} height={sp.s} viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="4"
                fill="#1e1008" stroke="#5a3010" strokeWidth="0.8" />
              <circle cx="3.5" cy="3.5" r="0.9" fill="#2e1a08" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Drawer ────────────────────────────────────────────────────────────
export default function ItemsDrawer({ category, lang, onClose }) {
  const { t } = useTranslation()
  const { items, loading } = useItems(category?.id)
  const name = category ? (lang === 'ar' ? category.name_ar : category.name_en) : ''

  return (
    <AnimatePresence>
      {category && (
        <>
          {/* Backdrop */}
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={onClose} />

         // داخل ItemsDrawer
          <motion.div key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 overflow-y-auto overflow-x-hidden" // أضفنا overflow-x-hidden
            style={{
              width: 'min(580px, 100vw)', background: '#0d0d0d',
              borderLeft: '1px solid rgba(212,175,55,0.07)',
              // نضمن أن الحاوية لا تسمح بأي سكرول عرضي
              maxWidth: '100vw'
            }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            {/* Scattered spices background */}
            <DrawerSpices />

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%)'
              }} />

            {/* ── Header ── */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-5"
              style={{
                background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(212,175,55,0.07)'
              }}>
              <div>
                <p className="font-body text-xs mb-0.5"
                  style={{ color: 'rgba(212,175,55,0.45)', letterSpacing: '0.35em', fontSize: 10 }}>
                  {t('categories.heading')}
                </p>
                <h3 className="font-display"
                  style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  {name}
                </h3>
              </div>
              <button onClick={onClose}
                className="transition-opacity hover:opacity-50"
                style={{ color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1l14 14M15 1L1 15"
                    stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── Items ── */}
            <div className="relative z-10 py-10">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-xs"
                    style={{ color: 'var(--text-dim)', letterSpacing: '0.3em' }}>
                    {lang === 'ar' ? 'يتم التحميل...' : 'Loading...'}
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex items-center justify-center py-32">
                  <p className="font-body text-sm" style={{ color: 'var(--text-dim)' }}>
                    {lang === 'ar' ? 'لا توجد أصناف حالياً' : 'No items available'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: '0' }}>
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

  const { addToCart, cartItems } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  // حساب الإزاحة بناءً على اللغة والترتيب لمنع القفزات عند تغيير اللغة
  const getTranslation = () => {
    if (isEven) return isRTL ? '15%' : '-15%';
    return isRTL ? '-15%' : '15%';
  }

  return (
    <motion.div
      // نستخدم الـ x بحذر لضمان عدم خروج العنصر عن الشاشة
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05
      }}
      className="relative w-full overflow-hidden" // منع السكرول داخل السطر نفسه
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '1.1fr 1fr' : '1fr 1.1fr',
        alignItems: 'center',
        minHeight: '240px',
        marginBottom: '1.5rem',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(212,175,55,0.05)',
        // 3. التغيير السحري هنا:
        // أثناء الحركة (false) يكون visible حتى لا تُقص الصورة
        // بعد الاستقرار (true) يصبح hidden لمنع أي سكرول جانبي
        overflow: isAnimationDone ? 'hidden' : 'visible',
      }}
    >
      {/* ── قسم الصورة ── */}
      <div style={{ order: isEven ? 1 : 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <motion.img
          src={item.img_url}
          alt={name}
          whileHover={{ scale: 1.08 }}
          style={{
            width: '130%',
            maxWidth: '320px',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
            transform: `translateX(${getTranslation()})`,
            zIndex: 10,
          }}
        />
        {item.has_steam && (
          <div style={{
            position: 'absolute',
            bottom: '45%',        // يطلع من منتصف الصورة للأعلى
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            pointerEvents: 'none',
          }}>
            <SteamEffect />
          </div>
        )}
      </div>

      {/* ── قسم النص ── */}
      <div
        style={{
          order: isEven ? 2 : 1,
          textAlign: isEven ? 'left' : 'right',
          padding: isEven ? '0 15px' : '0 15px',
          zIndex: 5,
          // نضمن أن النص لا يختفي تحت الصورة
          position: 'relative'
        }}
      >
        {item.is_chef_pick && (
          <p className="font-body text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>
            ✦ {t('item.chef_pick')}
          </p>
        )}

        <h4 className="font-display leading-tight mb-1"
          style={{ fontSize: '1.25rem', color: 'white' }}>
          {name}
        </h4>

        <p className="font-body mb-4 opacity-60"
          style={{ fontSize: '0.8rem', lineHeight: '1.4', maxWidth: '200px', marginLeft: isEven ? 0 : 'auto', marginRight: isEven ? 'auto' : 0 }}>
          {desc}
        </p>

        <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
          <span className="font-display text-gold" style={{ fontSize: '1.2rem' }}>₪{item.price}</span>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
              setJustAdded(true);
              setTimeout(() => setJustAdded(false), 1000);
            }}
            animate={{
              borderColor: justAdded ? '#4ade80' : 'rgba(212,175,55,0.3)',
              backgroundColor: justAdded ? 'rgba(74, 222, 128, 0.1)' : 'rgba(212,175,55,0.05)',
              scale: justAdded ? 1.05 : 1
            }}
            style={{
              padding: '6px 16px',
              fontSize: '10px',
              border: '1px solid',
              color: justAdded ? '#4ade80' : 'var(--gold)',
              cursor: 'pointer'
            }}
          >
            {justAdded ? (isRTL ? 'تم ✓' : 'Added ✓') : (isRTL ? 'أضف' : 'Add')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}