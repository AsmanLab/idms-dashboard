import { useState, useMemo } from 'react'
import { useAccessRequestsQuery } from '@/features/access/hooks/useAccessRequestsQuery'
import { useBulkApproveMutation } from '@/features/access/hooks/useBulkApproveMutation'
import { BulkActionsBar } from '@/features/access/components/BulkActionsBar'
import { RequestRow } from '@/features/access/components/RequestRow'

// ─── skeleton ────────────────────────────────────────────────────────────────

function AccessRequestsSkeleton() {
  const heights = [72, 72, 72]
  return (
    <div className="flex flex-col gap-3" aria-label="Loading access requests" aria-busy="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="shimmer"
          style={{
            height: h,
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
          }}
        />
      ))}
    </div>
  )
}

// ─── error banner ─────────────────────────────────────────────────────────────

function ErrorBanner() {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 px-5 py-4 rounded-[var(--radius-card)] text-sm"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-card)',
        color: 'var(--color-accent-red)',
        border: '1px solid var(--color-badge-maintenance-bg)',
      }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Failed to load access requests. Please try again.
    </div>
  )
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-16"
      style={{ color: 'var(--color-text-muted)' }}
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        No access requests
      </p>
      <p className="text-xs">All caught up.</p>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function AccessPage() {
  const { data, isLoading, isError } = useAccessRequestsQuery()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const bulkMutation = useBulkApproveMutation()

  const sorted = useMemo(() => {
    if (!data) return []
    const active = data.filter((r) => r.status === 'pending' || r.status === 'info_requested')
    const resolved = data.filter((r) => r.status === 'approved' || r.status === 'declined')
    return [
      ...active.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()),
      ...resolved.sort(
        (a, b) =>
          new Date(b.resolvedAt ?? b.requestedAt).getTime() -
          new Date(a.resolvedAt ?? a.requestedAt).getTime(),
      ),
    ]
  }, [data])

  const activeCount = data?.filter((r) => r.status === 'pending' || r.status === 'info_requested').length ?? 0
  const resolvedCount = data?.filter((r) => r.status === 'approved' || r.status === 'declined').length ?? 0

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBulkApprove() {
    bulkMutation.mutate([...selectedIds], {
      onSuccess: () => setSelectedIds(new Set()),
    })
  }

  return (
    <div className="flex flex-col min-h-full" style={{ position: 'relative' }}>
      <BulkActionsBar
        selectedCount={selectedIds.size}
        onApprove={handleBulkApprove}
        onClear={() => setSelectedIds(new Set())}
        isLoading={bulkMutation.isPending}
      />

      <div className="px-8 py-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Access Requests
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {activeCount} pending · {resolvedCount} resolved
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <AccessRequestsSkeleton />}

        {/* Error */}
        {isError && <ErrorBanner />}

        {/* List */}
        {!isLoading && !isError && sorted.length > 0 && (
          <div className="flex flex-col gap-3" role="list" aria-label="Access requests">
            {sorted.map((request) => (
              <div key={request.id} role="listitem">
                <RequestRow
                  request={request}
                  isExpanded={expandedId === request.id}
                  isSelected={selectedIds.has(request.id)}
                  onToggleExpand={() => toggleExpand(request.id)}
                  onToggleSelect={(e) => toggleSelect(request.id, e)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && sorted.length === 0 && <EmptyState />}
      </div>
    </div>
  )
}
