import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme/theme';

interface PremiumBadgeProps {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  text,
  style,
  textStyle
}) => {
  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: theme.colors.accentGold,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.accentGoldDark,
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accentGoldDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
export default PremiumBadge;
