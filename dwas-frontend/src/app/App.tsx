import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, queryClient } from './providers/QueryProvider'
import { AppShell } from '../presentation/shell'
import { CommandPalette } from '../presentation/overlays/CommandPalette'
import { KeyboardShortcutsProvider } from '../presentation/keyboard/shortcuts'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardShortcutsProvider />
      <AppShell>
        <RouterProvider router={router} />
      </AppShell>
      <CommandPalette />
    </QueryClientProvider>
  )
}
