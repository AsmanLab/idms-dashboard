import { UsersList } from '@/features/users'

export function UsersPage() {
  return (
    <main className="p-7 flex flex-col gap-6 min-h-full bg-[var(--color-bg-surface)]">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
            Management
          </p>
          <h1 className="text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
            Users
          </h1>
        </div>
      </div>

      <UsersList />
    </main>
  )
}
