import { motion } from 'framer-motion'

export const panelTransition = {
  type: 'tween' as const,
  duration: 0.15,
  ease: 'easeOut' as const,
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: panelTransition,
}

export const slideIn = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
  transition: panelTransition,
}

export const slideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: panelTransition,
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { ...panelTransition, duration: 0.12 },
}

export const queueItemInsert = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { ...panelTransition, duration: 0.12 },
}

export const MotionDiv = motion.div
export const MotionButton = motion.button
