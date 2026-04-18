import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

// ─── Hooks ────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// ─── Animation helpers ────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

// ─── Icon definitions ─────────────────────────────────────
const ICONS = {
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 40" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 14 Q14 2 28 2 Q42 2 52 14 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M2 18 Q14 4 28 4 Q42 4 54 18" strokeLinecap="round" />
      <path d="M0 22 Q7 17 14 22 Q21 27 28 22 Q35 17 42 22 Q49 27 56 22" strokeLinecap="round" />
      <rect x="2" y="25" width="52" height="7" rx="3" fill="currentColor" fillOpacity="0.08" />
      <rect x="2" y="25" width="52" height="7" rx="3" />
      <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z" />
    </svg>
  ),
  steak: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 44C5 40 2 30 8 18C14 6 32 4 44 8C56 12 62 24 58 36C54 48 40 56 28 58C16 60 19 48 12 44Z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="42" cy="22" r="5" fill="white" fillOpacity="0.3" />
      <circle cx="42" cy="22" r="2" />
      <g opacity="0.6" strokeWidth="1.2">
        <line x1="18" y1="20" x2="28" y2="10" />
        <line x1="24" y1="35" x2="38" y2="21" />
      </g>
    </svg>
  ),
  fries: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 50" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M4 22 L52 22 L46 48 L10 48 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M4 22 L52 22 L46 48 L10 48 Z" />
      <line x1="16" y1="22" x2="17" y2="48" />
      <line x1="28" y1="22" x2="28" y2="48" />
      <line x1="10" y1="22" x2="8" y2="2" />
      <line x1="28" y1="22" x2="28" y2="0" />
      <line x1="46" y1="22" x2="48" y2="2" />
    </svg>
  ),
  chefHat: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 46" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 26 Q10 6 28 6 Q46 6 46 26" />
      <rect x="6" y="26" width="44" height="9" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="6" y="26" width="44" height="9" rx="2" />
    </svg>
  ),
  fork: (s) => (
    <svg width={s} height={s} viewBox="0 0 44 56" fill="none" stroke="currentColor" strokeWidth="1.4">
      <line x1="10" y1="0" x2="10" y2="56" />
      <path d="M10 0 Q22 8 18 22 L10 24 Z" fill="currentColor" fillOpacity="0.12" />
      <line x1="28" y1="22" x2="28" y2="56" />
      <path d="M22 20 Q28 26 34 20" />
    </svg>
  ),
  grill: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 44" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="0" y1="30" x2="56" y2="30" />
      <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z" />
    </svg>
  ),
}

// ─── Settings ─────────────────────────────────────────────
const ICON_SIZES = {
  mobile: { burger: 68, steak: 72, fries: 62, chefHat: 62, fork: 62, grill: 62 },
  desktop: { burger: 48, steak: 52, fries: 44, chefHat: 44, fork: 44, grill: 44 },
}

const FONT_SIZES = {
  mobile: { eyebrow: '1.1rem', subtitle: '1.3rem', cta: '1.2rem' },
  desktop: {
    eyebrow: 'clamp(0.85rem, 2.2vw, 1.2rem)',
    subtitle: 'clamp(1rem, 3.5vw, 1.45rem)',
    cta: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  },
}

const FLOATING_ICONS = [
  { icon: 'burger', x: '5%', y: '12%', delay: 0, duration: 6 },
  { icon: 'steak', x: '78%', y: '17%', delay: 0.2, duration: 7 },
  { icon: 'fries', x: '88%', y: '55%', delay: 0.4, duration: 5 },
  { icon: 'chefHat', x: '70%', y: '78%', delay: 0.6, duration: 6 },
  { icon: 'fork', x: '3%', y: '65%', delay: 0.8, duration: 8 },
  { icon: 'grill', x: '14%', y: '82%', delay: 1, duration: 6 },
]

// ─── FloatingIcon ─────────────────────────────────────────
const FloatingIcon = ({ x, y, delay = 0, duration = 6, icon, size = 56 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.1, 0.15, 0.1],
      y: [0, -20, 0],
      rotate: [-5, 5, -5],
    }}
    transition={{ duration, repeat: Infinity, delay: delay * 0.3, ease: 'easeInOut' }}
    className="absolute pointer-events-none select-none"
    style={{ left: x, top: y, color: 'var(--gold)', zIndex: 1, willChange: 'transform' }}
  >
    {ICONS[icon]?.(size)}
  </motion.div>
)

// ─── Business Hours ───────────────────────────────────────
// الدوام: 11:00 صباحاً — 11:30 مساءً يومياً ما عدا الاثنين
const OPENS = 11        // 11:00 ص
const CLOSES = 23.5     // 11:30 م

function getStatus() {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
  if (day === 1) return false // الاثنين مغلق طول اليوم
  const time = now.getHours() + now.getMinutes() / 60
  return time >= OPENS && time < CLOSES
}

function isToday(dayIndex) {
  return new Date().getDay() === dayIndex
}

