import { Link } from 'react-router-dom'
import { ParticleText } from '../components/ParticleText'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './Footer.module.css'

const SIGNATURES = ['Ideas can be real', 'Code can be art', 'Play can be disruptive', 'Bugs can be beautiful']

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      <ParticleText texts={SIGNATURES} className={styles.signature} />
      <Reveal delay={0.2}>
        <div className={styles.meta}>
          <a href="#contact">{t('footer.contact')}</a>
          <Link to="/lab">{t('footer.lab')}</Link>
          <span>© 2026 KP</span>
        </div>
      </Reveal>
    </footer>
  )
}
