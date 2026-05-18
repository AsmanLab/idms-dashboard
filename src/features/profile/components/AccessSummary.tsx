import { useState } from 'react'
import { useAccessSummaryQuery } from '../hooks/useAccessSummaryQuery'
import { parseApiError } from '@/lib/parseApiError'
import type { Zone, ProvisionedApp } from '../types/profile.types'

const DEFAULT_VISIBLE = 5

interface AccessSummaryProps {
  identityId: string
}

function ZoneRow({ zone }: { zone: Zone }) {
  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {zone.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {zone.floor}
        </p>
      </div>
      <span
        className="shrink-0 ml-3 px-2.5 py-0.5 text-xs font-medium"
        style={{
          borderRadius: 'var(--radius-badge)',
          backgroundColor: 'var(--color-badge-inventory-bg)',
          color: 'var(--color-badge-inventory-text)',
        }}
      >
        {zone.accessLevel}
      </span>
    </div>
  )
}

function AppRow({ app }: { app: ProvisionedApp }) {
  const lastLogin = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(app.lastLogin))

  const protocolStyle =
    app.protocol === 'OIDC'
      ? { bg: 'var(--color-badge-order-bg)', text: 'var(--color-badge-order-text)' }
      : { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)' }

  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {app.name}
          </p>
          <span
            className="shrink-0 px-2 py-0.5 text-xs font-medium"
            style={{
              borderRadius: 'var(--radius-badge)',
              backgroundColor: protocolStyle.bg,
              color: protocolStyle.text,
            }}
          >
            {app.protocol}
          </span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Last login {lastLogin}
        </p>
      </div>
    </div>
  )
}

export function AccessSummary({ identityId }: AccessSummaryProps) {
  const { data, isLoading, isError, error } = useAccessSummaryQuery(identityId)
  const [showAllZones, setShowAllZones] = useState(false)
  const [showAllApps, setShowAllApps] = useState(false)

  if (isLoading) return <AccessSummarySkeleton />

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
          {parseApiError(error)}
        </p>
      </div>
    )
  }

  if (!data) return null

  const visibleZones = showAllZones ? data.zones : data.zones.slice(0, DEFAULT_VISIBLE)
  const visibleApps = showAllApps ? data.apps : data.apps.slice(0, DEFAULT_VISIBLE)

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="flex gap-4">
        <div
          className="flex-1 p-5 flex flex-col gap-1"
          style={{ backgroundColor: 'var(--color-card-periwinkle)', borderRadius: 'var(--radius-stat)' }}
        >
          <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.totalZones}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Zones accessible
          </p>
        </div>
        <div
          className="flex-1 p-5 flex flex-col gap-1"
          style={{ backgroundColor: 'var(--color-card-mauve)', borderRadius: 'var(--radius-stat)' }}
        >
          <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.totalApps}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Apps provisioned
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Granted Zones
              </h2>
              <span
                className="px-2 py-0.5 text-xs font-medium"
                style={{
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: 'var(--color-badge-inventory-bg)',
                  color: 'var(--color-badge-inventory-text)',
                }}
              >
                {data.zones.length}
              </span>
            </div>
          </div>
          {data.zones.length === 0 ? (
            <p className="text-sm py-3" style={{ color: 'var(--color-text-muted)' }}>
              No zones assigned.
            </p>
          ) : (
            <>
              {visibleZones.map((zone) => (
                <ZoneRow key={zone.id} zone={zone} />
              ))}
              {data.zones.length > DEFAULT_VISIBLE && (
                <button
                  type="button"
                  onClick={() => setShowAllZones((v) => !v)}
                  className="mt-2 text-xs font-medium"
                  style={{ color: 'var(--color-sidebar-accent)' }}
                >
                  {showAllZones ? 'Show less' : `Show all ${data.zones.length}`}
                </button>
              )}
            </>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Provisioned Apps
              </h2>
              <span
                className="px-2 py-0.5 text-xs font-medium"
                style={{
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: 'var(--color-badge-order-bg)',
                  color: 'var(--color-badge-order-text)',
                }}
              >
                {data.apps.length}
              </span>
            </div>
          </div>
          {data.apps.length === 0 ? (
            <p className="text-sm py-3" style={{ color: 'var(--color-text-muted)' }}>
              No apps provisioned.
            </p>
          ) : (
            <>
              {visibleApps.map((app) => (
                <AppRow key={app.id} app={app} />
              ))}
              {data.apps.length > DEFAULT_VISIBLE && (
                <button
                  type="button"
                  onClick={() => setShowAllApps((v) => !v)}
                  className="mt-2 text-xs font-medium"
                  style={{ color: 'var(--color-sidebar-accent)' }}
                >
                  {showAllApps ? 'Show less' : `Show all ${data.apps.length}`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AccessSummarySkeleton() {
  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="flex gap-4">
        <div className="flex-1 h-24 shimmer" style={{ borderRadius: 'var(--radius-stat)' }} />
        <div className="flex-1 h-24 shimmer" style={{ borderRadius: 'var(--radius-stat)' }} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="shimmer h-4 w-24 rounded-lg" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-10 rounded-lg" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="shimmer h-4 w-28 rounded-lg" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
