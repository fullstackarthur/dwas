import { memo } from 'react'
import { mockDispatchRecords } from '../../data/mock/operational'
import { FiAlertTriangle, FiClock } from 'react-icons/fi'

export const DelayedOperationsWidget = memo(function DelayedOperationsWidget() {
  const delayed = mockDispatchRecords.filter((d) => d.status === 'delayed')
  const overdueApprovals = [
    { id: 'oa-1', title: 'Essar payment release', days: 12, type: 'payment' },
    { id: 'oa-2', title: 'PO#48291 dispatch approval', hours: 1, type: 'dispatch' },
  ]

  return (
    <div className="divide-y divide-divider">
      {delayed.map((record) => (
        <div key={record.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-3.5 h-3.5 text-error-red flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary">{record.poNumber} - {record.destination}</div>
              <div className="text-[11px] text-error-red mt-0.5">{record.delayReason}</div>
            </div>
          </div>
        </div>
      ))}
      {overdueApprovals.map((oa) => (
        <div key={oa.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <FiClock className="w-3.5 h-3.5 text-warning-yellow flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary">{oa.title}</div>
              <div className="text-[11px] text-warning-yellow mt-0.5">
                {oa.days ? `${oa.days} days overdue` : `Due in ${oa.hours}h`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
