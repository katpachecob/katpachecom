import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import styles from './Portfolio.module.css'

const PortfolioCarousel = lazy(() =>
  import('../three/PortfolioCarousel').then((m) => ({ default: m.PortfolioCarousel })),
)

export function Portfolio() {
  const { t, lang } = useLanguage()
  const [active, setActive] = useState(0)
  const project = projects[active]
  // Stable references — recreating these on every `active` change would
  // re-trigger the carousel's texture-loading effects and briefly reset
  // already-loaded cover images back to their gradient placeholder.
  const carouselColors = useMemo(() => projects.map((p) => p.colors as [string, string]), [])
  const carouselCovers = useMemo(() => projects.map((p) => p.cover), [])

  return (
    <section id="portfolio" className={styles.portfolio}>
      <Reveal>
        <h2 className={styles.eyebrow}>{t('portfolio.eyebrow')}</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.stage}>
          <div className={styles.canvasStage}>
            <Suspense fallback={null}>
              <PortfolioCarousel
                colors={carouselColors}
                covers={carouselCovers}
                active={active}
                onActiveChange={setActive}
              />
            </Suspense>
          </div>

          <div className={styles.info}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.tag}>{project.tag}</p>
                <p className={styles.description}>{lang === 'es' ? project.summary.es : project.summary.en}</p>
                <Link className={styles.viewProject} to={`/portfolio/${project.slug}`}>
                  {t('portfolio.viewProject')} →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.arrows}>
            <button
              type="button"
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              aria-label={t('portfolio.prev')}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => Math.min(projects.length - 1, i + 1))}
              disabled={active === projects.length - 1}
              aria-label={t('portfolio.next')}
            >
              →
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
