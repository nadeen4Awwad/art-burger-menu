import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoriesSection from './components/CategoriesSection'
import ItemsDrawer from './components/ItemsDrawer'
import CartDrawer from './components/CartDrawer'
import DecorativeLayer from './components/DecorativeLayer'
import WhatsAppButton from './components/WhatsAppButton'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'

export default function App() {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState('ar')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Simple hash-based routing for /admin
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkRoute = () => {
      setIsAdmin(window.location.hash === '#/admin')
    }
    checkRoute()
    window.addEventListener('hashchange', checkRoute)
    return () => window.removeEventListener('hashchange', checkRoute)
  }, [])
  

  const toggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    i18n.changeLanguage(next)
    document.documentElement.setAttribute('lang', next)
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
  }

  const scrollToMenu = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = selectedCategory ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedCategory])

  // Admin page (no cart, no decorations)
  if (isAdmin) {
    return <AdminPage />
  }

  return (
    <CartProvider>
      <div
        className="relative min-h-screen"
        style={{ background: 'var(--bg)' }}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden />

        {/* Floating spices */}
        <DecorativeLayer />

        {/* Navbar */}
        <Navbar onLangToggle={toggleLang} lang={lang} />

        {/* Hero */}
        <Hero onExplore={scrollToMenu} />

        {/* Categories */}
        <CategoriesSection
          onCategorySelect={setSelectedCategory}
          lang={lang}
        />

        {/* Footer */}
        <Footer />

        {/* Items Drawer */}
        <ItemsDrawer
          category={selectedCategory}
          lang={lang}
          onClose={() => setSelectedCategory(null)}
        />

        {/* Cart Drawer */}
        <CartDrawer lang={lang} />

        {/* WhatsApp CTA */}
        <WhatsAppButton phone="970599000000" />
      </div>
    </CartProvider>
  )
}
