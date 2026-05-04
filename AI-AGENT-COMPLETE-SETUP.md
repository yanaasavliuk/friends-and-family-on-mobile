# AI Agent Setup Guide

> **For AI Agents**: This guide provides step-by-step instructions for completing the setup of this Chess.com Design System starter project after the user has cloned it.

## Overview

This project is **pre-configured** with:
- Vue 3 + TypeScript + Vite
- Design System package in `package.json`
- Properly configured `index.html`, `main.ts`, and `App.vue`
- Cursor rules in `.cursor/rules/design-system.md`
- GitHub Pages deployment workflow in `.github/workflows/deploy.yml`

**What still needs to be done:**
1. Install npm dependencies
2. Configure npm for GitHub Packages (if not already done)
3. Optionally: Set up git repository and GitHub remote
4. Optionally: Configure MCP server in Cursor
5. Optionally: Deploy to GitHub Pages

---

## Step 1: Verify Project Directory

```bash
# Check current directory
pwd

# Verify this is the starter project
ls -la

# Expected files:
# - package.json (with @chesscom/design-system)
# - index.html
# - src/main.ts
# - src/App.vue
# - .cursor/rules/design-system.md
# - AI-AGENT-COMPLETE-SETUP.md (this file)
```

**Checkpoint**: User is in the correct directory ✓

---

## Step 2: Configure npm for GitHub Packages

Check if npm is already configured for GitHub Packages:

```bash
# Check if GitHub Packages registry is configured
if grep -q "@chesscom:registry=https://npm.pkg.github.com" ~/.npmrc 2>/dev/null; then
  echo "✓ GitHub Packages registry already configured"
else
  echo "✗ GitHub Packages registry not configured - will configure now"
fi

# Check if authentication token exists
if grep -q "//npm.pkg.github.com/:_authToken" ~/.npmrc 2>/dev/null; then
  echo "✓ GitHub authentication token found"
else
  echo "✗ GitHub authentication token not found - will configure now"
fi
```

**If not configured, set it up:**

### Option A: Using GitHub CLI (Recommended)

```bash
# Check if gh is installed
if command -v gh >/dev/null 2>&1; then
  echo "✓ GitHub CLI found"
  
  # Ensure authenticated with read:packages scope
  gh auth refresh -h github.com -s read:packages
  
  # Add registry configuration
  if ! grep -q "@chesscom:registry=https://npm.pkg.github.com" ~/.npmrc 2>/dev/null; then
    echo "@chesscom:registry=https://npm.pkg.github.com" >> ~/.npmrc
  fi
  
  # Add authentication token
  sed -i.bak '/^\/\/npm.pkg.github.com\/:_authToken/d' ~/.npmrc 2>/dev/null || true
  echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
  
  echo "✓ GitHub Packages authentication configured"
else
  echo "✗ GitHub CLI not installed"
  echo "  Please install: brew install gh (macOS) or see https://cli.github.com/"
  echo "  Or use Option B (Personal Access Token) below"
fi
```

### Option B: Using Personal Access Token

If GitHub CLI is not available, inform the user:

```
GitHub CLI is not installed. To configure npm authentication manually:

1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select "read:packages" scope
   - Copy the token

2. Run these commands with your token:
   echo "@chesscom:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc

Then tell me when you're ready to continue.
```

**Verify it works:**

```bash
npm view @chesscom/design-system version --registry=https://npm.pkg.github.com
# Should show version number (e.g., "0.21.0")
```

**Checkpoint**: npm authenticated with GitHub Packages ✓

---

## Step 3: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify Design System package installed
if [ -d node_modules/@chesscom/design-system ]; then
  echo "✓ Design System package installed"
else
  echo "✗ Design System package not found"
  echo "  Check npm authentication (Step 2)"
fi
```

**Checkpoint**: Dependencies installed ✓

---

## Step 4: Test Local Development

```bash
# Test that the project builds
npm run build

if [ -d dist ]; then
  echo "✓ Build successful"
else
  echo "✗ Build failed - check errors above"
