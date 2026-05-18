# Component Conventions

## Rules

- Named exports only — no `export default`
- One component per file
- File name = component name (PascalCase)
- Props typed inline or as `type Props = {}`
- Tailwind for all styling — no inline styles

## UI Primitives (`src/components/ui/`)

Base building blocks: Button, Input, Select, Modal, Badge, Spinner, Card.
These have zero business logic. Accept `className` for override.

```tsx
// components/ui/Button.tsx
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  return <button className={cn(variants[variant], sizes[size], className)} {...props} />
}
```

## Common Components (`src/components/common/`)

App-aware shared components: PageHeader, DataTable, EmptyState, ErrorBoundary, ConfirmDialog.
May use hooks but stay feature-agnostic.

## Feature Components (`src/features/[name]/components/`)

Coupled to their feature. Import from own service/hooks. Never import across features directly — go through `@/features/[other]/index.ts`.

## Layouts (`src/layouts/`)

Wrap route outlets. Contain nav, sidebar, topbar. No data fetching — delegate to page/feature components.

```tsx
// layouts/DashboardLayout.tsx
export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

## cn() Utility

Use `clsx` + `tailwind-merge` for conditional classes.

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Loading & Error States

Every data-fetching component handles three states:

```tsx
const { data, isLoading, isError } = useXxxQuery()

if (isLoading) return <Spinner />
if (isError) return <ErrorState />
return <ActualUI data={data} />
```
