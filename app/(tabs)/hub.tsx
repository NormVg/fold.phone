import React from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TimelineColors } from '@/constants/theme';
import { TimelineHeader, BottomNavBar } from '@/components/timeline';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

/**
 * Hub Screen - EXACT from home:hub.svg
 * 
 * The SVG shows:
 * - Same header as timeline (THUR + Oct 24 + avatar)
 * - Empty content area
 * - Bottom nav with grid icon highlighted
 * 
 * No folders, no title - just the basic layout
 */
export default function HubScreen() {
  const router = useRouter();
  
  // Get current date info for header
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayOfWeek = days[now.getDay()];
  const date = `${months[now.getMonth()]} ${now.getDate()}`;

  const handleGridPress = () => {
    // On hub, pressing grid goes back to timeline
    router.replace('/');
  };

  const handleCapturePress = () => {
    console.log('Capture pressed');
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
      />
      
      {/* Empty content area */}
      <View style={styles.content} />

      {/* Bottom navigation bar with hub/grid highlighted */}
      <BottomNavBar
        activeTab="hub"
        onGridPress={handleGridPress}
        onCapturePress={handleCapturePress}
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
});
