import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './Contact.module.css'

// Placeholder email/social links — swap for the real ones in Phase 4.
const EMAIL = 'hola@katpache.com'
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/katpachecobc' },
  { label: 'GitHub', href: 'https://github.com/katpachecob' },
]

export function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className={styles.contact}>
      <Reveal>
        <p className={styles.eyebrow}>{t('contact.eyebrow')}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={styles.heading}>{t('contact.heading')}</h2>
      </Reveal>
      <Reveal delay={0.16}>
        <a className={styles.email} href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </Reveal>
      <Reveal delay={0.24}>
        <div className={styles.social}>
          {SOCIALS.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
