import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * FoldScoreCard - Fresh implementation from home:profile:foldscore.svg
 * 
 * Design measurements:
 * - Card: 358x159, rx=20, fill=#FDFBF7
 * - Ring center: cx=285, cy=82 (in SVG coords where card starts at x=4, y=2)
 * - Ring outer: r=62, fill=#EDEADC
 * - Ring inner: r=50, fill=#810100 opacity=0.2
 * - Progress arc: ~75% around, stroke=#810100, stroke-width=12
 * - Diamond: fold-logo-nonbg.png centered in ring
 * - Badge: x=19, y=121, 177x25, rx=12.5
 * - Score: JockeyOne font
 */

// Equal vertical padding for balanced spacing
const VERTICAL_PADDING = 18 * SCALE;

interface FoldScoreCardProps {
  score?: number;
  percentile?: number;
  progress?: number; // 0-1
}

export function FoldScoreCard({ 
  score = 840, 
  percentile = 10,
  progress = 0.75,
}: FoldScoreCardProps) {
  
  return (
    <View style={styles.card}>
      {/* Left content */}
      <View style={styles.leftContent}>
        <Text style={styles.label}>FOLD SCORE</Text>
        <Text style={styles.score}>{score}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>TOP {percentile}% CONSISTENCY</Text>
        </View>
      </View>
      
      {/* Right content - Progress ring with logo */}
      <View style={styles.rightContent}>
        <ProgressRing progress={progress} />
      </View>
    </View>
  );
}

/**
 * ProgressRing with Fold logo in center
 * 
 * From SVG analysis:
 * - Outer background circle: r=62, fill=#EDEADC  
 * - Progress arc: stroke-width = 12, arc radius = 56 (middle of 50 and 62)
 * - Inner circle: r=50, fill=#810100 at 20% opacity
 * - Progress starts at top and goes clockwise ~75%
 */
function ProgressRing({ progress = 0.75 }: { progress: number }) {
  const size = 124 * SCALE; // 62 * 2
  const center = size / 2;
  const outerRadius = 62 * SCALE;
  const innerRadius = 50 * SCALE;
  
  // The arc fills the ring between outer (62) and inner (50)
  const strokeWidth = 12 * SCALE;
  const arcRadius = 56 * SCALE; // (62 + 50) / 2 = 56
  
  // Arc path calculation
  const circumference = 2 * Math.PI * arcRadius;
  const strokeDasharray = `${circumference * progress} ${circumference * (1 - progress)}`;
  
  // Logo size - scaled to fit nicely in inner circle
  const logoSize = 50 * SCALE;
  
  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      {/* SVG for rings */}
      <Svg width={size} height={size}>
        {/* Background ring - cream color */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="#EDEADC"
        />
        
        {/* Progress arc - dark red, fills the ring gap */}
        <Circle
          cx={center}
          cy={center}
          r={arcRadius}
          stroke="#810100"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          fill="none"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
        
        {/* Inner circle - light red */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="#810100"
          fillOpacity={0.2}
        />
      </Svg>
      
      {/* Fold logo centered - using PNG */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/fold-logo-nonbg.png')}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 358 * SCALE,
    height: 159 * SCALE,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  leftContent: {
    flex: 1,
    paddingLeft: 15 * SCALE,
    paddingVertical: VERTICAL_PADDING,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
  },
  score: {
    fontFamily: 'JockeyOne',
    fontSize: 72 * SCALE,
    color: '#000000',
    marginTop: -8 * SCALE,
    includeFontPadding: false,
  },
  badge: {
    marginTop: 0,
    backgroundColor: 'rgba(129, 1, 0, 0.2)',
    borderRadius: 12.5 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(129, 1, 0, 0.25)',
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 4 * SCALE,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10 * SCALE,
    fontWeight: '600',
    color: '#810100',
    letterSpacing: 0.3,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15 * SCALE,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
