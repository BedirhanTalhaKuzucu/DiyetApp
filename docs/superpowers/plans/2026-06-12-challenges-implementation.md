# Challenges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a challenges system where users can enroll in fitness/nutrition challenges, track progress, and see available challenges to join.

**Architecture:** Challenges are managed in TrackingContext with state for enrolled and available challenges. Each challenge tracks category, target, current progress, and dates. Challenges Screen shows enrolled vs available. Home Screen displays progress summary for enrolled challenges.

**Tech Stack:** React Native, Expo, TypeScript, TrackingContext, i18next

---

### Task 1: Define Challenge Types

**Files:**
- Modify: `src/types/meal.ts`

- [ ] **Step 1: Add Challenge interface to meal.ts**

```typescript
export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: 'calories' | 'protein' | 'water' | 'steps';
  icon: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  color: string;
  enrolled: boolean;
}
```

---

### Task 2: Create Mock Challenges Data

**Files:**
- Create: `src/data/mockChallenges.ts`

- [ ] **Step 1: Create mock challenges file**

```typescript
import { Challenge } from '../types/meal';

export const mockChallenges: Challenge[] = [
  {
    id: 'ch_1',
    name: 'Su İçme Kampanyası',
    description: 'Günlük 2 litre su içme hedefi',
    category: 'water',
    icon: 'water-outline',
    target: 8,
    current: 5,
    unit: 'bardak',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    color: '#4FC3F7',
    enrolled: true,
  },
  {
    id: 'ch_2',
    name: 'Protein Hedefi',
    description: 'Günlük 150g protein tüketme',
    category: 'protein',
    icon: 'barbell-outline',
    target: 150,
    current: 120,
    unit: 'gram',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    color: '#A5D6A7',
    enrolled: true,
  },
  {
    id: 'ch_3',
    name: 'Kalori Kontrolü',
    description: '2000 kcal günlük hedef',
    category: 'calories',
    icon: 'flame-outline',
    target: 2000,
    current: 1800,
    unit: 'kcal',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    color: '#FFB74D',
    enrolled: false,
  },
  {
    id: 'ch_4',
    name: 'Sabah Sporu',
    description: 'Her gün sabah egzersiz yap',
    category: 'steps',
    icon: 'walk-outline',
    target: 10000,
    current: 0,
    unit: 'adım',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    color: '#EF9A9A',
    enrolled: false,
  },
];
```

---

### Task 3: Update TrackingContext for Challenges

**Files:**
- Modify: `src/context/TrackingContext.tsx`

- [ ] **Step 1: Import Challenge type and mock data**

Add at top after other imports:
```typescript
import { Challenge } from '../types/meal';
import { mockChallenges } from '../data/mockChallenges';
```

- [ ] **Step 2: Add challenges state to TrackingProvider**

In the TrackingProvider function, after `loggedMeals` state, add:
```typescript
const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
```

- [ ] **Step 3: Add enrollChallenge method**

Add after `removeMeal` function:
```typescript
const enrollChallenge = (challengeId: string) => {
  setChallenges(prev =>
    prev.map(ch => ch.id === challengeId ? { ...ch, enrolled: true } : ch)
  );
};
```

- [ ] **Step 4: Add leaveChallenge method**

```typescript
const leaveChallenge = (challengeId: string) => {
  setChallenges(prev =>
    prev.map(ch => ch.id === challengeId ? { ...ch, enrolled: false } : ch)
  );
};
```

- [ ] **Step 5: Update provider value**

In the return statement's value object, add:
```typescript
challenges,
enrollChallenge,
leaveChallenge,
```

---

### Task 4: Refactor ChallengesScreen Structure

**Files:**
- Modify: `src/screens/plans/ChallengesScreen.tsx`

- [ ] **Step 1: Replace ChallengesScreen with enrolled/available sections**

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { Card } from '../../components/cards/Card';
import { useTracking } from '../../context/TrackingContext';

