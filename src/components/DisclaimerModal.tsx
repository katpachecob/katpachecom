import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './DisclaimerModal.module.css'

interface DisclaimerModalProps {
  open: boolean
  onDismiss: () => void
}

export function DisclaimerModal({ open, onDismiss }: DisclaimerModalProps) {
  const { t } = useLanguage()
  const dismissRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    dismissRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onDismiss])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onDismiss}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-heading"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="disclaimer-heading" className={styles.heading}>
              {t('disclaimer.heading')}
            </h2>
            <p className={styles.body}>{t('disclaimer.body')}</p>
            <p className={styles.note}>{t('disclaimer.note')}</p>
            <button ref={dismissRef} type="button" className={styles.dismiss} onClick={onDismiss}>
              {t('disclaimer.dismiss')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
