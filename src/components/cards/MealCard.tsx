import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../../theme/theme';
import { PremiumBadge } from '../progress/PremiumBadge';

interface MealCardProps {
  name: string;
  calories: number;
  prepTime: number;
  imageUri: string;
  isPremium: boolean;
  typeLabel: string;
  onPress: () => void;
  premiumLabel: string;
  kcalLabel: string;
  minsLabel: string;
  onAddPress?: () => void;
  isAdded?: boolean;
  addLabel?: string;
  addedLabel?: string;
}

export const MealCard: React.FC<MealCardProps> = ({
  name,
  calories,
  prepTime,
  imageUri,
  isPremium,
  typeLabel,
  onPress,
  premiumLabel,
  kcalLabel,
  minsLabel,
  onAddPress,
  isAdded = false,
  addLabel = 'Ekle',
  addedLabel = 'Eklendi'
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
              <Text style={styles.lockEmoji}>🔒</Text>
              <Text style={styles.lockText}>{premiumLabel}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.typeLabel}>{typeLabel}</Text>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🔥 {calories} {kcalLabel}</Text>
          <Text style={styles.metaText}>⏱️ {prepTime} {minsLabel}</Text>
        </View>
        
        {onAddPress && !isPremium && (
          <Pressable
            onPress={onAddPress}
            style={[
              styles.actionBtn,
              isAdded ? styles.actionBtnAdded : styles.actionBtnAdd
            ]}
          >
            <Text style={[
              styles.actionBtnText,
              isAdded ? styles.actionBtnTextAdded : styles.actionBtnTextAdd
            ]}>
              {isAdded ? addedLabel : addLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.light,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.95,
  },
  imageContainer: {
    width: 110,
    height: 110,
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
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 10,
    marginRight: 2,
  },
  lockText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accentGoldDark,
  },
  infoContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
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
  actionBtn: {
    marginTop: theme.spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  actionBtnAdd: {
    backgroundColor: theme.colors.primary,
  },
  actionBtnAdded: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  actionBtnText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
  },
  actionBtnTextAdd: {
    color: theme.colors.white,
  },
  actionBtnTextAdded: {
    color: theme.colors.primary,
  },
});
export default MealCard;
