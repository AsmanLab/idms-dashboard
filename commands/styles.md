# Global Styles — Design System

Extracted from Jewellery Dashboard UI. All tokens live in `src/styles/globals.css`.
Tailwind v4 uses `@theme` directive — no `tailwind.config.js` needed.

---

## Color Palette

### Neutrals & Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-canvas` | `#EEC5A8` | Outer app background (peach/salmon) |
| `--color-bg-surface` | `#F8F7F4` | Main dashboard panel background |
| `--color-bg-card` | `#FFFFFF` | Card / panel background |
| `--color-bg-input` | `#F5F4F1` | Input / field background |
| `--color-border` | `#EEEDE9` | Card borders, dividers |
| `--color-border-subtle` | `#F0EEE9` | Subtle separators |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#1C1917` | Headings, values, strong labels |
| `--color-text-secondary` | `#6B6560` | Sub-labels, metadata |
| `--color-text-muted` | `#A8A29E` | Placeholder, hint text |
| `--color-text-inverse` | `#FFFFFF` | Text on dark/colored surfaces |

### Stat Card Backgrounds (pastel)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-card-amber` | `#E9C97C` | Total Sales card |
| `--color-card-periwinkle` | `#9B9FD4` | Total Making card |
| `--color-card-mauve` | `#BEA0D0` | Today's Sales card |
| `--color-card-peach` | `#F2B8A2` | Order not Initiated card |
| `--color-card-rose` | `#F0A0BA` | Delayed Job Orders card |
| `--color-card-blush` | `#F2AABB` | Jobs on Hold card |

### Accent / Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent-purple` | `#9B7FD4` | Progress bars, active nav, links |
| `--color-accent-pink` | `#F472B6` | Week badge, highlight tags |
| `--color-accent-green` | `#86EFAC` | Positive delta indicators |
| `--color-accent-red` | `#FCA5A5` | Negative delta, error states |

### Badge / Tag Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-badge-inventory-bg` | `#E0D9F8` | Inventory tag background |
| `--color-badge-inventory-text` | `#6B4FCC` | Inventory tag text |
| `--color-badge-order-bg` | `#FFE4CC` | Custom Order tag background |
| `--color-badge-order-text` | `#C2681A` | Custom Order tag text |
| `--color-badge-maintenance-bg` | `#FFD6E0` | Maintenance tag background |
| `--color-badge-maintenance-text` | `#C0394B` | Maintenance tag text |

---

## Typography

Font: **DM Sans** (primary) — clean, modern, geometric sans-serif matching the UI feel.
Fallback: `system-ui, -apple-system, sans-serif`.

```css
/* Install: npm install @fontsource/dm-sans */
@import '@fontsource/dm-sans/400.css';
@import '@fontsource/dm-sans/500.css';
@import '@fontsource/dm-sans/700.css';
```

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 28px | 700 | 1.2 | Stat card values ($1,284) |
| `text-title` | 18px | 600 | 1.3 | Section titles (Business Summary) |
| `text-body` | 14px | 400 | 1.5 | Body text, descriptions |
| `text-label` | 12px | 500 | 1.4 | Labels above values |
| `text-caption` | 11px | 400 | 1.4 | Timestamps, minor metadata |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-card` | `20px` | Main cards, panels |
| `--radius-stat` | `16px` | Stat cards inside Business Summary |
| `--radius-badge` | `999px` | Pill badges (+30% week, Inventory) |
| `--radius-btn` | `12px` | Action buttons |
| `--radius-avatar` | `999px` | Avatar circles |
| `--radius-input` | `10px` | Form inputs |
| `--radius-icon-btn` | `10px` | Icon-only action buttons |

---

## Spacing Scale

Uses Tailwind's default 4px base. Key layout values:

| Name | Value | Usage |
|------|-------|-------|
| `gap-card` | `12px` | Gap between stat cards |
| `gap-section` | `16px` | Gap between sections |
| `p-card` | `20px` | Card inner padding |
| `p-stat-card` | `20px 20px 16px` | Stat card padding |
| `p-page` | `28px` | Page outer padding |

---

## Shadows

```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
--shadow-panel: 0 8px 32px rgba(0,0,0,0.08);
--shadow-dropdown: 0 10px 24px rgba(0,0,0,0.10);
```

---

## globals.css — Full Token File

`src/styles/globals.css` — imported in `src/index.css`.

```css
@import "tailwindcss";
@import "./styles/globals.css";
```

```css
/* src/styles/globals.css */

