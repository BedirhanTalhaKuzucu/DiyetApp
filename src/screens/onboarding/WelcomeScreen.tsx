import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { dietitianProfile } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>{t('common.appName')}</Text>
      </View>

      <View style={styles.heroContainer}>
        <Image
          source={{ uri: dietitianProfile.imagePlaceholder }}
          style={styles.dietitianImage}
          contentFit="cover"
        />
        <View style={styles.brandOverlay}>
          <Text style={styles.dietitianName}>{dietitianProfile.name}</Text>
          <Text style={styles.dietitianTitle}>{t('common.dietitianCredentials')}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.tagline}>
          diyetApp
        </Text>
        <Text style={styles.subtitle}>
          {t('welcome.subtitle')}
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('common.getStarted')}
            onPress={() => navigation.replace('GoalSelection')}
            hasArrow
          />

          <Pressable style={styles.linkButton} onPress={() => navigation.replace('MainApp')}>
            <Text style={styles.linkLabel}>{t('common.alreadyHaveAccount')}</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          {t('common.createdBy', { dietitian: dietitianProfile.name })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xxl,
  },
  topBar: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  logoText: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  heroContainer: {
    height: 350,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  dietitianImage: {
    width: '100%',
    height: '100%',
  },
  brandOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 37, 18, 0.6)',
    padding: theme.spacing.lg,
  },
  dietitianName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  dietitianTitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.accentGold,
    marginTop: 2,
    fontWeight: theme.typography.weights.semibold,
  },
  contentContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  linkLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.lg,
    opacity: 0.8,
  },
});
export default WelcomeScreen;
