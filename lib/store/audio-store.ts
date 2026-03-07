import { Audio } from 'expo-av';
import { create } from 'zustand';

// Module-level ref so the Audio.Sound object lives outside React's render cycle.
// This is safe — it's a single global instance just like useRef on a Provider.
let _soundRef: Audio.Sound | null = null;

interface AudioState {
  playingEntryId: string | null;
  loadingEntryId: string | null;
  isLoadingAudio: boolean;
  playbackProgress: number;

  // Actions
  togglePlayback: (entryId: string, uri: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  seekTo: (progress: number) => Promise<void>;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  playingEntryId: null,
  loadingEntryId: null,
  isLoadingAudio: false,
  playbackProgress: 0,

  stopPlayback: async () => {
    if (_soundRef) {
      try {
        await _soundRef.stopAsync();
        await _soundRef.unloadAsync();
      } catch {}
      _soundRef = null;
    }
    set({ playingEntryId: null, loadingEntryId: null, isLoadingAudio: false, playbackProgress: 0 });
  },

  seekTo: async (progress: number) => {
    if (!_soundRef) return;
    try {
      const status = await _soundRef.getStatusAsync();
      if ('durationMillis' in status && status.durationMillis) {
        const positionMillis = status.durationMillis * Math.max(0, Math.min(1, progress));
        await _soundRef.setPositionAsync(positionMillis);
        set({ playbackProgress: progress });
      }
    } catch (error) {
      console.error('Audio seek error:', error);
    }
  },

  togglePlayback: async (entryId: string, uri: string) => {
    const { playingEntryId, stopPlayback } = get();

    try {
      // Same entry — toggle pause / resume
      if (playingEntryId === entryId && _soundRef) {
        const status = await _soundRef.getStatusAsync();
        if ('isPlaying' in status && status.isPlaying) {
          await _soundRef.pauseAsync();
          set({ playingEntryId: null });
        } else {
          await _soundRef.playAsync();
          set({ playingEntryId: entryId });
        }
        return;
      }

      // Stop whatever is currently playing
      await stopPlayback();

      // Mark this entry as loading (shows spinner on its VoiceCard)
      set({ loadingEntryId: entryId, isLoadingAudio: true });

      // Load and start the new track
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 }
      );
      _soundRef = sound;

      // Audio is now playing — clear loading, set playing
      set({
        playingEntryId: entryId,
        loadingEntryId: null,
        isLoadingAudio: false,
        playbackProgress: 0,
      });

      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isLoaded' in status && status.isLoaded) {
          if (status.durationMillis && status.positionMillis) {
            set({ playbackProgress: status.positionMillis / status.durationMillis });
          }
          if (status.didJustFinish) {
            sound.unloadAsync();
            _soundRef = null;
            set({ playingEntryId: null, playbackProgress: 0 });
          }
        }
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      set({ playingEntryId: null, loadingEntryId: null, isLoadingAudio: false, playbackProgress: 0 });
    }
  },
}));

// Compatibility shim — keeps existing consumers working without any import changes
export function useAudio() {
  return useAudioStore();
}
