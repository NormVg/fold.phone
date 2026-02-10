import { ActivityLevel, HubCalendar, HubPanelGrid } from '@/components/hub';
import { BottomNavBar, TimelineHeader } from '@/components/timeline';
import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

/**
 * Hub Screen - Based on home:hub.svg, home:hub:calander.svg, and home:hub:pannel.svg
 *
 * The SVG shows:
 * - Same header as timeline (THUR + Oct 24 + avatar)
 * - Calendar component with month navigation
 * - Activity heatmap on calendar days
 * - 2×2 panel grid (Stories, Emotions, zhare, Media)
 * - Bottom nav with grid icon highlighted
 */
export default function HubScreen() {
  const router = useRouter();

  // Get current date info for header
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[now.getDay()];
  const date = `${months[now.getMonth()]} ${now.getDate()}`;

  // Calendar state
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());

  // Sample activity data - matching the design SVG pattern
  const activityData = useMemo(() => {
    const data = new Map<number, ActivityLevel>();
    // Activity pattern from the SVG (September 2025)
    // Row 2: 4(0.3), 6(0.23)
    // Row 3: 9(0.2), 15(0.1), 16(0.19), 17(0.3)
    // Row 4: 18(today - special)
    data.set(4, 3);   // High activity
    data.set(6, 2);   // Medium activity
    data.set(9, 2);   // Medium activity
    data.set(15, 1);  // Low activity
    data.set(16, 2);  // Medium activity
    data.set(17, 3);  // High activity
    return data;
  }, []);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleDayPress = (day: number) => {
    console.log('Day pressed:', day);
  };

  const handleGridPress = () => {
    // On hub, pressing grid goes back to timeline
    router.replace('/');
  };

  const handleCapturePress = () => {
    router.push('/entry-text'); // Tap -> text entry
  };

  const handleCaptureLongPress = () => {
    router.push('/entry-audio'); // Long press -> voice recording
  };

  const handleProfilePress = () => {
    router.replace('/profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Header with date and avatar - same as timeline */}
      <TimelineHeader
        dayOfWeek={dayOfWeek}
        date={date}
        onProfilePress={handleProfilePress}
      />

      {/* Content area with calendar */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HubCalendar
          year={calendarYear}
          month={calendarMonth}
          activityData={activityData}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayPress={handleDayPress}
        />

        {/* Panel grid with Stories, Emotions, zhare, Media */}
        <HubPanelGrid
          onStoriesPress={() => router.push('/stories')}
          onEmotionsPress={() => console.log('Emotions pressed')}
          onSharePress={() => console.log('Share pressed')}
          onMediaPress={() => router.push('/media')}
        />
      </ScrollView>

      {/* Bottom navigation bar with hub/grid highlighted */}
      <BottomNavBar
        activeTab="hub"
        onGridPress={handleGridPress}
        onCapturePress={handleCapturePress}
        onCaptureLongPress={handleCaptureLongPress}
        onProfilePress={handleProfilePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background, // #EDEADC
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
    paddingBottom: 140 * SCALE, // Increased to ensure bottom cards are fully visible above nav bar
    alignItems: 'center',
    gap: 16 * SCALE,
  },
});
