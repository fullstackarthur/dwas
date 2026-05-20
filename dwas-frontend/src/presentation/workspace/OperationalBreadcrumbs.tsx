import { FiChevronRight, FiHome } from 'react-icons/fi'
import { useLocation, Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

const routeMap: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Dashboard', path: '/' }],
  '/inbox': [{ label: 'Dashboard', path: '/' }, { label: 'Inbox' }],
  '/queues': [{ label: 'Dashboard', path: '/' }, { label: 'Queues' }],
  '/dispatch': [{ label: 'Dashboard', path: '/' }, { label: 'Dispatch' }],
  '/procurement': [{ label: 'Dashboard', path: '/' }, { label: 'Procurement' }],
  '/escalations': [{ label: 'Dashboard', path: '/' }, { label: 'Escalations' }],
  '/collaboration': [{ label: 'Dashboard', path: '/' }, { label: 'Collaboration' }],
  '/notifications': [{ label: 'Dashboard', path: '/' }, { label: 'Notifications' }],
  '/settings': [{ label: 'Dashboard', path: '/' }, { label: 'Settings' }],
}

function OperationalBreadcrumbs() {
  const location = useLocation()
  const breadcrumbs = routeMap[location.pathname] || [{ label: 'Unknown' }]

  return (
    <nav className="flex items-center gap-1 text-xs">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <FiChevronRight className="w-3 h-3 text-[#6B778C]" />}
          {crumb.path ? (
            <Link to={crumb.path} className="text-[#6B778C] hover:text-[#44546F] transition-colors">
              {index === 0 && <FiHome className="w-3.5 h-3.5" />}
              {index > 0 && crumb.label}
            </Link>
          ) : (
            <span className="text-[#172B4D] font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default OperationalBreadcrumbs
