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
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

// ─── Icon definitions ─────────────────────────────────────
const ICONS = {
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 40" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14 Q14 2 28 2 Q42 2 52 14 Z" fill="currentColor" fillOpacity="0.10" />
      <path d="M2 18 Q14 4 28 4 Q42 4 54 18" />
      <path d="M0 22 Q7 17 14 22 Q21 27 28 22 Q35 17 42 22 Q49 27 56 22" />
      <rect x="2" y="25" width="52" height="7" rx="3" fill="currentColor" fillOpacity="0.08" />
      <rect x="2" y="25" width="52" height="7" rx="3" />
      <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z" fill="currentColor" fillOpacity="0.10" />
      <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z" />
    </svg>
  ),
  steak: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* جسم الستيك الأساسي */}
      <path
        d="M12 44C5 40 2 30 8 18C14 6 32 4 44 8C56 12 62 24 58 36C54 48 40 56 28 58C16 60 19 48 12 44Z"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* العظمة الدائرية في المنتصف (Marrow Bone) */}
      <circle cx="42" cy="22" r="5" fill="white" fillOpacity="0.3" strokeWidth="1.5" />
      <circle cx="42" cy="22" r="2" />

      {/* خطوط الشواء (Grill Marks) لتعطي شكل الستيك المعروف */}
      <g opacity="0.6" strokeWidth="1.2">
        <line x1="18" y1="20" x2="28" y2="10" />
        <line x1="24" y1="35" x2="38" y2="21" />
        <line x1="32" y1="48" x2="50" y2="30" />
        <line x1="45" y1="52" x2="58" y2="39" />
      </g>

      {/* تفاصيل الدهون الجانبية */}
      <path
        d="M10 25C15 20 25 18 30 22"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.4"
      />
    </svg>
  ),
  fries: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 50" fill="none" stroke="currentColor"
      strokeWidth="1.3" strokeLinecap="round">
      <path d="M4 22 L52 22 L46 48 L10 48 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M4 22 L52 22 L46 48 L10 48 Z" />
      <line x1="16" y1="22" x2="17" y2="48" />
      <line x1="28" y1="22" x2="28" y2="48" />
      <line x1="40" y1="22" x2="39" y2="48" />
      <line x1="10" y1="22" x2="8" y2="2" />
      <line x1="20" y1="22" x2="19" y2="-2" />
      <line x1="28" y1="22" x2="28" y2="0" />
      <line x1="36" y1="22" x2="37" y2="-3" />
      <line x1="46" y1="22" x2="48" y2="2" />
    </svg>
  ),
  chefHat: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 46" fill="none" stroke="currentColor"
      strokeWidth="1.3" strokeLinecap="round">
      <path d="M10 26 Q10 6 28 6 Q46 6 46 26" />
      <path d="M28 6 Q28 -2 36 -2 Q44 -2 44 6" />
      <path d="M28 6 Q28 -2 20 -2 Q12 -2 12 6" />
      <rect x="6" y="26" width="44" height="9" rx="2" fill="currentColor" fillOpacity="0.10" />
      <rect x="6" y="26" width="44" height="9" rx="2" />
      <rect x="6" y="35" width="44" height="6" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="6" y="35" width="44" height="6" rx="1" />
    </svg>
  ),
  fork: (s) => (
    <svg width={s} height={s} viewBox="0 0 44 56" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round">
      <line x1="10" y1="0" x2="10" y2="56" />
      <path d="M10 0 Q22 8 18 22 L10 24 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M10 0 Q22 8 18 22 L10 24 Z" />
      <line x1="28" y1="22" x2="28" y2="56" />
      <line x1="22" y1="0" x2="22" y2="20" />
      <line x1="28" y1="0" x2="28" y2="20" />
      <line x1="34" y1="0" x2="34" y2="20" />
      <path d="M22 20 Q28 26 34 20" />
    </svg>
  ),
  grill: (s) => (
    <svg width={s} height={s} viewBox="0 0 56 44" fill="none" stroke="currentColor"
      strokeWidth="1.3" strokeLinecap="round">
      <line x1="0" y1="30" x2="56" y2="30" />
      <line x1="8" y1="30" x2="8" y2="40" />
      <line x1="28" y1="30" x2="28" y2="40" />
      <line x1="48" y1="30" x2="48" y2="40" />
      <line x1="0" y1="35" x2="56" y2="35" />
      <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z"
        fill="currentColor" fillOpacity="0.14" />
      <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z" />
    </svg>
  ),
}

