import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useHandTracking } from '../lib/mediapipe/useHandTracking'
import { useHandAudio } from '../lib/audio/useHandAudio'
import { CameraBadge } from '../components/CameraBadge'
import styles from './Lab.module.css'

const LabScene = lazy(() => import('../three/LabScene').then((m) => ({ default: m.LabScene })))

export function Lab() {
  const { t } = useLanguage()
  const { videoRef, handRef, status } = useHandTracking()
  const { start, started, analyserRef, distortionRef } = useHandAudio(handRef)
  const cameraBlocked = status === 'denied' || status === 'unsupported'

  return (
    <section className={styles.lab}>
      <div className={styles.canvasWrap} aria-hidden="true">
        <Suspense fallback={null}>
          <LabScene handRef={handRef} analyserRef={analyserRef} distortionRef={distortionRef} />
        </Suspense>
      </div>

      <nav className={styles.nav}>
        <Link to="/">← {t('lab.back')}</Link>
      </nav>

      <div className={styles.overlay}>
        <CameraBadge videoRef={videoRef} live={status === 'granted'} privacyLabel={t('lab.privacy')} />
        <div>
          <p className={styles.eyebrow}>{t('lab.eyebrow')}</p>
          <p className={styles.hint}>{t('lab.hint')}</p>
          {cameraBlocked ? (
            <p className={styles.axis}>{t('lab.hintFallback')}</p>
          ) : (
            <>
              <p className={styles.axis}>{t('lab.axisX')}</p>
              <p className={styles.axis}>{t('lab.axisY')}</p>
            </>
          )}
        </div>
      </div>

      {!started && (
        <button type="button" className={styles.soundButton} onClick={start}>
          {t('lab.enableSound')}
        </button>
      )}
    </section>
  )
}
