import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsersQuery } from '../hooks/useUsersQuery'
import { UsersListSkeleton } from './UsersListSkeleton'
import type { UserRecord } from '../types/users.types'

function getInitials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

const roleStyle: Record<string, { bg: string; text: string }> = {
  'Super Administrator': { bg: 'var(--color-badge-inventory-bg)', text: 'var(--color-badge-inventory-text)' },
  Student:              { bg: 'var(--color-badge-order-bg)',      text: 'var(--color-badge-order-text)' },
  Teacher:              { bg: 'var(--color-card-amber)',           text: '#7A5200' },
  Staff:                { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)' },
}

function getRoleStyle(role: string) {
  return roleStyle[role] ?? { bg: 'var(--color-bg-input)', text: 'var(--color-text-secondary)' }
}

const avatarPalette = [
  'var(--color-card-periwinkle)',
  'var(--color-card-mauve)',
  'var(--color-card-amber)',
  'var(--color-card-peach)',
  'var(--color-card-rose)',
]

function UserRow({ user, index }: { user: UserRecord; index: number }) {
  const badge = getRoleStyle(user.role)
  const avatarBg = avatarPalette[index % avatarPalette.length]
  const navigate = useNavigate()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/users/${user.username}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/users/${user.username}`) }}
      className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-input)] transition-colors cursor-pointer"
      aria-label={`View profile for ${user.first_name} ${user.last_name}`}
    >
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.username}
          className="w-10 h-10 rounded-[var(--radius-avatar)] object-cover shrink-0 shadow-[var(--shadow-card)]"
        />
      ) : (
        <div
          className="w-10 h-10 rounded-[var(--radius-avatar)] flex items-center justify-center shrink-0 shadow-[var(--shadow-card)]"
          style={{ backgroundColor: avatarBg }}
        >
          <span className="text-xs font-bold text-[var(--color-text-primary)]">
            {getInitials(user.first_name, user.last_name)}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">@{user.username}</p>
      </div>

      <span
        className="shrink-0 px-3 py-1 rounded-[var(--radius-badge)] text-xs font-medium"
        style={{ backgroundColor: badge.bg, color: badge.text }}
      >
        {user.role}
      </span>
    </div>
  )
}

export function UsersList() {
  const { data, isLoading, isError } = useUsersQuery()
  const [activeRole, setActiveRole] = useState<string>('All')

  const roles = useMemo(() => {
    if (!data) return []
    return ['All', ...Array.from(new Set(data.map((u) => u.role)))]
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return activeRole === 'All' ? data : data.filter((u) => u.role === activeRole)
  }, [data, activeRole])

  if (isLoading) return <UsersListSkeleton />

  if (isError) {
    return (
      <div
        className="flex items-center justify-center gap-2 h-40 rounded-[var(--radius-card)] text-sm"
        style={{ backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-panel)', color: 'var(--color-accent-red)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Failed to load users. Check your connection.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {roles.map((role) => {
          const count = role === 'All'
            ? (data?.length ?? 0)
            : (data?.filter((u) => u.role === role).length ?? 0)
          const isActive = activeRole === role
          return (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-badge)] text-sm font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: 'var(--color-text-primary)', color: '#fff' }
                  : { backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', boxShadow: 'var(--shadow-card)' }
              }
            >
              {role}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={
                  isActive
                    ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }
                    : { backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-muted)' }
                }
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table card */}
      <div
        className="rounded-[var(--radius-card)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-panel)' }}
      >
        <div
          className="flex items-center gap-4 px-5 py-3 border-b border-[var(--color-border)]"
          style={{ backgroundColor: 'var(--color-bg-input)' }}
        >
          <div className="w-10 shrink-0" />
          <p className="flex-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Name
          </p>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Role
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No users in this category.
          </div>
        ) : (
          filtered.map((user, i) => <UserRow key={user.username} user={user} index={i} />)
        )}
      </div>
    </div>
  )
}
