import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { theme } from '../../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  active?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  active = false
}) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          active && styles.activeCard,
          pressed && styles.pressedCard,
          style
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, active && styles.activeCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    ...theme.shadows.light,
  },
  activeCard: {
    backgroundColor: theme.colors.primaryLightActive,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  pressedCard: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
});
export default Card;
