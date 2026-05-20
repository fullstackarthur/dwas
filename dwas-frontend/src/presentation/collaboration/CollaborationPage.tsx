import { memo } from 'react'
import { MultiOperatorPresence } from './MultiOperatorPresence'
import { RealtimeActivityFeed } from './RealtimeActivityFeed'
import { OperationalNotificationCenter } from './OperationalNotificationCenter'
import { TeamActivityPanel } from './TeamActivityPanel'
import { AssignmentHistoryPanel } from './AssignmentHistoryPanel'
import { WorkflowActivityPanel } from './WorkflowActivityPanel'
import { TeamSignalPanel } from './TeamSignalPanel'
import { OperationalHeartbeatWidget } from './OperationalHeartbeatWidget'
import { LiveQueueMetrics } from './LiveQueueMetrics'
import { SharedOperationalQueue } from './SharedOperationalQueue'
import { Widget, WidgetSpan, DashboardGrid } from '../dashboard/Widget'

export const CollaborationPage = memo(function CollaborationPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex-shrink-0">
        <h1 className="text-[24px] font-semibold text-text-primary">Collaboration Center</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Real-time operational awareness and team coordination</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DashboardGrid>
          <WidgetSpan span={1}>
            <Widget title="Team Presence" collapsible>
              <MultiOperatorPresence />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Live Metrics" collapsible>
              <LiveQueueMetrics />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="System Heartbeat" collapsible>
              <OperationalHeartbeatWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Team Signals" collapsible>
              <TeamSignalPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={2}>
            <Widget title="Activity Feed" subtitle="Recent operational events" collapsible>
              <RealtimeActivityFeed />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={2}>
            <Widget title="Notifications" subtitle="Operational alerts and updates" collapsible>
              <OperationalNotificationCenter />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Team Activity" collapsible>
              <TeamActivityPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Assignments" collapsible>
              <AssignmentHistoryPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Workflow" collapsible>
              <WorkflowActivityPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Shared Queue" collapsible>
              <SharedOperationalQueue />
            </Widget>
          </WidgetSpan>
        </DashboardGrid>
      </div>
    </div>
  )
})
