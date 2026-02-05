import { BottomNavBar, TimelineHeader, VoiceCard, PhotoCard, TextCard, VideoCard, StoryCard } from '@/components/timeline';
import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

export default function TimelineScreen() {
  const router = useRouter();

  // Get current date info for header
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[now.getDay()];
  const date = `${months[now.getMonth()]} ${now.getDate()}`;

  const handleGridPress = () => {
    router.replace('/hub');
  };

  const handleCapturePress = () => {
    console.log('Capture pressed');
  };

  const handleCaptureLongPress = () => {
    router.push('/new-memory');
  };

  const handleProfilePress = () => {
    router.replace('/profile');
  };

  const handlePlayPress = () => {
    console.log('Play pressed');
  };

  const handleSharePress = () => {
    console.log('Share pressed');
  };

  const handleLocationPress = () => {
    console.log('Location pressed');
  };

  const handleMoodPress = () => {
    console.log('Mood pressed');
  };

  const handleImagePress = () => {
    console.log('Image pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Header with date and avatar */}
      <TimelineHeader
        dayOfWeek={dayOfWeek}
        date={date}
        onProfilePress={handleProfilePress}
      />

      {/* Timeline content area with line inside */}
      <View style={styles.contentWrapper}>
        {/* Timeline vertical line - inside content area only */}
        <View style={styles.timelineLine} />
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Text card entry */}
          <View style={styles.cardWrapper}>
            <TextCard
              content="Just had the most amazing coffee this morning. Sometimes it's the little things that make a day great."
              time="04:20 PM"
              mood="HAPPY"
              onSharePress={handleSharePress}
              onLocationPress={handleLocationPress}
              onMoodPress={handleMoodPress}
            />
          </View>

          {/* Voice card entry */}
          <View style={styles.cardWrapper}>
            <VoiceCard
              title="Rant about math"
              time="03:34 PM"
              duration="03:34"
              mood="SAD"
              onPlayPress={handlePlayPress}
              onSharePress={handleSharePress}
              onLocationPress={handleLocationPress}
              onMoodPress={handleMoodPress}
            />
          </View>
          
          {/* Photo card entry */}
          <View style={styles.cardWrapper}>
            <PhotoCard
              title="Hello"
              time="02:15 PM"
              imageUri="https://picsum.photos/400/300"
              mood="SAD"
              onImagePress={handleImagePress}
              onSharePress={handleSharePress}
              onLocationPress={handleLocationPress}
              onMoodPress={handleMoodPress}
            />
          </View>

          {/* Video card entry */}
          <View style={styles.cardWrapper}>
            <VideoCard
              title="Sunset timelapse"
              time="01:45 PM"
              duration="00:32"
              thumbnailUri="https://picsum.photos/400/250"
              mood="HAPPY"
              onPlayPress={handlePlayPress}
              onSharePress={handleSharePress}
              onLocationPress={handleLocationPress}
              onMoodPress={handleMoodPress}
            />
          </View>

          {/* Story card entry */}
          <View style={styles.cardWrapper}>
            <StoryCard
              id="story-1"
              title="A Walk Through Memory Lane"
              content="Today I found myself walking through the old neighborhood where I grew up. The streets seemed smaller somehow, the trees much taller than I remembered. Every corner held a memory - the spot where I learned to ride a bike, the fence I used to climb, the window of my childhood bedroom where I would sit and dream about the future.

It's strange how places can hold so much of who we were. The old bakery is still there, though under new ownership now. The smell of fresh bread still wafts through the morning air, just as it did twenty years ago. I bought a croissant, and for a moment, I was ten years old again, clutching coins in my small hands, feeling like the richest kid in the world.

Some things change, and some things stay the same. But I realized today that the most important things - the feelings, the love, the sense of belonging - those live inside us forever. We carry our homes within our hearts, no matter how far we travel."
              time="12:30 PM"
              mood="HAPPY"
              onSharePress={handleSharePress}
              onLocationPress={handleLocationPress}
              onMoodPress={handleMoodPress}
            />
          </View>
        </ScrollView>
      </View>

      {/* Bottom navigation bar */}
      <BottomNavBar
        activeTab="timeline"
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
    backgroundColor: TimelineColors.background,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 63 * SCALE, // Match design: x="63" in SVG
    top: 10 * SCALE, // Start where first card starts (matches cardWrapper marginTop)
    bottom: 0,
    width: 5 * SCALE, // Match design: width="5" in SVG
    backgroundColor: '#810100',
    zIndex: 0, // Behind cards
  },
  content: {
    flex: 1,
    zIndex: 1, // Above the line
  },
  scrollContent: {
    paddingTop: 0, // Remove top padding, let card margin handle spacing
    paddingBottom: 120 * SCALE,
    alignItems: 'center', // Center cards horizontally
  },
  cardWrapper: {
    marginTop: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
});
