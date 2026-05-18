# IDMS Dashboard — Architecture

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 (lazy routes) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (via `src/services/api.ts`) |

---

## Folder Structure

```
src/
├── assets/              # Static files (images, fonts, icons)
├── components/
│   ├── ui/              # Base UI primitives (Button, Input, Modal…)
│   └── common/          # App-specific shared components (PageHeader, DataTable…)
├── features/            # Feature modules — the core of the app
│   └── [feature-name]/
│       ├── components/  # Components scoped to this feature
│       ├── hooks/       # Data hooks (useXxxQuery, useXxxMutation)
│       ├── services/    # API calls for this feature
│       ├── store/       # Zustand slice (if local state needed)
│       ├── types/       # Feature-specific TypeScript types
│       └── index.ts     # Public barrel — only export what other features may use
├── hooks/               # Global shared hooks (useDebounce, useMediaQuery…)
├── layouts/             # Route-wrapping layout components
│   └── RootLayout.tsx
├── lib/                 # Pure utilities, helpers, third-party config
├── pages/               # Route-level page components (thin — delegate to features)
├── router/              # Route definitions (index.tsx)
├── services/            # Global API layer (api.ts axios instance, interceptors)
├── store/               # Global Zustand stores (auth, theme, ui)
├── styles/              # Global CSS overrides, design tokens
└── types/               # App-wide TypeScript types (api.d.ts, common.d.ts)
```

---

## Rules

### Pages are thin
Pages only compose feature components and pass route params. No business logic.

```tsx
// pages/InventoryPage.tsx
export function InventoryPage() {
  return <InventoryList />
}
```

### Features are self-contained
Everything a feature needs lives inside `features/[name]/`. Cross-feature imports go through `index.ts` barrel only.

```
features/inventory/
├── components/InventoryList.tsx
├── components/InventoryFilters.tsx
├── hooks/useInventoryQuery.ts
├── services/inventory.service.ts
├── types/inventory.types.ts
└── index.ts              ← export { InventoryList } from './components/InventoryList'
```

### Data fetching with TanStack Query
All server state goes through hooks in `features/[name]/hooks/`. No raw fetches in components.

```ts
// features/inventory/hooks/useInventoryQuery.ts
export function useInventoryQuery(filters: InventoryFilters) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => inventoryService.getAll(filters),
  })
}
```

### API layer
One Axios instance at `services/api.ts`. Features import from their own service file.

```ts
// services/api.ts
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
api.interceptors.request.use(attachAuthHeader)
export default api
```

```ts
// features/inventory/services/inventory.service.ts
import api from '@/services/api'
export const inventoryService = {
  getAll: (filters) => api.get('/inventory', { params: filters }).then(r => r.data),
}
```

### Client state with Zustand
Use Zustand only for UI state or auth — not server data. One slice per concern.

```ts
// store/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
}))
```

### Path aliases
Always use `@/` alias. No relative `../../` imports across folder boundaries.

```ts
import { Button } from '@/components/ui/Button'
import { useInventoryQuery } from '@/features/inventory'
```

### TypeScript types
- `src/types/` — app-wide types (API response shapes, common unions)
- `features/[name]/types/` — feature-local types
- Export all types, never `interface` (use `type` for consistency)

### Component style
- Named exports only — no default exports
- Props type inline or as `type Props = {}`
- Co-locate component + its CSS module if not using Tailwind utility classes

### Routing
Routes defined in `src/router/index.tsx`. Always lazy-load page components.

```tsx
{
  path: '/inventory',
  lazy: () => import('@/pages/InventoryPage').then(m => ({ Component: m.InventoryPage })),
}
```

---

## Adding a New Feature

1. Create `src/features/[feature-name]/` with subfolders: `components/`, `hooks/`, `services/`, `types/`, `index.ts`
2. Add API calls in `services/[feature].service.ts` (import from `@/services/api`)
3. Wrap queries in `hooks/use[Feature]Query.ts`
4. Build UI in `components/`
5. Create page in `src/pages/[Feature]Page.tsx` — just render the top-level feature component
6. Add route in `src/router/index.tsx`
7. Export public API from `index.ts`

---

## Environment Variables

All env vars must be prefixed `VITE_` to be exposed to the client.

```
VITE_API_URL=https://api.idms.example.com
```

Access via `import.meta.env.VITE_API_URL`.

---

## Import Order Convention

1. React
2. Third-party libs
3. `@/` aliased imports (components, hooks, utils)
4. Relative imports (same feature)
5. Types (use `import type`)
