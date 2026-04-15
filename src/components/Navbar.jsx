import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'

export default function Navbar({ onLangToggle, lang }) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(15,15,15,0.82)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.07)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex flex-col leading-none">
          <span
            className="font-display text-xl tracking-widest"
            style={{ color: 'var(--gold)', letterSpacing: '0.2em',
              fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : ''
             }}
          >
            {t('nav.brand')}
          </span>
          <span
            className="font-body text-xs tracking-widest mt-0.5"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.25em' }}
          >
            {t('nav.tagline')}
          </span>
        </a>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative transition-opacity duration-300 hover:opacity-70"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  color: '#0f0f0f',
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Lang toggle */}
          <button
            onClick={onLangToggle}
            className="font-body text-xs tracking-widest transition-all duration-300"
            style={{
              color: 'var(--text-secondary)',
              letterSpacing: '0.15em',
              border: '1px solid rgba(212,175,55,0.15)',
              padding: '4px 10px',
              borderRadius: 2,
            }}
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
