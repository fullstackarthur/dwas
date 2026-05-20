import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '../../presentation/dashboard/DashboardPage'
import { OperationalInbox } from '../../presentation/inbox/OperationalInbox'
import { QueuesPage } from '../../presentation/queues/QueuePage'
import { ThreadDetailPage } from '../../presentation/threads/ThreadDetailPage'
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
import { ROUTES } from '../../core/constants'

export const router = createBrowserRouter([
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
    element: <ThreadDetailPage />,
  },
  {
    path: ROUTES.THREAD_DETAIL,
    element: <ThreadDetailPage />,
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
    element: <OperationalInbox />,
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
    path: ROUTES.SETTINGS,
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <DashboardPage />,
  },
])
