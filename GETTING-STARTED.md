# Getting Started

Welcome to the Chess.com Design System Starter Project! This guide will help you get up and running quickly.

## For People (Non-Technical Setup)

If you're not familiar with npm, git, or command-line tools:

1. **Install Cursor** - Download from https://cursor.sh/
2. **Open this folder in Cursor** - File > Open Folder
3. **Give this file to Cursor's AI**:
   - Open `AI-AGENT-COMPLETE-SETUP.md`
   - Ask Cursor: "Please follow the instructions in this file to set up my project"
4. **Let Cursor handle the rest!** - The AI will guide you through each step

## For Developers (Quick Setup)

### 1. Install Dependencies

First, configure npm for GitHub Packages (one-time setup):

```bash
# Using GitHub CLI (recommended)
gh auth refresh -h github.com -s read:packages
echo "@chesscom:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

Then install dependencies:

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see your app!

### 3. Look Up Design System Info via GNS (Optional)

If you have GNS CLI installed, query the Design System directly:

```bash
# Bootstrap your session
gns whoami
gns batch-get gns.server.keyspace gns.server.tagspace gns.server.linkspace teams.design.public.instructions

# Look things up
gns get teams.design.public.instructions.quick-reference
gns get teams.design.public.components.input.button
gns search "modal"
```

The Cursor rules in `.cursor/rules/design-system.md` also cover all token values and coding guidelines inline.

## What's Included

- ✅ Vue 3 + TypeScript + Vite
- ✅ Chess.com Design System pre-configured
- ✅ Dark mode enabled by default
- ✅ All critical setup done (globals, CSS imports, font-size reset)
- ✅ Cursor rules with GNS integration
- ✅ GitHub Pages deployment workflow
- ✅ Example component with counter

## Next Steps

1. **Explore the code** - Check out `src/App.vue` for examples
2. **Read the docs** - See `README.md` for complete documentation
3. **Build something!** - Start creating your components

## Need Help?

- **For setup issues**: See `AI-AGENT-COMPLETE-SETUP.md`
- **For project documentation**: See `README.md`
- **For Design System info**: See `.cursor/rules/design-system.md` or query GNS (`gns search "…"`)
- **For deployment**: See the GitHub Pages section in `README.md`

## Quick Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

Happy coding! 🚀
