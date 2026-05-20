import { memo } from 'react'
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export const Skeleton = memo(function Skeleton({
  className,
  width,
  height,
  variant = 'rectangular',
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-bg-tertiary',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-sm',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      style={{ width, height }}
    />
  )
})

interface SkeletonLineProps {
  lines?: number
  width?: string
  lastLineWidth?: string
  height?: string
}

export const SkeletonLine = memo(function SkeletonLine({
  lines = 1,
  width = '100%',
  lastLineWidth = '60%',
  height = '12px',
}: SkeletonLineProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={height}
          width={i === lines - 1 ? lastLineWidth : width}
        />
      ))}
    </div>
  )
})

export const SkeletonPanel = memo(function SkeletonPanel() {
  return (
    <div className="p-4 bg-bg-secondary border border-border-panel rounded-md">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton variant="text" width="120px" height="14px" />
      </div>
      <SkeletonLine lines={3} />
    </div>
  )
})

export const SkeletonQueueRow = memo(function SkeletonQueueRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-divider">
      <Skeleton variant="rectangular" width="48px" height="16px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="80%" height="13px" />
        <Skeleton variant="text" width="50%" height="11px" />
      </div>
      <Skeleton variant="rectangular" width="64px" height="16px" />
    </div>
  )
})

export const SkeletonQueueList = memo(function SkeletonQueueList({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonQueueRow key={i} />
      ))}
    </div>
  )
})

export const SkeletonMetricCard = memo(function SkeletonMetricCard() {
  return (
    <div className="p-4 bg-bg-secondary border border-border-panel rounded-md">
      <Skeleton variant="text" width="80px" height="12px" className="mb-2" />
      <Skeleton variant="text" width="48px" height="24px" />
    </div>
  )
})

export const SkeletonThreadMessage = memo(function SkeletonThreadMessage() {
  return (
    <div className="flex gap-2 px-4 py-3">
      <Skeleton variant="circular" width="28px" height="28px" className="flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="100px" height="12px" />
        <SkeletonLine lines={2} />
      </div>
    </div>
  )
})
