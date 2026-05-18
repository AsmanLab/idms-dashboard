import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/layouts/RootLayout').then((m) => ({ Component: m.RootLayout })),
    children: [
      {
        index: true,
        lazy: () => import('@/pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
      },
    ],
  },
])
