// Design System CSS imports (ORDER MATTERS - must be first!)
import '@chesscom/design-system/dist/variables.css'  // CSS custom properties (tokens)
import '@chesscom/design-system/dist/cc-utils.css'   // Utility classes
import '@chesscom/design-system/dist/style.css'      // Component styles

import { createApp } from 'vue'
import { provideDesignSystem } from '@chesscom/design-system'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

// Provide design system context (required for some components)
provideDesignSystem(app, {
  features: [], // Feature flags (empty array if not using feature flags)
  routes: {
    webMemberView: (username: string | undefined) => `/member/${username}`,
    webAbout: '/about',
    webMembership: (params: Record<string, string>) => `/membership/${params.tier || 'gold'}`,
    webMemberTitledPlayers: '/titled-players',
  },
  trans: {
    'Close': 'Close',
    'Avatar': 'Avatar',
    'Avatar of %username%': (username: string) => `Avatar of ${username}`,
    'Back': 'Back',
    'Back to Top': 'Back to Top',
    'Loading...': 'Loading...',
  },
})

app.mount('#app')
