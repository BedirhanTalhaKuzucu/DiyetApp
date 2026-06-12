# Öğün Kaydetme Sistemi - Tasarım Dokümanı

**Tarih:** 2026-06-12  
**Durum:** Onay Bekliyor  
**Versiyon:** 1.0

## Özet

Ana ekrandaki "Öğün Ekle" butonuna tıklandığında açılacak modal tabanlı öğün kaydetme sistemi. Kullanıcılar yemek arayabilir (Edamam API), manuel girebilir, fotoğraf ekleyebilir, gram/porsiyon seçebilir ve kalori/makro değerleri otomatik hesaplanır.

## Gereksinimler

### Fonksiyonel Gereksinimler
1. Yemek arama (Edamam Nutrition API entegrasyonu)
2. Manuel yemek girişi (API'de bulunamayan yemekler için)
3. Fotoğrafla yemek kaydı (expo-image-picker)
4. Gram/porsiyon seçimi ve miktarı ayarlama
5. Kalori ve makro değerlerinin otomatik hesaplanması
6. Eklenen öğünlerin TrackingContext'e kaydedilmesi
7. Ana ekran kalori/makro kartının anlık güncellenmesi

### Kullanıcı Akışı
1. Ana ekranda "Öğün Ekle" quick action butonuna tıklama
2. Modal açılır, 2 sekme görünür: "🔍 Ara" | "📝 Manuel Ekle"
3. **Arama sekmesi:**
   - Arama input'una yemek adı yazılır
   - Edamam API'den sonuçlar gelir
   - Kullanıcı bir yemek seçer
   - Porsiyon/gram seçer
   - Opsiyonel fotoğraf ekler
   - "Kaydet" butonuna basar
4. **Manuel sekme:**
   - Yemek adı, kalori, protein, karbonhidrat, yağ manuel girilir
   - Porsiyon/miktar bilgisi eklenir
   - Opsiyonel fotoğraf ekler
   - "Kaydet" butonuna basar
5. Öğün TrackingContext'e eklenir
6. Modal kapanır
7. Ana ekrandaki kalori/makro kartı güncellenir

## Mimari Tasarım

### Bileşen Hiyerarşisi
```
HomeScreen (mevcut)
  └─ AddMealModal (yeni)
      ├─ TabSelector (Ara | Manuel Ekle)
      ├─ SearchTab
      │   ├─ SearchInput
      │   ├─ FoodSearchResults
      │   └─ PhotoPicker
      ├─ ManualTab
      │   ├─ MealNameInput
      │   ├─ NutrientInputs (kalori, protein, carbs, fat)
      │   ├─ PortionInput
      │   └─ PhotoPicker
      └─ SaveButton
```

### Servisler
```
src/services/
  └─ EdamamService.ts
      ├─ searchFood(query: string): Promise<FoodItem[]>
      └─ calculateNutrients(foodId: string, quantity: number, unit: string)
```

### Veri Modelleri

#### LoggedMeal Interface
```typescript
interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;      // "100g", "1 porsiyon", "1 tabak"
  quantity: number;     // Miktar (1, 2, 150 gibi)
  photo?: string;       // Local URI
  timestamp: Date;
  source: 'api' | 'manual';
}
```

#### FoodItem (Edamam API Response)
```typescript
interface FoodItem {
  foodId: string;
  label: string;
  nutrients: {
    ENERC_KCAL: number;  // Kalori
    PROCNT: number;      // Protein
    CHOCDF: number;      // Karbonhidrat
    FAT: number;         // Yağ
  };
  measures: Array<{
    label: string;       // "gram", "ounce", "serving"
    weight: number;
  }>;
}
```

## UI Tasarımı

### Modal Yapısı
- **Boyut:** Ekranın %70'i (height)
- **Pozisyon:** Alt taraftan açılır (bottom sheet style)
- **Animasyon:** Smooth slide-up
- **Tema:** Mevcut yeşil tema (#A3C585, #EEF2D3)

### Arama Sekmesi Layout
```
┌─────────────────────────────────────┐
│  Öğün Ekle                  [X]     │
├─────────────────────────────────────┤
│  [🔍 Ara]  [📝 Manuel Ekle]         │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────┐ [🔍]  │
│  │ Yemek ara...            │       │
│  └─────────────────────────┘       │
│                                     │
│  Sonuçlar:                          │
│  ┌───────────────────────────────┐ │
│  │ 🍗 Izgara Tavuk Göğsü         │ │
│  │ 165 kcal • P:31g C:0g F:3.6g  │ │
│  │                         [+ Ekle]│ │
│  └───────────────────────────────┘ │
│                                     │
│  📷 Fotoğraf Ekle (opsiyonel)      │
│  ┌─────────────┐                   │
│  │  [Fotoğraf] │                   │
│  └─────────────┘                   │
│                                     │
│  Porsiyon: [100g ▼]  [-] [150] [+] │
│                                     │
│  Hesaplanan Değerler:               │
│  Kalori: 247 • P:46g C:0g F:5g     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │         Kaydet                 │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Manuel Girişi Sekmesi Layout
```
┌─────────────────────────────────────┐
│  Öğün Ekle                  [X]     │
├─────────────────────────────────────┤
│  [🔍 Ara]  [📝 Manuel Ekle]         │
├─────────────────────────────────────┤
│                                     │
│  Yemek Adı:                         │
│  ┌───────────────────────────────┐ │
│  │ Ev yapımı salata              │ │
│  └───────────────────────────────┘ │
│                                     │
│  Kalori (kcal):                     │
│  ┌───────────────────────────────┐ │
│  │ 250                           │ │
│  └───────────────────────────────┘ │
│                                     │
│  Protein (g):    Karbonhidrat (g): │
│  ┌────────────┐  ┌──────────────┐ │
│  │ 12         │  │ 30           │ │
│  └────────────┘  └──────────────┘ │
│                                     │
│  Yağ (g):        Porsiyon/Miktar:  │
│  ┌────────────┐  ┌──────────────┐ │
│  │ 8          │  │ 1 tabak      │ │
│  └────────────┘  └──────────────┘ │
│                                     │
│  📷 Fotoğraf Ekle (opsiyonel)      │
│  ┌─────────────┐                   │
│  │  [Fotoğraf] │                   │
│  └─────────────┘                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │         Kaydet                 │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## API Entegrasyonu

### Edamam Nutrition API

**Endpoint:**
```
https://api.edamam.com/api/food-database/v2/parser
```

**Kimlik Doğrulama:**
- Application ID: (Ücretsiz kayıt ile alınır)
- Application Key: (Ücretsiz kayıt ile alınır)
- Limit: 10,000 istek/ay (freemium plan)

**Örnek İstek:**
```http
GET https://api.edamam.com/api/food-database/v2/parser?app_id={APP_ID}&app_key={APP_KEY}&ingr=tavuk%20göğsü&nutrition-type=logging
```

**Örnek Yanıt:**
```json
{
  "text": "tavuk göğsü",
  "parsed": [],
  "hints": [
    {
      "food": {
        "foodId": "food_abc123",
        "label": "Chicken Breast",
        "nutrients": {
          "ENERC_KCAL": 165,
          "PROCNT": 31,
          "FAT": 3.6,
          "CHOCDF": 0
        },
        "category": "Generic foods",
        "categoryLabel": "food"
      },
      "measures": [
        {
          "uri": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
          "label": "gram",
          "weight": 1.0
        },
        {
          "uri": "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce",
          "label": "ounce",
          "weight": 28.35
        }
      ]
    }
  ]
}
```

**Service Implementasyonu:**
```typescript
// src/services/EdamamService.ts
export class EdamamService {
  private static readonly BASE_URL = 'https://api.edamam.com/api/food-database/v2';
  private static readonly APP_ID = process.env.EDAMAM_APP_ID || '';
  private static readonly APP_KEY = process.env.EDAMAM_APP_KEY || '';

  static async searchFood(query: string): Promise<FoodItem[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/parser?app_id=${this.APP_ID}&app_key=${this.APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`
      );
      const data = await response.json();
      return data.hints.map((hint: any) => ({
        foodId: hint.food.foodId,
        label: hint.food.label,
        nutrients: hint.food.nutrients,
        measures: hint.measures,
      }));
    } catch (error) {
      console.error('Edamam API error:', error);
      return [];
    }
  }

  static calculateNutrients(
    baseNutrients: FoodItem['nutrients'],
    quantity: number,
    unitWeight: number
  ) {
    const multiplier = (quantity * unitWeight) / 100;
    return {
      calories: Math.round(baseNutrients.ENERC_KCAL * multiplier),
      protein: Math.round(baseNutrients.PROCNT * multiplier),
      carbs: Math.round(baseNutrients.CHOCDF * multiplier),
      fat: Math.round(baseNutrients.FAT * multiplier),
    };
  }
}
```

## State Yönetimi

### TrackingContext Güncellemeleri

**Yeni State:**
```typescript
const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
```

**Yeni Metodlar:**
```typescript
const addMeal = (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
  const newMeal: LoggedMeal = {
    ...meal,
    id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  setLoggedMeals(prev => [...prev, newMeal]);
};

const removeMeal = (mealId: string) => {
  setLoggedMeals(prev => prev.filter(m => m.id !== mealId));
};
```

**Dinamik Kalori/Makro Hesaplama:**
```typescript
// Mevcut hesaplamaya eklenir
const loggedCalories = BASELINE.calories + 
  completedMeals.reduce((sum, mealId) => {
    const macros = mealMacros[mealId];
    return macros ? sum + macros.calories : sum;
  }, 0) +
  loggedMeals.reduce((sum, meal) => sum + meal.calories, 0);

const proteinCurrent = BASELINE.protein + 
  completedMeals.reduce((sum, mealId) => {
    const macros = mealMacros[mealId];
    return macros ? sum + macros.protein : sum;
  }, 0) +
  loggedMeals.reduce((sum, meal) => sum + meal.protein, 0);

// Aynı şekilde carbsCurrent ve fatCurrent için
```

**Context Provider Güncellemesi:**
```typescript
<TrackingContext.Provider
  value={{
    // Mevcut değerler...
    loggedMeals,
    addMeal,
    removeMeal,
  }}
>
  {children}
</TrackingContext.Provider>
```

## Fotoğraf Yönetimi

### Kullanılacak Kütüphane
```bash
expo-image-picker
```

### Kurulum
```bash
npx expo install expo-image-picker
```

### İzin Yapılandırması

**app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Yemek fotoğraflarını kaydetmek için galeri erişimi gerekiyor.",
          "cameraPermission": "Yemek fotoğrafı çekmek için kamera erişimi gerekiyor."
        }
      ]
    ]
  }
}
```

### Implementasyon

**Fotoğraf Çekme/Seçme:**
```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImageFromCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('İzin Gerekli', 'Kamera erişimi için izin vermeniz gerekiyor.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled) {
    setPhotoUri(result.assets[0].uri);
  }
};

const pickImageFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled) {
    setPhotoUri(result.assets[0].uri);
  }
};
```

**Fotoğraf Gösterimi:**
- Modal içinde thumbnail preview
- Ana ekranda loggedMeals listesinde küçük thumbnail
- Tıklayınca tam boyut gösterim (opsiyonel sonraki aşama)

**Depolama:**
- Fotoğraflar local file system'de saklanır
- URI LoggedMeal objesine kaydedilir
- Cloud storage entegrasyonu sonraki aşamada (opsiyonel)

## Hata Yönetimi

### API Hataları
- **Timeout:** 10 saniye sonra hata mesajı
- **Network Error:** "İnternet bağlantınızı kontrol edin" mesajı
- **API Limit:** "Arama limiti aşıldı, lütfen manuel giriş yapın" mesajı
- **No Results:** "Sonuç bulunamadı, manuel giriş yapabilirsiniz" mesajı

### Validasyon
- **Arama sekmesi:** Boş seçim yapılamaz
- **Manuel sekme:** Tüm zorunlu alanlar doldurulmalı (name, calories)
- **Porsiyon:** 0'dan büyük olmalı
- **Fotoğraf:** Opsiyonel, hata durumunda atlama seçeneği

### Edge Cases
- API yavaş yanıt verirse loading indicator
- Fotoğraf yüklemesi başarısız olursa, fotoğraf olmadan kayıt devam eder
- Aynı yemek birden fazla kez eklenebilir (duplicate control yok)

## Test Senaryoları

### Temel Akış Testleri
1. Modal açılma/kapanma
2. Sekme geçişleri
3. API'den yemek arama
4. Arama sonuçlarından seçim
5. Porsiyon değiştirme
6. Manuel giriş yapma
7. Fotoğraf ekleme (kamera)
8. Fotoğraf ekleme (galeri)
9. Kaydet butonu
10. TrackingContext'e ekleme
11. Ana ekran güncelleme

### Hata Durumu Testleri
1. API timeout
2. Network yok
3. Boş arama
4. Sonuç bulunamadı
5. Kamera izni reddedildi
6. Galeri izni reddedildi
7. Geçersiz input değerleri

## Gelecek İyileştirmeler

**Faz 1 (Bu Tasarım):**
- Temel öğün ekleme
- Edamam API entegrasyonu
- Fotoğraf desteği
- Gram/porsiyon seçimi

**Faz 2 (Gelecek):**
- Öğün geçmişi ekranı
- Eklenen öğünleri listeleme/silme
- Favori yemekler
- Son eklenenler (quick add)
- Barkod tarama

**Faz 3 (İleri Aşama):**
- AI görüntü tanıma
- Cloud storage (fotoğraflar için)
- Öğün zamanı takibi (kahvaltı/öğle/akşam)
- İstatistikler ve raporlar

## Bağımlılıklar

### Yeni Paketler
```json
{
  "expo-image-picker": "~15.0.7"
}
```

### API Credentials (Environment Variables)
```
EDAMAM_APP_ID=your_app_id_here
EDAMAM_APP_KEY=your_app_key_here
```

**.env dosyası oluşturulmalı ve .gitignore'a eklenmelidir.**

## Dosya Yapısı

```
src/
├── components/
│   └── modals/
│       ├── AddMealModal.tsx          (Ana modal component)
│       ├── SearchTab.tsx              (Arama sekmesi)
│       ├── ManualTab.tsx              (Manuel giriş sekmesi)
│       └── PhotoPicker.tsx            (Fotoğraf seçici component)
├── services/
│   └── EdamamService.ts               (API service)
├── context/
│   └── TrackingContext.tsx            (Güncellenir)
├── types/
│   └── meal.ts                        (LoggedMeal, FoodItem interfaces)
└── screens/
    └── home/
        └── HomeScreen.tsx             (Modal trigger eklenir)
```

## Çeviri (i18n)

### Türkçe (tr.json)
```json
{
  "meal": {
    "addMeal": "Öğün Ekle",
    "searchTab": "Ara",
    "manualTab": "Manuel Ekle",
    "searchPlaceholder": "Yemek ara...",
    "noResults": "Sonuç bulunamadı",
    "manualEntry": "Bulamadın mı? Manuel ekle",
    "mealName": "Yemek Adı",
    "calories": "Kalori (kcal)",
    "protein": "Protein (g)",
    "carbs": "Karbonhidrat (g)",
    "fat": "Yağ (g)",
    "portion": "Porsiyon/Miktar",
    "addPhoto": "Fotoğraf Ekle (opsiyonel)",
    "calculated": "Hesaplanan Değerler",
    "save": "Kaydet",
    "cancel": "İptal",
    "photoFrom": "Fotoğraf nereden?",
    "camera": "Kamera",
    "gallery": "Galeri",
    "cameraPermission": "Kamera erişimi için izin vermeniz gerekiyor.",
    "galleryPermission": "Galeri erişimi için izin vermeniz gerekiyor.",
    "networkError": "İnternet bağlantınızı kontrol edin",
    "apiError": "Arama sırasında bir hata oluştu",
    "required": "Bu alan zorunludur"
  }
}
```

### İngilizce (en.json)
```json
{
  "meal": {
    "addMeal": "Add Meal",
    "searchTab": "Search",
    "manualTab": "Manual Entry",
    "searchPlaceholder": "Search food...",
    "noResults": "No results found",
    "manualEntry": "Can't find it? Add manually",
    "mealName": "Meal Name",
    "calories": "Calories (kcal)",
    "protein": "Protein (g)",
    "carbs": "Carbs (g)",
    "fat": "Fat (g)",
    "portion": "Portion/Amount",
    "addPhoto": "Add Photo (optional)",
    "calculated": "Calculated Values",
    "save": "Save",
    "cancel": "Cancel",
    "photoFrom": "Choose photo from?",
    "camera": "Camera",
    "gallery": "Gallery",
    "cameraPermission": "Camera permission is required.",
    "galleryPermission": "Gallery permission is required.",
    "networkError": "Check your internet connection",
    "apiError": "An error occurred during search",
    "required": "This field is required"
  }
}
```

## Güvenlik ve Performans

### Güvenlik
- API key'leri environment variable'da saklanır (.env)
- .env dosyası .gitignore'a eklenir
- Fotoğraflar local file system'de, güvenli şekilde saklanır
- API rate limiting için throttle/debounce kullanılır

### Performans
- Arama için debounce (300ms)
- API sonuçları cache (geçici)
- Fotoğraf quality: 0.7 (optimize boyut)
- Lazy loading (modal sadece açıldığında render)
- FlatList kullanımı (uzun liste için)

## Kabul Kriterleri

✅ Kullanıcı "Öğün Ekle" butonuna tıklayabilmeli  
✅ Modal açılmalı ve 2 sekme gösterilmeli  
✅ Arama sekmesinde Edamam API'den sonuç gelmeli  
✅ Manuel sekmede tüm alanlar çalışmalı  
✅ Fotoğraf eklenebilmeli (kamera veya galeri)  
✅ Porsiyon/gram değiştirilebilmeli  
✅ Kalori ve makrolar dinamik hesaplanmalı  
✅ "Kaydet" ile öğün TrackingContext'e eklenmeli  
✅ Ana ekrandaki kalori/makro kartı güncellenmelі  
✅ Modal kapandıktan sonra temizlenmeli  
✅ Türkçe ve İngilizce çeviri desteklenmeli

---

**Tasarım Tamamlandı. Uygulama planı için writing-plans skill'i çağrılacak.**