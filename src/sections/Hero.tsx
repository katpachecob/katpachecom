import { lazy, Suspense } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useHandTracking } from '../lib/mediapipe/useHandTracking'
import { CameraBadge } from '../components/CameraBadge'
import styles from './Hero.module.css'

const HeroScene = lazy(() => import('../three/HeroScene').then((m) => ({ default: m.HeroScene })))

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Hero() {
  const { t, toggleLang } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const { videoRef, handRef, status } = useHandTracking()
  const itemTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <section className={styles.hero}>
      <div className={styles.canvasWrap} aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene handRef={handRef} />
        </Suspense>
      </div>

      <motion.div className={styles.frame} initial="hidden" animate="visible" variants={container}>
        <motion.div className={styles.nav} variants={item} transition={itemTransition}>
          <div className={styles.brand}>
            <span>KP</span>
            <a
              className={styles.cvLink}
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('nav.cv')}
            >
              {t('nav.cv')}
            </a>
          </div>
          <motion.button
            type="button"
            className={styles.langToggle}
            onClick={toggleLang}
            whileTap={{ scale: 0.92 }}
          >
            {t('nav.toggleLang')}
          </motion.button>
        </motion.div>

        <motion.div className={styles.main} variants={item} transition={itemTransition}>
          <h1 className={styles.title}>Kat Pacheco</h1>
          <p className={styles.role}>{t('hero.role')}</p>
        </motion.div>

        <motion.div className={styles.bottomRow} variants={item} transition={itemTransition}>
          <div className={styles.camGroup}>
            <CameraBadge videoRef={videoRef} live={status === 'granted'} privacyLabel={t('hero.privacy')} />
            <div>
              <p className={styles.handHint}>{t('hero.handHint')}</p>
              <p className={styles.noCameraHint}>{t('hero.noCameraHint')}</p>
            </div>
          </div>
          <p className={styles.scrollHint}>{t('hero.scrollHint')} ↓</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
