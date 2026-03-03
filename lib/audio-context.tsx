import { Audio } from 'expo-av';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface AudioContextValue {
  playingEntryId: string | null;
  playbackProgress: number;
  togglePlayback: (entryId: string, uri: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const stopPlayback = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
    setPlayingEntryId(null);
    setPlaybackProgress(0);
  }, []);

  const togglePlayback = useCallback(
    async (entryId: string, uri: string) => {
      try {
        // Same entry — toggle pause / resume
        if (playingEntryId === entryId && soundRef.current) {
          const status = await soundRef.current.getStatusAsync();
          if ('isPlaying' in status && status.isPlaying) {
            await soundRef.current.pauseAsync();
            setPlayingEntryId(null);
          } else {
            await soundRef.current.playAsync();
            setPlayingEntryId(entryId);
          }
          return;
        }

        // Stop whatever is currently playing
        await stopPlayback();

        // Load and start the new track
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true, progressUpdateIntervalMillis: 100 }
        );
        soundRef.current = sound;
        setPlayingEntryId(entryId);
        setPlaybackProgress(0);

        sound.setOnPlaybackStatusUpdate((status) => {
          if ('isLoaded' in status && status.isLoaded) {
            if (status.durationMillis && status.positionMillis) {
              setPlaybackProgress(status.positionMillis / status.durationMillis);
            }
            if (status.didJustFinish) {
              sound.unloadAsync();
              soundRef.current = null;
              setPlayingEntryId(null);
              setPlaybackProgress(0);
            }
          }
        });
      } catch (error) {
        console.error('Audio playback error:', error);
        setPlayingEntryId(null);
        setPlaybackProgress(0);
      }
    },
    [playingEntryId, stopPlayback]
  );

  return (
    <AudioContext.Provider value={{ playingEntryId, playbackProgress, togglePlayback, stopPlayback }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
