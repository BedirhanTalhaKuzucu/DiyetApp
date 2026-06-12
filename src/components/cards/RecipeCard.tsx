import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../../theme/theme';

interface RecipeCardProps {
  title: string;
  category: string;
  calories: number;
  prepTime: number;
  difficulty: string;
  imageUri: string;
  isPremium: boolean;
  onPress: () => void;
  premiumLabel: string;
  kcalLabel: string;
  minsLabel: string;
  difficultyLabel: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  category,
  calories,
  prepTime,
  difficulty,
  imageUri,
  isPremium,
  onPress,
  premiumLabel,
  kcalLabel,
  minsLabel,
  difficultyLabel
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {isPremium && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockText}>🔒 {premiumLabel}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🔥 {calories} {kcalLabel}</Text>
          <Text style={styles.metaText}>⏱️ {prepTime} {minsLabel}</Text>
          <Text style={styles.metaText}>📊 {difficulty}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
    ...theme.shadows.light,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.95,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 37, 18, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    backgroundColor: theme.colors.accentGold,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.accentGoldDark,
  },
  lockText: {
    color: theme.colors.accentGoldDark,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  category: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  metaText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
});
export default RecipeCard;
