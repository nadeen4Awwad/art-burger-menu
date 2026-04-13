import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      className="relative"
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid rgba(212,175,55,0.06)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Top gold line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 1,
          height: 60,
          background: 'linear-gradient(to bottom, rgba(212,175,55,0.3), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          {/* Brand */}
          <p
            className="font-display mb-3"
            style={{ fontSize: '2.5rem', color: 'rgba(212,175,55,0.15)', letterSpacing: '0.3em' }}
          >
            ART BURGER
          </p>
          <p
            className="font-body text-xs italic"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}
          >
            {t('footer.tagline')}
          </p>
        </motion.div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.08), transparent)',
            marginBottom: '2rem',
          }}
        />

        {/* Footer meta */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs"
          style={{ color: 'var(--text-dim)', letterSpacing: '0.15em' }}
        >
          <span>{t('footer.address')}</span>
          <span>{t('footer.hours')}</span>
          <span>{t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  )
}
