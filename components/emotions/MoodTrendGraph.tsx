import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { TimelineColors } from '@/constants/theme';
import { MOOD_COLORS, SCALE, SCREEN_WIDTH, type DayMood } from './constants';

const Y_AXIS_W = 48 * SCALE;
const CHART_H = 180 * SCALE;
const PAD_T = 12 * SCALE;
const PAD_B = 8 * SCALE;

const Y_LABELS: { label: string; score: number }[] = [
  { label: 'V. Happy', score: 2 },
  { label: 'Happy', score: 1 },
  { label: 'Normal', score: 0 },
  { label: 'Sad', score: -1 },
  { label: 'V. Sad', score: -2 },
];

function scoreToY(score: number): number {
  const plotH = CHART_H - PAD_T - PAD_B;
  const normalized = (score + 2) / 4;
  return PAD_T + plotH * (1 - normalized);
}

interface MoodTrendGraphProps {
  dayMoods: DayMood[];
  periodLabel: string;
}

export function MoodTrendGraph({ dayMoods, periodLabel }: MoodTrendGraphProps) {
  if (dayMoods.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mood Trend</Text>
        <Text style={styles.sectionSubtitle}>{periodLabel}</Text>
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>
            {dayMoods.length === 0
              ? 'No mood data yet. Start logging your mood!'
              : 'Need at least 2 days of data for a trend chart.'}
          </Text>
        </View>
      </View>
    );
  }

  const SVG_W = SCREEN_WIDTH - 34 * SCALE - 40 * SCALE - Y_AXIS_W;
  const PAD_SVG_R = 12 * SCALE;
  const plotW = SVG_W - PAD_SVG_R;

  const indexToX = (i: number) => {
    return 8 * SCALE + (i / (dayMoods.length - 1)) * (plotW - 8 * SCALE);
  };

  const points = dayMoods.map((d, i) => `${indexToX(i)},${scoreToY(d.avgScore)}`).join(' ');

  const firstDate = dayMoods[0].date;
  const lastDate = dayMoods[dayMoods.length - 1].date;
  const formatShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Mood Trend</Text>
      <Text style={styles.sectionSubtitle}>{periodLabel}</Text>

      <View style={styles.chartRow}>
        <View style={[styles.yAxisCol, { height: CHART_H }]}>
          {Y_LABELS.map(({ label, score }) => (
            <Text
              key={score}
              style={[styles.yAxisLabel, { top: scoreToY(score) - 7 * SCALE }]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ))}
        </View>

        <Svg width={SVG_W} height={CHART_H}>
          {Y_LABELS.map(({ score }) => {
            const y = scoreToY(score);
            return (
              <Line
                key={score}
                x1={0}
                y1={y}
                x2={SVG_W - PAD_SVG_R}
                y2={y}
                stroke={score === 0 ? 'rgba(129, 1, 0, 0.2)' : 'rgba(0,0,0,0.06)'}
                strokeWidth={score === 0 ? 1.5 : 0.5}
                strokeDasharray={score === 0 ? '6,4' : undefined}
              />
            );
          })}

          <Polyline
            points={points}
            fill="none"
            stroke={TimelineColors.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {dayMoods.map((d, i) => (
            <Circle
              key={d.dayKey}
              cx={indexToX(i)}
              cy={scoreToY(d.avgScore)}
              r={4.5 * SCALE}
              fill={MOOD_COLORS[d.dominantMood]}
              stroke={TimelineColors.primary}
              strokeWidth={1.5}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.xAxisRow}>
        <Text style={[styles.xAxisLabel, { marginLeft: Y_AXIS_W }]}>
          {formatShort(firstDate)}
        </Text>
        <Text style={styles.xAxisLabel}>{formatShort(lastDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 14 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 2 * SCALE,
  },
  sectionSubtitle: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#999',
    marginBottom: 14 * SCALE,
  },
  emptySection: {
    paddingVertical: 24 * SCALE,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13 * SCALE,
    fontWeight: '400',
    color: '#999',
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
  },
  yAxisCol: {
    width: Y_AXIS_W,
    position: 'relative',
  },
  yAxisLabel: {
    position: 'absolute',
    right: 6 * SCALE,
    fontSize: 9 * SCALE,
    fontWeight: '500',
    color: '#AAA',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6 * SCALE,
    paddingRight: 4 * SCALE,
  },
  xAxisLabel: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: '#999',
  },
});
