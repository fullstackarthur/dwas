import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, queryClient } from './providers/QueryProvider'
import { CommandPalette } from '../presentation/overlays/CommandPalette'
import { KeyboardShortcutsProvider } from '../presentation/keyboard/shortcuts'
import { PresenceEngineProvider } from '../presentation/providers/PresenceEngineProvider'
import { router } from './router'
import GlobalCommandPalette from '../presentation/command/GlobalCommandPalette'
import KeyboardShortcutRegistry from '../presentation/command/KeyboardShortcutRegistry'
import OfflineStatusBanner from '../presentation/pwa/OfflineStatusBanner'
import PWAInstallPrompt from '../presentation/pwa/PWAInstallPrompt'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PresenceEngineProvider>
        <KeyboardShortcutsProvider />
        <KeyboardShortcutRegistry />
        <OfflineStatusBanner />
        <RouterProvider router={router} />
        <CommandPalette />
        <GlobalCommandPalette />
        <PWAInstallPrompt />
      </PresenceEngineProvider>
    </QueryClientProvider>
  )
}
