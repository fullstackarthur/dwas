import { memo } from 'react'
import { Widget, DashboardGrid, WidgetSpan } from './Widget'
import { OperationalMetricsBar } from './OperationalMetricsBar'
import { QueueOverviewPanel } from './QueueOverviewPanel'
import { PendingApprovalsWidget } from './PendingApprovalsWidget'
import { RFQStatusWidget } from './RFQStatusWidget'
import { DispatchTrackingWidget } from './DispatchTrackingWidget'
import { VendorResponseWidget } from './VendorResponseWidget'
import { AIRecommendationWidget } from './AIRecommendationWidget'
import { TeamActivityWidget } from './TeamActivityWidget'
import { DelayedOperationsWidget } from './DelayedOperationsWidget'
import { DailyOperationalSummary } from './DailyOperationalSummary'
import { TransportMonitoringPanel } from './TransportMonitoringPanel'
import { FinancialSyncStatusWidget } from './FinancialSyncStatusWidget'
import { NotificationSummaryPanel } from './NotificationSummaryPanel'
import { RecentOperationalEventsWidget } from './RecentOperationalEventsWidget'
import { EscalationQueueWidget } from './EscalationQueueWidget'
import { DriverActivityWidget } from './DriverActivityWidget'
import { OperationalHealthWidget } from './OperationalHealthWidget'
import { WorkloadDistributionWidget } from './WorkloadDistributionWidget'

export const DashboardPage = memo(function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex-shrink-0">
        <h1 className="text-[24px] font-semibold text-text-primary">Operations Dashboard</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Real-time operational control center</p>
      </div>

      <OperationalMetricsBar />

      <div className="flex-1 overflow-y-auto">
        <DashboardGrid>
          <WidgetSpan span={1}>
            <Widget title="Queue Overview" collapsible defaultCollapsed={false}>
              <QueueOverviewPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={2}>
            <Widget title="Daily Summary" collapsible>
              <DailyOperationalSummary />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Operational Health" collapsible>
              <OperationalHealthWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={2}>
            <Widget title="Pending Approvals" subtitle="Requires your attention" headerAction={
              <button className="text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">View all</button>
            }>
              <PendingApprovalsWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Delayed Operations" collapsible>
              <DelayedOperationsWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={2}>
            <Widget title="Dispatch Tracking" subtitle="Active shipments" headerAction={
              <button className="text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">Board view</button>
            }>
              <DispatchTrackingWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Transport Fleet" collapsible>
              <TransportMonitoringPanel />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="RFQ Status" collapsible>
              <RFQStatusWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Vendor Responses" collapsible>
              <VendorResponseWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Escalations" collapsible>
              <EscalationQueueWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="AI Recommendations" collapsible>
              <AIRecommendationWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Financial Status" collapsible>
              <FinancialSyncStatusWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Team Workload" collapsible>
              <WorkloadDistributionWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Driver Activity" collapsible>
              <DriverActivityWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Recent Events" collapsible>
              <RecentOperationalEventsWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Team Activity" collapsible>
              <TeamActivityWidget />
            </Widget>
          </WidgetSpan>

          <WidgetSpan span={1}>
            <Widget title="Notifications" collapsible>
              <NotificationSummaryPanel />
            </Widget>
          </WidgetSpan>
        </DashboardGrid>
      </div>
    </div>
  )
})
