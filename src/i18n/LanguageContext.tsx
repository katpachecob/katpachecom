import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import es from './es.json'
import en from './en.json'

type Dictionary = typeof es
export type Lang = 'es' | 'en'

const dictionaries: Record<Lang, Dictionary> = { es, en }
const STORAGE_KEY = 'portfolio-lang'

function detectInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'es' || stored === 'en') return stored
  return 'es'
}

function resolve(dict: Dictionary, path: string): string {
  const value = path
    .split('.')
    .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], dict)
  return typeof value === 'string' ? value : path
}

interface LanguageContextValue {
  lang: Lang
  toggleLang: () => void
  t: (path: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      toggleLang: () =>
        setLang((prev) => {
          const next = prev === 'es' ? 'en' : 'es'
          localStorage.setItem(STORAGE_KEY, next)
          return next
        }),
      t: (path: string) => resolve(dictionaries[lang], path),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
