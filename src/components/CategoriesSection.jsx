import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCategories, prefetchItems } from '../hooks/useData'

export default function CategoriesSection({ onCategorySelect, lang }) {
  const { t } = useTranslation()
  const { categories, loading } = useCategories()

  return (
    <section id="categories" style={{ background: 'var(--bg)', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 px-6"
      >
        <p className="font-body text-xs mb-4"
          style={{ color: 'rgba(212,175,55,0.55)', letterSpacing: '0.4em',fontFamily: lang === 'ar' ? '"Cairo", sans-serif':'' }}>
          — {t('categories.subheading')} —
        </p>
        <h2 className="font-display"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--text-primary)', fontFamily: lang === 'ar' ? '"Cairo", sans-serif':'' }}>
          {t('categories.heading')}
        </h2>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <p className="font-body text-xs" style={{ color: 'var(--text-dim)', letterSpacing: '0.3em', fontFamily: lang === 'ar' ? '"Cairo", sans-serif':'' }}>
            {lang === 'ar' ? 'يتم التحميل...' : 'Loading...'}
          </p>
        </div>
      ) : (
        <div
          className="grid px-6"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            border: '1px solid rgba(212,175,55,0.06)',
          }}
        >
          {categories.filter(cat => !cat.parent_id).map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={i}
              lang={lang}
              onClick={onCategorySelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CategoryCard({ category, index, lang, onClick }) {
  const { t } = useTranslation()
  const name = lang === 'ar' ? category.name_ar : category.name_en
  const desc = lang === 'ar' ? category.desc_ar : category.desc_en

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(category)}
      onMouseEnter={() => prefetchItems(category.id)}
      onTouchStart={() => prefetchItems(category.id)}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: 'var(--card)',
        aspectRatio: '4/3',
        borderRight: '1px solid rgba(212,175,55,0.06)',
        borderBottom: '1px solid rgba(212,175,55,0.06)',
      }}
    >
      {/* 1. الصورة الخلفية - زدنا السطوع قليلاً هنا */}
      <motion.div
        className="absolute inset-0 z-0"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={category.image_url}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ filter: 'brightness(0.9) saturate(0.9)' }}
        />
      </motion.div>

      {/* 2. طبقة التعتيم الذكية - خففنا الـ opacity لـ 40% بدل 70% */}
      <div
        className="absolute inset-0 bg-black opacity-40 group-hover:opacity-10 transition-opacity duration-700 z-10"
        aria-hidden="true"
      />

      {/* 3. التدرج اللوني - جعلناه يتركز في الأسفل فقط (أقصر) ليعطي وضوح للنص دون تعتيم الصورة كاملة */}
      <div
        className="absolute inset-0 z-20"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)' }}
      />

      {/* 4. المحتوى العلوي */}
      <div className="relative z-30 h-full w-full p-6 flex flex-col justify-between">

        {/* الزوايا الذهبية */}
        <div className="absolute top-4 left-4"
          style={{
            width: 28, height: 28,
            borderTop: '1px solid rgba(212,175,55,0.3)',
            borderLeft: '1px solid rgba(212,175,55,0.3)'
          }} />
        <div className="absolute top-4 right-4"
          style={{
            width: 28, height: 28,
            borderTop: '1px solid rgba(212,175,55,0.3)',
            borderRight: '1px solid rgba(212,175,55,0.3)'
          }} />

        {/* عداد الأصناف */}
        <div className="absolute top-5 left-0 right-0 flex justify-center">
          <span className="font-body text-[10px]"
            style={{ color: 'rgba(212,175,55,0.7)', letterSpacing: '0.3em' }}>
            {String(category.item_count || 0).padStart(2, '0')} {lang === 'ar' ? 'صنف' : 'items'}
          </span>
        </div>

        {/* النصوص في الأسفل */}
        <div className="mt-auto">
          <div className="gold-line mb-3" style={{ opacity: 0.5 }} />
          <h3 className="font-display mb-1"
            style={{ fontSize: '1.5rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)',fontFamily: lang === 'ar' ? '"Cairo", sans-serif':'' }}>
            {name}
          </h3>
          <p className="font-body text-[11px]"
            style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontWeight: 300,fontFamily: lang === 'ar' ? '"Cairo", sans-serif':'' }}>
            {desc}
          </p>

          {/* Hover CTA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="mt-3 font-body text-[10px] flex items-center gap-2"
            style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}
          >
            <span>{t('item.explore')}</span>
            <div className="h-[1px] w-8 bg-gold opacity-50" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}