fi
```

**If build succeeds, start dev server:**

```bash
# This will start the dev server
# Tell the user: "Dev server starting at http://localhost:5173"
npm run dev
```

**Checkpoint**: Project runs locally ✓

---

## Step 5: Configure Git (Optional)

If the user wants to push to GitHub:

```bash
# Check if git is initialized
if [ -d .git ]; then
  echo "✓ Git repository already initialized"
else
  echo "Initializing git repository..."
  git init
  echo "✓ Git initialized"
fi

# Check for remote
if git remote get-url origin >/dev/null 2>&1; then
  REPO_URL=$(git remote get-url origin)
  echo "✓ Git remote configured: $REPO_URL"
else
  echo "No git remote configured."
  echo "Would you like to create a GitHub repository and push this project?"
  echo ""
  echo "If yes, I can:"
  echo "  1. Create a new GitHub repository"
  echo "  2. Push your code"
  echo "  3. Set up GitHub Pages deployment"
  echo ""
  echo "Tell me if you'd like to proceed with GitHub setup."
fi
```

**If user wants GitHub setup, continue to Step 6. Otherwise, skip to Step 7.**

---

## Step 6: GitHub Repository Setup (Optional)

Only perform this if the user explicitly asks to push to GitHub.

### A. Create GitHub Repository

```bash
# Get project name
PROJECT_NAME=$(basename "$(pwd)")

echo "Creating GitHub repository: $PROJECT_NAME"

# Create public repository (required for free GitHub Pages)
gh repo create "$PROJECT_NAME" --public --source=. --remote=origin

if [ $? -eq 0 ]; then
  echo "✓ GitHub repository created"
  
  # Get repository info
  REPO_URL=$(git remote get-url origin)
  OWNER=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')
  
  echo "  Repository: https://github.com/$OWNER/$PROJECT_NAME"
else
  echo "✗ Failed to create GitHub repository"
  echo "  Make sure gh CLI is authenticated: gh auth login"
fi
```

### B. Create GitHub Packages Token Secret

For GitHub Pages deployment, the workflow needs a token with `read:packages` access:

```
To deploy to GitHub Pages, you need to add a secret to your repository:

1. Go to: https://github.com/settings/tokens
2. Create a new token with "read:packages" scope
3. Copy the token
4. Go to your repository: Settings > Secrets and variables > Actions
5. Click "New repository secret"
6. Name: GH_PACKAGES_TOKEN
7. Value: [paste your token]
8. Click "Add secret"

Tell me when you've added the secret and I'll continue with deployment.
```

### C. Enable GitHub Pages

```bash
# Enable GitHub Pages via API
gh api --method POST repos/:owner/:repo/pages \
  -f build_type='workflow' 2>/dev/null || echo "Pages may already be enabled"

echo ""
echo "GitHub Pages enabled. To verify:"
echo "  1. Go to: https://github.com/$OWNER/$PROJECT_NAME/settings/pages"
echo "  2. Verify 'Source' is set to 'GitHub Actions'"
echo ""
```

### D. Create Initial Commit and Push

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Vue + Chess.com Design System

- Set up Vue 3 with Vite and TypeScript
- Install @chesscom/design-system package
- Configure MCP server and Cursor rules
- Add GitHub Pages deployment workflow
- Include comprehensive setup documentation"

echo "✓ Initial commit created"

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
  echo "✓ Pushed to GitHub"
  echo ""
  echo "Deployment starting! Check the Actions tab:"
  echo "  https://github.com/$OWNER/$PROJECT_NAME/actions"
  echo ""
  
  # Wait a moment and show deployment status
  sleep 5
  gh run list --limit 1
  
  echo ""
  echo "Your site will be available at:"
  echo "  https://$OWNER.github.io/$PROJECT_NAME/"
  echo ""
  echo "It may take 1-2 minutes for the first deployment to complete."
else
  echo "✗ Failed to push to GitHub"
fi
```

**Checkpoint**: Code pushed to GitHub and deploying ✓

---

## Step 7: Verify GNS Access (Optional)

The Design System uses GNS (Global Name Space) as its source of truth. If the user has GNS CLI installed, they can look up any Design System information directly.

