import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Portfolio } from '../sections/Portfolio'
import { LabPromo } from '../sections/LabPromo'
import { Contact } from '../sections/Contact'
import { Footer } from '../sections/Footer'
import { DisclaimerModal } from '../components/DisclaimerModal'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../lib/seo/useSEO'

const SEO_COPY = {
  es: {
    title: 'Kat Pacheco — Creative Technologist',
    description:
      'Instalaciones y experiencias interactivas con computer vision, TouchDesigner y sonido en tiempo real.',
  },
  en: {
    title: 'Kat Pacheco — Creative Technologist',
    description:
      'Interactive installations and experiences built with computer vision, TouchDesigner, and real-time sound.',
  },
}

export function Home() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewRaw = useTransform(scrollVelocity, [-3500, 0, 3500], [-5, 0, 5])
  const skew = useSpring(skewRaw, { stiffness: 220, damping: 22, mass: 0.4 })
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const { lang } = useLanguage()
  useSEO({ ...SEO_COPY[lang], path: '/' })

  // Hero mounts the camera/hand-tracking pipeline and the three.js scene right
  // away — showing the modal's enter animation on top of that competes for the
  // main thread and feels janky. Give the initial render room to settle first.
  useEffect(() => {
    const id = setTimeout(() => setDisclaimerOpen(true), 400)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      <DisclaimerModal open={disclaimerOpen} onDismiss={() => setDisclaimerOpen(false)} />
      <motion.div style={{ skewY: shouldReduceMotion ? 0 : skew }}>
        <Hero />
        <About />
        <Portfolio />
        <LabPromo />
        <Contact />
        <Footer />
      </motion.div>
    </>
  )
}
