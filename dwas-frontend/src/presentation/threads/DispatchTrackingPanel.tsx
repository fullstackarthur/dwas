import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiTruck, FiMapPin, FiClock, FiPackage, FiHash } from 'react-icons/fi'
import clsx from 'clsx'

export const DispatchTrackingPanel = memo(function DispatchTrackingPanel() {
  const { dispatchInfo } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
    pending: { color: 'text-warning-yellow', label: 'Pending', bg: 'bg-warning-yellow/10' },
    loading: { color: 'text-active-blue', label: 'Loading', bg: 'bg-active-blue/10' },
    in_transit: { color: 'text-info-cyan', label: 'In Transit', bg: 'bg-info-cyan/10' },
    delivered: { color: 'text-success-green', label: 'Delivered', bg: 'bg-success-green/10' },
    delayed: { color: 'text-error-red', label: 'Delayed', bg: 'bg-error-red/10' },
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Dispatch Tracking</h2>
      <div className="space-y-3">
        {dispatchInfo.map((dispatch) => {
          const conf = statusConfig[dispatch.status] || statusConfig.pending

          return (
            <div key={dispatch.id} className="border border-border-panel rounded-md">
              <div className="px-3 py-2 border-b border-divider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTruck className="w-4 h-4 text-text-muted" />
                  <span className="text-[13px] font-medium text-text-primary">{dispatch.poNumber}</span>
                </div>
                <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', conf.bg, conf.color)}>
                  {conf.label}
                </span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <FiPackage className="w-3.5 h-3.5 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Material</div>
                    <div className="text-[12px] text-text-primary">{dispatch.material}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiHash className="w-3.5 h-3.5 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Weight</div>
                    <div className="text-[12px] text-text-primary">{dispatch.weight}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-3.5 h-3.5 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Destination</div>
                    <div className="text-[12px] text-text-primary">{dispatch.destination}</div>
                  </div>
                </div>
                {dispatch.vehicleNumber && (
                  <div className="flex items-center gap-2">
                    <FiTruck className="w-3.5 h-3.5 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted">Vehicle</div>
                      <div className="text-[12px] text-text-primary font-mono">{dispatch.vehicleNumber}</div>
                    </div>
                  </div>
                )}
                {dispatch.driverName && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-3.5 h-3.5 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted">Driver</div>
                      <div className="text-[12px] text-text-primary">{dispatch.driverName}</div>
                    </div>
                  </div>
                )}
                {dispatch.eta && (
                  <div className="flex items-center gap-2">
                    <FiClock className="w-3.5 h-3.5 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted">ETA</div>
                      <div className="text-[12px] text-text-primary">
                        {new Date(dispatch.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
                {dispatch.gatePassNumber && (
                  <div className="flex items-center gap-2">
                    <FiHash className="w-3.5 h-3.5 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted">Gate Pass</div>
                      <div className="text-[12px] text-text-primary font-mono">{dispatch.gatePassNumber}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
