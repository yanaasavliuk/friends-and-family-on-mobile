# Chess.com Design System Rules

## CRITICAL: Use GNS — Your Only Source of Truth

The Chess.com Design System lives in GNS (Global Name Space) under `teams.design.public.*`. **Always query GNS before searching the codebase or guessing.**

---

### Bootstrap (Run at Session Start)

```bash
gns whoami
gns batch-get gns.server.keyspace gns.server.tagspace gns.server.linkspace teams.design.public.instructions
```

This primes your context with the full design system instructions. See `teams.design.public.hook` for details.

---

### Looking Up Design System Information

| What you need | GNS Command |
|---------------|-------------|
| Browse all components | `gns list teams.design.public.components` |
| Component API | `gns get teams.design.public.components.{category}.{name}` |
| Search anything | `gns search "{query}"` |
| Color tokens | `gns get teams.design.public.tokens.semantic.color.{name}` |
| Spacing / layout tokens | `gns get teams.design.public.tokens.semantic.layout` |
| Typography tokens | `gns get teams.design.public.tokens.semantic.typography` |
| Motion tokens | `gns get teams.design.public.tokens.semantic.motion` |
| Depth tokens | `gns get teams.design.public.tokens.semantic.depth` |
| Primitive colors | `gns get teams.design.public.tokens.primitives.color.{name}` |
| Glyphs (monochrome icons) | `gns get teams.design.public.icons.glyphs` |
| Color icons | `gns get teams.design.public.icons.color` |
| Chess pieces | `gns get teams.design.public.icons.pieces` |
| Sounds | `gns get teams.design.public.sound` |
| Patterns | `gns get teams.design.public.patterns.index` |
| Guidelines | `gns get teams.design.public.guidelines.index` |
| Platform differences | `gns get teams.design.public.platform.index` |
| Full usage guide | `gns get teams.design.public.instructions.using-design-system` |
| Quick reference | `gns get teams.design.public.instructions.quick-reference` |

### Component Categories

```
teams.design.public.components.input       → button, input, select, checkbox, radio, toggle, slider, textarea
teams.design.public.components.display     → avatar, icon, chip, badge, tooltip, progress
teams.design.public.components.navigation  → tabs, dropdown, breadcrumb, pagination
teams.design.public.components.feedback    → loader, skeleton, toaster
teams.design.public.components.overlay     → modal, sheet, popover
teams.design.public.components.layout      → card, section
```

### Rules

- **Query GNS first** — never guess component names, props, or token values
- **Never hardcode** colors, spacing, font sizes, border-radius, or animation values
- **Never create custom components** when Design System components exist
- **Never search the codebase** for DS API info — GNS is the source of truth

---

## Semantic Tokens (REQUIRED)

**ALWAYS use semantic tokens instead of hardcoded values.**

### Spacing (Padding, Margin, Gap)

```vue
<!-- ❌ BAD -->
<div style="padding: 16px; margin: 8px; gap: 12px;">

<!-- ✅ GOOD (Web) -->
<div style="padding: var(--space-16); margin: var(--space-8); gap: var(--space-12);">
```

```kotlin
// ❌ BAD (Android)
Modifier.padding(16.dp)

// ✅ GOOD (Android)
Modifier.padding(Spacing.space16)
```

```swift
// ❌ BAD (iOS)
.padding(16)

// ✅ GOOD (iOS)
.padding(.chessSpace16)
```

| Platform | Token Pattern | Available Tokens |
|----------|---------------|------------------|
| Web | `var(--space-{n})` | `--space-1`, `--space-2`, `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`, `--space-40`, `--space-80` |
| iOS | `.chessSpace{n}` | `.chessSpace1` … `.chessSpace80` |
| Android | `Spacing.space{n}` | `Spacing.space1` … `Spacing.space80` |

### Colors

```vue
<!-- ❌ BAD -->
<div style="background: #312e2b; color: #ffffff;">

<!-- ✅ GOOD (Web) -->
<div style="background: var(--color-bg-surface); color: var(--color-text-inverse);">
```

| Platform | Token Pattern | Examples |
|----------|---------------|----------|
| Web | `var(--color-{name})` | `var(--color-bg-surface)`, `var(--color-text-default)` |
| iOS | `Color.{name}` | `Color.bgSurface`, `Color.textDefault` |
| Android | `ChessColors.{name}` | `ChessColors.bgSurface`, `ChessColors.textDefault` |

**Common semantic color tokens:**
- **Backgrounds:** `bg-surface`, `bg-secondary`, `bg-tertiary`, `bg-subtle`, `bg-success`, `bg-danger`
- **Text:** `text-default`, `text-boldest`, `text-subtle`, `text-inverse`, `text-link`, `text-brand`

