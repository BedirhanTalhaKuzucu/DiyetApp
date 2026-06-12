# Challenge Sistem Genişletme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend challenges system with detail page, community view with enrolled/available sections, and progress tracking actions.

**Architecture:** ChallengesScreen shows enrolled (with progress) and available (with enroll button) sections. Tapping a challenge opens ChallengeDetailScreen with full details, progress bar, and action buttons to update progress. Home screen challenges are clickable and link to detail page. TrackingContext manages challenge progress updates.

**Tech Stack:** React Native, Expo, TypeScript, React Navigation, TrackingContext

---

### Task 1: Update ChallengesScreen with Enrolled/Available Sections

**Files:**
- Modify: `src/screens/challenges/ChallengesScreen.tsx`

- [ ] **Step 1: Replace current flat list with sections**

```typescript
return (
  <SafeAreaView style={styles.safeContainer}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>{t('challenges.title')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.challengesList}>
        {/* Enrolled Challenges */}
        {enrolledChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('challenges.enrolled')}</Text>
            {enrolledChallenges.map(ch => renderChallengeCard(ch, true))}
          </>
        )}

        {/* Available Challenges */}
        {availableChallenges.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>
              {t('challenges.available')}
            </Text>
            {availableChallenges.map(ch => renderChallengeCard(ch, false))}
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  </SafeAreaView>
);
```

- [ ] **Step 2: Update renderChallengeCard to be navigable**

```typescript
const renderChallengeCard = (challenge: Challenge, isEnrolled: boolean) => {
  const progress = Math.round((challenge.current / challenge.target) * 100);

  return (
    <Pressable
      key={challenge.id}
      onPress={() => navigation.navigate('ChallengeDetail', { challengeId: challenge.id })}
      style={[styles.challengeCard, { borderRadius: 20, overflow: 'hidden' }]}
    >
      {/* existing card content */}
    </Pressable>
  );
};
```

- [ ] **Step 3: Add navigation prop to component**

Add to component signature:
```typescript
type ChallengesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Challenges'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ChallengesScreenNavigationProp;
}

export const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
```

- [ ] **Step 4: Commit**

```bash
git add src/screens/challenges/ChallengesScreen.tsx
git commit -m "feat: add enrolled/available sections and navigation to ChallengesScreen"
```

---

### Task 2: Add updateChallengeProgress to TrackingContext

**Files:**
- Modify: `src/context/TrackingContext.tsx`

- [ ] **Step 1: Add updateChallengeProgress method**

After `leaveChallenge` method:
```typescript
const updateChallengeProgress = (challengeId: string, increment: number) => {
  setChallenges(prev =>
    prev.map(ch => 
      ch.id === challengeId 
        ? { ...ch, current: Math.min(ch.current + increment, ch.target) }
        : ch
    )
  );
};
```

- [ ] **Step 2: Add to context type interface**

In TrackingContextType, add:
```typescript
updateChallengeProgress: (challengeId: string, increment: number) => void;
```

- [ ] **Step 3: Export in provider value**

```typescript
updateChallengeProgress,
```

- [ ] **Step 4: Commit**

```bash
git add src/context/TrackingContext.tsx
git commit -m "feat: add updateChallengeProgress method to TrackingContext"
```

---

### Task 3: Create ChallengeDetailScreen

**Files:**
- Create: `src/screens/challenges/ChallengeDetailScreen.tsx`

- [ ] **Step 1: Create the screen file with complete implementation**

