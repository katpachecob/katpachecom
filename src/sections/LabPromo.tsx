import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './LabPromo.module.css'

export function LabPromo() {
  const { t } = useLanguage()

  return (
    <section className={styles.labPromo}>
      <Reveal>
        <p className={styles.eyebrow}>{t('labPromo.eyebrow')}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={styles.heading}>{t('labPromo.heading')}</h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className={styles.body}>{t('labPromo.body')}</p>
      </Reveal>
      <Reveal delay={0.24}>
        <Link to="/lab" className={styles.cta}>
          <span>{t('labPromo.cta')}</span>
          <span className={styles.ctaIcon} aria-hidden="true">
            ↗
          </span>
        </Link>
      </Reveal>
    </section>
  )
}
