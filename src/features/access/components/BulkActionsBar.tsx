interface BulkActionsBarProps {
  selectedCount: number
  onApprove: () => void
  onClear: () => void
  isLoading: boolean
}

export function BulkActionsBar({ selectedCount, onApprove, onClear, isLoading }: BulkActionsBarProps) {
  return (
    <div
      aria-live="polite"
      aria-label={selectedCount > 0 ? `${selectedCount} request${selectedCount !== 1 ? 's' : ''} selected` : undefined}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: 'var(--color-text-primary)',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '24px',
        paddingRight: '24px',
        transform: `translateY(${selectedCount > 0 ? '0' : '-100%'})`,
        transition: 'transform 0.25s ease',
        pointerEvents: selectedCount > 0 ? 'auto' : 'none',
      }}
    >
      {/* Left: selection count */}
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
        {selectedCount} request{selectedCount !== 1 ? 's' : ''} selected
      </p>

      {/* Center: bulk approve button */}
      <button
        onClick={onApprove}
        disabled={isLoading}
        aria-label={`Approve ${selectedCount} selected request${selectedCount !== 1 ? 's' : ''}`}
        style={{
          backgroundColor: 'var(--color-sidebar-accent)',
          color: '#fff',
          borderRadius: 'var(--radius-btn)',
          border: 'none',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '8px',
          paddingBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'opacity 0.15s ease',
        }}
      >
        {isLoading && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'spin 0.75s linear infinite' }}
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        Approve {selectedCount} selected
      </button>

      {/* Right: clear selection */}
      <button
        onClick={onClear}
        aria-label="Clear selection"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
      >
        Clear selection
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
