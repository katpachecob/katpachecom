import { useLanguage } from '../i18n/LanguageContext'
import styles from './Portfolio.module.css'

// Hardcoded for now — see README "Future improvements" for the data-model migration plan.
const projects = [
  { title: 'Proyecto Uno', tag: 'Interactive', es: 'Descripción placeholder.', en: 'Placeholder description.' },
  { title: 'Proyecto Dos', tag: 'Creative Code', es: 'Descripción placeholder.', en: 'Placeholder description.' },
  { title: 'Proyecto Tres', tag: 'Installation', es: 'Descripción placeholder.', en: 'Placeholder description.' },
  { title: 'Proyecto Cuatro', tag: 'Web Experience', es: 'Descripción placeholder.', en: 'Placeholder description.' },
]

export function Portfolio() {
  const { t, lang } = useLanguage()

  return (
    <section className={styles.portfolio}>
      <p className={styles.eyebrow}>{t('portfolio.eyebrow')}</p>
      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardTag}>{project.tag}</p>
            <p className={styles.cardDescription}>{lang === 'es' ? project.es : project.en}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
