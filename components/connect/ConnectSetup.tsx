import { TimelineColors } from '@/constants/theme';
import {
  acceptConnectRequest,
  connectByCode,
  connectByUser,
  declineConnectRequest,
  getConnectInviteCode,
  searchConnectUsers,
  type ConnectPendingRequest,
  type ConnectSearchResult,
  type ConnectStatus,
} from '@/lib/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// ============== ICONS ==============

function PersonAddIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 8v6M23 11h-6"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="#999"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke="#999"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6v6l4 2"
        stroke="#999"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ============== TYPES ==============

interface ConnectSetupProps {
  status: ConnectStatus;
  onConnected: () => void; // callback when connection is established
}

// ============== COMPONENT ==============

export function ConnectSetup({ status, onConnected }: ConnectSetupProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [joiningCode, setJoiningCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConnectSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load invite code on mount
  useEffect(() => {
    loadInviteCode();
  }, []);

  const loadInviteCode = async () => {
    setLoadingCode(true);
    const result = await getConnectInviteCode();
    if (result.data) {
      setInviteCode(result.data.inviteCode);
    }
    setLoadingCode(false);
  };

  // Guard — status should always be present when ConnectSetup is rendered,
  // but protect against any timing edge cases
  if (!status) return null;

  // Debounced search
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (text.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const result = await searchConnectUsers(text);
      if (result.data) {
        setSearchResults(result.data);
      }
      setSearching(false);
    }, 400);
  }, []);

  const handleJoinByCode = async () => {
    const code = codeInput.trim().toUpperCase();
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Invite codes are 6 characters long.');
      return;
    }
    setJoiningCode(true);
    const result = await connectByCode(code);
    setJoiningCode(false);
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      onConnected();
    }
  };

  const handleSendRequest = async (userId: string) => {
    setSendingRequest(userId);
    const result = await connectByUser(userId);
    setSendingRequest(null);
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Request Sent', 'Your connection request has been sent.');
      onConnected(); // refresh status
    }
  };

  const handleAccept = async (requestId: string) => {
    setAcceptingId(requestId);
    const result = await acceptConnectRequest(requestId);
    setAcceptingId(null);
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      onConnected();
    }
  };

  const handleDecline = async (requestId: string) => {
    Alert.alert('Decline Request', 'Are you sure you want to decline this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          await declineConnectRequest(requestId);
          onConnected(); // refresh
        },
      },
    ]);
  };

  const receivedRequests = status.pending.filter((p) => p.direction === 'received');
  const sentRequests = status.pending.filter((p) => p.direction === 'sent');

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cooldown notice */}
      {status.cooldown && (
        <View style={styles.cooldownCard}>
          <ClockIcon size={18 * SCALE} />
          <View style={styles.cooldownTextWrap}>
            <Text style={styles.cooldownTitle}>Cooldown Active</Text>
            <Text style={styles.cooldownSub}>
              You can connect again after{' '}
              {new Date(status.cooldown.until).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      {/* Pending received requests */}
      {receivedRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Requests</Text>
          {receivedRequests.map((req) => (
            <PendingRequestCard
              key={req.id}
              request={req}
              onAccept={() => handleAccept(req.id)}
              onDecline={() => handleDecline(req.id)}
              accepting={acceptingId === req.id}
            />
          ))}
        </View>
      )}

      {/* Your invite code */}
      {!status.cooldown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Invite Code</Text>
          <View style={styles.inviteCodeCard}>
            <Text style={styles.inviteCodeLabel}>Share this code with someone to connect</Text>
            {loadingCode ? (
              <ActivityIndicator size="small" color={TimelineColors.primary} />
            ) : (
              <Text style={styles.inviteCodeText}>{inviteCode || '------'}</Text>
            )}
          </View>
        </View>
      )}

      {/* Join with code */}
      {!status.cooldown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join with Code</Text>
          <View style={styles.codeInputRow}>
            <TextInput
              style={styles.codeInput}
              placeholder="ENTER CODE"
              placeholderTextColor="#999"
              value={codeInput}
              onChangeText={(t) => setCodeInput(t.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Pressable
              style={[styles.joinButton, codeInput.length !== 6 && styles.joinButtonDisabled]}
              onPress={handleJoinByCode}
              disabled={codeInput.length !== 6 || joiningCode}
            >
              {joiningCode ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.joinButtonText}>Join</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* Search users */}
      {!status.cooldown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find Someone</Text>
          <View style={styles.searchInputRow}>
            <SearchIcon size={18 * SCALE} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by email"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
          {searching && (
            <ActivityIndicator
              size="small"
              color={TimelineColors.primary}
              style={{ marginTop: 12 * SCALE }}
            />
          )}
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((u) => (
                <View key={u.id} style={styles.searchResultRow}>
                  {u.image ? (
                    <Image source={{ uri: u.image }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Text style={styles.avatarInitial}>
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.searchResultName} numberOfLines={1}>
                    {u.name}
                  </Text>
                  <Pressable
                    style={styles.requestButton}
                    onPress={() => handleSendRequest(u.id)}
                    disabled={sendingRequest === u.id}
                  >
                    {sendingRequest === u.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <PersonAddIcon size={16 * SCALE} />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Sent requests */}
      {sentRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sent Requests</Text>
          {sentRequests.map((req) => (
            <View key={req.id} style={styles.sentRequestCard}>
              <Text style={styles.sentRequestText}>
                Waiting for response...
              </Text>
              <Text style={styles.sentRequestDate}>
                Sent {new Date(req.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 * SCALE }} />
    </ScrollView>
  );
}

// ============== PENDING REQUEST CARD ==============

function PendingRequestCard({
  request,
  onAccept,
  onDecline,
  accepting,
}: {
  request: ConnectPendingRequest;
  onAccept: () => void;
  onDecline: () => void;
  accepting: boolean;
}) {
  return (
    <View style={styles.pendingCard}>
      <View style={styles.pendingInfo}>
        {request.requesterImage ? (
          <Image source={{ uri: request.requesterImage }} style={styles.pendingAvatar} />
        ) : (
          <View style={[styles.pendingAvatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {request.requesterName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={styles.pendingText}>
          <Text style={styles.pendingName}>{request.requesterName}</Text>
          <Text style={styles.pendingDate}>
            {new Date(request.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.pendingActions}>
        <Pressable style={styles.declineButton} onPress={onDecline}>
          <Text style={styles.declineText}>Decline</Text>
        </Pressable>
        <Pressable style={styles.acceptButton} onPress={onAccept} disabled={accepting}>
          {accepting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.acceptText}>Accept</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ============== STYLES ==============

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
  },
  section: {
    marginBottom: 24 * SCALE,
  },
  sectionTitle: {
    fontSize: 16 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 10 * SCALE,
  },

  // Cooldown
  cooldownCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
    marginBottom: 20 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cooldownTextWrap: {
    flex: 1,
  },
  cooldownTitle: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  cooldownSub: {
    fontSize: 13 * SCALE,
    color: '#666',
    marginTop: 2,
  },

  // Invite code
  inviteCodeCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 20 * SCALE,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inviteCodeLabel: {
    fontSize: 13 * SCALE,
    color: '#666',
    marginBottom: 12 * SCALE,
  },
  inviteCodeText: {
    fontFamily: 'JockeyOne',
    fontSize: 40 * SCALE,
    color: TimelineColors.primary,
    letterSpacing: 8,
  },

  // Code input
  codeInputRow: {
    flexDirection: 'row',
    gap: 10 * SCALE,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
    letterSpacing: 4,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: TimelineColors.primary,
    borderRadius: 12 * SCALE,
    paddingHorizontal: 24 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.4,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16 * SCALE,
    fontWeight: '700',
  },

  // Search
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 14 * SCALE,
    gap: 8 * SCALE,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14 * SCALE,
    fontSize: 15 * SCALE,
    color: TimelineColors.textDark,
  },
  searchResults: {
    marginTop: 10 * SCALE,
    gap: 8 * SCALE,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    padding: 12 * SCALE,
    gap: 10 * SCALE,
  },
  avatar: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 18 * SCALE,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 15 * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
  },
  searchResultName: {
    flex: 1,
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  requestButton: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 18 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Pending requests
  pendingCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    marginBottom: 8 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
    marginBottom: 12 * SCALE,
  },
  pendingAvatar: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
  },
  pendingText: {
    flex: 1,
  },
  pendingName: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  pendingDate: {
    fontSize: 12 * SCALE,
    color: '#999',
    marginTop: 2,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 10 * SCALE,
    justifyContent: 'flex-end',
  },
  declineButton: {
    paddingHorizontal: 18 * SCALE,
    paddingVertical: 10 * SCALE,
    borderRadius: 10 * SCALE,
    backgroundColor: '#EDEADC',
  },
  declineText: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: '#666',
  },
  acceptButton: {
    paddingHorizontal: 18 * SCALE,
    paddingVertical: 10 * SCALE,
    borderRadius: 10 * SCALE,
    backgroundColor: TimelineColors.primary,
  },
  acceptText: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: '#fff',
  },

  // Sent requests
  sentRequestCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginBottom: 8 * SCALE,
  },
  sentRequestText: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  sentRequestDate: {
    fontSize: 12 * SCALE,
    color: '#999',
    marginTop: 4,
  },
});
