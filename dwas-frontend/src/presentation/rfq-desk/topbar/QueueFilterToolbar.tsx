import { memo } from 'react'
import clsx from 'clsx'
import { FiFilter } from 'react-icons/fi'
import { RFQGlobalSearch } from './RFQGlobalSearch'
import { RFQQuickActions } from './RFQQuickActions'
import { LiveQueueUpdateIndicator } from '../realtime/LiveQueueUpdateIndicator'
import { QueueSyncStatus } from '../realtime/QueueSyncStatus'

interface QueueFilterToolbarProps {
  className?: string
}

export const QueueFilterToolbar = memo(function QueueFilterToolbar({
  className,
}: QueueFilterToolbarProps) {
  return (
    <div
      className={clsx(
        'h-12 flex items-center gap-3 px-4 bg-bg-secondary border-b border-border-panel flex-shrink-0',
        className
      )}
    >
      <RFQGlobalSearch />

      <div className="h-5 w-px bg-border-panel" />

      <OperationalFilterDropdown />
      <PriorityFilterControl />
      <SLAFilterControl />
      <AssignedOperatorFilter />

      <div className="flex-1" />

      <QueueSyncStatus />
      <LiveQueueUpdateIndicator />
      <RFQQuickActions />
    </div>
  )
})

import { memo as memo2, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { useRFQDeskStore } from '../../stores'

const RFQStages = [
  { id: 'new', label: 'New', color: '#6B778C' },
  { id: 'requirements_extraction', label: 'Requirements Extraction', color: '#8B5CF6' },
  { id: 'vendor_sourcing', label: 'Vendor Sourcing', color: '#3B82F6' },
  { id: 'vendor_coordination', label: 'Vendor Coordination', color: '#F59E0B' },
  { id: 'quotation_received', label: 'Quotation Received', color: '#EF4444' },
  { id: 'quotation_review', label: 'Quotation Review', color: '#10B981' },
  { id: 'client_presentation', label: 'Client Presentation', color: '#6366F1' },
  { id: 'negotiation', label: 'Negotiation', color: '#EC4899' },
  { id: 'order_confirmation', label: 'Order Confirmation', color: '#14B8A6' },
  { id: 'po_generated', label: 'PO Generated', color: '#8B5CF6' },
  { id: 'closed', label: 'Closed', color: '#94A3B8' },
  { id: 'cancelled', label: 'Cancelled', color: '#6B7280' },
] as const

const RFQPriorities = [
  { id: 'critical', label: 'Critical', color: '#EF4444' },
  { id: 'high', label: 'High', color: '#F59E0B' },
  { id: 'medium', label: 'Medium', color: '#3B82F6' },
  { id: 'low', label: 'Low', color: '#94A3B8' },
] as const

const SLABreached = [
  { id: 'on_track', label: 'On Track', color: '#22C55E' },
  { id: 'at_risk', label: 'At Risk', color: '#F59E0B' },
  { id: 'breached', label: 'Breached', color: '#EF4444' },
  { id: 'no_sla', label: 'No SLA', color: '#94A3B8' },
] as const

const OperationalFilterDropdown = memo2(function OperationalFilterDropdown() {
  const [open, setOpen] = useState(false)
  const filters = useRFQDeskStore((s) => s.filters)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'inline-flex items-center gap-1.5 px-2 py-1 text-[12px] rounded border transition-colors duration-120',
          filters.stage?.length
            ? 'bg-active-blue/10 border-active-blue/30 text-active-blue'
            : 'border-border-panel text-text-secondary hover:bg-hover-surface hover:text-text-primary'
        )}
      >
        <FiFilter className="w-3.5 h-3.5" />
        <span>Stage</span>
        {filters.stage?.length && <span className="ml-0.5">({filters.stage.length})</span>}
        <FiChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 w-56 bg-bg-secondary border border-border-panel rounded-md shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-[11px] font-semibold text-text-muted px-2 py-1">STAGE</div>
                {RFQStages.map((stage) => (
                  <FilterCheckbox
                    key={stage.id}
                    label={stage.label}
                    color={stage.color}
                    checked={filters.stage?.includes(stage.id as any) || false}
                    onChange={(checked) => {
                      const current = filters.stage || []
                      useRFQDeskStore.getState().setFilters({
                        stage: checked
                          ? [...current, stage.id as any]
                          : current.filter((s) => s !== stage.id),
                      })
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

const PriorityFilterControl = memo2(function PriorityFilterControl() {
  const [open, setOpen] = useState(false)
  const filters = useRFQDeskStore((s) => s.filters)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'inline-flex items-center gap-1.5 px-2 py-1 text-[12px] rounded border transition-colors duration-120',
          filters.priority?.length
            ? 'bg-active-blue/10 border-active-blue/30 text-active-blue'
            : 'border-border-panel text-text-secondary hover:bg-hover-surface hover:text-text-primary'
        )}
      >
        <span>Priority</span>
        {filters.priority?.length && <span className="ml-0.5">({filters.priority.length})</span>}
        <FiChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 w-48 bg-bg-secondary border border-border-panel rounded-md shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-[11px] font-semibold text-text-muted px-2 py-1">PRIORITY</div>
                {RFQPriorities.map((p) => (
                  <FilterCheckbox
                    key={p.id}
                    label={p.label}
                    color={p.color}
                    checked={filters.priority?.includes(p.id as any) || false}
                    onChange={(checked) => {
                      const current = filters.priority || []
                      useRFQDeskStore.getState().setFilters({
                        priority: checked
                          ? [...current, p.id as any]
                          : current.filter((s) => s !== p.id),
                      })
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

const SLAFilterControl = memo2(function SLAFilterControl() {
  const [open, setOpen] = useState(false)
  const filters = useRFQDeskStore((s) => s.filters)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'inline-flex items-center gap-1.5 px-2 py-1 text-[12px] rounded border transition-colors duration-120',
          filters.slaStatus?.length
            ? 'bg-active-blue/10 border-active-blue/30 text-active-blue'
            : 'border-border-panel text-text-secondary hover:bg-hover-surface hover:text-text-primary'
        )}
      >
        <span>SLA</span>
        {filters.slaStatus?.length && <span className="ml-0.5">({filters.slaStatus.length})</span>}
        <FiChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 w-44 bg-bg-secondary border border-border-panel rounded-md shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-[11px] font-semibold text-text-muted px-2 py-1">SLA STATUS</div>
                {SLABreached.map((s) => (
                  <FilterCheckbox
                    key={s.id}
                    label={s.label}
                    color={s.color}
                    checked={filters.slaStatus?.includes(s.id as any) || false}
                    onChange={(checked) => {
                      const current = filters.slaStatus || []
                      useRFQDeskStore.getState().setFilters({
                        slaStatus: checked
                          ? [...current, s.id as any]
                          : current.filter((st) => st !== s.id),
                      })
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

const AssignedOperatorFilter = memo2(function AssignedOperatorFilter() {
  const [open, setOpen] = useState(false)
  const filters = useRFQDeskStore((s) => s.filters)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'inline-flex items-center gap-1.5 px-2 py-1 text-[12px] rounded border transition-colors duration-120',
          filters.assigneeId
            ? 'bg-active-blue/10 border-active-blue/30 text-active-blue'
            : 'border-border-panel text-text-secondary hover:bg-hover-surface hover:text-text-primary'
        )}
      >
        <span>Assignee</span>
        <FiChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 w-48 bg-bg-secondary border border-border-panel rounded-md shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-[11px] font-semibold text-text-muted px-2 py-1">ASSIGNED TO</div>
                <FilterCheckbox
                  label="Unassigned"
                  checked={filters.assigneeId === 'unassigned'}
                  onChange={(checked) =>
                    useRFQDeskStore.getState().setFilters({
                      assigneeId: checked ? 'unassigned' : undefined,
                    })
                  }
                />
                {[
                  { id: 'u1', name: 'Arjun Mehta' },
                  { id: 'u2', name: 'Priya Sharma' },
                  { id: 'u3', name: 'Ravi Kumar' },
                ].map((user) => (
                  <FilterCheckbox
                    key={user.id}
                    label={user.name}
                    checked={filters.assigneeId === user.id}
                    onChange={(checked) =>
                      useRFQDeskStore.getState().setFilters({
                        assigneeId: checked ? user.id : undefined,
                      })
                    }
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

interface FilterCheckboxProps {
  label: string
  color?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const FilterCheckbox = memo2(function FilterCheckbox({
  label,
  color,
  checked,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-hover-surface cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-border-panel text-active-blue focus:ring-active-blue/30"
      />
      {color && (
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      )}
      <span className="text-[12px] text-text-secondary">{label}</span>
    </label>
  )
})