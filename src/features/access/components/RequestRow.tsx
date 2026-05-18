import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApproveRequestMutation } from '../hooks/useApproveRequestMutation'
import { useDeclineRequestMutation } from '../hooks/useDeclineRequestMutation'
import { useInfoRequestMutation } from '../hooks/useInfoRequestMutation'
import type { AccessRequest } from '../types/access.types'

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

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
  low:    { bg: '#D1FAE5', text: '#065F46', label: 'Low' },
  medium: { bg: 'var(--color-card-amber)', text: '#78350F', label: 'Medium' },
  high:   { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)', label: 'High' },
}

const STATUS_STYLE = {
  pending:        { bg: 'var(--color-badge-order-bg)', text: 'var(--color-badge-order-text)', label: 'Pending' },
  approved:       { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
  declined:       { bg: 'var(--color-badge-maintenance-bg)', text: 'var(--color-badge-maintenance-text)', label: 'Declined' },
  info_requested: { bg: 'var(--color-badge-inventory-bg)', text: 'var(--color-badge-inventory-text)', label: 'Info Requested' },
}

// ─── sub-components ─────────────────────────────────────────────────────────

function Pill({ bg, text, label }: { bg: string; text: string; label: string }) {
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        borderRadius: 'var(--radius-badge)',
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
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

// ─── main component ──────────────────────────────────────────────────────────

interface RequestRowProps {
  request: AccessRequest
  isExpanded: boolean
  isSelected: boolean
  onToggleExpand: () => void
  onToggleSelect: (e: React.MouseEvent) => void
}

export function RequestRow({ request, isExpanded, isSelected, onToggleExpand, onToggleSelect }: RequestRowProps) {
  const [decliningMode, setDecliningMode] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [infoMode, setInfoMode] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  const approveMutation = useApproveRequestMutation()
  const declineMutation = useDeclineRequestMutation()
  const infoMutation = useInfoRequestMutation()

  const isPending = request.status === 'pending'
  const isResolved = request.status === 'approved' || request.status === 'declined'

  const avatarBg = AVATAR_PALETTE[hashString(request.id) % AVATAR_PALETTE.length]
  const riskStyle = RISK_STYLE[request.riskLevel]
  const statusStyle = STATUS_STYLE[request.status]

  function handleApprove() {
    approveMutation.mutate(request.id)
  }

  function handleConfirmDecline() {
    if (!declineReason.trim()) return
    declineMutation.mutate(
      { id: request.id, reason: declineReason },
      { onSuccess: () => { setDecliningMode(false); setDeclineReason('') } },
    )
  }

  function handleConfirmInfoRequest() {
    if (!infoMessage.trim()) return
    infoMutation.mutate(
      { id: request.id, message: infoMessage },
      { onSuccess: () => { setInfoMode(false); setInfoMessage('') } },
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        borderLeft: request.riskLevel === 'high' ? '4px solid #C0394B' : '4px solid transparent',
        opacity: isResolved ? 0.65 : 1,
        transition: 'opacity 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Collapsed row (always visible) ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleExpand() }}
        aria-expanded={isExpanded}
        aria-label={`${request.requestedBy.name} — ${request.resource.name}. ${isExpanded ? 'Collapse' : 'Expand'} details.`}
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        style={{ outline: 'none' }}
      >
        {/* Checkbox — intercept click so it doesn't expand the row */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleSelect(e) }}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            aria-label={`Select request from ${request.requestedBy.name}`}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-sidebar-accent)' }}
          />
        </div>

        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {request.requestedBy.avatarUrl ? (
            <img
              src={request.requestedBy.avatarUrl}
              alt={request.requestedBy.name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: avatarBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
              aria-hidden="true"
            >
              {getInitials(request.requestedBy.name)}
            </div>
          )}
        </div>

        {/* Name + department */}
        <div style={{ minWidth: 0, maxWidth: 140, flexShrink: 0 }}>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {request.requestedBy.name}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {request.requestedBy.department}
          </p>
        </div>

        {/* Resource name + type */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {request.resource.name}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 1 }}>
            {request.resource.type}
            {request.resource.protocol ? ` · ${request.resource.protocol}` : ''}
          </p>
        </div>

        {/* Risk badge */}
        <Pill bg={riskStyle.bg} text={riskStyle.text} label={riskStyle.label} />

        {/* Status badge */}
        <Pill bg={statusStyle.bg} text={statusStyle.text} label={statusStyle.label} />

        {/* Time ago */}
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0, minWidth: 48, textAlign: 'right' }}>
          {timeAgo(request.requestedAt)}
        </span>

        {/* Chevron */}
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: 'var(--color-text-muted)',
            flexShrink: 0,
            transform: `rotate(${isExpanded ? 180 : 0}deg)`,
            transition: 'transform 0.2s ease',
          }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* ── Expanded section ── */}
      {isExpanded && (
        <div
          style={{ borderTop: '1px solid var(--color-border)' }}
          className="px-5 pb-5 pt-4 flex flex-col gap-4"
        >
          {/* Reason */}
          <div>
            <p
              style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 4 }}
            >
              Reason
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{request.reason}</p>
          </div>

          {/* Dual sign-off policy note */}
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

          {/* Info requested message (existing) */}
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

          {/* Decline reason shown */}
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

          {/* Action buttons row (pending only) */}
          {isPending && (
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

              {/* View full detail */}
              <Link
                to={`/access/${request.id}`}
                className="ml-auto text-xs font-medium flex items-center gap-1"
                style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                aria-label={`View full details for request from ${request.requestedBy.name}`}
              >
                View full
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          )}

          {/* Decline form */}
          {decliningMode && isPending && (
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <label
                  htmlFor={`decline-reason-${request.id}`}
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Reason for declining{' '}
                  <span style={{ color: '#C0394B' }}>*</span>
                </label>
                <textarea
                  id={`decline-reason-${request.id}`}
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
          {infoMode && isPending && (
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <label
                  htmlFor={`info-message-${request.id}`}
                  className="text-xs font-semibold mb-1.5 block"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Message to requester{' '}
                  <span style={{ color: '#C0394B' }}>*</span>
                </label>
                <textarea
                  id={`info-message-${request.id}`}
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
      )}
    </div>
  )
}
