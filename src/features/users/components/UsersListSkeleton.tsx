// Mirrors the exact UsersList layout — tabs + table header + rows

const tabWidths = [72, 104, 80, 92]

const rows = [
  { name: 136, username: 80,  badge: 120 },
  { name: 112, username: 64,  badge: 80  },
  { name: 152, username: 96,  badge: 140 },
  { name: 96,  username: 72,  badge: 80  },
  { name: 128, username: 88,  badge: 100 },
  { name: 144, username: 56,  badge: 120 },
  { name: 104, username: 80,  badge: 80  },
  { name: 120, username: 68,  badge: 140 },
]

function Bone({ width, height = 12, radius = 6 }: { width: number; height?: number; radius?: number }) {
  return (
    <div
      className="shimmer shrink-0"
      style={{ width, height, borderRadius: radius }}
    />
  )
}

function SkeletonTab({ width }: { width: number }) {
  return (
    <div
      className="shimmer"
      style={{ width, height: 36, borderRadius: 9999 }}
    />
  )
}

function SkeletonRow({ name, username, badge }: { name: number; username: number; badge: number }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-0">
      {/* Avatar circle */}
      <div
        className="shimmer shrink-0"
        style={{ width: 40, height: 40, borderRadius: 9999 }}
      />

      {/* Name + username */}
      <div className="flex-1 flex flex-col gap-2">
        <Bone width={name} height={13} />
        <Bone width={username} height={10} />
      </div>

      {/* Badge */}
      <Bone width={badge} height={24} radius={9999} />
    </div>
  )
}

export function UsersListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Tab skeletons */}
      <div className="flex items-center gap-2">
        {tabWidths.map((w, i) => (
          <SkeletonTab key={i} width={w} />
        ))}
      </div>

      {/* Table card */}
      <div
        className="rounded-[var(--radius-card)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-panel)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-4 px-5 py-3 border-b border-[var(--color-border)]"
          style={{ backgroundColor: 'var(--color-bg-input)' }}
        >
          <div className="w-10 shrink-0" />
          <p className="flex-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Name
          </p>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Role
          </p>
        </div>

        {/* Skeleton rows */}
        {rows.map((r, i) => (
          <SkeletonRow key={i} {...r} />
        ))}
      </div>
    </div>
  )
}
