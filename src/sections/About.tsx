import { useLanguage } from '../i18n/LanguageContext'
import styles from './About.module.css'

export function About() {
  const { t } = useLanguage()

  return (
    <section className={styles.about}>
      <p className={styles.eyebrow}>{t('about.eyebrow')}</p>
      <p className={styles.body}>{t('about.body')}</p>
    </section>
  )
}
