import { useState } from 'react'
import { useCredentialQuery } from '../hooks/useCredentialQuery'
import { RevokeModal } from './RevokeModal'
import { parseApiError } from '@/lib/parseApiError'
import type { Credential } from '../types/profile.types'

const enrolledFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

const protocolConfig: Record<
  'BLE' | 'NFC' | 'FIDO2',
  { bg: string; text: string; dot: string }
> = {
  BLE: {
    bg: 'rgba(134,239,172,0.2)',
    text: '#86EFAC',
    dot: '#86EFAC',
  },
  NFC: {
    bg: 'rgba(96,165,250,0.2)',
    text: '#93C5FD',
    dot: '#93C5FD',
  },
  FIDO2: {
    bg: 'rgba(244,114,182,0.2)',
    text: '#F9A8D4',
    dot: '#F9A8D4',
  },
}

const credentialStatusStyle: Record<
  Credential['status'],
  { bg: string; text: string; label: string }
> = {
  active: { bg: '#86EFAC', text: '#14532D', label: 'Active' },
  revoked: { bg: '#FCA5A5', text: '#7F1D1D', label: 'Revoked' },
  suspended: { bg: '#E9C97C', text: '#78350F', label: 'Suspended' },
}

interface CredentialCardProps {
  identityId: string
}

export function CredentialCard({ identityId }: CredentialCardProps) {
  const { data: credential, isLoading, isError, error } = useCredentialQuery(identityId)
  const [showRevokeModal, setShowRevokeModal] = useState(false)

  if (isLoading) return <CredentialCardSkeleton />

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #2D1B6B 0%, #4C2A9E 50%, #3D2463 100%)',
    borderRadius: 'var(--radius-card)',
    padding: '24px',
  }

  if (isError) {
    return (
      <div style={cardStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Digital Credential
        </p>
        <p className="text-sm" style={{ color: '#FCA5A5' }} role="alert">
          {parseApiError(error)}
        </p>
      </div>
    )
  }

  if (!credential) return null

  const statusBadge = credentialStatusStyle[credential.status]

  return (
    <>
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Digital Credential
          </span>
          <span
            className="px-2.5 py-1 text-xs font-semibold"
            style={{
              borderRadius: 'var(--radius-badge)',
              backgroundColor: statusBadge.bg,
              color: statusBadge.text,
            }}
          >
            {statusBadge.label}
          </span>
        </div>

        <div className="mb-5">
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Employee ID
          </p>
          <p
            className="text-2xl font-bold font-mono tracking-wider"
            style={{ color: 'rgba(255,255,255,1)' }}
          >
            {credential.id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {credential.protocols.map((protocol) => {
            const cfg = protocolConfig[protocol]
            return (
              <span
                key={protocol}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
                style={{
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: cfg.bg,
                  color: cfg.text,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cfg.dot }}
                  aria-hidden="true"
                />
                {protocol}
              </span>
            )
          })}
        </div>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,1)' }}>
              {credential.deviceName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Enrolled {enrolledFormatter.format(new Date(credential.enrolledAt))}
            </p>
          </div>

          {credential.status === 'active' && (
            <button
              type="button"
              onClick={() => setShowRevokeModal(true)}
              className="text-xs font-medium px-3 py-1.5 transition-opacity hover:opacity-80"
              style={{
                color: '#FCA5A5',
                border: '1px solid rgba(252,165,165,0.4)',
                borderRadius: 'var(--radius-btn)',
                backgroundColor: 'transparent',
              }}
            >
              Report lost device
            </button>
          )}
        </div>
      </div>

      {showRevokeModal && (
        <RevokeModal
          credentialId={credential.id}
          deviceName={credential.deviceName}
          identityId={identityId}
          onClose={() => setShowRevokeModal(false)}
        />
      )}
    </>
  )
}

export function CredentialCardSkeleton() {
  const shimmerBone = (className: string) => (
    <div
      className={className}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.16) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.08) 100%)',
        backgroundSize: '400% 100%',
        animation: 'shimmer 1.6s ease-in-out infinite',
        borderRadius: '8px',
      }}
    />
  )

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #2D1B6B 0%, #4C2A9E 50%, #3D2463 100%)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        {shimmerBone('h-3 w-32')}
        {shimmerBone('h-5 w-16 rounded-full')}
      </div>
      <div className="mb-5">
        {shimmerBone('h-3 w-20 mb-2')}
        {shimmerBone('h-8 w-48')}
      </div>
      <div className="flex gap-2 mb-6">
        {shimmerBone('h-6 w-14 rounded-full')}
        {shimmerBone('h-6 w-14 rounded-full')}
      </div>
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
      >
        <div className="flex flex-col gap-1.5">
          {shimmerBone('h-4 w-28')}
          {shimmerBone('h-3 w-36')}
        </div>
        {shimmerBone('h-7 w-28')}
      </div>
    </div>
  )
}