@theme {
  /* Surfaces */
  --color-bg-canvas: #EEC5A8;
  --color-bg-surface: #F8F7F4;
  --color-bg-card: #FFFFFF;
  --color-bg-input: #F5F4F1;

  /* Borders */
  --color-border: #EEEDE9;
  --color-border-subtle: #F0EEE9;

  /* Text */
  --color-text-primary: #1C1917;
  --color-text-secondary: #6B6560;
  --color-text-muted: #A8A29E;
  --color-text-inverse: #FFFFFF;

  /* Stat cards */
  --color-card-amber: #E9C97C;
  --color-card-periwinkle: #9B9FD4;
  --color-card-mauve: #BEA0D0;
  --color-card-peach: #F2B8A2;
  --color-card-rose: #F0A0BA;
  --color-card-blush: #F2AABB;

  /* Accents */
  --color-accent-purple: #9B7FD4;
  --color-accent-pink: #F472B6;
  --color-accent-green: #86EFAC;
  --color-accent-red: #FCA5A5;

  /* Badges */
  --color-badge-inventory-bg: #E0D9F8;
  --color-badge-inventory-text: #6B4FCC;
  --color-badge-order-bg: #FFE4CC;
  --color-badge-order-text: #C2681A;
  --color-badge-maintenance-bg: #FFD6E0;
  --color-badge-maintenance-text: #C0394B;

  /* Radius */
  --radius-card: 20px;
  --radius-stat: 16px;
  --radius-badge: 9999px;
  --radius-btn: 12px;
  --radius-avatar: 9999px;
  --radius-input: 10px;
  --radius-icon-btn: 10px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-panel: 0 8px 32px rgba(0,0,0,0.08);
  --shadow-dropdown: 0 10px 24px rgba(0,0,0,0.10);

  /* Font */
  --font-sans: 'DM Sans', system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg-canvas);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Tailwind Usage Examples

```tsx
// Stat card
<div className="rounded-[var(--radius-stat)] bg-[var(--color-card-amber)] p-5 shadow-[var(--shadow-card)]">

// Badge
<span className="rounded-[var(--radius-badge)] bg-[var(--color-badge-inventory-bg)] text-[var(--color-badge-inventory-text)] px-3 py-1 text-xs font-medium">

// Card panel
<div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-panel)] p-5">

// Text hierarchy
<p className="text-[28px] font-bold text-[var(--color-text-primary)]">  // display
<p className="text-sm font-medium text-[var(--color-text-secondary)]">  // label
<p className="text-xs text-[var(--color-text-muted)]">                  // caption
```

---

## Nav Bar

- Background: `--color-bg-card` (white)
- Active tab: dark pill `bg-[#1C1917]` text `text-white`, `rounded-[var(--radius-badge)]`
- Inactive tabs: `text-[var(--color-text-secondary)]`
- Right icons: `text-[var(--color-text-secondary)]` with `hover:text-[var(--color-text-primary)]`

## Customer Profile Card (right panel)

- Avatar: 80px circle, `rounded-[var(--radius-avatar)]`
- Action icon buttons: 36px, `rounded-[var(--radius-icon-btn)]`, `bg-[var(--color-bg-input)]`
- Detail rows: bordered bottom `border-b border-[var(--color-border)]`, label 11px muted, value 14px primary

## Progress Bars

- Track: `bg-[var(--color-border)]` height `6px` rounded full
- Fill: `bg-[var(--color-accent-purple)]` or `bg-[var(--color-card-rose)]`
- Thumb/handle: white circle with drop shadow
