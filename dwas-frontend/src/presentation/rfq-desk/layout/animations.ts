import { motion } from 'framer-motion'

export const rfqPanelTransition = {
  type: 'tween' as const,
  duration: 0.15,
  ease: 'easeOut' as const,
}

export const queueRailTransition = {
  type: 'tween' as const,
  duration: 0.18,
  ease: 'easeInOut' as const,
}

export const operationalFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: rfqPanelTransition,
}

export const operationalSlide = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 4 },
  transition: rfqPanelTransition,
}

export const operationalSlideUp = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: rfqPanelTransition,
}

export const operationalScale = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { ...rfqPanelTransition, duration: 0.12 },
}

export const queueItemMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { ...rfqPanelTransition, duration: 0.12 },
}

export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionSpan = motion.span