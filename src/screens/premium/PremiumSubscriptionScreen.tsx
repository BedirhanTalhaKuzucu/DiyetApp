import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { PremiumBadge } from '../../components/progress/PremiumBadge';

type Props = NativeStackScreenProps<RootStackParamList, 'Premium'>;

export const PremiumSubscriptionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handleStartPremium = () => {
    Alert.alert(t('common.subAlertTitle'), t('common.subAlertMessage'), [
      {
        text: t('common.ok'),
        onPress: () => navigation.navigate('MainApp')
      }
    ]);
  };

  const benefits = [
    t('premium.benefit1'),
    t('premium.benefit2'),
    t('premium.benefit3'),
    t('premium.benefit4'),
    t('premium.benefit5'),
    t('premium.benefit6'),
    t('premium.benefit7')
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('common.appName')}</Text>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.bannerContainer}>
          <Text style={styles.title}>{t('premium.title')}</Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop' }}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>
        </View>

        {/* Benefits Checklist */}
        <View style={styles.benefitsBox}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Options */}
        <View style={styles.pricingContainer}>
          {/* Yearly Plan */}
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.selectedPlanCard
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.bestValueWrapper}>
              <PremiumBadge text={t('common.bestValue')} />
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{t('premium.yearly')}</Text>
              <View style={[styles.checkbox, selectedPlan === 'yearly' && styles.checkboxSelected]}>
                {selectedPlan === 'yearly' && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </View>
            <Text style={styles.planPrice}>{t('premium.yearlyPrice')}</Text>
            <Text style={styles.planDisclaimer}>{t('premium.yearlySave')}</Text>
          </Pressable>

          {/* Monthly Plan */}
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.selectedPlanCard
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{t('premium.monthly')}</Text>
              <View style={[styles.checkbox, selectedPlan === 'monthly' && styles.checkboxSelected]}>
                {selectedPlan === 'monthly' && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </View>
            <Text style={styles.planPrice}>{t('premium.monthlyPrice')}</Text>
            <Text style={styles.planDisclaimer}>{t('premium.monthlyBilling')}</Text>
          </Pressable>
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <PrimaryButton
            title={t('premium.startPremium')}
            onPress={handleStartPremium}
          />
          <Text style={styles.disclaimerText}>{t('common.cancelAnytime')}</Text>
          <Text style={styles.legalNotes}>{t('premium.disclaimer')}</Text>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.textDark,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  placeholderBox: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 18,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  benefitsBox: {
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.round,
    backgroundColor: '#EEF2D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  checkText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.medium,
  },
  pricingContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  planCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    position: 'relative',
    ...theme.shadows.light,
  },
  selectedPlanCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  bestValueWrapper: {
    position: 'absolute',
    top: -12,
    right: 16,
    zIndex: 10,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  planTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkMark: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  planDisclaimer: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  legalNotes: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 14,
  },
  bottomSpacing: {
    height: 40,
  },
});
export default PremiumSubscriptionScreen;
