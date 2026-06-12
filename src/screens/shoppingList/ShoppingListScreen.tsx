import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { mockShoppingList, ShoppingItem } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'ShoppingList'>;

export const ShoppingListScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [list, setList] = useState<ShoppingItem[]>(mockShoppingList);

  const toggleCheck = (id: string) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleShare = () => {
    Alert.alert(t('shoppingList.share'), 'Alışveriş listeniz panoya kopyalandı ve paylaşıldı!');
  };

  const handleGenerate = () => {
    Alert.alert(t('shoppingList.generate'), 'Bu haftanın beslenme planından yeni alışveriş listesi başarıyla oluşturuldu!');
  };

  // Group items by category
  const categories: ShoppingItem['category'][] = ['vegetables', 'fruits', 'protein', 'dairy', 'grains', 'snacks'];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('shoppingList.title')}</Text>
        <Pressable onPress={handleShare} style={styles.shareIconBtn}>
          <Text style={styles.shareIcon}>📤</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {categories.map((category) => {
          const categoryItems = list.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <View key={category} style={styles.categoryBlock}>
              <Text style={styles.categoryTitle}>{t(`shoppingList.categories.${category}`)}</Text>
              <View style={styles.itemsBox}>
                {categoryItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleCheck(item.id)}
                    style={styles.itemRow}
                  >
                    <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                      {item.checked && <Text style={styles.checkText}>✓</Text>}
                    </View>
                    <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                      {item.nameTr}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={t('shoppingList.generate')}
            onPress={handleGenerate}
            style={styles.actionBtn}
          />
          <Pressable style={styles.shareLink} onPress={handleShare}>
            <Text style={styles.shareLinkText}>{t('shoppingList.share')}</Text>
          </Pressable>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backText: {
    fontSize: 18,
    color: theme.colors.textDark,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  shareIconBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  shareIcon: {
    fontSize: 16,
  },
  scroll: {
    flex: 1,
  },
  categoryBlock: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  categoryTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
    marginLeft: 2,
  },
  itemsBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.light,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textDark,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  actionBtn: {
    width: '100%',
  },
  shareLink: {
    paddingVertical: theme.spacing.sm,
  },
  shareLinkText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 40,
  },
});
export default ShoppingListScreen;
