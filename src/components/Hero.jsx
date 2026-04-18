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
    cta: 'clamp(0.9rem, 2.5vw, 1.1rem)' 
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

// ─── FloatingIcon (The Layered Fix) ────────────────────────
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

// ─── Main Hero Component ──────────────────────────────────
export default function Hero({ onExplore }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const isMobile = useIsMobile()

  const arabicFont = '"Cairo", sans-serif'
  const englishFont = '"Cormorant Garamond", serif'

  const sizes = isMobile ? ICON_SIZES.mobile : ICON_SIZES.desktop
  const fonts = isMobile ? FONT_SIZES.mobile : FONT_SIZES.desktop

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'var(--bg)',
        textAlign: 'center',
      }}
    >
      {/* ─── Layer 1: Background Floating Icons ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FLOATING_ICONS.map((cfg) => (
          <FloatingIcon
            key={cfg.icon}
            {...cfg}
            size={sizes[cfg.icon]}
          />
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
          style={{
            margin: 'clamp(1.5rem, 5vw, 3rem) 0',
          }}
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
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,175,55,0.1)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: 'clamp(2rem, 6vw, 3rem)',
            fontSize: fonts.cta,
            padding: '14px 48px',
            color: 'var(--gold)',
            border: '1px solid rgba(212,175,55,0.4)',
            background: 'rgba(212,175,55,0.05)',
            cursor: 'pointer',
            fontFamily: isAr ? arabicFont : englishFont,
            letterSpacing: '0.05em',
            transition: 'border-color 0.3s',
          }}
        >
          {t('hero.cta')}
        </motion.button>
      </div>
    </section>
  )
}