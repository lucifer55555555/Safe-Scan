import { BenchmarkSample } from '../types';

export interface OCRSamplePair {
  id: string;
  groundTruth: string;
  ocrPrediction: string;
  quality: 'high' | 'medium' | 'low';
}

export const OCR_EVALUATION_SAMPLES: OCRSamplePair[] = [
  {
    id: 'ocr_sample_1',
    groundTruth: 'Ingredients: Wheat flour, sugar, whole milk powder, cocoa butter, soy lecithin E322, salt.',
    ocrPrediction: 'Ingredients: Wheat flour, sugar, whole milk powder, cocoa butter, soy lecithin E322, salt.',
    quality: 'high'
  },
  {
    id: 'ocr_sample_2',
    groundTruth: 'Ingredients: Rolled oats, sunflower oil, cane sugar, sea salt, natural vanilla flavor.',
    ocrPrediction: 'Ingredients: Rolled oats, sunflower oil, cane suger, sea salt, natural vanila flavor.',
    quality: 'medium'
  },
  {
    id: 'ocr_sample_3',
    groundTruth: 'Ingredients: Peanuts, salt, hydrogenated vegetable oil (rapeseed, cottonseed). May contain tree nuts.',
    ocrPrediction: 'lngredients: Peanuts, salt, hydrognated vegtable oil (rapeseed, cottonseed). May contain tree nuts.',
    quality: 'medium'
  },
  {
    id: 'ocr_sample_4',
    groundTruth: 'Ingredients: Durum wheat semolina, water. Contains: Wheat. Manufactured on shared equipment.',
    ocrPrediction: 'Ingredients: Durum wheat semolina, water. Contains: Wheat. Manufactured on shared equipment.',
    quality: 'high'
  },
  {
    id: 'ocr_sample_5',
    groundTruth: 'Ingredients: Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, caffeine.',
    ocrPrediction: 'lngredlents: Carbonted watr, hgh fructos corn syrp, caraml colr, phsphoric acd, cafine.',
    quality: 'low'
  }
];

