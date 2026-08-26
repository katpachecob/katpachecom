import { useLanguage } from '../i18n/LanguageContext'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      {/* Placeholder: Phase 3 forms this from particles settling on scroll-into-view */}
      <p className={styles.signature}>{t('footer.signature')}</p>
      <div className={styles.meta}>
        <span>{t('footer.contact')}</span>
        <span>© 2026 KP</span>
      </div>
    </footer>
  )
}
