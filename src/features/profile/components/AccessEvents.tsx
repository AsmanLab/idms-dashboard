import { useState } from 'react'
import { useAccessEventsQuery } from '../hooks/useAccessEventsQuery'
import { parseApiError } from '@/lib/parseApiError'
import type { AccessEvent } from '../types/profile.types'

const eventFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeStyle: 'short',
})

type Filter = 'All' | 'Granted' | 'Denied'

const protocolBadgeStyle: Record<
  AccessEvent['protocol'],
  { bg: string; text: string }
> = {
  BLE: { bg: 'var(--color-badge-inventory-bg)', text: 'var(--color-badge-inventory-text)' },
  NFC: { bg: 'var(--color-badge-inventory-bg)', text: 'var(--color-badge-inventory-text)' },
  OIDC: { bg: 'var(--color-badge-order-bg)', text: 'var(--color-badge-order-text)' },
  SAML: { bg: 'var(--color-badge-order-bg)', text: 'var(--color-badge-order-text)' },
  FIDO2: { bg: 'var(--color-card-mauve)', text: 'var(--color-text-primary)' },
}

const resultBadgeStyle: Record<
  AccessEvent['result'],
  { bg: string; text: string; label: string }
> = {
  granted: { bg: 'var(--color-accent-green)', text: '#166534', label: 'Granted' },
  denied: { bg: 'var(--color-accent-red)', text: '#7F1D1D', label: 'Denied' },
  revoked: { bg: 'var(--color-card-amber)', text: '#78350F', label: 'Revoked' },
}

function DoorIcon() {
  return (
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

function AppIcon() {
  return (
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function EventRow({ event }: { event: AccessEvent }) {
  const isDenied = event.result === 'denied'
  const protocol = protocolBadgeStyle[event.protocol]
  const result = resultBadgeStyle[event.result]

  return (
    <div
      className="flex items-center gap-4 py-3 border-b last:border-0"
      style={{
        borderColor: 'var(--color-border)',
        borderLeftWidth: isDenied ? '4px' : '0',
        borderLeftStyle: isDenied ? 'solid' : 'none',
        borderLeftColor: isDenied ? 'var(--color-accent-red)' : undefined,
        paddingLeft: isDenied ? '12px' : '16px',
        paddingRight: '16px',
      }}
    >
      <time
        className="shrink-0 text-xs tabular-nums"
        style={{ color: 'var(--color-text-muted)', minWidth: '140px' }}
        dateTime={event.timestamp}
      >
        {eventFormatter.format(new Date(event.timestamp))}
      </time>

      <span
        className="shrink-0"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label={event.resourceType === 'door' ? 'Door' : 'Application'}
      >
        {event.resourceType === 'door' ? <DoorIcon /> : <AppIcon />}
      </span>

      <span
        className="flex-1 text-sm font-medium truncate"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {event.resource}
      </span>

      <span
        className="shrink-0 px-2 py-0.5 text-xs font-semibold"
        style={{
          borderRadius: 'var(--radius-badge)',
          backgroundColor: protocol.bg,
          color: protocol.text,
        }}
      >
        {event.protocol}
      </span>

      <span
        className="shrink-0 px-2.5 py-0.5 text-xs font-semibold"
        style={{
          borderRadius: 'var(--radius-badge)',
          backgroundColor: result.bg,
          color: result.text,
        }}
      >
        {result.label}
      </span>
    </div>
  )
}

interface AccessEventsProps {
  identityId: string
}

export function AccessEvents({ identityId }: AccessEventsProps) {
  const { data, isLoading, isError, error } = useAccessEventsQuery(identityId)
  const [filter, setFilter] = useState<Filter>('All')

  if (isLoading) return <AccessEventsSkeleton />

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

  const filtered = (data ?? []).filter((e) => {
    if (filter === 'All') return true
    if (filter === 'Granted') return e.result === 'granted'
    if (filter === 'Denied') return e.result === 'denied'
    return true
  })

  const filters: Filter[] = ['All', 'Granted', 'Denied']

  return (
    <div
      className="p-6 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Recent Access Events
        </h2>
        <div
          className="flex items-center gap-1 p-1"
          style={{
            backgroundColor: 'var(--color-bg-input)',
            borderRadius: 'var(--radius-btn)',
          }}
          role="group"
          aria-label="Filter events"
        >
          {filters.map((f) => {
            const isActive = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={isActive}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--color-text-primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
          No events match this filter.
        </p>
      ) : (
        <div>
          {filtered.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function AccessEventsSkeleton() {
  return (
    <div
      className="p-6 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="shimmer h-4 w-36 rounded-lg" />
        <div className="shimmer h-8 w-36 rounded-xl" />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="shimmer h-3 rounded-lg" style={{ minWidth: '140px' }} />
          <div className="shimmer h-3 w-3 rounded" />
          <div className="shimmer h-3 flex-1 rounded-lg" />
          <div className="shimmer h-5 w-14 rounded-full" />
          <div className="shimmer h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