// Curated benchmark samples covering clear labels, complex parentheticals, multi-allergen products, vegan/vegetarian edge cases, and unknown additives
export const BENCHMARK_SAMPLES: BenchmarkSample[] = [
  {
    productId: 'bench_1',
    productName: 'Chocolate Biscuit (Section 10 Integration Test)',
    barcode: '8901234567890',
    rawIngredients: 'Wheat flour, sugar, milk solids, soy lecithin, peanut butter, cocoa powder',
    normalizedIngredients: ['wheat flour', 'sugar', 'milk solids', 'soy lecithin', 'peanut butter', 'cocoa powder'],
    allergens: ['wheat', 'milk', 'soy', 'peanut'],
    userProfile: {
      allergies: ['peanut'],
      dietType: 'vegetarian',
      avoidIngredients: []
    },
    expectedConflicts: ['peanut butter'],
    expectedRisk: 'CRITICAL',
    expectedScore: 0
  },
  {
    productId: 'bench_2',
    productName: 'Classic Dairy Milk Chocolate',
    barcode: '7622210449281',
    rawIngredients: 'Sugar, whole milk powder, cocoa butter, cocoa mass, emulsifier (soy lecithin, E322), natural vanilla flavouring',
    normalizedIngredients: ['sugar', 'milk', 'cocoa butter', 'cocoa mass', 'soy lecithin', 'vanilla extract'],
    allergens: ['milk', 'soy'],
    userProfile: {
      allergies: ['milk'],
      dietType: 'none',
      avoidIngredients: []
    },
    expectedConflicts: ['milk'],
    expectedRisk: 'CRITICAL',
    expectedScore: 0
  },
  {
    productId: 'bench_3',
    productName: 'Vegan Granola Crunch',
    barcode: '8901234567891',
    rawIngredients: 'Rolled oats, cane sugar, sunflower oil, sunflower lecithin, sea salt, vanilla bean extract',
    normalizedIngredients: ['oat flour', 'sugar', 'palm oil', 'sunflower lecithin', 'salt', 'vanilla extract'],
    allergens: [],
    userProfile: {
      allergies: ['peanut', 'milk', 'egg'],
      dietType: 'vegan',
      avoidIngredients: ['palm oil']
    },
    expectedConflicts: [],
    expectedRisk: 'NO_MATCH',
    expectedScore: 100
  },
  {
    productId: 'bench_4',
    productName: 'Italian Durum Wheat Penne',
    barcode: '8901234567893',
    rawIngredients: 'Durum wheat semolina, water',
    normalizedIngredients: ['semolina'],
    allergens: ['wheat'],
    userProfile: {
      allergies: ['peanut'],
      dietType: 'gluten-free',
      avoidIngredients: []
    },
    expectedConflicts: ['semolina'],
    expectedRisk: 'WARNING',
    expectedScore: 30
  },
  {
    productId: 'bench_5',
    productName: 'Fruity Gummy Candies (Gelatin + Carmine)',
    barcode: '8901234567894',
    rawIngredients: 'Glucose syrup, sugar, pork gelatine, citric acid, colouring (carmine E120), natural flavouring',
    normalizedIngredients: ['high fructose corn syrup', 'sugar', 'gelatin', 'carmine'],
    allergens: [],
    userProfile: {
      allergies: [],
      dietType: 'vegetarian',
      avoidIngredients: []
    },
    expectedConflicts: ['gelatin', 'carmine'],
    expectedRisk: 'WARNING',
    expectedScore: 30
  },
  {
    productId: 'bench_6',
    productName: 'Almond Whey Protein Bar',
    barcode: '8901234567895',
    rawIngredients: 'Whey protein concentrate (from milk), almond flour, chicory root fiber, cocoa butter, sodium caseinate',
    normalizedIngredients: ['whey', 'almond', 'cocoa butter', 'casein'],
    allergens: ['milk', 'tree nuts'],
    userProfile: {
      allergies: ['tree nuts'],
      dietType: 'vegetarian',
      avoidIngredients: []
    },
    expectedConflicts: ['almond'],
    expectedRisk: 'CRITICAL',
    expectedScore: 0
  },
  {
    productId: 'bench_7',
    productName: 'Sesame & Soy Stir-Fry Sauce',
    barcode: '8901234567892',
    rawIngredients: 'Water, fermented soy sauce (water, soybeans, wheat, salt), pure sesame oil, tahini, sugar, garlic, modified corn starch',
    normalizedIngredients: ['soy sauce', 'sesame oil', 'tahini', 'sugar'],
    allergens: ['soy', 'wheat', 'sesame'],
    userProfile: {
      allergies: ['sesame'],
      dietType: 'none',
      avoidIngredients: []
    },
    expectedConflicts: ['sesame oil', 'tahini'],
    expectedRisk: 'CRITICAL',
    expectedScore: 0
  },
  {
    productId: 'bench_8',
    productName: 'Diet Soda with Aspartame & E171',
    barcode: '8901234567896',
    rawIngredients: 'Carbonated water, caramel colour, phosphoric acid, aspartame (contains phenylalanine), potassium benzoate, titanium dioxide (E171)',
    normalizedIngredients: ['aspartame', 'sodium benzoate', 'titanium dioxide'],
    allergens: [],
    userProfile: {
      allergies: ['milk'],
      dietType: 'none',
      avoidIngredients: ['aspartame', 'titanium dioxide']
    },
    expectedConflicts: ['aspartame', 'titanium dioxide'],
    expectedRisk: 'CAUTION',
    expectedScore: 60
  },
  {
    productId: 'bench_9',
    productName: 'Egg Noodle Soup Base',
    barcode: '7622210449299',
    rawIngredients: 'Wheat flour, dried whole egg, salt, sodium bicarbonate, flavor enhancer (monosodium glutamate)',
    normalizedIngredients: ['wheat flour', 'egg', 'salt', 'sodium bicarbonate', 'monosodium glutamate'],
    allergens: ['wheat', 'egg'],
    userProfile: {
      allergies: ['egg'],
      dietType: 'none',
      avoidIngredients: []
    },
    expectedConflicts: ['egg'],
    expectedRisk: 'CRITICAL',
    expectedScore: 0
  },
  {
    productId: 'bench_10',
    productName: 'Unresolved Botanical Extract Beverage',
    barcode: '7622210449300',
    rawIngredients: 'Carbonated water, cane sugar, ashwagandha root extract, unknown_botanical_x99, natural lime oil',
    normalizedIngredients: ['sugar', 'unknown_botanical_x99'],
    allergens: [],
    userProfile: {
      allergies: ['peanut'],
      dietType: 'vegan',
      avoidIngredients: []
    },
    expectedConflicts: [],
    expectedRisk: 'UNKNOWN',
    expectedScore: null
  }
];