```typescript
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { useTracking } from '../../context/TrackingContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChallengeDetail'>;

export const ChallengeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { challengeId } = route.params;
  const { challenges, enrollChallenge, leaveChallenge, updateChallengeProgress } = useTracking();

  const challenge = useMemo(() => 
    challenges.find(ch => ch.id === challengeId), 
    [challenges, challengeId]
  );

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Challenge not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = Math.round((challenge.current / challenge.target) * 100);
  const remaining = challenge.target - challenge.current;

  const handleProgressUpdate = (amount: number) => {
    updateChallengeProgress(challengeId, amount);
  };

  const handleEnroll = () => {
    enrollChallenge(challengeId);
    Alert.alert('Başarılı', 'Mücadeleye katıldınız!');
  };

  const handleLeave = () => {
    Alert.alert('Mücadeleden Ayrıl', 'Emin misiniz?', [
      { text: t('common.cancel'), style: 'cancel' },
      { 
        text: 'Ayrıl', 
        style: 'destructive',
        onPress: () => {
          leaveChallenge(challengeId);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('challenges.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <Card style={[styles.headerCard, { backgroundColor: challenge.color + '15', borderWidth: 1, borderColor: challenge.color + '30' }]}>
          <View style={styles.headerContent}>
            <View style={[styles.iconBg, { backgroundColor: challenge.color + '25' }]}>
              <Ionicons name={challenge.icon as any} size={40} color={challenge.color} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{challenge.name}</Text>
              <Text style={styles.description}>{challenge.description}</Text>
            </View>
          </View>
        </Card>

        {/* Progress Section */}
        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>İlerleme</Text>
          
          <View style={styles.progressStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{progress}%</Text>
              <Text style={styles.statLabel}>Tamamlama</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{challenge.current}</Text>
              <Text style={styles.statLabel}>Güncel</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{remaining}</Text>
              <Text style={styles.statLabel}>Kalan</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
            </View>
            <Text style={styles.progressLabel}>{challenge.current} / {challenge.target} {challenge.unit}</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        {challenge.enrolled && (
          <Card style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>İlerleme Ekle</Text>
            
            <View style={styles.actionButtonsRow}>
              <Pressable 
                style={[styles.actionBtn, { backgroundColor: challenge.color + '20' }]}
                onPress={() => handleProgressUpdate(10)}
              >
                <Ionicons name="add" size={20} color={challenge.color} />
                <Text style={[styles.actionBtnText, { color: challenge.color }]}>10</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionBtn, { backgroundColor: challenge.color + '20' }]}
                onPress={() => handleProgressUpdate(25)}
              >
                <Ionicons name="add" size={20} color={challenge.color} />
                <Text style={[styles.actionBtnText, { color: challenge.color }]}>25</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionBtn, { backgroundColor: challenge.color + '20' }]}
                onPress={() => handleProgressUpdate(50)}
              >
                <Ionicons name="add" size={20} color={challenge.color} />
                <Text style={[styles.actionBtnText, { color: challenge.color }]}>50</Text>
              </Pressable>
            </View>

            <Pressable 
              style={[styles.fullWidthBtn, { backgroundColor: challenge.color }]}
              onPress={handleLeave}
            >
              <Text style={styles.fullWidthBtnText}>Mücadeleden Ayrıl</Text>
            </Pressable>
          </Card>
        )}

        {!challenge.enrolled && (
          <Card style={styles.actionsCard}>
            <Pressable 
              style={[styles.fullWidthBtn, { backgroundColor: challenge.color }]}
              onPress={handleEnroll}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.fullWidthBtnText}>Katıl</Text>
            </Pressable>
          </Card>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8B9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textDark,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  headerCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.lg,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  progressCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#E2E8B9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFg: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  actionsCard: {
    padding: theme.spacing.lg,
    borderRadius: 20,
    marginBottom: theme.spacing.lg,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fullWidthBtn: {
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  fullWidthBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ChallengeDetailScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/challenges/ChallengeDetailScreen.tsx
git commit -m "feat: create ChallengeDetailScreen with progress tracking"
```

---

### Task 4: Add ChallengeDetail Route to Navigation

**Files:**
- Modify: `src/types/navigation.ts`
- Modify: `src/navigation/Navigation.tsx`

- [ ] **Step 1: Update RootStackParamList**

```typescript
export type RootStackParamList = {
  Welcome: undefined;
  GoalSelection: undefined;
  MainApp: undefined;
  RecipeDetail: { recipeId: string };
  Premium: undefined;
  ShoppingList: undefined;
  Challenges: undefined;
  ChallengeDetail: { challengeId: string };
};
```

- [ ] **Step 2: Import ChallengeDetailScreen and add route**

In Navigation.tsx:
```typescript
import ChallengeDetailScreen from '../screens/challenges/ChallengeDetailScreen';

// In Navigation component, add:
<Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
```

- [ ] **Step 3: Commit**

```bash
git add src/types/navigation.ts src/navigation/Navigation.tsx
git commit -m "feat: add ChallengeDetail route to navigation"
```

---

### Task 5: Make HomeScreen Challenges Clickable

**Files:**
- Modify: `src/screens/home/HomeScreen.tsx`

- [ ] **Step 1: Wrap challenge progress cards with Pressable**

Update the challenge progress section:
```typescript
{enrolledChallenges.slice(0, 2).map((challenge) => {
  const progress = Math.round((challenge.current / challenge.target) * 100);
  return (
    <Pressable
      key={challenge.id}
      onPress={() => navigation.navigate('ChallengeDetail', { challengeId: challenge.id })}
    >
      <Card style={styles.challengeProgressCard}>
        {/* existing card content */}
      </Card>
    </Pressable>
  );
})}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/home/HomeScreen.tsx
git commit -m "feat: make challenge cards clickable on HomeScreen"
```

---

### Task 6: Update Translations for Detail Screen

**Files:**
- Modify: `src/i18n/locales/tr.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Add Turkish translations**

In tr.json challenges section, add:
```json
"detail": {
  "progress": "İlerleme",
  "completion": "Tamamlama",
  "current": "Güncel",
  "remaining": "Kalan",
  "addProgress": "İlerleme Ekle",
  "leave": "Mücadeleden Ayrıl",
  "join": "Katıl",
  "leaveConfirm": "Mücadeleden ayrılmak istediğinize emin misiniz?",
  "joinSuccess": "Mücadeleye katıldınız!",
  "progressAdded": "eklendi!"
}
```

- [ ] **Step 2: Add English translations**

In en.json challenges section, add:
```json
"detail": {
  "progress": "Progress",
  "completion": "Completion",
  "current": "Current",
  "remaining": "Remaining",
  "addProgress": "Add Progress",
  "leave": "Leave Challenge",
  "join": "Join",
  "leaveConfirm": "Are you sure you want to leave this challenge?",
  "joinSuccess": "You joined the challenge!",
  "progressAdded": "added!"
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/locales/tr.json src/i18n/locales/en.json
git commit -m "feat: add challenge detail translations"
```
