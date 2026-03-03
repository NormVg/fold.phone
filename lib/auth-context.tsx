// Re-export from Zustand store for backward compatibility.
// New code should import from '@/lib/store/auth-store' directly.
export { useAuth, useAuthStore } from './store/auth-store';

// Re-export AuthProvider as a no-op wrapper for any remaining references
// (all state is now in the Zustand store, initialized via StoreInitializer in _layout.tsx)
import React from 'react';
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
