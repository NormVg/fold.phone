import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const COLORS = {
  background: '#EDEADC',
  card: '#FDFBF7',
  primary: '#810100',
  textDark: '#181717',
  textMuted: 'rgba(0, 0, 0, 0.4)',
  disabledText: 'rgba(0, 0, 0, 0.15)',
  selectedBg: '#810100',
  selectedText: '#FDFBF7',
  overlay: 'rgba(0, 0, 0, 0.35)',
};

interface MonthYearPickerProps {
  visible: boolean;
  selectedYear: number;
  selectedMonth: number; // 0-indexed
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}

export function MonthYearPicker({
  visible,
  selectedYear,
  selectedMonth,
  onSelect,
  onClose,
}: MonthYearPickerProps) {
  const [pickerYear, setPickerYear] = useState(selectedYear);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Reset picker year when modal opens
  React.useEffect(() => {
    if (visible) {
      setPickerYear(selectedYear);
    }
  }, [visible, selectedYear]);

  const handlePrevYear = useCallback(() => {
    setPickerYear((y) => y - 1);
  }, []);

  const handleNextYear = useCallback(() => {
    setPickerYear((y) => {
      if (y >= currentYear) return y; // Don't go past current year
      return y + 1;
    });
  }, [currentYear]);

  const handleMonthPress = useCallback(
    (monthIndex: number) => {
      onSelect(monthIndex, pickerYear);
      onClose();
    },
    [pickerYear, onSelect, onClose],
  );

  const isFutureMonth = (monthIndex: number): boolean => {
    if (pickerYear > currentYear) return true;
    if (pickerYear === currentYear && monthIndex > currentMonth) return true;
    return false;
  };

  const isSelected = (monthIndex: number): boolean => {
    return pickerYear === selectedYear && monthIndex === selectedMonth;
  };

  const isCurrentMonth = (monthIndex: number): boolean => {
    return pickerYear === currentYear && monthIndex === currentMonth;
  };

  const canGoNext = pickerYear < currentYear;

  // Build 4x3 grid
  const rows: number[][] = [];
  for (let r = 0; r < 4; r++) {
    rows.push([r * 3, r * 3 + 1, r * 3 + 2]);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          {/* Year selector */}
          <View style={styles.yearRow}>
            <TouchableOpacity
              onPress={handlePrevYear}
              style={styles.yearChevron}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ChevronLeft />
            </TouchableOpacity>

            <Text style={styles.yearText}>{pickerYear}</Text>

            <TouchableOpacity
              onPress={handleNextYear}
              style={[styles.yearChevron, !canGoNext && styles.chevronDisabled]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              disabled={!canGoNext}
            >
              <ChevronRight disabled={!canGoNext} />
            </TouchableOpacity>
          </View>

          {/* Month grid (4 rows x 3 cols) */}
          <View style={styles.monthGrid}>
            {rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.monthRow}>
                {row.map((monthIndex) => {
                  const future = isFutureMonth(monthIndex);
                  const selected = isSelected(monthIndex);
                  const current = isCurrentMonth(monthIndex);

                  return (
                    <TouchableOpacity
                      key={monthIndex}
                      style={[
                        styles.monthCell,
                        selected && styles.monthCellSelected,
                        current && !selected && styles.monthCellCurrent,
                      ]}
                      onPress={() => handleMonthPress(monthIndex)}
                      disabled={future}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.monthText,
                          selected && styles.monthTextSelected,
                          current && !selected && styles.monthTextCurrent,
                          future && styles.monthTextDisabled,
                        ]}
                      >
                        {MONTHS_SHORT[monthIndex]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ChevronLeft() {
  const size = 18 * SCALE;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10 12L6 8L10 4"
        stroke={COLORS.textDark}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight({ disabled }: { disabled?: boolean }) {
  const size = 18 * SCALE;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 4L10 8L6 12"
        stroke={disabled ? COLORS.disabledText : COLORS.textDark}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const CARD_WIDTH = 320 * SCALE;
const MONTH_CELL_SIZE = 80 * SCALE;
const MONTH_CELL_HEIGHT = 48 * SCALE;
const MONTH_GAP = (CARD_WIDTH - 48 * SCALE - 3 * MONTH_CELL_SIZE) / 2;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: 20 * SCALE,
    paddingVertical: 24 * SCALE,
    paddingHorizontal: 24 * SCALE,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20 * SCALE,
    paddingHorizontal: 8 * SCALE,
  },
  yearChevron: {
    padding: 8 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronDisabled: {
    opacity: 0.3,
  },
  yearText: {
    fontSize: 22 * SCALE,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  monthGrid: {
    gap: 8 * SCALE,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthCell: {
    width: MONTH_CELL_SIZE,
    height: MONTH_CELL_HEIGHT,
    borderRadius: 12 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthCellSelected: {
    backgroundColor: COLORS.selectedBg,
  },
  monthCellCurrent: {
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
  },
  monthText: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  monthTextSelected: {
    color: COLORS.selectedText,
    fontWeight: '700',
  },
  monthTextCurrent: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  monthTextDisabled: {
    color: COLORS.disabledText,
  },
});
