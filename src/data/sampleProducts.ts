import { Product } from '../types';

export const SAMPLE_PRODUCTS: Product[] = [
  // --- DEMO SCENARIO 1: SAFE PRODUCT ---
  {
    id: 'prod_demo_safe_oats',
    barcode: '8901234567891',
    name: 'Pure Vegan Oat Crunchies',
    brand: 'Natura Planet',
    category: 'Snack Bars',
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Oat flour, cane sugar, sunflower oil, sunflower lecithin, sea salt, vanilla extract.',
    ingredientsList: ['oat flour', 'cane sugar', 'sunflower oil', 'sunflower lecithin', 'sea salt', 'vanilla extract'],
    nutrition: {
      calories: 390,
      fat: '14g',
      saturatedFat: '2g',
      carbs: '60g',
      sugar: '18g',
      protein: '6.0g',
      sodium: '110mg'
    },
    labels: ['Demo 1: Safe Product (Expected: SAFE)', '100% Plant-Based', 'Vegan Certified', 'Dairy-Free', 'Nut-Free Recipe'],
    verifiedSource: 'curated_database'
  },
  // --- DEMO SCENARIO 2: MILK ALLERGEN ---
  {
    id: 'prod_demo_milk_chocolate',
    barcode: '7622210449281',
    name: 'Classic Dairy Milk Chocolate',
    brand: 'Alpine Confections',
    category: 'Chocolate & Sweets',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Sugar, whole milk powder, cocoa butter, cocoa mass, emulsifier (soy lecithin E322), natural vanilla flavouring.',
    ingredientsList: ['sugar', 'whole milk powder', 'cocoa butter', 'cocoa mass', 'soy lecithin', 'vanilla extract'],
    nutrition: {
      calories: 535,
      fat: '30g',
      saturatedFat: '18g',
      carbs: '58g',
      sugar: '57g',
      protein: '7.3g',
      sodium: '80mg'
    },
    labels: ['Demo 2: Milk Allergen (Expected: NOT SUITABLE)', 'Contains Milk', 'Contains Soy'],
    verifiedSource: 'curated_database'
  },
  // --- DEMO SCENARIO 3: PEANUT ALLERGEN ---
  {
    id: 'prod_walkthrough_choc_biscuit',
    barcode: '8901234567890',
    name: 'Chocolate Peanut Butter Biscuit',
    brand: 'Golden Bakery Co.',
    category: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Wheat flour, sugar, milk solids, soy lecithin, peanut butter, cocoa powder.',
    ingredientsList: ['wheat flour', 'sugar', 'milk solids', 'soy lecithin', 'peanut butter', 'cocoa powder'],
    nutrition: {
      calories: 480,
      fat: '22g',
      saturatedFat: '10g',
      carbs: '64g',
      sugar: '32g',
      protein: '7.5g',
      sodium: '220mg'
    },
    labels: ['Demo 3: Peanut Allergen (Expected: NOT SUITABLE)', 'Contains Peanut', 'Contains Milk', 'Contains Soy', 'Contains Wheat'],
    verifiedSource: 'curated_database'
  },
  // --- DEMO SCENARIO 4: VEGAN VIOLATION ---
  {
    id: 'prod_almond_protein_shake',
    barcode: '8901234567895',
    name: 'Whey & Almond Protein Bar',
    brand: 'ProFit Nutrition',
    category: 'Sports Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Whey protein concentrate, almond butter, chicory root fiber, cocoa butter, sodium caseinate, sea salt.',
    ingredientsList: ['whey protein concentrate', 'almond butter', 'chicory root fiber', 'cocoa butter', 'sodium caseinate', 'sea salt'],
    nutrition: {
      calories: 210,
      fat: '8g',
      saturatedFat: '2.5g',
      carbs: '12g',
      sugar: '2g',
      protein: '20g',
      sodium: '140mg'
    },
    labels: ['Demo 4: Vegan Violation (Expected: NOT SUITABLE for Vegan)', 'Contains Whey / Dairy', 'Contains Tree Nuts'],
    verifiedSource: 'curated_database'
  },
  // --- DEMO SCENARIO 5: UNKNOWN INGREDIENT QUARANTINE ---
  {
    id: 'prod_demo_unknown_botanical',
    barcode: '7622210449300',
    name: 'Botanical Elixir (Unresolved Additive)',
    brand: 'Apex Alchemy Lab',
    category: 'Functional Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Carbonated spring water, organic cane sugar, ashwagandha root extract, unknown_phyto_compound_x99, natural lime oil.',
    ingredientsList: ['carbonated spring water', 'cane sugar', 'ashwagandha root extract', 'unknown_phyto_compound_x99', 'natural lime oil'],
    nutrition: {
      calories: 45,
      fat: '0g',
      saturatedFat: '0g',
      carbs: '11g',
      sugar: '10g',
      protein: '0g',
      sodium: '15mg'
    },
    labels: ['Demo 5: Unknown Ingredient (Expected: CAUTION / Score: null)', 'Quarantine Trigger', 'Unverified Additive'],
    verifiedSource: 'curated_database'
  },
  // Additional catalog products
  {
    id: 'prod_durum_wheat_pasta',
    barcode: '8901234567893',
    name: 'Authentic Durum Wheat Penne',
    brand: 'Pastificio Italiano',
    category: 'Pasta & Noodles',
    imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=80',
    ingredientsText: '100% durum wheat semolina, spring water.',
    ingredientsList: ['durum wheat semolina', 'spring water'],
    nutrition: {
      calories: 350,
      fat: '1.5g',
      saturatedFat: '0.3g',
      carbs: '72g',
      sugar: '2.5g',
      protein: '13g',
      sodium: '5mg'
    },
    labels: ['Gluten-Free Violation Test', 'Contains Wheat'],
    verifiedSource: 'curated_database'
  },
  // --- AUTHENTIC INDIAN MARKET PRODUCTS (890 EAN-13 BARCODES) ---
  {
    id: 'prod_ind_maggi_masala_noodles',
    barcode: '8901058000290',
    name: 'MAGGI 2-Minute Masala Instant Noodles',
    brand: 'Nestlé India',
    category: 'Instant Noodles & Seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Noodles: Refined wheat flour (Maida), Palm oil, Iodized salt, Wheat gluten, Thickeners (508 & 412), Acidity regulators (501(i) & 500(i)) and Humectant (451(i)). Masala Tastemaker: Mixed spices (25.6%) (Onion powder, Coriander powder, Turmeric powder, Red chilli powder, Garlic powder, Cumin powder, Aniseed powder, Ginger powder, Fenugreek powder, Black pepper powder, Clove powder, Green cardamom powder & Nutmeg powder), Refined wheat flour (Maida), Hydrolysed groundnut protein, Sugar, Palm oil, Starch, Iodized salt, Thickener (508), Flavour enhancer (635), Toasted onion flakes, Acidity regulator (330), Colour (150d), Mineral and Wheat gluten. Contains Wheat & Nut. May contain Milk, Mustard, Oats And Soy.',
    ingredientsList: [
      'maida',
      'palm oil',
      'iodized salt',
      'wheat gluten',
      'thickener 508',
      'thickener 412',
      'acidity regulator 501',
      'acidity regulator 500',
      'humectant 451',
      'mixed spices',
      'onion powder',
      'coriander powder',
      'turmeric powder',
      'red chilli powder',
      'garlic powder',
      'cumin powder',
      'aniseed powder',
      'ginger powder',
      'fenugreek powder',
      'black pepper powder',
      'clove powder',
      'cardamom powder',
      'nutmeg powder',
      'hydrolysed groundnut protein',
      'sugar',
      'starch',
      'flavour enhancer 635',
      'toasted onion flakes',
      'acidity regulator 330',
      'colour 150d'
    ],
    nutrition: {
      calories: 384,
      fat: '12.5g',
      saturatedFat: '8.2g',
      carbs: '59.6g',
      sugar: '1.8g',
      protein: '8.2g',
      sodium: '1028.3mg'
    },
    labels: ['FSSAI Lic. 10012011000168', 'Contains Wheat & Nut (Groundnut)', 'May Contain Milk, Mustard, Oats, Soy', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_haldiram_aloo_bhujia',
    barcode: '8904063200010',
    name: 'Haldiram\'s Aloo Bhujia Sev',
    brand: 'Haldiram\'s Nagpur',
    category: 'Indian Namkeen & Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Potatoes, edible vegetable oil (cottonseed/palmolein), gram flour (besan), tepary bean flour, rice flour, starch, spices and condiments (coriander powder, cumin powder, dry mango powder, red chilli powder, black pepper, clove powder, cardamom powder), iodised salt, acidity regulator (citric acid E330).',
    ingredientsList: ['potatoes', 'vegetable oil', 'besan', 'rice flour', 'starch', 'coriander', 'cumin', 'amchur', 'red chilli', 'black pepper', 'salt', 'citric acid'],
    nutrition: {
      calories: 578,
      fat: '42g',
      saturatedFat: '14g',
      carbs: '42g',
      sugar: '2g',
      protein: '7.8g',
      sodium: '780mg'
    },
    labels: ['FSSAI Certified (Green Dot)', 'Indian Namkeen Staple', 'Besan & Potato Blend', '100% Vegetarian'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_amul_cow_ghee',
    barcode: '8901262010053',
    name: 'Amul Pure Cow Ghee (Clarified Butter)',
    brand: 'Amul (GCMMF)',
    category: 'Indian Dairy & Cooking Fats',
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80',
    ingredientsText: '100% Milk Fat derived from pure cow milk (Cow Ghee / Desi Ghee).',
    ingredientsList: ['ghee', 'milk fat'],
    nutrition: {
      calories: 900,
      fat: '99.7g',
      saturatedFat: '65g',
      carbs: '0g',
      sugar: '0g',
      protein: '0g',
      sodium: '0mg'
    },
    labels: ['Contains Milk (Dairy Allergen)', 'FSSAI Green Dot', 'Traditional Desi Ghee', 'Vegetarian (Non-Vegan)'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_parle_g_biscuits',
    barcode: '8901719101038',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle Products',
    category: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Refined wheat flour (maida), sugar, refined palm oil, invert sugar syrup, milk solids, raising agents (sodium bicarbonate E500ii, ammonium bicarbonate E503ii), iodised salt, emulsifier (soy lecithin E322), dough conditioner (sodium metabisulphite E223).',
    ingredientsList: ['maida', 'sugar', 'palm oil', 'invert sugar', 'milk solids', 'sodium bicarbonate', 'salt', 'soy lecithin', 'sodium metabisulphite'],
    nutrition: {
      calories: 454,
      fat: '13.3g',
      saturatedFat: '6.4g',
      carbs: '77.2g',
      sugar: '26.8g',
      protein: '6.5g',
      sodium: '280mg'
    },
    labels: ['Contains Wheat / Gluten', 'Contains Milk', 'Contains Soy Lecithin', 'Contains Sulphites (E223)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_mtr_paneer_butter_masala',
    barcode: '8901042954317',
    name: 'MTR Ready-To-Eat Paneer Butter Masala',
    brand: 'MTR Foods',
    category: 'Ready-To-Eat Meals',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Paneer (cottage cheese 20%), water, tomatoes, onions, butter, cashew nuts (kaju 4%), cream (malai), desi ghee, ginger garlic paste, spices and condiments (garam masala, turmeric powder, coriander powder, cumin powder, kasuri methi), iodised salt, red chilli powder.',
    ingredientsList: ['paneer', 'butter', 'cashew', 'malai', 'ghee', 'garam masala', 'turmeric', 'coriander', 'cumin', 'fenugreek', 'salt'],
    nutrition: {
      calories: 220,
      fat: '16g',
      saturatedFat: '8g',
      carbs: '11g',
      sugar: '4g',
      protein: '7.5g',
      sodium: '540mg'
    },
    labels: ['Contains Milk (Paneer/Butter/Cream)', 'Contains Tree Nuts (Cashew / Kaju)', 'FSSAI Green Dot (Vegetarian)'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_mothers_mango_pickle',
    barcode: '8906007280123',
    name: 'Mother\'s Recipe Mango Pickle (Achar)',
    brand: 'Mother\'s Recipe',
    category: 'Indian Pickles & Chutneys',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Mango pieces (60%), edible common salt, mustard oil (sarson ka tel), mustard seeds (rai), fenugreek (methi), turmeric powder, red chilli powder, compounded asafoetida (bandhani hing, maida wheat flour, gum arabic), acidity regulator (acetic acid E260).',
    ingredientsList: ['mango', 'salt', 'mustard seeds', 'fenugreek', 'turmeric', 'red chilli', 'compounded asafoetida', 'acetic acid'],
    nutrition: {
      calories: 180,
      fat: '12g',
      saturatedFat: '1.5g',
      carbs: '15g',
      sugar: '1g',
      protein: '2.5g',
      sodium: '4200mg'
    },
    labels: ['Contains Mustard (Sarson/Rai)', 'Hidden Gluten Alert (Compounded Hing contains Wheat Flour)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_haldiram_kaju_katli',
    barcode: '8904063205541',
    name: 'Haldiram\'s Royal Kaju Katli (Mithai)',
    brand: 'Haldiram\'s Sweets',
    category: 'Traditional Indian Sweets (Mithai)',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Cashew nuts (kaju 52%), sugar, liquid glucose, cardamom powder, silver foil (edible vark).',
    ingredientsList: ['cashew', 'sugar', 'liquid glucose', 'cardamom'],
    nutrition: {
      calories: 495,
      fat: '25g',
      saturatedFat: '4.5g',
      carbs: '58g',
      sugar: '44g',
      protein: '9.2g',
      sodium: '20mg'
    },
    labels: ['Contains Tree Nuts (Cashew / Kaju)', '100% Plant-Based Recipe (Vegan & Vegetarian)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  }
];
