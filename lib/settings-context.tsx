// Re-export from Zustand store for backward compatibility.
// New code should import from '@/lib/store/settings-store' directly.
export { useSettings, useSettingsStore } from './store/settings-store';

// Re-export SettingsProvider as a no-op wrapper for any remaining references
import React from 'react';
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
