import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/common/Sidebar'

export function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-surface)]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
