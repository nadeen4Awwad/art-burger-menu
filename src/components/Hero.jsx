import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

// ============================
// Floating Icon (FIXED + iOS SAFE)
// ============================
const FloatingIcon = ({ x, y, delay = 0, duration = 6, icon, size = 56, rotateRange = 10 }) => {
  const icons = {
    burger: (s) => (
      <svg width={s} height={s} viewBox="0 0 56 40" fill="none" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14 Q14 2 28 2 Q42 2 52 14 Z" fill="currentColor" fillOpacity="0.10"/>
        <path d="M2 18 Q14 4 28 4 Q42 4 54 18"/>
        <path d="M0 22 Q7 17 14 22 Q21 27 28 22 Q35 17 42 22 Q49 27 56 22"/>
        <rect x="2" y="25" width="52" height="7" rx="3" fill="currentColor" fillOpacity="0.08"/>
        <rect x="2" y="25" width="52" height="7" rx="3"/>
        <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z" fill="currentColor" fillOpacity="0.10"/>
        <path d="M2 32 L54 32 Q54 42 28 42 Q2 42 2 32 Z"/>
      </svg>
    ),
    steak: (s) => (
      <svg width={s} height={s} viewBox="0 0 66 44" fill="none" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round">
        <path d="M2 24 Q10 5 30 3 Q50 1 58 16 Q64 26 52 32 Q38 38 18 36 Q3 34 2 24 Z"
          fill="currentColor" fillOpacity="0.10"/>
        <path d="M2 24 Q10 5 30 3 Q50 1 58 16 Q64 26 52 32 Q38 38 18 36 Q3 34 2 24 Z"/>
        <path d="M14 20 Q22 15 30 20" strokeWidth="0.9" opacity="0.6"/>
        <path d="M30 12 Q38 9 46 15" strokeWidth="0.9" opacity="0.6"/>
        <path d="M34 24 Q42 22 50 26" strokeWidth="0.9" opacity="0.6"/>
        <path d="M54 30 L66 20" strokeWidth="2"/>
        <circle cx="67" cy="19" r="3" fill="currentColor" fillOpacity="0.15"/>
        <circle cx="67" cy="19" r="3"/>
      </svg>
    ),
    fries: (s) => (
      <svg width={s} height={s} viewBox="0 0 56 50" fill="none" stroke="currentColor"
        strokeWidth="1.3" strokeLinecap="round">
        <path d="M4 22 L52 22 L46 48 L10 48 Z" fill="currentColor" fillOpacity="0.08"/>
        <path d="M4 22 L52 22 L46 48 L10 48 Z"/>
        <line x1="16" y1="22" x2="17" y2="48"/>
        <line x1="28" y1="22" x2="28" y2="48"/>
        <line x1="40" y1="22" x2="39" y2="48"/>
        <line x1="10" y1="22" x2="8"  y2="2"/>
        <line x1="20" y1="22" x2="19" y2="-2"/>
        <line x1="28" y1="22" x2="28" y2="0"/>
        <line x1="36" y1="22" x2="37" y2="-3"/>
        <line x1="46" y1="22" x2="48" y2="2"/>
      </svg>
    ),
    chefHat: (s) => (
      <svg width={s} height={s} viewBox="0 0 56 46" fill="none" stroke="currentColor"
        strokeWidth="1.3" strokeLinecap="round">
        <path d="M10 26 Q10 6 28 6 Q46 6 46 26"/>
        <path d="M28 6 Q28 -2 36 -2 Q44 -2 44 6"/>
        <path d="M28 6 Q28 -2 20 -2 Q12 -2 12 6"/>
        <rect x="6" y="26" width="44" height="9" rx="2" fill="currentColor" fillOpacity="0.10"/>
        <rect x="6" y="26" width="44" height="9" rx="2"/>
        <rect x="6" y="35" width="44" height="6" rx="1" fill="currentColor" fillOpacity="0.06"/>
        <rect x="6" y="35" width="44" height="6" rx="1"/>
      </svg>
    ),
    fork: (s) => (
      <svg width={s} height={s} viewBox="0 0 44 56" fill="none" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round">
        <line x1="10" y1="0" x2="10" y2="56"/>
        <path d="M10 0 Q22 8 18 22 L10 24 Z" fill="currentColor" fillOpacity="0.12"/>
        <path d="M10 0 Q22 8 18 22 L10 24 Z"/>
        <line x1="28" y1="22" x2="28" y2="56"/>
        <line x1="22" y1="0" x2="22" y2="20"/>
        <line x1="28" y1="0" x2="28" y2="20"/>
        <line x1="34" y1="0" x2="34" y2="20"/>
        <path d="M22 20 Q28 26 34 20"/>
      </svg>
    ),
    grill: (s) => (
      <svg width={s} height={s} viewBox="0 0 56 44" fill="none" stroke="currentColor"
        strokeWidth="1.3" strokeLinecap="round">
        <line x1="0"  y1="30" x2="56" y2="30"/>
        <line x1="8"  y1="30" x2="8"  y2="40"/>
        <line x1="28" y1="30" x2="28" y2="40"/>
        <line x1="48" y1="30" x2="48" y2="40"/>
        <line x1="0"  y1="35" x2="56" y2="35"/>
        <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z"
          fill="currentColor" fillOpacity="0.14"/>
        <path d="M10 30 Q13 20 18 24 Q20 14 24 22 Q26 10 28 21 Q30 14 32 22 Q36 20 40 30 Z"/>
      </svg>
    ),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.15, 0.18, 0.15], // 👈 ثابتة (ما تختفي)
        y: [0, -20, -35, -20, 0],
        rotate: [-rotateRange * 0.5, rotateRange, -rotateRange, rotateRange * 0.5, -rotateRange * 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay: delay * 0.3, // 👈 أسرع ظهور
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, color: 'var(--gold)', zIndex: 1 }}
    >
      {icons[icon]?.(size)}
    </motion.div>
  )
}
// ============================
// HERO
// ============================
export default function Hero({ onExplore }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const arabicFont = '"Cairo", sans-serif'
  const englishFont = '"Cormorant Garamond", serif'

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ background: 'var(--bg)', paddingBottom: '8rem' }}
    >

      {/* Floating Icons */}
      <FloatingIcon icon="burger" x="5%" y="12%" delay={0} />
      <FloatingIcon icon="steak" x="78%" y="8%" delay={0.2} />
      <FloatingIcon icon="fries" x="88%" y="55%" delay={0.4} />
      <FloatingIcon icon="chefHat" x="70%" y="78%" delay={0.6} />
      <FloatingIcon icon="fork" x="3%" y="65%" delay={0.8} />
      <FloatingIcon icon="grill" x="14%" y="82%" delay={1} />

      <div
        style={{
          zIndex: 2,
          maxWidth: '900px',
          width: '100%',
          padding: '0 clamp(1rem,4vw,2rem)',
        }}
      >

        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0.1)}
          style={{
            color: 'var(--gold)',
            fontSize: 'clamp(1rem,2.5vw,1.3rem)',
            fontFamily: isAr ? arabicFont : 'inherit',
          }}
        >
          {t('hero.eyebrow')}
        </motion.p>

        {/* LOGO FIXED CENTER + BIG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: '2.5rem 0',
          }}
        >
          <img
            src="/logo.png"
            alt="logo"
            style={{
              width: 'clamp(320px, 85vw, 850px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: 'clamp(1.2rem,4vw,1.6rem)',
            lineHeight: 1.9,
            maxWidth: 650,
            fontFamily: isAr ? arabicFont : englishFont,
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.button
          {...fadeUp(0.3)}
          onClick={onExplore}
          style={{
            marginTop: '2rem',
            fontSize: 'clamp(1rem,3vw,1.2rem)',
            padding: 'clamp(14px,3vw,18px) clamp(40px,6vw,60px)',
            color: 'var(--gold)',
            border: '1px solid rgba(212,175,55,0.3)',
            background: 'rgba(212,175,55,0.05)',
            cursor: 'pointer',
          }}
        >
          {t('hero.cta')}
        </motion.button>

      </div>
    </section>
  )
}