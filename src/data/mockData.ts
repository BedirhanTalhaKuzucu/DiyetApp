export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  nameKey: string;
  nameTr: string;
  nameEn: string;
  calories: number;
  prepTime: number;
  isPremium: boolean;
  imagePlaceholder: string;
}

export interface Recipe {
  id: string;
  titleKey: string;
  titleTr: string;
  titleEn: string;
  categoryTr: string;
  categoryEn: string;
  calories: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  protein: number;
  carbs: number;
  fat: number;
  dietitianTipTr: string;
  dietitianTipEn: string;
  ingredientsTr: string[];
  ingredientsEn: string[];
  stepsTr: string[];
  stepsEn: string[];
  imagePlaceholder: string;
  isPremium: boolean;
}

export interface Challenge {
  id: string;
  titleKey: string;
  titleTr: string;
  titleEn: string;
  category: 'nutrition' | 'mindful';
  durationTr: string;
  durationEn: string;
  activeMembers: string;
  isPremium: boolean;
  progressPercent: number;
  currentDay?: number;
  totalDays?: number;
  imagePlaceholder: string;
  descTr: string;
  descEn: string;
}

export interface ShoppingItem {
  id: string;
  nameTr: string;
  nameEn: string;
  category: 'vegetables' | 'fruits' | 'protein' | 'dairy' | 'grains' | 'snacks';
  checked: boolean;
}

export const dietitianProfile = {
  name: 'Buse Simge',
  credentials: 'MSC, RD • CLINICAL NUTRITION',
  imagePlaceholder: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
  instagram: '@bubesimge.nutrition',
  bioTr: '12 yılı aşkın klinik deneyimiyle Buse Simge, metabolik sağlık ve bitki bazlı beslenme konularında uzmanlaşmıştır. Hem zihni hem de bedeni iyileştirmek ve beslemek için bütünsel gıdaların gücüne inanmaktadır. Yaklaşımı kişiselleştirilmiş, bilimsel doğrulukla derinden bütünleşmiştir.',
  bioEn: 'With over 12 years of clinical experience, Buse Simge specializes in metabolic health and plant-based nutrition. She believes in the power of whole foods to heal and nourish both mind and body. Her approach is editorial, personalized, and deeply rooted in scientific accuracy.',
  tagsTr: ['METABOLİK SAĞLIK', 'BİTKİ BAZLI', 'BAĞIRSAK SAĞLIĞI'],
  tagsEn: ['METABOLIC HEALTH', 'PLANT-BASED', 'GUT WELLNESS'],
  weeklyFocusTr: 'Bu hafta, yenileyici hidrasyona odaklanalım. Sabah içtiğiniz suya bir nane yaprağı veya bir dilim salatalık eklemek, basit bir alışkanlığı özenli bir ritüele dönüştürebilir.',
  weeklyFocusEn: 'This week, let\'s focus on restorative hydration. Adding just a sprig of mint or a slice of cucumber to your morning water can transform a simple habit into a ritual of care.',
  messageTr: 'Sevgilerle, Buse Simge',
  messageEn: 'Warmly, Buse Simge'
};

export const mockGoals = [
  { id: 'lose_weight', translationKey: 'goals.lose_weight', icon: 'scale' },
  { id: 'eat_healthier', translationKey: 'goals.eat_healthier', icon: 'food-apple' },
  { id: 'build_habits', translationKey: 'goals.build_habits', icon: 'checkbox-marked-circle' },
  { id: 'track_macros', translationKey: 'goals.track_macros', icon: 'calculator' },
  { id: 'discover_recipes', translationKey: 'goals.discover_recipes', icon: 'book-open-variant' },
  { id: 'follow_plan', translationKey: 'goals.follow_plan', icon: 'clipboard-text' }
];

