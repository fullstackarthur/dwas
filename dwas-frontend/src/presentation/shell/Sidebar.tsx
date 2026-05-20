import { memo } from 'react'
import { useUIStore, useNotificationStore } from '../stores'
import type { NavSection } from '../../core/types'
import {
  FiHome,
  FiInbox,
  FiList,
  FiTruck,
  FiMessageSquare,
  FiCpu,
  FiAlertTriangle,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import clsx from 'clsx'

const navSections: NavSection[] = [
  {
    id: 'main',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', href: '/inbox', badge: 3 },
    ],
  },
  {
    id: 'queues',
    label: 'Queues',
    items: [
      { id: 'all-queues', label: 'All Queues', icon: 'list', href: '/queues' },
      { id: 'dispatch', label: 'Dispatch', icon: 'truck', href: '/queues/dispatch', badge: 3 },
      { id: 'procurement', label: 'Procurement', icon: 'list', href: '/queues/procurement', badge: 2 },
      { id: 'logistics', label: 'Logistics', icon: 'truck', href: '/queues/logistics', badge: 2 },
      { id: 'vendor', label: 'Vendor Comm.', icon: 'message-square', href: '/queues/vendor_communication' },
      { id: 'ai-review', label: 'AI Review', icon: 'cpu', href: '/queues/ai_review', badge: 1 },
      { id: 'escalations', label: 'Escalations', icon: 'alert-triangle', href: '/queues/escalations', badge: 1 },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'dispatch-board', label: 'Dispatch Board', icon: 'truck', href: '/dispatch' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
    ],
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: FiHome,
  inbox: FiInbox,
  list: FiList,
  truck: FiTruck,
  'message-square': FiMessageSquare,
  cpu: FiCpu,
  'alert-triangle': FiAlertTriangle,
  settings: FiSettings,
}

function NavSectionGroup({ section, collapsed }: { section: NavSection; collapsed: boolean }) {
  const { activeNavId, setActiveNav } = useUIStore()
  const { unreadCount } = useNotificationStore()

  return (
    <div className="mb-4">
      {!collapsed && (
        <div className="px-3 mb-1">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
            {section.label}
          </span>
        </div>
      )}
      <div className="space-y-px">
        {section.items.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = activeNavId === item.id

          let badge = item.badge
          if (item.id === 'inbox') badge = unreadCount || badge

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={clsx(
                'w-full flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-md transition-colors duration-120',
                isActive
                  ? 'bg-selected-surface text-text-primary'
                  : 'text-text-secondary hover:bg-hover-surface hover:text-text-primary'
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="ml-auto text-[11px] bg-active-blue/20 text-active-blue px-1.5 py-0.5 rounded-sm font-medium">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const Sidebar = memo(function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={clsx(
        'h-full bg-bg-secondary border-r border-border-panel flex flex-col transition-all duration-180',
        sidebarCollapsed ? 'w-14' : 'w-60'
      )}
    >
      <div className="h-12 flex items-center px-3 border-b border-divider flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-active-blue rounded-sm flex items-center justify-center">
              <span className="text-[11px] font-semibold text-white">D</span>
            </div>
            <span className="text-[14px] font-semibold text-text-primary">DWAS</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'ml-auto p-1 rounded text-text-muted hover:text-text-primary hover:bg-hover-surface transition-colors duration-120',
            sidebarCollapsed ? 'mx-auto' : ''
          )}
        >
          {sidebarCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navSections.map((section) => (
          <NavSectionGroup key={section.id} section={section} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-3 py-2 border-t border-divider">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center">
              <span className="text-[10px] font-medium text-text-secondary">AM</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary truncate">Arjun Mehta</div>
              <div className="text-[11px] text-text-muted">Admin</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
})
