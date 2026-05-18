import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAccessRequestQuery } from '@/features/access/hooks/useAccessRequestQuery'
import { useApproveRequestMutation } from '@/features/access/hooks/useApproveRequestMutation'
import { useDeclineRequestMutation } from '@/features/access/hooks/useDeclineRequestMutation'
import { useInfoRequestMutation } from '@/features/access/hooks/useInfoRequestMutation'
import type { AuditEntry } from '@/features/access/types/access.types'

// ─── helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const AVATAR_PALETTE = [
  'var(--color-card-periwinkle)',
  'var(--color-card-mauve)',
  'var(--color-card-amber)',
  'var(--color-card-peach)',
]

const RISK_STYLE = {
  low:    { bg: '#D1FAE5', text: '#065F46', label: 'Low Risk' },
  medium: { bg: 'var(--color-card-amber)', text: '#78350F', label: 'Medium Risk' },
  high:   { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)', label: 'High Risk' },
}

const STATUS_STYLE = {
  pending:        { bg: 'var(--color-badge-order-bg)', text: 'var(--color-badge-order-text)', label: 'Pending' },
  approved:       { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
  declined:       { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)', label: 'Declined' },
  info_requested: { bg: 'var(--color-badge-inventory-bg)', text: 'var(--color-badge-inventory-text)', label: 'Info Requested' },
}

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(
    new Date(iso),
  )
}

function Pill({ bg, text, label }: { bg: string; text: string; label: string }) {
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        borderRadius: 'var(--radius-badge)',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
      }}
    >
      {children}
    </div>
  )
}

function InfoIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#1D4ED8', flexShrink: 0, marginTop: 1 }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" />
      <line x1="12" y1="11" x2="12" y2="17" />
    </svg>
  )
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Loading request details" aria-busy="true">
      {[120, 220, 200].map((h, i) => (
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

// ─── audit timeline ──────────────────────────────────────────────────────────

function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  return (
    <div role="list" aria-label="Audit trail">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1
        return (
          <div key={entry.id} className="flex gap-3" role="listitem">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sidebar-accent)',
                  marginTop: 6,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              {!isLast && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    marginTop: 4,
                    backgroundColor: 'var(--color-border)',
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 20 }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {formatTimestamp(entry.timestamp)}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: 2 }}>
                {entry.action}{' '}
                <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>
                  by {entry.actor}
                </span>
              </p>
              {entry.note && (
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 4, fontStyle: 'italic' }}>
                  &ldquo;{entry.note}&rdquo;
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function AccessRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: request, isLoading, isError } = useAccessRequestQuery(id)

  const [decliningMode, setDecliningMode] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [infoMode, setInfoMode] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  const approveMutation = useApproveRequestMutation()
  const declineMutation = useDeclineRequestMutation()
  const infoMutation = useInfoRequestMutation()

  function handleApprove() {
    if (!request) return
    approveMutation.mutate(request.id)
  }

  function handleConfirmDecline() {
    if (!request || !declineReason.trim()) return
    declineMutation.mutate(
      { id: request.id, reason: declineReason },
      { onSuccess: () => { setDecliningMode(false); setDeclineReason('') } },
    )
  }

  function handleConfirmInfoRequest() {
    if (!request || !infoMessage.trim()) return
    infoMutation.mutate(
      { id: request.id, message: infoMessage },
      { onSuccess: () => { setInfoMode(false); setInfoMessage('') } },
    )
  }

  const isPending = request?.status === 'pending'

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Back link */}
      <Link
        to="/access"
        className="flex items-center gap-1.5 text-sm w-fit"
        style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        aria-label="Back to access requests"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to requests
      </Link>

      {/* Loading */}
      {isLoading && <DetailSkeleton />}

      {/* Error */}
      {isError && (
        <div
          role="alert"
          className="flex items-center gap-2 px-5 py-4 rounded-[var(--radius-card)] text-sm"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            boxShadow: 'var(--shadow-card)',
            color: 'var(--color-accent-red)',
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
          Failed to load request details.
        </div>
      )}

      {request && (
        <>
          {/* ── Header card ── */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-panel)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: avatar + name */}
            <div className="flex items-center gap-4">
              {request.requestedBy.avatarUrl ? (
                <img
                  src={request.requestedBy.avatarUrl}
                  alt={request.requestedBy.name}
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: AVATAR_PALETTE[hashString(request.id) % AVATAR_PALETTE.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {getInitials(request.requestedBy.name)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {request.requestedBy.name}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {request.requestedBy.department}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  @{request.requestedBy.username}
                </p>
              </div>
            </div>

            {/* Right: risk + status badges */}
            <div className="flex flex-col items-end gap-2">
              <Pill
                bg={RISK_STYLE[request.riskLevel].bg}
                text={RISK_STYLE[request.riskLevel].text}
                label={RISK_STYLE[request.riskLevel].label}
              />
              <Pill
                bg={STATUS_STYLE[request.status].bg}
                text={STATUS_STYLE[request.status].text}
                label={STATUS_STYLE[request.status].label}
              />
            </div>
          </div>

          {/* ── Request details card ── */}
          <SectionCard>
            <div className="flex flex-col gap-5">
              {/* Resource */}
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 8,
                  }}
                >
                  Resource
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {request.resource.name}
                  </p>
                  <Pill
                    bg="var(--color-bg-input)"
                    text="var(--color-text-secondary)"
                    label={request.resource.type}
                  />
                  {request.resource.protocol && (
                    <Pill
                      bg="var(--color-badge-inventory-bg)"
                      text="var(--color-badge-inventory-text)"
                      label={request.resource.protocol}
                    />
                  )}
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />

              {/* Reason */}
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 8,
                  }}
                >
                  Reason
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {request.reason}
                </p>
              </div>

              <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />

              {/* Requested at */}
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 8,
                  }}
                >
                  Requested at
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {formatTimestamp(request.requestedAt)}
                </p>
              </div>

              {/* Dual sign-off note */}
              {request.requiresDualSignoff && (
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 'var(--radius-btn)',
                    padding: '10px 14px',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <InfoIcon />
                    <p style={{ fontSize: '12px', color: '#1E40AF' }}>
                      Dual sign-off required.{' '}
                      {request.dualSignoffApprover && (
                        <strong>{request.dualSignoffApprover}</strong>
                      )}{' '}
                      must also approve this request.
                    </p>
                  </div>
                </div>
              )}

              {/* Info requested message */}
              {request.status === 'info_requested' && request.infoRequestedMessage && (
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 'var(--radius-btn)',
                    padding: '10px 14px',
                  }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1E40AF', marginBottom: 4 }}>
                    Awaiting response from {request.requestedBy.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#1E40AF' }}>
                    &ldquo;{request.infoRequestedMessage}&rdquo;
                  </p>
                </div>
              )}

              {/* Decline reason */}
              {request.status === 'declined' && request.declineReason && (
                <div
                  style={{
                    backgroundColor: 'var(--color-badge-maintenance-bg)',
                    border: '1px solid #FBCFE8',
                    borderRadius: 'var(--radius-btn)',
                    padding: '10px 14px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-badge-maintenance-text)',
                      marginBottom: 4,
                    }}
                  >
                    Decline reason
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-badge-maintenance-text)' }}>
                    {request.declineReason}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Action buttons ── */}
          {isPending && (
            <SectionCard>
              <div className="flex flex-col gap-4">
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Actions
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Approve */}
                  <button
                    onClick={handleApprove}
                    disabled={approveMutation.isPending}
                    aria-label="Approve this request"
                    className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      borderRadius: 'var(--radius-btn)',
                      border: 'none',
                      cursor: approveMutation.isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {approveMutation.isPending ? 'Approving…' : '✓ Approve'}
                  </button>

                  {/* Decline toggle */}
                  {!decliningMode && (
                    <button
                      onClick={() => { setDecliningMode(true); setInfoMode(false) }}
                      aria-label="Decline this request"
                      className="px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--color-badge-maintenance-bg)',
                        color: 'var(--color-badge-maintenance-text)',
                        borderRadius: 'var(--radius-btn)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Decline
                    </button>
                  )}

                  {/* Request info toggle */}
                  {!infoMode && (
                    <button
                      onClick={() => { setInfoMode(true); setDecliningMode(false) }}
                      aria-label="Request more information"
                      className="px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--color-badge-inventory-bg)',
                        color: 'var(--color-badge-inventory-text)',
                        borderRadius: 'var(--radius-btn)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Request info
                    </button>
                  )}
                </div>

                {/* Decline form */}
                {decliningMode && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label
                        htmlFor="detail-decline-reason"
                        className="text-xs font-semibold mb-1.5 block"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Reason for declining{' '}
                        <span style={{ color: '#C0394B' }}>*</span>
                      </label>
                      <textarea
                        id="detail-decline-reason"
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        rows={3}
                        placeholder="Explain why this request is being declined. This message will be visible to the requester."
                        aria-required="true"
                        style={{
                          width: '100%',
                          resize: 'none',
                          backgroundColor: 'var(--color-bg-input)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-input)',
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: 'var(--color-text-primary)',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmDecline}
                        disabled={!declineReason.trim() || declineMutation.isPending}
                        className="px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
                        style={{
                          backgroundColor: '#C0394B',
                          color: 'white',
                          borderRadius: 'var(--radius-btn)',
                          border: 'none',
                          cursor: !declineReason.trim() || declineMutation.isPending ? 'not-allowed' : 'pointer',
                        }}
                        aria-label="Confirm decline"
                      >
                        {declineMutation.isPending ? 'Declining…' : 'Confirm decline'}
                      </button>
                      <button
                        onClick={() => { setDecliningMode(false); setDeclineReason('') }}
                        className="px-4 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: 'var(--color-bg-input)',
                          color: 'var(--color-text-secondary)',
                          borderRadius: 'var(--radius-btn)',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                        }}
                        aria-label="Cancel decline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Info request form */}
                {infoMode && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label
                        htmlFor="detail-info-message"
                        className="text-xs font-semibold mb-1.5 block"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Message to requester{' '}
                        <span style={{ color: '#C0394B' }}>*</span>
                      </label>
                      <textarea
                        id="detail-info-message"
                        value={infoMessage}
                        onChange={(e) => setInfoMessage(e.target.value)}
                        rows={3}
                        placeholder="Ask for the information you need before making a decision."
                        aria-required="true"
                        style={{
                          width: '100%',
                          resize: 'none',
                          backgroundColor: 'var(--color-bg-input)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-input)',
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: 'var(--color-text-primary)',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmInfoRequest}
                        disabled={!infoMessage.trim() || infoMutation.isPending}
                        className="px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
                        style={{
                          backgroundColor: 'var(--color-badge-inventory-bg)',
                          color: 'var(--color-badge-inventory-text)',
                          borderRadius: 'var(--radius-btn)',
                          border: 'none',
                          cursor: !infoMessage.trim() || infoMutation.isPending ? 'not-allowed' : 'pointer',
                        }}
                        aria-label="Send information request"
                      >
                        {infoMutation.isPending ? 'Sending…' : 'Send request'}
                      </button>
                      <button
                        onClick={() => { setInfoMode(false); setInfoMessage('') }}
                        className="px-4 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: 'var(--color-bg-input)',
                          color: 'var(--color-text-secondary)',
                          borderRadius: 'var(--radius-btn)',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                        }}
                        aria-label="Cancel info request"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── Audit timeline card ── */}
          <SectionCard>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: 20,
              }}
            >
              Audit Trail
            </p>
            {request.auditTrail.length > 0 ? (
              <AuditTimeline entries={request.auditTrail} />
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No audit entries.</p>
            )}
          </SectionCard>
        </>
      )}
    </div>
  )
}
