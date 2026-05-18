import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

type NavItem = {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Users',
    to: '/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Access',
    to: '/access',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

function getInitials(name?: string, username?: string) {
  if (name) return name.slice(0, 2).toUpperCase()
  return (username ?? 'U').slice(0, 2).toUpperCase()
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className="flex flex-col h-screen shrink-0"
      style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--color-sidebar-bg)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-sidebar-accent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>IDMIS</span>
        </div>
      </div>

      {/* User profile */}
      <div
        className="mx-3 mb-5 px-3 py-3 rounded-[var(--radius-btn)]"
        style={{ backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-sidebar-accent)' }}
          >
            <span className="text-xs font-bold text-white">
              {getInitials(undefined, user?.username)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {user?.username ?? '—'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
              {user?.role ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Nav — pl-3 only so active items reach the right edge */}
      <nav className="flex-1 flex flex-col gap-0.5 pl-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-item flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? 'nav-active'
                  : 'mr-3 rounded-[var(--radius-btn)] hover:bg-[var(--color-sidebar-hover-bg)]'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-sidebar-text)',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-btn)] text-sm font-medium transition-colors hover:bg-[var(--color-sidebar-hover-bg)]"
          style={{ color: 'var(--color-sidebar-text)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
