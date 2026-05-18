import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  // Auth routes (public)
  {
    lazy: () => import('@/layouts/AuthLayout').then((m) => ({ Component: m.AuthLayout })),
    children: [
      {
        path: '/login',
        lazy: () => import('@/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        lazy: () => import('@/layouts/RootLayout').then((m) => ({ Component: m.RootLayout })),
        children: [
          {
            path: '/',
            lazy: () => import('@/pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
