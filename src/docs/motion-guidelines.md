# Chess.com Motion Design Tokens

Reference extracted from the official Figma Motion Tokens file.

## Easing Curves

| Token Name | Bezier Curve | Description |
|---|---|---|
| linear | (0, 0, 1, 1) | Constant speed |
| ease-in-gentle | (0.4, 0, 1, 1) | Soft acceleration |
| ease-in-strong | (0.8, 0, 1, 1) | Sharp acceleration |
| ease-in-dramatic | (0.55, 0, 1, 0.45) | Rapid acceleration |
| **ease-out-gentle** | **(0, 0, 0.2, 1)** | Default curve, soft deceleration |
| **ease-out-strong** | **(0, 0, 0.4, 1)** | Smooth landing |
| ease-out-dramatic | (0.2, 1, 0.3, 1) | Quick start, soft finish |
| ease-out-harsh | (0, 0.55, 0.45, 1) | Quick start, strong deceleration |
| ease-out-abrupt | (0, 0, 0, 1) | Instant explosion, used for confetti |
| ease-in-out-gentle | (1, 0.1, 0.4, 1) | Dramatic acceleration and deceleration |
| ease-in-out-strong | (0.5, 0, 0.6, 1) | Balanced acceleration and deceleration |
| ease-in-out-dramatic | (0.7, 0.2, 0, 0.8) | Steep acceleration with a slow start and finish |

## Duration Tokens

| Token Name | Duration | Use Case |
|---|---|---|
| instant | 0ms | State changes, immediate feedback |
| snappy | 50ms | Hover effects, button presses |
| faster | 100ms | Toggles, checkboxes, micro-interactions |
| fast | 150ms | Dropdowns, tooltips, tab switches |
| standard | 200ms | Accordion panels, card flips |
| moderate | 250ms | Modal entrances, sidebar slides |
| steady | 300ms | Expanding accordions and dropdowns |
| slow | 400ms | Text animations |
| slower | 500ms | Complex transforms |
| crawl | 800ms | Lingering effects |

## Distance Tokens

| Token Name | Value | Description |
|---|---|---|
| distance-p-10 | 10% | Relative value - 10% of target element |
| distance-p-25 | 25% | Relative value - 25% of target element |
| distance-p-33 | 33% | Relative value - 33% of target element |
| distance-p-50 | 50% | Relative value - 50% of target element |
| distance-p-66 | 66% | Relative value - 66% of target element |
| distance-p-75 | 75% | Relative value - 75% of target element |
| distance-p-100 | 100% | Relative value - 100% of target element |

## Animation Primitives

All primitives default to `ease-out-strong (0, 0, 0.4, 1)` with `faster 100ms`.

### fade-in / fade-out
- **Curve**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration**: faster 100ms
- Use when an element needs to appear or disappear entirely (0 → 100% opacity or vice versa).

### move
- **Curve**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration**: faster 100ms
- **Distance**: Use space tokens for fixed, distance tokens for relative
- Use when you need to change the position of an element in any direction.

### slide-in / slide-out
- **Curve**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration**: faster 100ms
- Combines fade-in/out and move. Limited to single axis (x or y).

### grow / shrink
- **Curve**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration**: faster 100ms
- **Amount**: Percentage (e.g. 150% to grow, 50% to shrink)
- **Direction**: horizontal (x), vertical (y), or uniform (x and y)
- **Origin**: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right

### change-color
- **Curve**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration**: faster 100ms
- Use when you need to change the color of an element (uses color tokens for start/end).

### pulse
- **Curve-in**: ease-out-strong `(0, 0, 0.4, 1)`
- **Curve-out**: ease-out-strong `(0, 0, 0.4, 1)`
- **Duration-in/out**: moderate 250ms
- **Frequency**: 1000ms (default)
- Combines grow/shrink and change-color in a repeating loop.

## Token Taxonomy (File Naming)

Pattern: `category-descriptor-variant.ext`

- **Category**: Prefix for grouping (product/feature name, animation type, or broad category like "ui")
- **Descriptor**: Concise name for what the animation does
- **Variant** (optional): Suffix for different versions
- **Extension**: `.json` / `.lottie` for Lottie, `.riv` for Rive

Examples: `celebration-confetti-white.json`, `gameReview-moveCallout-brilliant.json`, `ui-loadingSpinner.json`

## CSS Usage

```css
/* Standard animation primitive */
animation: myAnimation 0.1s cubic-bezier(0, 0, 0.4, 1) both;

/* Hover/interactive feedback */
transition: background 0.05s cubic-bezier(0, 0, 0.2, 1);

/* Hero entrance (use standard 200ms for complex multi-element sequences) */
animation: iconAppear 0.2s cubic-bezier(0, 0, 0.4, 1) both;

/* Choreography via stagger delays, not longer durations */
animation: sparkle 0.1s 0.25s cubic-bezier(0, 0, 0.4, 1) both;
```
