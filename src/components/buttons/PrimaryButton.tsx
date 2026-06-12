import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  hasArrow?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  hasArrow = false
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
        {hasArrow && (
          <Text style={[styles.arrow, textStyle, disabled && styles.disabledText]}>
            {" →"}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  pressed: {
    backgroundColor: theme.colors.primaryDark,
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: theme.colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  arrow: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
});
export default PrimaryButton;
