# Chess.com Design System Starter

A ready-to-use Vue 3 + TypeScript + Vite starter project with the Chess.com Design System pre-configured.

## Features

- ✅ **Vue 3** with Composition API and `<script setup>`
- ✅ **TypeScript** for type safety
- ✅ **Vite** for fast development and optimized builds
- ✅ **Chess.com Design System** (`@chesscom/design-system`) pre-installed
- ✅ **Dark Mode** configured by default
- ✅ **Design System CSS** imported in correct order
- ✅ **Cursor Rules** for Design System GNS integration
- ✅ **Cloudflare Workers** deployment with `wrangler` configured
- ✅ **Font-size reset** (1rem = 10px) configured
- ✅ **Global window objects** (`window.chesscom`, `window.context`) initialized

## Quick Start

### 1. Clone This Repository

```bash
git clone <your-repo-url>
cd starter-project
```

### 2. Install Dependencies

```bash
npm install
```

**Note**: You'll need to configure npm for GitHub Packages first. See [Setup Instructions](#setup-instructions) below.

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your app.

## Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **GitHub account** with access to `@chesscom/design-system` package
- **Cursor** (optional, for GNS integration)
- **GNS CLI** (optional, for Design System lookups)

### Configure npm for GitHub Packages

The `@chesscom/design-system` package is hosted on GitHub Packages and requires authentication.

> **🚨 CRITICAL**: Both commands below write to your **global** `~/.npmrc` file. This is required for:
> - Installing dependencies with `npm install`
> - Running the MCP server in Cursor (which executes outside your project directory)
>
> You need BOTH the registry scope mapping AND the auth token in `~/.npmrc`.

**Option 1: Using GitHub CLI (Recommended)**

```bash
# Ensure gh is authenticated
gh auth refresh -h github.com -s read:packages

# Add GitHub Packages registry scope mapping (required!)
echo "@chesscom:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Add authentication token
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

**Option 2: Using Personal Access Token**

1. Create a token at [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Select `read:packages` scope
3. Add to `~/.npmrc`:

```bash
echo "@chesscom:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
```

**Verify it works:**

```bash
npm view @chesscom/design-system
```

### Query Design System via GNS (Optional)

The Design System knowledge lives in GNS under `teams.design.public.*`. If you have GNS CLI installed, bootstrap your session and query anything:

```bash
# Bootstrap
gns whoami
gns batch-get gns.server.keyspace gns.server.tagspace gns.server.linkspace teams.design.public.instructions

# Look things up
gns get teams.design.public.instructions.quick-reference
gns get teams.design.public.components.input.button
gns search "modal"
gns get teams.design.public.tokens.semantic.layout
gns get teams.design.public.icons.pieces
```

The Cursor rules in `.cursor/rules/design-system.md` are already configured and include all token values and coding guidelines inline.

## What's Configured

### Design System Setup

This starter includes all critical Design System configuration:

#### ✅ 1. Globals in `index.html`
```html
<script>
  window.chesscom = window.chesscom || { features: [], settings: {} };
  window.context = window.context || {};
</script>
```

#### ✅ 2. Dark Mode Class
```html
<body class="dark-mode">
```

#### ✅ 3. CSS Imports in `src/main.ts`
```typescript
import '@chesscom/design-system/dist/variables.css'
import '@chesscom/design-system/dist/cc-utils.css'
import '@chesscom/design-system/dist/style.css'
```

#### ✅ 4. Font-size Reset in `src/App.vue`
```css
html {
  font-size: 62.5%; /* 1rem = 10px */
}
```

#### ✅ 5. Design System Context Provider
```typescript
provideDesignSystem(app, {
  features: [],
  routes: { /* ... */ },
  trans: { /* ... */ },
})
```

#### ✅ 6. Base Body Styles
```css
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-default);
  font-family: var(--font-family-system);
}
```

## Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run deploy           # Deploy to Cloudflare Workers (production)
npm run deploy:preview   # Deploy to Cloudflare Workers (preview)
```

## Project Structure

```
starter-project/
├── .cursor/
│   └── rules/
│       └── design-system.md    # Cursor rules for GNS
├── .github/
│   └── workflows/
│       └── deploy.yml          # Cloudflare Workers deployment
├── src/
│   ├── App.vue                 # Main app component
│   └── main.ts                 # Entry point with DS setup
├── index.html                  # HTML with globals
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── wrangler.toml               # Cloudflare Workers config
├── tsconfig.json               # TypeScript config
└── README.md                   # This file
```

## Using Design System Components

Import components from `@chesscom/design-system`:

```vue
<script setup lang="ts">
import { CcButton, CcIcon, CcCard } from '@chesscom/design-system'
</script>

<template>
  <CcCard>
    <h2 class="cc-heading-small">Hello World</h2>
    <p class="cc-paragraph-medium">This is a card component.</p>
    <CcButton variant="primary">Click Me</CcButton>
    <CcIcon name="gear" variant="glyph" />
  </CcCard>
</template>
```

### Typography Utility Classes

Instead of hardcoding styles, use Design System utility classes:

```vue
<h1 class="cc-heading-large-bold">Page Title</h1>
<p class="cc-paragraph-medium">Body text</p>
<span class="cc-text-small">Small text</span>
```

### Design Tokens

Use CSS custom properties for colors, spacing, and other design tokens:

```css
.my-component {
  background: var(--color-bg-secondary);
  color: var(--color-text-default);
  padding: var(--space-16);
  border-radius: var(--radius-medium);
  gap: var(--space-8);
}
```

## Deploying to Cloudflare Workers

Deployment to Cloudflare Workers happens automatically via GitHub Actions:

- **Production deploys**: When you push to the `main` branch
- **Preview deploys**: When you push to a pull request branch

### Deploy

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy your site to Cloudflare Workers.

## Advanced Setup (Optional)

For a complete guided setup including GitHub Pages deployment, see:

**[AI-AGENT-COMPLETE-SETUP.md](./AI-AGENT-COMPLETE-SETUP.md)**

This guide walks through:
- Installing prerequisites (Node.js, Git, GitHub CLI)
- Creating and configuring GitHub repository
- Verifying GNS access
- Deploying to GitHub Pages
- Complete verification checklist

## Troubleshooting

### Components Look Too Large
- **Cause**: Missing font-size reset
- **Fix**: Verify `html { font-size: 62.5% }` is in App.vue

### Colors Look Wrong
- **Cause**: Missing dark-mode class
- **Fix**: Verify `<body class="dark-mode">` in index.html

### "design system data not found" Error
- **Cause**: Missing design system context
- **Fix**: Verify `provideDesignSystem()` is called in main.ts

### npm Install Fails with 404
- **Cause**: GitHub Packages registry not configured in global `~/.npmrc`
- **Most common issue**: Auth token is present but registry scope mapping is missing
- **Fix**:
  ```bash
  # Ensure BOTH lines are in ~/.npmrc (not project .npmrc)
  npm config set @chesscom:registry https://npm.pkg.github.com
  grep -E "@chesscom:registry|npm.pkg.github.com/:_authToken" ~/.npmrc
  ```
- **Full setup**: See [Setup Instructions](#configure-npm-for-github-packages)

## Documentation

- **Design System (GNS)**: `gns get teams.design.public.instructions.quick-reference`
- **Cursor Rules**: `.cursor/rules/design-system.md` — token values, coding standards, GNS commands
- **Vue 3 Docs**: https://vuejs.org/
- **Vite Docs**: https://vitejs.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/

## License

This starter template is provided as-is for internal Chess.com development.