function BusinessHours({ isAr, arabicFont, englishFont, isMobile }) {
  const [open, setOpen] = useState(getStatus)
  const isMonday = isToday(1)

  useEffect(() => {
    const id = setInterval(() => setOpen(getStatus()), 60_000)
    return () => clearInterval(id)
  }, [])

  const openText  = isAr ? 'مفتوح الآن'  : 'Open Now'
  const closeText = isAr ? 'مغلق الآن'   : 'Closed Now'

  const hoursLine = isAr
    ? 'الأحد — السبت  ١١:٠٠ ص — ١١:٣٠ م'
    : 'Sun — Sat  11:00 AM — 11:30 PM'

  // رسالة "يفتح في" — تختلف حسب إذا كان الاثنين أو لا
  const opensAtLine = isMonday
    ? (isAr ? 'يفتح غداً الثلاثاء الساعة ١١:٠٠ ص' : 'Opens Tuesday at 11:00 AM')
    : (isAr ? 'يفتح الساعة ١١:٠٠ صباحاً' : 'Opens at 11:00 AM')

  const dotSize    = isMobile ? '9px'    : '7px'
  const statusSize = isMobile ? '0.9rem' : '0.72rem'
  const hoursSize  = isMobile ? '0.9rem' : '0.64rem'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}
    >
      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>

        {/* Pulsing dot */}
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: open ? '#4ade80' : 'rgba(255,255,255,0.18)',
            display: 'block',
            position: 'relative',
            zIndex: 2,
          }} />
          {open && (
            <motion.span
              animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                background: '#4ade80',
                zIndex: 1,
              }}
            />
          )}
        </span>

        {/* Status label */}
        <motion.span
          key={open ? 'open' : 'closed'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: statusSize,
            letterSpacing: '0.2em',
            color: open ? '#4ade80' : 'rgba(255,255,255,0.22)',
            fontFamily: isAr ? arabicFont : englishFont,
            fontWeight: 500,
          }}
        >
          {open ? openText : closeText}
        </motion.span>
      </div>

      {/* Hours line */}
      <p style={{
        fontSize: hoursSize,
        letterSpacing: '0.14em',
        color: 'rgba(212,175,55,0.55)',
        fontFamily: isAr ? arabicFont : englishFont,
        margin: 0,
      }}>
        {hoursLine}
      </p>

      {/* "Opens at" — يظهر فقط لما مغلق */}
      {!open && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: isMobile ? '0.7rem' : '0.6rem',
            letterSpacing: '0.16em',
            color: 'rgba(212,175,55,0.22)',
            fontFamily: isAr ? arabicFont : englishFont,
            margin: 0,
          }}
        >
          {opensAtLine}
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── Main Hero Component ──────────────────────────────────
export default function Hero({ onExplore }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const isMobile = useIsMobile()

  const arabicFont  = '"Cairo", sans-serif'
  const englishFont = '"Cormorant Garamond", serif'

  const sizes = isMobile ? ICON_SIZES.mobile : ICON_SIZES.desktop
  const fonts = isMobile ? FONT_SIZES.mobile : FONT_SIZES.desktop

  // نص العطلة الأسبوعية — بدل EST. 2021
  const offDayText = isAr ? 'عطلة أسبوعية: الاثنين' : 'Weekly Off: Monday'

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)', textAlign: 'center' }}
    >
      {/* ─── Layer 1: Background Floating Icons ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FLOATING_ICONS.map((cfg) => (
          <FloatingIcon key={cfg.icon} {...cfg} size={sizes[cfg.icon]} />
        ))}
      </div>

      {/* ─── Layer 2: Static Front Content ─── */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative z-10 flex flex-col items-center"
        style={{
          maxWidth: '860px',
          width: '100%',
          padding: '0 clamp(1.25rem, 5vw, 2.5rem)',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0.1)}
          style={{
            color: 'var(--gold)',
            fontSize: fonts.eyebrow,
            letterSpacing: '0.08em',
            fontFamily: isAr ? arabicFont : 'inherit',
            margin: 0,
          }}
        >
          {t('hero.eyebrow')}
        </motion.p>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ margin: 'clamp(1.5rem, 5vw, 3rem) 0' }}
        >
          <img
            src="/logo.png"
            alt="logo"
            style={{
              width: 'clamp(260px, 80vw, 650px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontSize: fonts.subtitle,
            lineHeight: isAr ? 1.8 : 1.6,
            maxWidth: '600px',
            fontFamily: isAr ? arabicFont : englishFont,
            margin: 0,
            opacity: 0.9,
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          {...fadeUp(0.5)}
          onClick={onExplore}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 'clamp(2rem, 6vw, 3rem)',
            fontSize: fonts.cta,
            padding: '14px 52px',
            color: 'var(--gold)',
            border: '1px solid rgba(212,175,55,0.25)',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: isAr ? arabicFont : englishFont,
            letterSpacing: '0.18em',
            fontWeight: 400,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '100px',
            boxShadow: '0 0 24px rgba(212,175,55,0.08), inset 0 0 24px rgba(212,175,55,0.04)',
            transition: 'all 0.4s',
          }}
        >
          {/* Shine sweep */}
          <motion.span
            initial={{ x: '-120%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {t('hero.cta')}
        </motion.button>

        {/* Business Hours + Off Day */}
        <motion.div
          {...fadeUp(0.7)}
          style={{
            marginTop: 'clamp(2rem, 5vw, 3rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Thin gradient divider */}
          <div style={{
            width: '1px',
            height: '28px',
            background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)',
          }} />

          <BusinessHours
            isAr={isAr}
            arabicFont={arabicFont}
            englishFont={englishFont}
            isMobile={isMobile}
          />

          {/* Weekly Off Day — بدل EST. 2021 */}
          <p style={{
            fontSize: isMobile ? '0.72rem' : '0.65rem',
            letterSpacing: '0.22em',
            color: 'rgba(212,175,55,0.28)',
            fontFamily: isAr ? arabicFont : englishFont,
            margin: 0,
          }}>
            {offDayText}
          </p>
        </motion.div>

      </div>
    </section>
  )
}