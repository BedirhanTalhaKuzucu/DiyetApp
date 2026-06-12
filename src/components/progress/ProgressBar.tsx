import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../theme/theme';

interface ProgressBarProps {
  progress: number; // between 0 and 1
  label?: string;
  showPercent?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercent = true,
  color,
  style
}) => {
  const activePercent = Math.min(Math.max(Math.round(progress * 100), 0), 100);
  const barColor = color || theme.colors.primary;

  return (
    <View style={[styles.container, style]}>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercent && <Text style={styles.percent}>{activePercent}%</Text>}
        </View>
      )}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barForeground,
            { width: `${activePercent}%`, backgroundColor: barColor }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
  },
  percent: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  barBackground: {
    height: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  barForeground: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
});
export default ProgressBar;