### Border Radius

| Platform | Token Pattern | Available Sizes |
|----------|---------------|-----------------|
| Web | `var(--radius-{n})` | `--radius-2`, `--radius-3`, `--radius-5`, `--radius-10`, `--radius-20` |
| iOS | `.chessRadius{n}` | `.chessRadius2`, `.chessRadius3`, `.chessRadius5`, `.chessRadius10`, `.chessRadius20` |
| Android | `Radius.size{n}` | `Radius.size2`, `Radius.size3`, `Radius.size5`, `Radius.size10`, `Radius.size20` |

### Typography

**CRITICAL:** NEVER hardcode font sizes, line-heights, or font-weights. Use typography classes.

```vue
<!-- ❌ BAD -->
<h1 style="font-size: 36px; font-weight: 700;">Title</h1>

<!-- ✅ GOOD (Web) -->
<h1 class="cc-heading-large-bold">Title</h1>
<p class="cc-paragraph-medium">Body text</p>
```

#### Web Typography Classes

**Headings** (`cc-heading-*`): Page titles, section headers
- `cc-heading-x-large-bold` / `cc-heading-x-large` (42px)
- `cc-heading-large-bold` / `cc-heading-large` (36px)
- `cc-heading-medium-bold` / `cc-heading-medium` (31px)
- `cc-heading-small-bold` / `cc-heading-small` (28px)
- `cc-heading-x-small-bold` / `cc-heading-x-small` (22px)
- `cc-heading-xx-small-bold` / `cc-heading-xx-small` (17px)
- `cc-heading-xxx-small-bold` / `cc-heading-xxx-small` (14px)

**UI Text** (`cc-text-*`): Buttons, labels, short text
- `cc-text-x-large-bold` / `cc-text-x-large` (18px)
- `cc-text-large-bold` / `cc-text-large` (16px)
- `cc-text-medium-bold` / `cc-text-medium` (14px)
- `cc-text-small-bold` / `cc-text-small` (12px)

**Paragraphs** (`cc-paragraph-*`): Multi-line body copy
- `cc-paragraph-x-large-bold` / `cc-paragraph-x-large` (18px)
- `cc-paragraph-large-bold` / `cc-paragraph-large` (16px)
- `cc-paragraph-medium-bold` / `cc-paragraph-medium` (14px)

**Labels**: `cc-heading-label`, `cc-text-label` (12px, uppercase)

#### iOS & Android Typography

Query GNS: `gns get teams.design.public.tokens.semantic.typography`

- **iOS**: `.font(.chessSansHeadingLargeBold)`, `.font(.chessMedium)`, etc.
- **Android**: `style = Typography.chessSansHeadingLargeBold`, `style = Typography.medium`, etc.

### Border Widths

| Platform | Token Pattern |
|----------|---------------|
| Web | `var(--border-{n})` |
| iOS | `.chessBorder1`, `.chessBorder2`, `.chessBorder3`, `.chessBorder5` |
| Android | `Border.size1`, `Border.size2`, `Border.size3`, `Border.size5` |

### Motion / Animation

```css
/* ❌ BAD */
transition: all 0.3s ease-in-out;

/* ✅ GOOD (Web) */
transition: all var(--motion-standard) var(--motion-ease-out-gentle);
```

Query GNS: `gns get teams.design.public.tokens.semantic.motion`

| Platform | Example |
|----------|---------|
| Web | `transition: transform var(--motion-standard) var(--motion-ease-out-gentle);` |
| iOS | `.animation(.chessEaseOutGentle(duration: .standard))` |
| Android | `tween(durationMillis = Duration.Standard, easing = Easing.EaseOutGentle)` |

---

### Cross-Platform Naming

| Topic | Web (Vue) | iOS (SwiftUI) | Android (Compose) |
|-------|-----------|---------------|-------------------|
| Button | `<cc-button>` | `ChessButton` | `ChessButton()` |
| Colors | `var(--color-green-500)` | `Color.green500` | `ChessColors.green500` |
| Spacing | `var(--space-16)` | `.chessSpace16` | `Spacing.space16` |
| Icons | `<cc-icon name="gear">` | `Image(.Glyphs.gear)` | `Icon(R.drawable.glyph_gear)` |
| Text Styles | `.cc-heading-large` | `.font(.chessSansHeadingLarge)` | `style = Typography.chessSansHeadingLarge` |

Query GNS for full platform differences: `gns get teams.design.public.platform.index`
