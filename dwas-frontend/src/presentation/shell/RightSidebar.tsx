import { memo } from 'react'
import { useUIStore, useAIStore } from '../stores'
import {
  FiX,
  FiAlertTriangle,
  FiTrendingUp,
  FiCheckCircle,
  FiFileText,
  FiChevronRight,
} from 'react-icons/fi'
import clsx from 'clsx'

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const color =
    confidence >= 0.85
      ? 'text-success-green bg-success-green/10'
      : confidence >= 0.7
        ? 'text-warning-yellow bg-warning-yellow/10'
        : 'text-text-muted bg-text-muted/10'

  return (
    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', color)}>
      {Math.round(confidence * 100)}%
    </span>
  )
}

function TypeIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    risk_alert: FiAlertTriangle,
    routing_suggestion: FiTrendingUp,
    priority_adjustment: FiAlertTriangle,
    summary: FiFileText,
    action_item: FiCheckCircle,
  }

  const Icon = iconMap[type] || FiChevronRight
  const colorMap: Record<string, string> = {
    risk_alert: 'text-error-red',
    routing_suggestion: 'text-info-cyan',
    priority_adjustment: 'text-warning-yellow',
    summary: 'text-text-secondary',
    action_item: 'text-success-green',
  }

  return <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', colorMap[type] || 'text-text-muted')} />
}

function RecommendationCard({ id }: { id: string }) {
  const { recommendations, dismissRecommendation } = useAIStore()
  const rec = recommendations.find((r) => r.id === id)
  if (!rec) return null

  return (
    <div className="p-3 bg-bg-tertiary border border-border-panel rounded-md group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <TypeIcon type={rec.type} />
          <span className="text-[12px] font-medium text-text-primary">{rec.title}</span>
        </div>
        <button
          onClick={() => dismissRecommendation(id)}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text-primary transition-all duration-120"
        >
          <FiX className="w-3 h-3" />
        </button>
      </div>
      <p className="text-[12px] text-text-secondary leading-snug mb-2">{rec.description}</p>
      <div className="flex items-center justify-between">
        <ConfidenceBadge confidence={rec.confidence} />
        {rec.suggestedAction && (
          <button className="text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
            Apply suggestion
          </button>
        )}
      </div>
    </div>
  )
}

function ActivityFeed() {
  const activities = [
    { id: 'a1', user: 'Priya Sharma', action: 'updated dispatch status', target: 'PO#48291', time: '2 min ago' },
    { id: 'a2', user: 'DWAS AI', action: 'completed review', target: 'PO#48287 docs', time: '8 min ago' },
    { id: 'a3', user: 'Ravi Kumar', action: 'added comment to', target: 'SAIL quotation', time: '15 min ago' },
    { id: 'a4', user: 'Sneha Patel', action: 'created logistics item', target: 'Vizag transport', time: '22 min ago' },
    { id: 'a5', user: 'Arjun Mehta', action: 'approved', target: 'gate pass PO#48291', time: '30 min ago' },
    { id: 'a6', user: 'DWAS AI', action: 'flagged risk', target: 'Essar payment', time: '1 hr ago' },
  ]

  return (
    <div className="space-y-0">
      {activities.map((activity) => (
        <div key={activity.id} className="px-3 py-2 border-b border-divider last:border-0">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] font-medium text-text-secondary">
                {activity.user.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[12px] text-text-secondary leading-snug">
                <span className="text-text-primary font-medium">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="text-active-blue">{activity.target}</span>
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">{activity.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MetadataPanel() {
  return (
    <div className="p-3 space-y-3">
      <div>
        <div className="text-[11px] font-medium text-text-muted mb-1.5">Workspace</div>
        <div className="text-[12px] text-text-secondary">Operations Coordination</div>
      </div>
      <div className="border-t border-divider pt-3">
        <div className="text-[11px] font-medium text-text-muted mb-1.5">Active Queues</div>
        <div className="space-y-1">
          {['Dispatch', 'Procurement', 'Logistics', 'Vendor Comm.'].map((q) => (
            <div key={q} className="flex items-center justify-between text-[12px]">
              <span className="text-text-secondary">{q}</span>
              <span className="text-text-muted">{Math.floor(Math.random() * 5) + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-divider pt-3">
        <div className="text-[11px] font-medium text-text-muted mb-1.5">System Status</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-secondary">API</span>
            <span className="text-success-green text-[11px]">Operational</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-secondary">AI Engine</span>
            <span className="text-success-green text-[11px]">Operational</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-secondary">Sync</span>
            <span className="text-success-green text-[11px]">Current</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const RightSidebar = memo(function RightSidebar() {
  const { rightSidebarVisible, rightSidebarTab, setRightSidebarTab, toggleRightSidebar } = useUIStore()
  const { recommendations } = useAIStore()

  if (!rightSidebarVisible) return null

  const tabs = [
    { id: 'ai' as const, label: 'AI', count: recommendations.length },
    { id: 'activity' as const, label: 'Activity' },
    { id: 'metadata' as const, label: 'Info' },
  ]

  return (
    <aside className="w-80 bg-bg-secondary border-l border-border-panel flex flex-col flex-shrink-0">
      <div className="h-10 border-b border-divider flex items-center px-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRightSidebarTab(tab.id)}
              className={clsx(
                'px-2 py-1 text-[12px] rounded transition-colors duration-120',
                rightSidebarTab === tab.id
                  ? 'bg-selected-surface text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-hover-surface'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 text-[10px] text-text-muted">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={toggleRightSidebar}
          className="ml-auto p-1 text-text-muted hover:text-text-primary transition-colors duration-120"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rightSidebarTab === 'ai' && (
          <div className="p-2 space-y-2">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} id={rec.id} />
            ))}
            {recommendations.length === 0 && (
              <div className="p-4 text-center">
                <div className="text-[12px] text-text-muted">No active recommendations</div>
              </div>
            )}
          </div>
        )}
        {rightSidebarTab === 'activity' && <ActivityFeed />}
        {rightSidebarTab === 'metadata' && <MetadataPanel />}
      </div>
    </aside>
  )
})