export const ChallengesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { challenges, enrollChallenge, leaveChallenge } = useTracking();

  const enrolledChallenges = challenges.filter(ch => ch.enrolled);
  const availableChallenges = challenges.filter(ch => !ch.enrolled);

  const renderChallengeCard = (challenge, isEnrolled: boolean) => {
    const progress = Math.round((challenge.current / challenge.target) * 100);
    
    return (
      <Card key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeContent}>
          <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
            <Ionicons name={challenge.icon as any} size={24} color={challenge.color} />
          </View>
          
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeName}>{challenge.name}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>
            
            {isEnrolled && (
              <>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
                </View>
                <Text style={styles.progressText}>{challenge.current} / {challenge.target} {challenge.unit}</Text>
              </>
            )}
          </View>

          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: challenge.color + '20' }
            ]}
            onPress={() => {
              if (isEnrolled) {
                leaveChallenge(challenge.id);
              } else {
                enrollChallenge(challenge.id);
              }
            }}
          >
            <Ionicons
              name={isEnrolled ? 'checkmark' : 'add'}
              size={20}
              color={challenge.color}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t('challenges.title')}</Text>

        {/* Enrolled Challenges */}
        {enrolledChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Katıldığım Mücadeleler</Text>
            {enrolledChallenges.map(ch => renderChallengeCard(ch, true))}
          </>
        )}

        {/* Available Challenges */}
        {availableChallenges.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Diğer Mücadeleler</Text>
            {availableChallenges.map(ch => renderChallengeCard(ch, false))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  challengeCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  challengeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  progressBg: {
    height: 4,
    backgroundColor: '#E2E8B9',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFg: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

### Task 5: Add Challenge Progress Section to Home Screen

**Files:**
- Modify: `src/screens/home/HomeScreen.tsx`

- [ ] **Step 1: Import challenges from useTracking**

In the useTracking hook call, add `challenges` to destructuring.

- [ ] **Step 2: Add challenges section after logged meals**

After the logged meals section (before Go Premium card), add:

```typescript
{/* Challenge Progress - Mücadele İlerlemesi */}
{(() => {
  const enrolledChallenges = challenges.filter(ch => ch.enrolled);
  return enrolledChallenges.length > 0 ? (
    <>
      <View style={styles.challengeProgressHeader}>
        <Text style={styles.sectionTitle}>Mücadeleler</Text>
        <Pressable onPress={() => navigation.navigate('Challenges')}>
          <Text style={styles.editBtnText}>Hepsini Gör</Text>
        </Pressable>
      </View>
      {enrolledChallenges.slice(0, 2).map((challenge) => {
        const progress = Math.round((challenge.current / challenge.target) * 100);
        return (
          <Card key={challenge.id} style={styles.challengeProgressCard}>
            <View style={styles.challengeProgressContent}>
              <View style={[styles.challengeProgressIcon, { backgroundColor: challenge.color + '20' }]}>
                <Ionicons name={challenge.icon as any} size={20} color={challenge.color} />
              </View>
              
              <View style={styles.challengeProgressInfo}>
                <Text style={styles.challengeProgressName}>{challenge.name}</Text>
                <View style={styles.challengeProgressBg}>
                  <View style={[styles.challengeProgressFg, { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color }]} />
                </View>
                <Text style={styles.challengeProgressText}>{challenge.current} / {challenge.target} {challenge.unit}</Text>
              </View>

              <Text style={styles.challengeProgressPercent}>{progress}%</Text>
            </View>
          </Card>
        );
      })}
    </>
  ) : null;
})()}
```

- [ ] **Step 3: Add challenge styles to StyleSheet**

```typescript
challengeProgressHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: theme.spacing.sm,
  marginTop: theme.spacing.lg,
},
challengeProgressCard: {
  padding: theme.spacing.md,
  marginBottom: theme.spacing.md,
  borderRadius: 20,
  backgroundColor: '#F5F7EE',
},
challengeProgressContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
},
challengeProgressIcon: {
  width: 44,
  height: 44,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
},
challengeProgressInfo: {
  flex: 1,
},
challengeProgressName: {
  fontSize: 12,
  fontWeight: '700',
  color: theme.colors.textDark,
  marginBottom: 6,
},
challengeProgressBg: {
  height: 4,
  backgroundColor: '#E2E8B9',
  borderRadius: 2,
  marginBottom: 4,
},
challengeProgressFg: {
  height: '100%',
  borderRadius: 2,
},
challengeProgressText: {
  fontSize: 10,
  color: theme.colors.textMuted,
  fontWeight: '600',
},
challengeProgressPercent: {
  fontSize: 14,
  fontWeight: '700',
  color: theme.colors.textDark,
  minWidth: 35,
  textAlign: 'right',
},
```

---

### Task 6: Add Challenge i18n Translations

**Files:**
- Modify: `src/i18n/locales/tr.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Step 1: Add Turkish translations**

In tr.json, add to root:
```json
"challenges": {
  "title": "Mücadeleler",
  "enrolled": "Katıldığım Mücadeleler",
  "available": "Diğer Mücadeleler",
  "join": "Katıl",
  "leave": "Ayrıl",
  "viewAll": "Hepsini Gör"
}
```

- [ ] **Step 2: Add English translations**

In en.json, add to root:
```json
"challenges": {
  "title": "Challenges",
  "enrolled": "My Challenges",
  "available": "Other Challenges",
  "join": "Join",
  "leave": "Leave",
  "viewAll": "View All"
}
```
