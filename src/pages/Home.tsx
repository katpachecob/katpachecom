import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Portfolio } from '../sections/Portfolio'
import { LabPromo } from '../sections/LabPromo'
import { Contact } from '../sections/Contact'
import { Footer } from '../sections/Footer'
import { DisclaimerModal } from '../components/DisclaimerModal'

export function Home() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewRaw = useTransform(scrollVelocity, [-3500, 0, 3500], [-5, 0, 5])
  const skew = useSpring(skewRaw, { stiffness: 220, damping: 22, mass: 0.4 })
  const [disclaimerOpen, setDisclaimerOpen] = useState(true)

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
