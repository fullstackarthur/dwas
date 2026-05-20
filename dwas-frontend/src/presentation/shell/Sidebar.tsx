import { memo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUIStore, useNotificationStore } from '../stores'
import {
  FiLayout,
  FiBarChart2,
  FiStar,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiMessageSquare,
  FiCpu,
  FiAlertTriangle,
  FiInbox,
  FiUsers,
  FiSettings,
  FiMoreHorizontal,
  FiPlus,
  FiChevronDown,
  FiChevronRight,
  FiMoreVertical,
} from 'react-icons/fi'
import clsx from 'clsx'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  color?: string
}

const navItems: NavItem[] = [
  { id: 'for-you', label: 'For you', icon: FiLayout, href: '/dashboard' },
  { id: 'recent', label: 'Recent', icon: FiBarChart2, href: '/queues' },
  { id: 'starred', label: 'Starred', icon: FiStar, href: '/queues/escalations' },
]

const projectItems: NavItem[] = [
  { id: 'procurement', label: 'Procurement', icon: FiPackage, href: '/queues/procurement', color: '#36B37E' },
  { id: 'dispatch', label: 'Dispatch', icon: FiTruck, href: '/dispatch', color: '#0052CC', badge: 3 },
  { id: 'logistics', label: 'Logistics', icon: FiMapPin, href: '/queues/logistics', color: '#FFAB00' },
  { id: 'vendor', label: 'Vendor Communication', icon: FiMessageSquare, href: '/queues/vendor_communication', color: '#DE350B' },
  { id: 'ai-review', label: 'AI Review', icon: FiCpu, href: '/queues/ai_review', color: '#6B778C', badge: 1 },
  { id: 'escalations', label: 'Escalations', icon: FiAlertTriangle, href: '/queues/escalations', color: '#DE350B', badge: 1 },
]

const systemItems: NavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: FiInbox, href: '/inbox', badge: 3 },
  { id: 'collaboration', label: 'Collaboration', icon: FiUsers, href: '/collaboration' },
  { id: 'settings', label: 'Settings', icon: FiSettings, href: '/settings' },
]

function NavItemRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setActiveNav } = useUIStore()
  const { unreadCount } = useNotificationStore()

  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  const badge = item.id === 'inbox' ? unreadCount || item.badge : item.badge

  return (
    <button
      onClick={() => {
        setActiveNav(item.id)
        navigate(item.href)
      }}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-hover-surface rounded transition-colors duration-120 relative group',
        isActive && 'bg-selected-surface text-active-blue font-medium'
      )}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-active-blue rounded-r" />
      )}

      <span
        className={clsx(
          'w-4 h-4 flex-shrink-0 flex items-center justify-center',
          isActive && 'text-active-blue',
          !isActive && !item.color && 'text-text-muted'
        )}
        style={item.color && !isActive ? { color: item.color } : undefined}
      >
        <item.icon className="w-4 h-4" />
      </span>

      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ml-auto text-[10px] font-medium text-text-muted bg-hover-surface px-1.5 py-0.5 rounded-sm">
              {badge}
            </span>
          )}
          {item.id === 'dispatch' && (
            <button className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded transition-all">
              <FiMoreVertical className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}
    </button>
  )
}

export const Sidebar = memo(function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const [projectsExpanded, setProjectsExpanded] = useState(true)

  return (
    <aside
      className={clsx(
        'h-full bg-white border-r border-[#DFE1E6] flex flex-col transition-all duration-200',
        sidebarCollapsed ? 'w-[48px]' : 'w-[240px]'
      )}
    >
      <div className="h-12 flex items-center px-2 border-b border-[#DFE1E6] flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-hover-surface transition-colors duration-120"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 5.5V10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M7 6L9 8L7 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10.5 5.5V10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 6L7 8L9 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {!sidebarCollapsed && (
          <div className="flex items-center gap-1 ml-1">
            <div className="w-5 h-5 flex-shrink-0">
              <svg viewBox="55 50 105 110" className="w-full h-full">
                <defs>
                  <linearGradient id="brandGradient" x1="40" y1="170" x2="160" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0052CC" />
                    <stop offset="45%" stopColor="#0052CC" />
                    <stop offset="100%" stopColor="#0052CC" />
                  </linearGradient>
                  <filter id="overlapShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-1" dy="2" stdDeviation="1.5" floodColor="#0052CC" floodOpacity="0.3" />
                  </filter>
                </defs>
                <path d="M 90 80 C 145 75, 155 130, 80 125" fill="none" stroke="url(#brandGradient)" strokeWidth="24" strokeLinecap="round" />
                <path d="M 110 55 L 70 105 L 100 105 L 60 155" fill="none" stroke="url(#brandGradient)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" filter="url(#overlapShadow)" />
              </svg>
            </div>
            <span className="text-[14px] font-bold text-text-primary" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
              dwas
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navItems.map((item) => (
          <NavItemRow key={item.id} item={item} collapsed={sidebarCollapsed} />
        ))}

        <div className="mt-3 mb-1">
          {!sidebarCollapsed && (
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="w-full flex items-center justify-between px-3 py-1 text-[12px] font-semibold text-text-primary hover:bg-hover-surface rounded transition-colors duration-120"
            >
              <span>Operations</span>
              <div className="flex items-center gap-1">
                <button className="p-0.5 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded transition-colors">
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
                <button className="p-0.5 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded transition-colors">
                  <FiMoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {projectsExpanded ? (
                  <FiChevronDown className="w-3.5 h-3.5 text-text-muted" />
                ) : (
                  <FiChevronRight className="w-3.5 h-3.5 text-text-muted" />
                )}
              </div>
            </button>
          )}
        </div>

        {(projectsExpanded || sidebarCollapsed) && (
          <div className="space-y-px">
            {projectItems.map((item) => (
              <NavItemRow key={item.id} item={item} collapsed={sidebarCollapsed} />
            ))}
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="mt-3 pt-3 border-t border-[#DFE1E6]">
            {systemItems.map((item) => (
              <NavItemRow key={item.id} item={item} collapsed={sidebarCollapsed} />
            ))}
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="mt-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-hover-surface rounded transition-colors duration-120">
              <FiMoreHorizontal className="w-4 h-4 text-text-muted" />
              <span>More</span>
            </button>
          </div>
        )}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-3 py-2 border-t border-[#DFE1E6]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-active-blue/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-active-blue">
                AM
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary font-medium truncate">
                Arjun Mehta
              </div>
              <div className="text-[11px] text-text-muted">Admin</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
})
