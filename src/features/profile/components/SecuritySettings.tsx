import { useState } from 'react'
import { useSettingsQuery } from '../hooks/useSettingsQuery'
import { useUpdateSettingsMutation } from '../hooks/useUpdateSettingsMutation'
import { parseApiError } from '@/lib/parseApiError'
import type { IdentitySettings } from '../types/profile.types'

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: () => void
  id: string
  tooltip?: string
  error?: string | null
}

function ToggleRow({ label, description, checked, disabled, onChange, id, tooltip, error }: ToggleRowProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="flex items-start justify-between gap-4 py-4 border-b last:border-0"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={id}
            className="text-sm font-semibold cursor-pointer"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                aria-label="More information"
                className="flex items-center"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="12" y1="11" x2="12" y2="16" />
                </svg>
              </button>
              {showTooltip && (
                <div
                  className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs w-56 text-center pointer-events-none"
                  style={{
                    backgroundColor: 'var(--color-text-primary)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-dropdown)',
                  }}
                  role="tooltip"
                >
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
        {error && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-accent-red)' }} role="alert">
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        disabled={disabled}
        className="shrink-0 relative transition-colors"
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: checked ? 'var(--color-sidebar-accent)' : 'var(--color-bg-input)',
          border: '1px solid var(--color-border)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          padding: 0,
          outline: 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: '18px',
            height: '18px',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.2s',
            display: 'block',
          }}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

interface SecuritySettingsProps {
  identityId: string
}

export function SecuritySettings({ identityId }: SecuritySettingsProps) {
  const { data: settings, isLoading, isError, error: queryError } = useSettingsQuery(identityId)
  const { mutate, isPending, error: mutationError } = useUpdateSettingsMutation(identityId)

  if (isLoading) return <SecuritySettingsSkeleton />

  if (isError) {
    return (
      <div
        className="p-6"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--color-accent-red)' }} role="alert">
          {parseApiError(queryError)}
        </p>
      </div>
    )
  }

  if (!settings) return null

  function toggle(key: keyof IdentitySettings) {
    if (!settings) return
    mutate({ [key]: !settings[key] })
  }

  const mutationErrorMsg = mutationError ? parseApiError(mutationError) : null

  return (
    <div
      className="p-6 flex flex-col"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Identity Settings
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Changes apply immediately.
      </p>

      <ToggleRow
        id="setting-biometric"
        label="Require biometric confirmation"
        description="User must verify with Face ID / fingerprint for each door or app access."
        checked={settings.requireBiometric}
        disabled={isPending}
        onChange={() => toggle('requireBiometric')}
        error={mutationErrorMsg}
      />
      <ToggleRow
        id="setting-offline"
        label="Allow offline credential use"
        description="Credential works without internet. Increases convenience but reduces revocation speed."
        checked={settings.allowOffline}
        disabled={isPending}
        onChange={() => toggle('allowOffline')}
        tooltip="Offline credentials cannot be immediately revoked if a device is reported lost."
      />
      <ToggleRow
        id="setting-notify"
        label="Notify me on denied access"
        description="Send push notification when access is denied."
        checked={settings.notifyOnDenied}
        disabled={isPending}
        onChange={() => toggle('notifyOnDenied')}
      />
    </div>
  )
}

function SecuritySettingsSkeleton() {
  return (
    <div
      className="p-6 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="shimmer h-4 w-32 rounded-lg" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-4 border-b last:border-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex flex-col gap-2 flex-1 mr-4">
            <div className="shimmer h-4 w-48 rounded-lg" />
            <div className="shimmer h-3 w-64 rounded-lg" />
          </div>
          <div className="shimmer shrink-0 rounded-full" style={{ width: '44px', height: '24px' }} />
        </div>
      ))}
    </div>
  )
}
