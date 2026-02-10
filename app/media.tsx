import { UnifiedMediaViewer } from '@/components/media/UnifiedMediaViewer';
import { TimelineColors } from '@/constants/theme';
import { useTimeline } from '@/lib/timeline-context';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCALE = SCREEN_WIDTH / 393;
const COLUMN_COUNT = 3;
const GAP = 2 * SCALE;
const ITEM_SIZE = (SCREEN_WIDTH - (COLUMN_COUNT - 1) * GAP) / COLUMN_COUNT;

// ============== ICONS ==============

function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GridIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3H10V10H3V3Z"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 3H21V10H14V3Z"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 14H21V21H14V14Z"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 14H10V21H3V14Z"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function VideoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5V19L19 12L8 5Z" fill="white" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============== TYPES ==============

type MediaType = 'image' | 'video';
type FilterType = 'all' | 'image' | 'video';

interface MediaItemDisplay {
  id: string;
  uri: string;
  thumbnailUri?: string | null;
  type: MediaType;
  date: Date;
  entryId: string;
}

interface SectionData {
  title: string;
  data: MediaItemDisplay[];
}

// ============== COMPONENTS ==============

function FilterPill({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterPill,
        isActive && styles.filterPillActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          isActive && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ============== MAIN COMPONENT ==============

export default function MediaScreen() {
  const router = useRouter();
  const { entries } = useTimeline();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItemDisplay | null>(null);

  // Extract, filter, and group media items
  const sections = useMemo(() => {
    let mediaItems: MediaItemDisplay[] = [];

    // 1. Extract all items
    entries.forEach(entry => {
      if (entry.media && entry.media.length > 0) {
        entry.media.forEach(m => {
          if (m.type === 'image' || m.type === 'video') {
            mediaItems.push({
              id: m.id || `${entry.id}-${m.uri}`,
              uri: m.uri,
              thumbnailUri: m.thumbnailUri,
              type: m.type,
              date: new Date(entry.createdAt),
              entryId: entry.id,
            });
          }
        });
      }
    });

    // 2. Filter
    if (activeFilter !== 'all') {
      mediaItems = mediaItems.filter(item => item.type === activeFilter);
    }

    // 3. Sort by date (newest first)
    mediaItems.sort((a, b) => b.date.getTime() - a.date.getTime());

    // 4. Group by Month Year
    const grouped: Record<string, MediaItemDisplay[]> = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    mediaItems.forEach(item => {
      const monthIndex = item.date.getMonth();
      const year = item.date.getFullYear();
      const key = `${monthNames[monthIndex]} ${year}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    // 5. Convert to SectionList sections
    // Note: Since we sorted items by date, and we process them in order,
    // the keys in 'grouped' might not be strictly ordered if we just iterate keys.
    // However, usually we want sections ordered by time too.
    // Let's rely on the first item of each group to determine section order or just Map order.
    // A robust way is to re-sort the keys or maintain order during grouping.
    // We'll map the unique keys from the sorted array to preserve order.
    const sectionKeys = Array.from(new Set(mediaItems.map(item => {
      const monthIndex = item.date.getMonth();
      const year = item.date.getFullYear();
      return `${monthNames[monthIndex]} ${year}`;
    })));

    return sectionKeys.map(key => ({
      title: key,
      data: grouped[key],
    }));
  }, [entries, activeFilter]);

  const handleBack = () => {
    router.back();
  };



  // Helper to chunk data for the grid within a section (if not using numColumns in SectionList directly)
  // Converting flat data to chunks of 3 for valid row rendering is cleaner for layout flexibility
  // BUT SectionList supports numColumns, yet styling headers vs rows gets tricky with column wrapper.
  // Standard workaround: render a custom 'row' item or use a flat SectionList with formatted data.
  // For simplicity with existing standard RN components, let's use a flattening approach or layout trick.
  // actually,  // Helper to chunk data for the grid within a section (if not using numColumns in SectionList directly)
  const chunkedSections = useMemo(() => {
    return sections.map(section => {
      const rows = [];
      for (let i = 0; i < section.data.length; i += COLUMN_COUNT) {
        rows.push({
          id: `row-${section.title}-${i}`,
          items: section.data.slice(i, i + COLUMN_COUNT)
        });
      }
      return {
        title: section.title,
        data: rows
      };
    });
  }, [sections]);

  const handleMediaPress = (item: MediaItemDisplay) => {
    setSelectedMedia(item);
  };

  const handleCloseViewer = () => {
    setSelectedMedia(null);
  };


  const renderRow = ({ item }: { item: { id: string, items: MediaItemDisplay[] } }) => {
    return (
      <View style={styles.row}>
        {item.items.map((mediaItem) => (
          <Pressable
            key={mediaItem.id}
            style={styles.mediaItem}
            onPress={() => handleMediaPress(mediaItem)}
          >
            <ExpoImage
              source={{ uri: mediaItem.thumbnailUri || mediaItem.uri }}
              style={styles.mediaImage}
              contentFit="cover"
              transition={200}
            />
            {mediaItem.type === 'video' && (
              <View style={styles.videoIndicator}>
                <VideoIcon size={12 * SCALE} />
              </View>
            )}
          </Pressable>
        ))}
        {/* Fill empty spots if last row is incomplete */}
        {Array.from({ length: COLUMN_COUNT - item.items.length }).map((_, idx) => (
          <View key={`empty-${idx}`} style={[styles.mediaItem, { backgroundColor: 'transparent' }]} />
        ))}
      </View>
    )
  }

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <View style={styles.iconCircle}>
            <GridIcon size={16 * SCALE} />
          </View>
          <Text style={styles.topBarTitle}>Media</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FilterPill
          label="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <FilterPill
          label="Photos"
          isActive={activeFilter === 'image'}
          onPress={() => setActiveFilter('image')}
        />
        <FilterPill
          label="Videos"
          isActive={activeFilter === 'video'}
          onPress={() => setActiveFilter('video')}
        />
      </View>

      {/* Media Grid */}
      <SectionList
        sections={chunkedSections}
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media found.</Text>
          </View>
        }
      />

      {/* Unified Viewer */}
      <UnifiedMediaViewer
        isVisible={!!selectedMedia}
        onClose={handleCloseViewer}
        items={sections.flatMap(s => s.data).map(m => ({
          id: m.id,
          uri: m.uri,
          type: m.type,
          thumbnailUri: m.thumbnailUri
        }))}
        initialIndex={sections.flatMap(s => s.data).findIndex(m => m.id === selectedMedia?.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  iconCircle: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  placeholder: {
    width: 40 * SCALE,
  },
  // Filters
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 17 * SCALE,
    paddingVertical: 12 * SCALE,
    gap: 10 * SCALE,
    zIndex: 10,
  },
  filterPill: {
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 8 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    borderColor: 'rgba(129, 1, 0, 0.2)',
  },
  filterText: {
    fontSize: 14 * SCALE,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: TimelineColors.primary,
    fontWeight: '600',
  },
  // Grid
  gridContent: {
    paddingBottom: 100 * SCALE,
  },
  sectionHeader: {
    paddingHorizontal: 17 * SCALE,
    paddingVertical: 12 * SCALE,
    backgroundColor: TimelineColors.background,
  },
  sectionHeaderText: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E1D3',
  },
  videoIndicator: {
    position: 'absolute',
    top: 6 * SCALE,
    right: 6 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8 * SCALE,
    padding: 4 * SCALE,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100 * SCALE,
  },
  emptyText: {
    fontSize: 16 * SCALE,
    color: '#888',
    fontStyle: 'italic',
  },

});
