import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { AppShell } from '../../presentation/shell'
import { DashboardPage } from '../../presentation/dashboard/DashboardPage'
import { OperationalInbox } from '../../presentation/inbox/OperationalInbox'
import { QueuesPage } from '../../presentation/queues/QueuePage'
import { ThreadWorkspaceLayout } from '../../presentation/threads/ThreadWorkspaceLayout'
import { DispatchPage } from '../../presentation/dispatch/DispatchPage'
import { AIAssistantPage } from '../../presentation/ai/AIAssistantPage'
import { AwaitingVendorQueue } from '../../presentation/queues/AwaitingVendorQueue'
import { AwaitingApprovalQueue } from '../../presentation/queues/AwaitingApprovalQueue'
import { DelayedDispatchQueue } from '../../presentation/queues/DelayedDispatchQueue'
import { PendingPOQueue } from '../../presentation/queues/PendingPOQueue'
import { TallySyncQueue } from '../../presentation/queues/TallySyncQueue'
import { EscalationQueue } from '../../presentation/queues/EscalationQueue'
import { DriverUpdateQueue } from '../../presentation/queues/DriverUpdateQueue'
import { AIReviewQueue } from '../../presentation/queues/AIReviewQueue'
import { NotificationPage } from '../../presentation/notifications/NotificationPage'
import { CollaborationPage } from '../../presentation/collaboration/CollaborationPage'
import {
  RFQDeskPage,
  VendorCoordinationPage,
  ClientQuotationsPage,
  PurchaseOrdersPage,
  LogisticsPage,
  DispatchTrackingPage,
  DeliveriesPage,
  PaymentsTallyPage,
} from '../../presentation/operations'
import { ROUTES } from '../../core/constants'

const ShellLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
)

export const router = createBrowserRouter([
  {
    element: <ShellLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.INBOX,
        element: <OperationalInbox />,
      },
      {
        path: ROUTES.QUEUES,
        element: <QueuesPage />,
      },
      {
        path: ROUTES.QUEUES_DETAIL,
        element: <QueuesPage />,
      },
      {
        path: ROUTES.THREADS,
        element: <ThreadWorkspaceLayout />,
      },
      {
        path: ROUTES.THREAD_DETAIL,
        element: <ThreadWorkspaceLayout />,
      },
      {
        path: ROUTES.DISPATCH,
        element: <DispatchPage />,
      },
      {
        path: ROUTES.AI_ASSISTANT,
        element: <AIAssistantPage />,
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationPage />,
      },
      {
        path: '/queues/vendor_awaiting',
        element: <AwaitingVendorQueue />,
      },
      {
        path: '/queues/approvals',
        element: <AwaitingApprovalQueue />,
      },
      {
        path: '/queues/delayed',
        element: <DelayedDispatchQueue />,
      },
      {
        path: '/queues/pending-po',
        element: <PendingPOQueue />,
      },
      {
        path: '/queues/tally',
        element: <TallySyncQueue />,
      },
      {
        path: '/queues/escalations',
        element: <EscalationQueue />,
      },
      {
        path: '/queues/driver-updates',
        element: <DriverUpdateQueue />,
      },
      {
        path: '/queues/ai-review',
        element: <AIReviewQueue />,
      },
      {
        path: '/collaboration',
        element: <CollaborationPage />,
      },
      {
        path: ROUTES.OPERATIONS.RFQ_DESK,
        element: <RFQDeskPage />,
      },
      {
        path: ROUTES.OPERATIONS.VENDOR_COORDINATION,
        element: <VendorCoordinationPage />,
      },
      {
        path: ROUTES.OPERATIONS.CLIENT_QUOTATIONS,
        element: <ClientQuotationsPage />,
      },
      {
        path: ROUTES.OPERATIONS.PURCHASE_ORDERS,
        element: <PurchaseOrdersPage />,
      },
      {
        path: ROUTES.OPERATIONS.LOGISTICS,
        element: <LogisticsPage />,
      },
      {
        path: ROUTES.OPERATIONS.DISPATCH_TRACKING,
        element: <DispatchTrackingPage />,
      },
      {
        path: ROUTES.OPERATIONS.DELIVERIES,
        element: <DeliveriesPage />,
      },
      {
        path: ROUTES.OPERATIONS.PAYMENTS_TALLY,
        element: <PaymentsTallyPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <DashboardPage />,
      },
      {
        path: '*',
        element: <DashboardPage />,
      },
    ],
  },
])
