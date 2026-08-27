import type { RefObject } from 'react'
import styles from './CameraBadge.module.css'

interface CameraBadgeProps {
  videoRef: RefObject<HTMLVideoElement | null>
  live: boolean
  privacyLabel: string
}

export function CameraBadge({ videoRef, live, privacyLabel }: CameraBadgeProps) {
  return (
    <div className={styles.badge} title={privacyLabel} tabIndex={0} role="status" aria-label={privacyLabel}>
      <video ref={videoRef} className={styles.video} muted playsInline aria-hidden="true" />
      <span className={`${styles.dot} ${live ? styles.dotLive : ''}`} aria-hidden="true" />
    </div>
  )
}