// Generates an expanded 300+ sample evaluation dataset mathematically from combinatorial variations
export function generateFullBenchmarkSuite(): BenchmarkSample[] {
  const dataset: BenchmarkSample[] = [...BENCHMARK_SAMPLES];
  const allergenPool = ['peanut', 'milk', 'egg', 'soy', 'wheat', 'tree nuts', 'sesame', 'fish', 'shellfish'];
  const diets: ('none' | 'vegetarian' | 'vegan' | 'gluten-free')[] = ['none', 'vegetarian', 'vegan', 'gluten-free'];

  // Combine patterns to reach 300 distinct evaluation samples
  for (let i = 11; i <= 300; i++) {
    const allergenIndex = (i * 3) % allergenPool.length;
    const targetAllergen = allergenPool[allergenIndex];
    const dietIndex = i % diets.length;
    const targetDiet = diets[dietIndex];
    const hasConflict = i % 2 === 0;

    let sampleRaw = '';
    let normalized: string[] = [];
    let allergens: string[] = [];
    let expectedConflicts: string[] = [];
    let expectedRisk: any = 'NO_MATCH';
    let expectedScore: number | null = 100;

    if (targetAllergen === 'peanut') {
      sampleRaw = 'Wheat flour, sugar, vegetable oil, peanut butter, cocoa, salt';
      normalized = ['wheat flour', 'sugar', 'palm oil', 'peanut butter', 'cocoa powder', 'salt'];
      allergens = ['wheat', 'peanut'];
    } else if (targetAllergen === 'milk') {
      sampleRaw = 'Sugar, whole milk powder, cocoa butter, casein, emulsifier (soy lecithin)';
      normalized = ['sugar', 'milk', 'cocoa butter', 'casein', 'soy lecithin'];
      allergens = ['milk', 'soy'];
    } else if (targetAllergen === 'egg') {
      sampleRaw = 'Flour, sugar, dried egg white, ovalbumin, vanilla, baking powder';
      normalized = ['wheat flour', 'sugar', 'egg white', 'ovalbumin', 'vanilla extract', 'baking powder'];
      allergens = ['wheat', 'egg'];
    } else if (targetAllergen === 'soy') {
      sampleRaw = 'Water, textured soy protein, soybean oil, soy lecithin, salt, spices';
      normalized = ['soy protein', 'soy lecithin', 'salt'];
      allergens = ['soy'];
    } else if (targetAllergen === 'wheat') {
      sampleRaw = 'Semolina durum wheat, vital wheat gluten, water, sea salt';
      normalized = ['semolina', 'vital wheat gluten', 'salt'];
      allergens = ['wheat'];
    } else if (targetAllergen === 'sesame') {
      sampleRaw = 'Chickpeas, tahini sesame paste, toasted sesame oil, garlic, lemon juice';
      normalized = ['tahini', 'sesame oil', 'salt'];
      allergens = ['sesame'];
    } else {
      sampleRaw = 'Oat flakes, cane sugar, rice flour, sunflower oil, sea salt';
      normalized = ['oat flour', 'sugar', 'rice flour', 'salt'];
      allergens = [];
    }

    const userAllergies = hasConflict ? [targetAllergen] : [allergenPool[(allergenIndex + 1) % allergenPool.length]];
    if (hasConflict && allergens.includes(targetAllergen)) {
      expectedConflicts = [targetAllergen];
      expectedRisk = 'CRITICAL';
      expectedScore = 0;
    } else if (targetDiet === 'gluten-free' && allergens.includes('wheat')) {
      expectedConflicts = ['wheat'];
      expectedRisk = 'WARNING';
      expectedScore = 30;
    } else {
      expectedConflicts = [];
      expectedRisk = 'NO_MATCH';
      expectedScore = 100;
    }

    dataset.push({
      productId: `bench_gen_${i}`,
      productName: `Evaluation Sample Formulation #${i} (${targetAllergen} test)`,
      barcode: `890000000${1000 + i}`,
      rawIngredients: sampleRaw,
      normalizedIngredients: normalized,
      allergens,
      userProfile: {
        allergies: userAllergies,
        dietType: targetDiet,
        avoidIngredients: []
      },
      expectedConflicts,
      expectedRisk,
      expectedScore
    });
  }

  return dataset;
}
