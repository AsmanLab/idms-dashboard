import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-canvas)] p-4">
      <Outlet />
    </div>
  )
}