export const mockMeals: Meal[] = [
  {
    id: 'm1',
    type: 'breakfast',
    nameKey: 'meals.breakfast',
    nameTr: 'Avokado ve Yumurtalı Çavdar Ekmeği',
    nameEn: 'Avocado & Egg Rye Toast',
    calories: 320,
    prepTime: 10,
    isPremium: false,
    imagePlaceholder: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'm2',
    type: 'lunch',
    nameKey: 'meals.lunch',
    nameTr: 'Fırınlanmış Nohut Salatası',
    nameEn: 'Roasted Chickpea Salad',
    calories: 420,
    prepTime: 20,
    isPremium: false,
    imagePlaceholder: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'm3',
    type: 'dinner',
    nameKey: 'meals.dinner',
    nameTr: 'Izgara Somon ve Buharda Kuşkonmaz',
    nameEn: 'Grilled Salmon & Steamed Asparagus',
    calories: 480,
    prepTime: 25,
    isPremium: true,
    imagePlaceholder: 'https://images.unsplash.com/photo-1485921325814-a5341826fb8e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'm4',
    type: 'snack',
    nameKey: 'meals.snack',
    nameTr: 'Chia Puding ve Orman Meyveleri',
    nameEn: 'Chia Pudding with Berries',
    calories: 180,
    prepTime: 5,
    isPremium: true,
    imagePlaceholder: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    titleKey: 'roasted_chickpea_salad',
    titleTr: 'Fırınlanmış Nohut Salatası',
    titleEn: 'Roasted Chickpea Salad',
    categoryTr: 'VEJETARYEN LEZZETİ',
    categoryEn: 'VEGETARIAN DELIGHT',
    calories: 420,
    prepTime: 20,
    difficulty: 'easy',
    protein: 14,
    carbs: 52,
    fat: 18,
    dietitianTipTr: 'Nohutları fırınlarken bir tutam tütsülenmiş toz biber eklemek, ekstra sodyum eklemeden lezzeti inanılmaz derecede artırır.',
    dietitianTipEn: 'Roast the chickpeas with a pinch of smoked paprika to enhance the umami flavor without adding extra sodium.',
    ingredientsTr: [
      '1 kutu (400g) Nohut, yıkanmış ve süzülmüş',
      '2 su bardağı Taze Roka veya Bebek Ispanak',
      '1/2 adet Salatalık, küp doğranmış',
      '1 yemek kaşığı Zeytinyağı & Limon suyu'
    ],
    ingredientsEn: [
      '1 can (15oz) Chickpeas, drained and rinsed',
      '2 cups Fresh Arugula or Baby Spinach',
      '1/2 cup Cucumber, diced',
      '1 tbsp Olive Oil & Lemon juice'
    ],
    stepsTr: [
      'Fırını 200°C\'ye ısıtın. Nohutları kurulayın, zeytinyağı, tuz ve baharatlarla harmanlayın.',
      'Fırın tepsisine yayın ve çıtırdayıp altın sarısı olana kadar 15-20 dakika fırınlayın.',
      'Nohutlar fırındayken roka, salatalık ve domateslerden tabanı hazırlayın. Üzerine limonlu tahin sosu gezdirin.'
    ],
    stepsEn: [
      'Preheat your oven to 400°F (200°C). Pat the chickpeas dry and toss with olive oil, salt, and your favorite spices.',
      'Spread them on a baking sheet and roast for 15-20 minutes until crispy and golden brown.',
      'While chickpeas roast, prepare the base with arugula, cucumber, and tomatoes. Drizzle with lemon-tahini dressing.'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'r2',
    titleKey: 'avocado_egg_toast',
    titleTr: 'Avokado ve Yumurtalı Çavdar Ekmeği',
    titleEn: 'Avocado & Egg Rye Toast',
    categoryTr: 'KAHVALTI',
    categoryEn: 'BREAKFAST',
    calories: 320,
    prepTime: 10,
    difficulty: 'easy',
    protein: 16,
    carbs: 28,
    fat: 15,
    dietitianTipTr: 'Yumurta akı protein açısından zengindir, avokado ise sağlıklı yağlar sağlayarak sizi uzun süre tok tutar.',
    dietitianTipEn: 'Egg whites are rich in protein, while avocado supplies healthy fats that keep you satiated for longer.',
    ingredientsTr: [
      '1 dilim Ekşi Mayalı Çavdar Ekmeği',
      '1/2 Avokado, ezilmiş',
      '2 adet Haşlanmış Yumurta',
      'Pul biber ve çörek otu'
    ],
    ingredientsEn: [
      '1 slice Sourdough Rye Toast',
      '1/2 Avocado, mashed',
      '2 Poached Eggs',
      'Chili flakes & black sesame seeds'
    ],
    stepsTr: [
      'Çavdar ekmeğini kızartın.',
      'Avokadoyu tuz ve limonla ezerek kızarmış ekmeğin üzerine sürün.',
      'Haşlanmış yumurtaları üzerine dilimleyip baharatları serpiştirin.'
    ],
    stepsEn: [
      'Toast the rye bread slice.',
      'Mash avocado with a pinch of salt and lemon juice, then spread on toast.',
      'Slice poached eggs on top and sprinkle with spices.'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'r3',
    titleKey: 'grilled_salmon',
    titleTr: 'Izgara Somon ve Kuşkonmaz',
    titleEn: 'Grilled Salmon & Asparagus',
    categoryTr: 'AKŞAM YEMEĞİ',
    categoryEn: 'DINNER',
    calories: 480,
    prepTime: 25,
    difficulty: 'medium',
    protein: 36,
    carbs: 12,
    fat: 26,
    dietitianTipTr: 'Omega-3 yağ asitleri kalp sağlığını destekler. Haftada en az iki kez somon tüketmeye özen gösterin.',
    dietitianTipEn: 'Omega-3 fatty acids support cardiac health. Aim to eat salmon at least twice a week.',
    ingredientsTr: [
      '150g Somon Fileto',
      '8 adet Kuşkonmaz',
      '1 yemek kaşığı Zeytinyağı',
      'Taze Sarımsak ve Limon dilimleri'
    ],
    ingredientsEn: [
      '150g Salmon Fillet',
      '8 Asparagus Spears',
      '1 tbsp Olive Oil',
      'Fresh Garlic & Lemon slices'
    ],
    stepsTr: [
      'Somon ve kuşkonmazları zeytinyağı, ezilmiş sarımsak ve limonla marine edin.',
      'Orta ateşte tavada veya ızgarada somonun her iki yüzünü 5-6 dakika pişirin.',
      'Kuşkonmazları hafif yumuşayana kadar soteleyip sıcak servis edin.'
    ],
    stepsEn: [
      'Marinate salmon and asparagus with olive oil, minced garlic, and lemon.',
      'Grill salmon for 5-6 minutes on each side over medium-high heat.',
      'Sauté asparagus until tender-crisp and serve warm.'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1485921325814-a5341826fb8e?q=80&w=600&auto=format&fit=crop',
    isPremium: true
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    titleKey: 'water_challenge',
    titleTr: '7 Günlük Su İçme Mücadelesi',
    titleEn: '7-Day Water Challenge',
    category: 'nutrition',
    durationTr: '7 Gün',
    durationEn: '7 Days',
    activeMembers: '1.2b+ katılıyor',
    isPremium: false,
    progressPercent: 57,
    currentDay: 4,
    totalDays: 7,
    imagePlaceholder: 'https://images.unsplash.com/photo-1548839134-660c474b2150?q=80&w=400&auto=format&fit=crop',
    descTr: 'Vücudunuzu hidre edin. Her gün en az 2.5 litre su tüketerek metabolizmanızı canlandırın.',
    descEn: 'Hydrate your body. Drink at least 2.5 liters of water daily to energize your metabolism.'
  },
  {
    id: 'c2',
    titleKey: 'breakfast_challenge',
    titleTr: '14 Günlük Dengeli Kahvaltı Mücadelesi',
    titleEn: '14-Day Balanced Breakfast Challenge',
    category: 'nutrition',
    durationTr: '14 Gün',
    durationEn: '14 Days',
    activeMembers: '4.8b Aktif Üye',
    isPremium: false,
    progressPercent: 0,
    imagePlaceholder: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    descTr: 'Güne besleyici protein ve lif açısından zengin kahvaltılarla başlayarak güne enerjik adım atın.',
    descEn: 'Kickstart your metabolism with protein-rich morning rituals designed by our top nutritionists.'
  },
  {
    id: 'c3',
    titleKey: 'sugar_free',
    titleTr: 'Şekersiz Bir Hafta',
    titleEn: 'Sugar-Free Week',
    category: 'nutrition',
    durationTr: '7 Gün',
    durationEn: '7 Days',
    activeMembers: 'Premium',
    isPremium: true,
    progressPercent: 0,
    imagePlaceholder: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=600&auto=format&fit=crop',
    descTr: 'İşlenmiş şekere veda edin. Kan şekerini dengeleyen ve enerji seviyesini optimize eden arınma protokolü.',
    descEn: 'Break the cycle. An intensive 7-day detox protocol focused on glycemic stability and energy optimization.'
  }
];

export const mockShoppingList: ShoppingItem[] = [
  { id: 's1', nameTr: 'Nohut (2 konserve)', nameEn: 'Chickpeas (2 cans)', category: 'protein', checked: false },
  { id: 's2', nameTr: 'Taze Roka (2 paket)', nameEn: 'Fresh Arugula (2 packs)', category: 'vegetables', checked: true },
  { id: 's3', nameTr: 'Salatalık (1 kg)', nameEn: 'Cucumber (1 kg)', category: 'vegetables', checked: false },
  { id: 's4', nameTr: 'Avokado (3 adet)', nameEn: 'Avocado (3 pcs)', category: 'fruits', checked: false },
  { id: 's5', nameTr: 'Yumurta (10 adet)', nameEn: 'Eggs (10 pcs)', category: 'dairy', checked: true },
  { id: 's6', nameTr: 'Çavdar Ekmeği (1 somun)', nameEn: 'Rye Bread (1 loaf)', category: 'grains', checked: false },
  { id: 's7', nameTr: 'Somon Fileto (300g)', nameEn: 'Salmon Fillet (300g)', category: 'protein', checked: false },
  { id: 's8', nameTr: 'Çiğ Badem (200g)', nameEn: 'Raw Almonds (200g)', category: 'snacks', checked: false }
];
