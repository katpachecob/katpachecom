import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './About.module.css'

export function About() {
  const { t } = useLanguage()

  return (
    <section className={styles.about}>
      <Reveal>
        <h2 className={styles.eyebrow}>{t('about.eyebrow')}</h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className={styles.body}>{t('about.body')}</p>
      </Reveal>
    </section>
  )
}
