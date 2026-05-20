import { useLocation, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiHome, FiInbox, FiTruck, FiPackage, FiAlertTriangle, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useUIStore } from '../stores'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: number
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { id: 'inbox', label: 'Inbox', icon: FiInbox, path: '/inbox', badge: 12 },
  { id: 'queues', label: 'Queues', icon: FiBarChart2, path: '/queues' },
  { id: 'dispatch', label: 'Dispatch', icon: FiTruck, path: '/dispatch' },
  { id: 'procurement', label: 'Procurement', icon: FiPackage, path: '/procurement' },
  { id: 'escalations', label: 'Escalations', icon: FiAlertTriangle, path: '/escalations', badge: 3 },
  { id: 'collaboration', label: 'Collaboration', icon: FiUsers, path: '/collaboration' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: '/settings' },
]

function CollapsibleOperationalSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? 56 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-full bg-[#FFFFFF] border-r border-[#DFE1E6] flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#DFE1E6]">
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold text-[#172B4D] tracking-tight">DWAS</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-[#EBECF0] text-[#6B778C] hover:text-[#44546F] transition-colors"
        >
          {sidebarCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors relative ${
                isActive
                  ? 'bg-[#DEEBFF] text-[#172B4D]'
                  : 'text-[#44546F] hover:bg-[#EBECF0] hover:text-[#172B4D]'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0052CC]" />}
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-medium bg-[#0052CC]/20 text-[#0052CC] rounded">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-3 py-2 border-t border-[#DFE1E6]">
          <div className="text-[10px] text-[#6B778C]">DWAS v1.0.0</div>
        </div>
      )}
    </motion.div>
  )
}

export default CollapsibleOperationalSidebar
