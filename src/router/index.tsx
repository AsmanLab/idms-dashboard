import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  // Public
  {
    lazy: () => import('@/layouts/AuthLayout').then((m) => ({ Component: m.AuthLayout })),
    children: [
      {
        path: '/login',
        lazy: () => import('@/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
      },
    ],
  },

  // Protected
  {
    element: <ProtectedRoute />,
    children: [
      {
        lazy: () => import('@/layouts/RootLayout').then((m) => ({ Component: m.RootLayout })),
        children: [
          { path: '/', element: <Navigate to="/users" replace /> },
          {
            path: '/users',
            lazy: () => import('@/pages/UsersPage').then((m) => ({ Component: m.UsersPage })),
          },
          {
            path: '/users/:username',
            lazy: () => import('@/pages/UserProfilePage').then((m) => ({ Component: m.UserProfilePage })),
          },
          {
            path: '/access',
            lazy: () => import('@/pages/AccessPage').then((m) => ({ Component: m.AccessPage })),
          },
          {
            path: '/access/:id',
            lazy: () => import('@/pages/AccessRequestDetailPage').then((m) => ({ Component: m.AccessRequestDetailPage })),
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/users" replace /> },
])
