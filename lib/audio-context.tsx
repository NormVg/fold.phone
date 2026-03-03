// Re-export from Zustand store for backward compatibility.
// New code should import from '@/lib/store/audio-store' directly.
export { useAudio, useAudioStore } from './store/audio-store';

// Re-export AudioProvider as a no-op wrapper for any remaining references
import React from 'react';
export function AudioProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
