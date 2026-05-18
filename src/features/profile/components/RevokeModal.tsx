import { useEffect, useRef, useState } from 'react'
import { useRevokeMutation } from '../hooks/useRevokeMutation'
import { parseApiError } from '@/lib/parseApiError'

interface RevokeModalProps {
  credentialId: string
  deviceName: string
  identityId: string
  onClose: () => void
}

export function RevokeModal({ credentialId, deviceName, identityId, onClose }: RevokeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [confirmText, setConfirmText] = useState('')
  const { mutate, isPending, isError, error, reset } = useRevokeMutation(identityId)

  const canConfirm = confirmText === 'REVOKE'

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const getFocusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
    getFocusable()[0]?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleConfirm() {
    if (!canConfirm) return
    mutate(credentialId, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="revoke-modal-title"
        className="relative w-full max-w-md mx-4 p-6 flex flex-col gap-5"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-panel)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: 'rgba(252,165,165,0.15)' }}
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-red)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2
            id="revoke-modal-title"
            className="text-base font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Report lost device
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            This will immediately revoke the credential for{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {deviceName}
            </span>
            . The user will lose access to all doors and apps until a new credential is issued.
            This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="revoke-confirm-input"
            className="text-xs font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Type <span className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>REVOKE</span> to confirm
          </label>
          <input
            id="revoke-confirm-input"
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value)
              if (isError) reset()
            }}
            placeholder="REVOKE"
            className="w-full px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: 'var(--color-bg-input)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            autoComplete="off"
          />
        </div>

        {isError && (
          <div
            className="px-3 py-2 text-sm rounded-lg"
            style={{
              backgroundColor: 'rgba(252,165,165,0.12)',
              color: 'var(--color-accent-red)',
              borderRadius: 'var(--radius-input)',
            }}
            role="alert"
          >
            {parseApiError(error)}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              borderRadius: 'var(--radius-btn)',
              backgroundColor: 'var(--color-bg-input)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium transition-opacity"
            style={{
              borderRadius: 'var(--radius-btn)',
              backgroundColor: canConfirm && !isPending ? 'rgba(252,165,165,0.15)' : 'var(--color-bg-input)',
              color: canConfirm && !isPending ? 'var(--color-accent-red)' : 'var(--color-text-muted)',
              border: `1px solid ${canConfirm && !isPending ? 'rgba(252,165,165,0.5)' : 'var(--color-border)'}`,
              cursor: canConfirm && !isPending ? 'pointer' : 'not-allowed',
            }}
            aria-disabled={!canConfirm || isPending}
          >
            {isPending ? 'Revoking…' : 'Revoke credential'}
          </button>
        </div>
      </div>
    </div>
  )
}
