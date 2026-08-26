import { useLanguage } from '../i18n/LanguageContext'
import styles from './Hero.module.css'

export function Hero() {
  const { t, toggleLang } = useLanguage()

  return (
    <section className={styles.hero}>
      <div className={styles.nav}>
        <span>KP</span>
        <button type="button" className={styles.langToggle} onClick={toggleLang}>
          {t('nav.toggleLang')}
        </button>
      </div>

      {/* Placeholder: Phase 2 replaces this with the orb + particle field reacting to hand tracking */}
      <div className={styles.main}>
        <h1 className={styles.title}>Tu Nombre</h1>
        <p className={styles.role}>{t('hero.role')}</p>
      </div>

      <p className={styles.scrollHint}>{t('hero.scrollHint')} ↓</p>
    </section>
  )
}
