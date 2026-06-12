import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '../../theme/theme';

interface SelectableGoalCardProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  iconName: string;
}

export const SelectableGoalCard: React.FC<SelectableGoalCardProps> = ({
  title,
  subtitle,
  selected,
  onPress
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selectedCard,
        pressed && styles.pressedCard
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
          <Text style={[styles.bulletPoint, selected && styles.selectedBullet]}>🎯</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...theme.shadows.light,
  },
  selectedCard: {
    backgroundColor: theme.colors.primaryLightActive,
    borderColor: theme.colors.primary,
  },
  pressedCard: {
    opacity: 0.95,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  selectedIconContainer: {
    backgroundColor: theme.colors.primary,
  },
  bulletPoint: {
    fontSize: 18,
  },
  selectedBullet: {
    color: theme.colors.white,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
  },
  subtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkMark: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default SelectableGoalCard;