// ─── Icon sizes per breakpoint — عدّل هون بس ─────────────
const ICON_SIZES = {
  mobile: { burger: 68, steak: 72, fries: 62, chefHat: 62, fork: 62, grill: 62 },
  desktop: { burger: 48, steak: 52, fries: 44, chefHat: 44, fork: 44, grill: 44 },
}

// ─── Font sizes per breakpoint — عدّل هون بس ─────────────
const FONT_SIZES = {
  mobile: {
    eyebrow: '1.1rem',
    subtitle: '1.3rem',
    cta: '1.2rem',
  },
  desktop: {
    eyebrow: 'clamp(0.85rem, 2.2vw, 1.2rem)',
    subtitle: 'clamp(1rem, 3.5vw, 1.45rem)',
    cta: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  },
}

// ─── Icon layout — positions & timing ─────────────────────
const FLOATING_ICONS = [
  { icon: 'burger', x: '5%', y: '12%', delay: 0, duration: 6 },
  { icon: 'steak', x: '78%', y: '17%', delay: 0.2, duration: 7 },
  { icon: 'fries', x: '88%', y: '55%', delay: 0.4, duration: 5 },
  { icon: 'chefHat', x: '70%', y: '78%', delay: 0.6, duration: 6 },
  { icon: 'fork', x: '3%', y: '65%', delay: 0.8, duration: 8 },
  { icon: 'grill', x: '14%', y: '82%', delay: 1, duration: 6 },
]

// ─── FloatingIcon component ───────────────────────────────
const FloatingIcon = ({ x, y, delay = 0, duration = 6, icon, size = 56, rotateRange = 10 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.12, 0.16, 0.12],
      y: [0, -16, -28, -16, 0],
      rotate: [-rotateRange * 0.5, rotateRange, -rotateRange, rotateRange * 0.5, -rotateRange * 0.5],
    }}
    transition={{ duration, repeat: Infinity, delay: delay * 0.3, ease: 'easeInOut' }}
    className="absolute pointer-events-none select-none"
    style={{ left: x, top: y, color: 'var(--gold)', zIndex: 1 }}
  >
    {ICONS[icon]?.(size)}
  </motion.div>
)



// ─── Hero ─────────────────────────────────────────────────
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-visible"
      style={{
        background: 'var(--bg)',
        paddingTop: 'clamp(2rem, 8vw, 4rem)',
        paddingBottom: 'clamp(4rem, 10vw, 8rem)',
        textAlign: 'center',
      }}
    >
      {FLOATING_ICONS.map(({ icon, x, y, delay, duration }) => (
        <FloatingIcon
          key={icon}
          icon={icon}
          x={x} y={y}
          delay={delay}
          duration={duration}
          size={sizes[icon]}
        />
      ))}

      <div
        dir={isAr ? 'rtl' : 'ltr'}
        style={{
          zIndex: 2,
          maxWidth: '860px',
          width: '100%',
          padding: '0 clamp(1.25rem, 5vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: 'clamp(1.25rem, 4vw, 2.5rem) 0',
          }}
        >
          <img
            src="/logo.png"
            alt="logo"
            style={{
              width: 'clamp(260px, 88vw, 680px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: fonts.subtitle,
            lineHeight: isAr ? 2.0 : 1.85,
            maxWidth: 580,
            fontFamily: isAr ? arabicFont : englishFont,
            margin: 0,
            textAlign: 'center',
            opacity: 0.88,
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.button
          {...fadeUp(0.3)}
          onClick={onExplore}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 'clamp(1.5rem, 4vw, 2rem)',
            fontSize: fonts.cta,
            padding: 'clamp(12px, 2.5vw, 16px) clamp(32px, 5vw, 52px)',
            color: 'var(--gold)',
            border: '1px solid rgba(212,175,55,0.3)',
            background: 'rgba(212,175,55,0.05)',
            cursor: 'pointer',
            fontFamily: isAr ? arabicFont : englishFont,
            letterSpacing: '0.05em',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          {t('hero.cta')}
        </motion.button>
      </div>

    </section>
  )
}