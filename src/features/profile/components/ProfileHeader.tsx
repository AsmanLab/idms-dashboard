import { useState } from 'react'
import type { UserProfile } from '../types/profile.types'
import { useUpdateProfileMutation } from '../hooks/useUpdateProfileMutation'
import { parseApiError } from '@/lib/parseApiError'

const statusStyle: Record<
  UserProfile['status'],
  { bg: string; text: string; label: string }
> = {
  active: {
    bg: 'var(--color-badge-inventory-bg)',
    text: 'var(--color-badge-inventory-text)',
    label: 'Active',
  },
  suspended: {
    bg: 'var(--color-badge-order-bg)',
    text: 'var(--color-badge-order-text)',
    label: 'Suspended',
  },
  offboarded: {
    bg: 'var(--color-badge-maintenance-bg)',
    text: 'var(--color-badge-maintenance-text)',
    label: 'Offboarded',
  },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState(profile.name)
  const [departmentValue, setDepartmentValue] = useState(profile.department)

  const { mutate, isPending, isError, error, reset } = useUpdateProfileMutation(
    profile.id,
    profile.username,
  )

  const badge = statusStyle[profile.status]

  function handleSave() {
    mutate(
      { name: nameValue, department: departmentValue },
      {
        onSuccess: () => setIsEditing(false),
      },
    )
  }

  function handleCancel() {
    setNameValue(profile.name)
    setDepartmentValue(profile.department)
    reset()
    setIsEditing(false)
  }

  return (
    <div
      className="flex items-start gap-5 p-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 object-cover"
            style={{ borderRadius: 'var(--radius-avatar)' }}
          />
        ) : (
          <div
            className="w-20 h-20 flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-avatar)',
              backgroundColor: 'var(--color-sidebar-accent)',
            }}
            aria-hidden="true"
          >
            <span className="text-xl font-bold text-white">{getInitials(profile.name)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-name"
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Name
              </label>
              <input
                id="edit-name"
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="px-3 py-2 text-sm w-full max-w-xs outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-department"
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Department
              </label>
              <input
                id="edit-department"
                type="text"
                value={departmentValue}
                onChange={(e) => setDepartmentValue(e.target.value)}
                className="px-3 py-2 text-sm w-full max-w-xs outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            {isError && (
              <p className="text-xs" style={{ color: 'var(--color-accent-red)' }} role="alert">
                {parseApiError(error)}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white transition-opacity"
                style={{
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-sidebar-accent)',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-bg-input)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {profile.name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {profile.title}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {profile.department} · {profile.employeeId}
            </p>
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 text-xs font-medium"
                style={{
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: badge.bg,
                  color: badge.text,
                }}
              >
                {badge.label}
              </span>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors"
          style={{
            borderRadius: 'var(--radius-btn)',
            backgroundColor: 'var(--color-bg-input)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
          }}
          aria-label="Edit profile"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit profile
        </button>
      )}
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div
      className="flex items-start gap-5 p-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="shimmer w-20 h-20 shrink-0" style={{ borderRadius: 'var(--radius-avatar)' }} />
      <div className="flex-1 flex flex-col gap-2.5 pt-1">
        <div className="shimmer h-7 w-48 rounded-lg" />
        <div className="shimmer h-4 w-32 rounded-lg" />
        <div className="shimmer h-3.5 w-40 rounded-lg" />
        <div className="shimmer h-5 w-16 rounded-full mt-1" />
      </div>
    </div>
  )
}
