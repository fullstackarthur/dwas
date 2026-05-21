import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { AppShell } from '../../presentation/shell'
import { DashboardPage } from '../../presentation/dashboard/DashboardPage'
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
