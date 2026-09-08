import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import { useSEO } from '../lib/seo/useSEO'
import styles from './ProjectDetail.module.css'

function toYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export function ProjectDetail() {
  const { t, lang } = useLanguage()
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const found = index !== -1 ? projects[index] : undefined

  useSEO({
    title: found ? `${found.title} — Kat Pacheco` : 'Kat Pacheco — Creative Technologist',
    description: found ? found.summary[lang] : '',
    path: `/portfolio/${slug ?? ''}`,
    image: found?.cover ? `https://katpache.com${found.cover}` : undefined,
  })

  if (index === -1) return <Navigate to="/" replace />

  const project = projects[index]
  const prev = projects[index - 1]
  const next = projects[index + 1]

  return (
    <section className={styles.detail}>
      <nav className={styles.nav}>
        <Link to="/#portfolio">← {t('portfolio.eyebrow')}</Link>
      </nav>

      <div className={styles.content}>
        <div className={styles.intro}>
          <div>
            <Reveal>
              <p className={styles.tag}>{project.tag}</p>
              <h1 className={styles.title}>{project.title}</h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className={styles.summary}>{lang === 'es' ? project.summary.es : project.summary.en}</p>
            </Reveal>

            {project.repo && (
              <Reveal delay={0.15}>
                <a className={styles.repoLink} href={project.repo} target="_blank" rel="noreferrer">
                  {t('project.viewCode')} ↗
                </a>
              </Reveal>
            )}
          </div>

          {project.cover && (
            <Reveal delay={0.05} className={styles.coverWrap}>
              <img
                className={styles.cover}
                src={project.cover}
                alt={project.title}
                loading="eager"
              />
            </Reveal>
          )}
        </div>

        <div className={styles.grid}>
          <Reveal delay={0.15}>
            <div className={styles.block}>
              <p className={styles.label}>{t('project.context')}</p>
              <p className={styles.body}>{lang === 'es' ? project.context.es : project.context.en}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className={styles.block}>
              <p className={styles.label}>{t('project.role')}</p>
              <p className={styles.body}>{lang === 'es' ? project.role.es : project.role.en}</p>
            </div>
          </Reveal>

          {project.tools.length > 0 && (
            <Reveal delay={0.25}>
              <div className={styles.block}>
                <p className={styles.label}>{t('project.tools')}</p>
                <ul className={styles.tools}>
                  {project.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.3}>
            <div className={styles.block}>
              <p className={styles.label}>{t('project.process')}</p>
              <p className={styles.body}>{lang === 'es' ? project.process.es : project.process.en}</p>
            </div>
          </Reveal>
        </div>

        {project.video && toYouTubeEmbedUrl(project.video) && (
          <Reveal delay={0.05}>
            <div className={styles.videoWrap}>
              <iframe
                className={styles.video}
                src={toYouTubeEmbedUrl(project.video)!}
                title={project.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <Reveal delay={0.1}>
            <div className={styles.gallery}>
              {project.gallery.map((src) => (
                <img key={src} className={styles.galleryImg} src={src} alt={project.title} loading="lazy" />
              ))}
            </div>
          </Reveal>
        )}

        <div className={styles.pager}>
          {prev ? (
            <Link to={`/portfolio/${prev.slug}`} className={styles.pagerLink}>
              ← {t('portfolio.prev')}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/portfolio/${next.slug}`} className={styles.pagerLink}>
              {t('portfolio.next')} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  )
}
