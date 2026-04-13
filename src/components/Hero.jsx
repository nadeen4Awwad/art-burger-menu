import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ onExplore }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 55%, rgba(212,175,55,0.06) 0%, transparent 75%)',
        }}
      />

      {/* Vertical lines decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[22, 78].map((x) => (
          <div
            key={x}
            className="absolute top-0 bottom-0"
            style={{
              left: `${x}%`,
              width: 1,
              background:
                'linear-gradient(to bottom, transparent, rgba(212,175,55,0.05) 30%, rgba(212,175,55,0.05) 70%, transparent)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col items-center">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0.1)}
          className="font-body text-xs tracking-widest mb-8"
          style={{
            color: 'var(--gold)',
            letterSpacing: isAr ? 'normal' : '0.35em',
            opacity: 0.7,
            direction: isAr ? 'rtl' : 'ltr'
          }}
        >
          {t('hero.eyebrow')}
        </motion.p>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 1,
            height: 40,
            background:
              'linear-gradient(to bottom, transparent, rgba(212,175,55,0.5), transparent)',
            marginBottom: '2.618rem', // golden ratio spacing
          }}
        />

        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2.618rem' }}
        >
          <img
            src="/logo.png"
            alt="Art Burger & More"
            style={{
              width: 'clamp(320px, 45vw, 520px)',
              height: 'auto',
              filter: 'drop-shadow(0 6px 28px rgba(212,175,55,0.18))',
            }}
          />
        </motion.div>

        {/* Luxury tagline under logo */}
        <motion.p
          {...fadeUp(0.5)}
          className="font-body mb-12"
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 2,
            fontWeight: 300,
            maxWidth: 340,
            fontSize: isAr ? '0.95rem' : '0.85rem',
            letterSpacing: isAr ? '0.02em' : '0.08em',
            fontFamily: isAr
              ? '"Cairo", "Almarai", sans-serif'
              : '"Cormorant Garamond", serif',
            fontStyle: isAr ? 'normal' : 'italic',
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.button
          {...fadeUp(0.65)}
          onClick={onExplore}
          className="font-body text-xs tracking-widest relative group"
          style={{
            color: 'var(--gold)',
            letterSpacing: '0.3em',
            padding: '14px 42px',
            borderRadius: '2px',
            background:
              'linear-gradient(to right, rgba(212,175,55,0.08), transparent)',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
          }}
          whileHover={{
            backgroundColor: 'rgba(212,175,55,0.12)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          {t('hero.cta')}
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
          style={{ color: 'var(--text-dim)' }}
        >
          <span
            className="font-body text-xs tracking-widest"
            style={{ letterSpacing: '0.25em', fontSize: 10 }}
          >
            {t('hero.scroll')}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <rect
                x="1"
                y="1"
                width="10"
                height="18"
                rx="5"
                stroke="rgba(212,175,55,0.3)"
                strokeWidth="1"
              />
              <motion.rect
                x="5"
                y="4"
                width="2"
                height="4"
                rx="1"
                fill="rgba(212,175,55,0.5)"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}