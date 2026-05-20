import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiTruck, FiMapPin, FiClock, FiPhone, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

export const DriverCoordinationPanel = memo(function DriverCoordinationPanel() {
  const { dispatchInfo } = useThreadDataStore()
  const dispatch = dispatchInfo[0]

  if (!dispatch?.driverName) return null

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Driver Coordination</h2>
      <div className="border border-border-panel rounded-md">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-selected-surface flex items-center justify-center">
              <span className="text-[11px] font-medium text-text-secondary">
                {dispatch.driverName.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="text-[13px] font-medium text-text-primary">{dispatch.driverName}</div>
              <div className="text-[11px] text-text-muted font-mono">{dispatch.vehicleNumber}</div>
            </div>
            <button className="ml-auto p-2 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded transition-colors duration-120">
              <FiPhone className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px]">
              <FiMapPin className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted">Destination:</span>
              <span className="text-text-primary">{dispatch.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <FiTruck className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted">Status:</span>
              <span className={clsx('text-text-primary capitalize')}>{dispatch.status.replace('_', ' ')}</span>
            </div>
            {dispatch.eta && (
              <div className="flex items-center gap-2 text-[12px]">
                <FiClock className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-muted">ETA:</span>
                <span className="text-text-primary">
                  {new Date(dispatch.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            {dispatch.status === 'delayed' && (
              <div className="flex items-start gap-2 text-[12px] mt-2 p-2 bg-error-red/5 rounded">
                <FiAlertTriangle className="w-3.5 h-3.5 text-error-red mt-0.5 flex-shrink-0" />
                <span className="text-error-red">Dispatch delayed. Contact driver for status update.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
