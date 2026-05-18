# Command: Add New Feature

Use this doc when scaffolding any new feature module.

## Checklist

- [ ] Create `src/features/[name]/` with all subfolders
- [ ] Add service file with typed API calls
- [ ] Add query/mutation hooks
- [ ] Build feature components
- [ ] Create thin page in `src/pages/`
- [ ] Register route in `src/router/index.tsx`
- [ ] Export public API via `index.ts`

---

## Scaffold Template

Replace `[Name]` with PascalCase feature name, `[name]` with kebab-case.

### 1. Types — `features/[name]/types/[name].types.ts`

```ts
export type [Name] = {
  id: string
  // ...
}

export type [Name]Filters = {
  // ...
}
```

### 2. Service — `features/[name]/services/[name].service.ts`

```ts
import api from '@/services/api'
import type { [Name], [Name]Filters } from '../types/[name].types'

export const [name]Service = {
  getAll: (filters: [Name]Filters) =>
    api.get<[Name][]>('/[name]', { params: filters }).then((r) => r.data),

  getById: (id: string) =>
    api.get<[Name]>(`/[name]/${id}`).then((r) => r.data),

  create: (payload: Omit<[Name], 'id'>) =>
    api.post<[Name]>('/[name]', payload).then((r) => r.data),

  update: (id: string, payload: Partial<[Name]>) =>
    api.patch<[Name]>(`/[name]/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/[name]/${id}`),
}
```

### 3. Hooks — `features/[name]/hooks/use[Name]Query.ts`

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { [name]Service } from '../services/[name].service'
import type { [Name]Filters } from '../types/[name].types'

const QUERY_KEY = '[name]' as const

export function use[Name]Query(filters: [Name]Filters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => [name]Service.getAll(filters),
  })
}

export function useCreate[Name]() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: [name]Service.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
```

### 4. Component — `features/[name]/components/[Name]List.tsx`

```tsx
import { use[Name]Query } from '../hooks/use[Name]Query'

export function [Name]List() {
  const { data, isLoading } = use[Name]Query({})

  if (isLoading) return <div>Loading…</div>

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.id}</li>
      ))}
    </ul>
  )
}
```

### 5. Barrel — `features/[name]/index.ts`

```ts
export { [Name]List } from './components/[Name]List'
// export only what other features or pages need
```

### 6. Page — `src/pages/[Name]Page.tsx`

```tsx
import { [Name]List } from '@/features/[name]'

export function [Name]Page() {
  return (
    <main className="p-8">
      <[Name]List />
    </main>
  )
}
```

### 7. Route — `src/router/index.tsx`

```tsx
{
  path: '/[name]',
  lazy: () =>
    import('@/pages/[Name]Page').then((m) => ({ Component: m.[Name]Page })),
}
```

---

## State (Zustand) — only when needed

Only add a Zustand store slice if the feature has persistent UI state (selected rows, open panels, filters that survive navigation).

```ts
// features/[name]/store/[name].store.ts
import { create } from 'zustand'

type [Name]State = {
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export const use[Name]Store = create<[Name]State>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}))
```
