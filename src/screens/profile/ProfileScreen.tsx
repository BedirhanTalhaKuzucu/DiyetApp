import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { dietitianProfile } from '../../data/mockData';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const handleInstagramPress = () => {
    Alert.alert('Instagram', `Instagram'da ${dietitianProfile.instagram} profilini ziyaret edin!`);
  };

  const handleLogout = () => {
    Alert.alert('Çıkış', 'Başarıyla çıkış yapıldı.', [
      { text: t('common.ok'), onPress: () => navigation.navigate('Welcome') }
    ]);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.appName')}</Text>
        <Pressable onPress={toggleLanguage} style={styles.langBtn}>
          <Text style={styles.langBtnText}>{i18n.language.toUpperCase()}</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Dietitian Header Profile Block */}
        <View style={styles.profileHero}>
          <Image
            source={{ uri: dietitianProfile.imagePlaceholder }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.profileNameOverlay}>
            <Text style={styles.profileName}>{dietitianProfile.name}</Text>
            <Text style={styles.profileCredentials}>{t('common.dietitianCredentials')}</Text>
          </View>
        </View>

        {/* Bio Block */}
        <View style={styles.bioSection}>
          <View style={styles.bioHeader}>
            <Text style={styles.bioTitle}>
              {t('profile.about')} {dietitianProfile.name.split(' ')[0]}
            </Text>
            <Pressable onPress={handleInstagramPress} style={styles.instagramBadge}>
              <Text style={styles.instagramText}>📷 Instagram</Text>
            </Pressable>
          </View>

          <Text style={styles.bioText}>
            {i18n.language === 'tr' ? dietitianProfile.bioTr : dietitianProfile.bioEn}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {(i18n.language === 'tr' ? dietitianProfile.tagsTr : dietitianProfile.tagsEn).map((tag, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Focus Box */}
        <Card style={styles.focusCard}>
          <Text style={styles.focusLabel}>{t('profile.weeklyFocus')}</Text>
          <Text style={styles.focusQuote}>
            “{i18n.language === 'tr' ? dietitianProfile.weeklyFocusTr : dietitianProfile.weeklyFocusEn}”
          </Text>
          <View style={styles.focusFooter}>
            <View style={styles.line} />
            <Text style={styles.focusAuthor}>
              {i18n.language === 'tr' ? dietitianProfile.messageTr : dietitianProfile.messageEn}
            </Text>
          </View>
        </Card>

        {/* Settings Links */}
        <Text style={styles.settingsHeader}>{t('profile.settings')}</Text>
        <View style={styles.settingsGroup}>
          {/* Notifications */}
          <Pressable style={styles.settingsRow} onPress={() => Alert.alert(t('profile.notificationSettings'), 'Bildirim ayarları açılıyor...')}>
            <Text style={styles.rowIcon}>🔔</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{t('profile.notificationSettings')}</Text>
              <Text style={styles.rowDesc}>{t('profile.notificationDesc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </Pressable>

          {/* Privacy */}
          <Pressable style={styles.settingsRow} onPress={() => Alert.alert(t('profile.privacy'), 'Gizlilik sözleşmesi açılıyor...')}>
            <Text style={styles.rowIcon}>🛡️</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{t('profile.privacy')}</Text>
              <Text style={styles.rowDesc}>{t('profile.privacyDesc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </Pressable>

          {/* Subscription */}
          <Pressable style={styles.settingsRow} onPress={() => navigation.navigate('Premium')}>
            <Text style={styles.rowIcon}>⭐</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{t('profile.subStatus')}</Text>
              <Text style={styles.rowDesc}>{t('profile.subStatusDesc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </Pressable>
          
          {/* Shopping list */}
          <Pressable style={styles.settingsRow} onPress={() => navigation.navigate('ShoppingList')}>
            <Text style={styles.rowIcon}>🛒</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{t('shoppingList.title')}</Text>
              <Text style={styles.rowDesc}>Alışveriş listenizi kontrol edin</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </Pressable>
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>🚪 {t('common.logOut')}</Text>
        </Pressable>

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
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  langBtn: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  scroll: {
    flex: 1,
  },
  profileHero: {
    height: 350,
    width: '90%',
    alignSelf: 'center',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 37, 18, 0.6)',
    padding: theme.spacing.lg,
  },
  profileName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  profileCredentials: {
    fontSize: 12,
    color: theme.colors.accentGold,
    fontWeight: theme.typography.weights.medium,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bioTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  instagramBadge: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  instagramText: {
    fontSize: 11,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  bioText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  tagBadge: {
    backgroundColor: '#EEF2D3',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
  },
  focusCard: {
    backgroundColor: '#EEF2D3',
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  focusQuote: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    fontStyle: 'italic',
    color: theme.colors.textDark,
    lineHeight: 24,
  },
  focusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  line: {
    width: 24,
    height: 1,
    backgroundColor: theme.colors.textMuted,
  },
  focusAuthor: {
    fontSize: 12,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
  },
  settingsHeader: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  settingsGroup: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.light,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: theme.spacing.lg,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
  },
  rowDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },
  logoutBtn: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: theme.colors.danger,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  bottomSpacing: {
    height: 40,
  },
});
export default ProfileScreen;
