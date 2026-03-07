import * as Ably from 'ably';
import { create } from 'zustand';
import { apiRequest } from '../api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: string;         // e.g. 'share_viewed', 'streak_milestone', 'weekly_digest'
  title: string;
  body: string;
  data?: Record<string, unknown>;
  receivedAt: string;   // ISO timestamp
  read: boolean;
}

interface NotificationState {
  // Connection
  isConnected: boolean;
  connectionError: string | null;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;

  // Actions
  connect: (userId: string) => void;
  disconnect: () => void;
  markAllRead: () => void;
  clearAll: () => void;
}

// ─── Private refs (outside React render tree) ────────────────────────────────

let _ablyClient: Ably.Realtime | null = null;
let _channel: Ably.RealtimeChannel | null = null;

// ─── Store ───────────────────────────────────────────────────────────────────

export const useNotificationStore = create<NotificationState>((set, get) => ({
  isConnected: false,
  connectionError: null,
  notifications: [],
  unreadCount: 0,

  connect: (userId: string) => {
    // Prevent duplicate connections
    if (_ablyClient) {
      console.log('[Notifications] Already connected, skipping');
      return;
    }

    console.log('[Notifications] Connecting for user:', userId);

    try {
      _ablyClient = new Ably.Realtime({
        authCallback: async (_tokenParams, callback) => {
          try {
            const res = await apiRequest<{ tokenRequest: Ably.TokenRequest }>(
              '/api/realtime/token',
              { method: 'POST' }
            );
            if (res.data?.tokenRequest) {
              callback(null, res.data.tokenRequest as any);
            } else {
              callback(res.error || 'Failed to get Ably token', null);
            }
          } catch (err: any) {
            console.error('[Notifications] Auth callback error:', err);
            callback(err as any, null);
          }
        },
        clientId: userId,
        // Auto-reconnect on connection drops
        disconnectedRetryTimeout: 5_000,
        suspendedRetryTimeout: 15_000,
      });

      // Monitor connection state
      _ablyClient.connection.on('connected', () => {
        console.log('[Notifications] Connected to Ably');
        set({ isConnected: true, connectionError: null });
      });

      _ablyClient.connection.on('disconnected', () => {
        console.log('[Notifications] Disconnected from Ably');
        set({ isConnected: false });
      });

      _ablyClient.connection.on('failed', (stateChange) => {
        console.error('[Notifications] Connection failed:', stateChange.reason);
        set({ isConnected: false, connectionError: stateChange.reason?.message || 'Connection failed' });
      });

      // Subscribe to user-specific channel
      const channelName = `user:${userId}`;
      _channel = _ablyClient.channels.get(channelName);

      _channel.subscribe((message: Ably.Message) => {
        console.log('[Notifications] Received:', message.name, message.data);

        const notification: AppNotification = {
          id: message.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type: message.name || 'general',
          title: (message.data as any)?.title || 'Notification',
          body: (message.data as any)?.body || '',
          data: (message.data as any)?.data,
          receivedAt: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50), // Keep latest 50
          unreadCount: state.unreadCount + 1,
        }));
      });
    } catch (err: any) {
      console.error('[Notifications] Failed to initialize Ably:', err);
      set({ connectionError: err.message || 'Failed to connect' });
    }
  },

  disconnect: () => {
    console.log('[Notifications] Disconnecting');

    if (_channel) {
      _channel.unsubscribe();
      _channel = null;
    }

    if (_ablyClient) {
      _ablyClient.close();
      _ablyClient = null;
    }

    set({
      isConnected: false,
      connectionError: null,
      notifications: [],
      unreadCount: 0,
    });
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
