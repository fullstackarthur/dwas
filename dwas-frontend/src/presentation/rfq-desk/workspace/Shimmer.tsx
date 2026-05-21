import { memo } from 'react'
import { motion } from 'framer-motion'

export const Shimmer = memo(function Shimmer({
  className = '',
  width = '100%',
  height = '16px',
  borderRadius = '4px',
}: {
  className?: string
  width?: string
  height?: string
  borderRadius?: string
}) {
  return (
    <div
      className={`relative overflow-hidden bg-bg-tertiary ${className}`}
      style={{ width, height, borderRadius }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        }}
        animate={{ x: ['0%', '200%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
})

export const ShimmerLine = memo(function ShimmerLine({
  count = 1,
}: {
  count?: number
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} height="12px" />
      ))}
    </div>
  )
})

export const ShimmerCard = memo(function ShimmerCard() {
  return (
    <div className="p-3 rounded border border-border-panel bg-bg-secondary space-y-2">
      <Shimmer width="60%" height="14px" />
      <Shimmer width="100%" height="10px" />
      <Shimmer width="80%" height="10px" />
      <div className="flex gap-2 pt-1">
        <Shimmer width="40px" height="20px" borderRadius="10px" />
        <Shimmer width="40px" height="20px" borderRadius="10px" />
      </div>
    </div>
  )
})

export const ShimmerTable = memo(function ShimmerTable({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <Shimmer width="40%" height="10px" />
        <Shimmer width="20%" height="10px" />
        <Shimmer width="30%" height="10px" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Shimmer width="40%" height="12px" />
          <Shimmer width="20%" height="12px" />
          <Shimmer width="30%" height="12px" />
        </div>
      ))}
    </div>
  )
})

export const ShimmerTimeline = memo(function ShimmerTimeline() {
  return (
    <div className="flex items-center gap-6 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Shimmer width="32px" height="32px" borderRadius="50%" />
          <Shimmer width="60px" height="10px" />
          <Shimmer width="40px" height="8px" />
        </div>
      ))}
    </div>
  )
})

export const ShimmerDocument = memo(function ShimmerDocument() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Shimmer width="32px" height="32px" borderRadius="6px" />
      <div className="flex-1 space-y-1">
        <Shimmer width="70%" height="12px" />
        <Shimmer width="40%" height="8px" />
      </div>
    </div>
  )
})
