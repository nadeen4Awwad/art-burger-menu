import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ lang }) {
  const { t } = useTranslation()
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart()

  const [notes, setNotes] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const handleClearCart = () => {
    if (confirmClear) {
      clearCart()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 bottom-0 z-[70] overflow-y-auto flex flex-col"
            style={{
              [dir === 'rtl' ? 'left' : 'right']: 0,
              width: 'min(440px, 100vw)',
              background: '#0d0d0d',
              borderLeft: dir === 'rtl' ? 'none' : '1px solid rgba(212,175,55,0.07)',
              borderRight: dir === 'rtl' ? '1px solid rgba(212,175,55,0.07)' : 'none',
            }}
            dir={dir}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-20 flex items-center justify-between px-7 py-5"
              style={{
                background: 'rgba(13,13,13,0.95)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(212,175,55,0.07)',
              }}
            >
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <div>
                  <h3
                    className="font-display"
                    style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}
                  >
                    {lang === 'ar' ? 'السلة' : 'Your Cart'}
                  </h3>
                  <p
                    className="font-body text-xs"
                    style={{ color: 'rgba(212,175,55,0.45)', letterSpacing: '0.2em', fontSize: 10 }}
                  >
                    {totalItems} {lang === 'ar' ? 'عنصر' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="transition-opacity hover:opacity-50"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p
                    className="font-body text-sm mt-4"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {lang === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {cartItems.map((item, i) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      index={i}
                      lang={lang}
                      onRemove={removeFromCart}
                      onUpdateQty={updateQuantity}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer with total */}
            {cartItems.length > 0 && (
              <div
                className="sticky bottom-0 px-7 py-5"
                style={{
                  background: 'rgba(13,13,13,0.95)',
                  backdropFilter: 'blur(16px)',
                  borderTop: '1px solid rgba(212,175,55,0.07)',
                }}
              >
                {/* Clear cart */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleClearCart}
                    className="flex items-center gap-1.5 font-body text-xs transition-all duration-200"
                    style={{
                      color: confirmClear ? 'rgba(220,60,60,0.85)' : 'var(--text-dim)',
                      letterSpacing: '0.12em',
                      padding: '4px 8px',
                      border: confirmClear ? '1px solid rgba(220,60,60,0.3)' : '1px solid transparent',
                      borderRadius: 0,
                      background: confirmClear ? 'rgba(220,60,60,0.06)' : 'transparent',
                    }}
                  >
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                      <path d="M1 3h9M4 3V1.5h3V3M2 3l.5 7.5h6L9 3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="4.5" y1="5.5" x2="4.5" y2="8.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
                      <line x1="6.5" y1="5.5" x2="6.5" y2="8.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
                    </svg>
                    {confirmClear
                      ? (lang === 'ar' ? 'تأكيد الحذف؟' : 'Sure?')
                      : (lang === 'ar' ? 'إفراغ السلة' : 'Clear Cart')
                    }
                  </button>
                </div>

                {/* Notes field */}
                <div className="mb-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'ملاحظات أو طلبات خاصة...' : 'Notes or special requests...'}
                    rows={2}
                    className="w-full resize-none"
                    style={{
                      fontSize: '16px', // منع الزوم التلقائي في iOS
                      fontFamily: 'inherit',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,175,55,0.12)',
                      color: 'var(--text-secondary)',
                      padding: '10px 12px',
                      outline: 'none',
                      letterSpacing: '0.05em',
                      lineHeight: 1.6,
                      borderRadius: 0,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)' }}
                  />
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-body text-sm"
                    style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
                  >
                    {lang === 'ar' ? 'المجموع' : 'Total'}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: '1.5rem', color: 'var(--gold)' }}
                  >
                    ₪{totalPrice.toFixed(0)}
                  </span>
                </div>

                {/* WhatsApp order button */}
                <a
                  href={buildWhatsAppUrl(cartItems, totalPrice, lang, notes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-body text-xs tracking-widest py-4 transition-all duration-300"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: 'var(--gold)',
                    letterSpacing: '0.25em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
                  }}
                >
                  {lang === 'ar' ? 'اطلب عبر واتساب' : 'ORDER VIA WHATSAPP'}
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItemRow({ item, index, lang, onRemove, onUpdateQty }) {
  const name = lang === 'ar' ? item.name_ar : item.name_en

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center gap-4 py-4"
      style={{ borderBottom: '1px solid rgba(212,175,55,0.04)' }}
    >
      {/* Image */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: 56, height: 56, borderRadius: 2 }}
      >
        {item.img_url ? (
          <img
            src={item.img_url}
            alt={name}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85)' }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'var(--card)' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-display text-sm truncate"
          style={{ color: 'var(--text-primary)', lineHeight: 1.3 }}
        >
          {name}
        </h4>
        <p
          className="font-body text-xs mt-0.5"
          style={{ color: 'var(--gold)', opacity: 0.8 }}
        >
          ₪{item.price}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: 26,
            height: 26,
            border: '1px solid rgba(212,175,55,0.15)',
            color: 'var(--text-secondary)',
            background: 'transparent',
            fontSize: 14,
          }}
        >
          −
        </button>
        <span
          className="font-body text-sm"
          style={{ color: 'var(--text-primary)', width: 20, textAlign: 'center' }}
        >
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: 26,
            height: 26,
            border: '1px solid rgba(212,175,55,0.15)',
            color: 'var(--text-secondary)',
            background: 'transparent',
            fontSize: 14,
          }}
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 transition-opacity hover:opacity-50"
        style={{ color: 'var(--text-dim)' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M1 1l10 10M11 1L1 11"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  )
}

function buildWhatsAppUrl(items, total, lang, notes) {
  const phone = '972568978116'
  let message = lang === 'ar' ? '🍔 طلب جديد من Art Burger:\n\n' : '🍔 New Order from Art Burger:\n\n'

  items.forEach((item) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en
    message += `• ${name} x${item.quantity} — ₪${item.price * item.quantity}\n`
  })

  message += `\n${lang === 'ar' ? 'المجموع' : 'Total'}: ₪${total.toFixed(0)}`

  if (notes && notes.trim()) {
    message += `\n\n${lang === 'ar' ? '📝 ملاحظات' : '📝 Notes'}: ${notes.trim()}`
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}