```bash
# Check if GNS CLI is available
if command -v gns >/dev/null 2>&1; then
  echo "✓ GNS CLI found"

  # Verify authentication
  gns whoami

  # Bootstrap design system context
  gns batch-get gns.server.keyspace gns.server.tagspace gns.server.linkspace teams.design.public.instructions

  echo "✓ GNS connected — Design System knowledge available"
else
  echo "ℹ GNS CLI not installed — Design System info is available in .cursor/rules/design-system.md"
fi
```

**If authenticated, the agent can query:**
```bash
gns get teams.design.public.instructions.quick-reference    # Quick lookup table
gns get teams.design.public.components.input.button         # Component APIs
gns search "modal"                                           # Search anything
gns get teams.design.public.tokens.semantic.layout          # Spacing tokens
```

**Checkpoint**: GNS access verified (optional) ✓

---

## Step 8: Final Verification

Run complete verification:

```bash
echo ""
echo "========================================="
echo "Setup Verification"
echo "========================================="
echo ""

CHECKS_PASSED=0
CHECKS_TOTAL=8

echo -n "1. npm configured for GitHub Packages... "
grep -q "@chesscom:registry" ~/.npmrc && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗"

echo -n "2. Dependencies installed... "
[ -d node_modules ] && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗"

echo -n "3. Design System package installed... "
[ -d node_modules/@chesscom/design-system ] && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗"

echo -n "4. Project builds successfully... "
[ -d dist ] && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗"

echo -n "5. Git repository initialized... "
[ -d .git ] && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗ (optional)"

echo -n "6. Git remote configured... "
git remote get-url origin >/dev/null 2>&1 && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗ (optional)"

echo -n "7. GNS CLI available... "
command -v gns >/dev/null 2>&1 && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗ (optional)"

echo -n "8. Cursor rules present... "
[ -f .cursor/rules/design-system.md ] && echo "✓" && CHECKS_PASSED=$((CHECKS_PASSED + 1)) || echo "✗"

echo ""
echo "Verification: $CHECKS_PASSED/$CHECKS_TOTAL checks passed"
echo ""
```

---

## Success! What's Next?

Tell the user:

```
========================================
✅ SETUP COMPLETE!
========================================

Your Chess.com Design System starter project is ready!

📁 Project Directory: $(pwd)

Local Development:
------------------
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

Using the Design System:
------------------------
- Import components: import { CcButton, CcIcon } from '@chesscom/design-system'
- Use typography classes: cc-heading-large-bold, cc-paragraph-medium, etc.
- Use design tokens: var(--color-bg-primary), var(--space-16), etc.

Design System (via GNS):
------------------------
- gns get teams.design.public.instructions.quick-reference
- gns get teams.design.public.components.input.button
- gns search "modal"
- gns get teams.design.public.tokens.semantic.layout

Documentation:
--------------
- README.md - Complete project documentation
- .cursor/rules/design-system.md - Cursor rules (already configured)
- node_modules/@chesscom/design-system-mcp/ - MCP documentation

[IF GITHUB WAS SET UP]
GitHub Repository:
------------------
🔗 https://github.com/[OWNER]/[REPO]
🌐 https://[OWNER].github.io/[REPO]/ (deploying now...)
⚡ Actions: https://github.com/[OWNER]/[REPO]/actions

Future Updates:
---------------
git add .
git commit -m "Your changes"
git push                # Automatically deploys to GitHub Pages

Happy coding! 🚀
```

---

## Troubleshooting

### Build Fails with "Cannot find module @chesscom/design-system"
- **Cause**: npm not authenticated or package not installed
- **Fix**: Re-run Step 2 (Configure npm) and Step 3 (Install dependencies)

### Components Look Too Large
- **Cause**: Already configured correctly in this starter
- **Note**: This starter includes the font-size reset, so components should be correct size

### Colors Look Wrong
- **Cause**: Already configured correctly in this starter
- **Note**: This starter includes `dark-mode` class in index.html

### MCP Not Working
- **Cause**: Cursor not restarted or MCP not configured
- **Fix**: Verify Step 7 and **completely quit and reopen Cursor** (not just reload)

### GitHub Pages Shows 404
- **Cause**: Deployment not complete or Pages not enabled
- **Fix**: Wait 2 minutes, check Actions tab, verify Pages is enabled in repo settings
