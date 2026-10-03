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
  },

  // ============================================================================
  // COMPETING INDIAN BRANDS — For Brand-vs-Brand Comparison
  // ============================================================================

  // --- INSTANT NOODLES: Yippee Noodles vs MAGGI (prod_ind_maggi_masala_noodles) ---
  {
    id: 'prod_ind_yippee_magic_masala',
    barcode: '8901725183004',
    name: 'Sunfeast YiPPee! Magic Masala Noodles',
    brand: 'ITC Sunfeast',
    category: 'Instant Noodles & Seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Noodle Cake: Refined wheat flour (Maida), Edible vegetable oil (Palm oil), Iodised salt, Thickeners (INS 508, INS 412), Acidity regulators (INS 501(i), INS 500(i)), Humectant (INS 451(i)). Masala: Mixed spices (Coriander, Cumin, Turmeric, Red chilli, Fenugreek, Black pepper, Ginger, Garlic), Iodised salt, Sugar, Starch, Onion powder, Flavour enhancer (INS 627, INS 631), Hydrolysed vegetable protein (Soy), Citric acid (INS 330), Edible vegetable oil (Palm oil).',
    ingredientsList: [
      'maida', 'palm oil', 'iodized salt', 'thickener 508', 'thickener 412',
      'acidity regulator 501', 'acidity regulator 500', 'humectant 451',
      'coriander', 'cumin', 'turmeric', 'red chilli', 'fenugreek',
      'black pepper', 'ginger', 'garlic', 'sugar', 'starch', 'onion powder',
      'flavour enhancer 627', 'flavour enhancer 631', 'hydrolysed vegetable protein',
      'soy', 'citric acid'
    ],
    nutrition: {
      calories: 378,
      fat: '13.0g',
      saturatedFat: '6.5g',
      carbs: '56.4g',
      sugar: '2.1g',
      protein: '7.8g',
      sodium: '950mg'
    },
    labels: ['⚔️ Compare with: MAGGI Masala Noodles', 'Contains Wheat & Soy', 'FSSAI Green Dot', 'No Groundnut Protein (unlike MAGGI)'],
    verifiedSource: 'curated_database'
  },

  // --- INSTANT NOODLES: Patanjali Atta Noodles vs MAGGI ---
  {
    id: 'prod_ind_patanjali_atta_noodles',
    barcode: '8904109451234',
    name: 'Patanjali Atta Noodles (Whole Wheat)',
    brand: 'Patanjali Ayurved',
    category: 'Instant Noodles & Seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Whole wheat flour (Atta 90%), Edible vegetable oil (Rice bran oil), Iodised salt, Wheat gluten, Thickener (INS 508), Acidity regulator (INS 501(i)). Masala: Mixed spices (Coriander, Cumin, Turmeric, Red chilli, Fenugreek, Ginger, Ajwain), Salt, Dried onion flakes, Citric acid (INS 330).',
    ingredientsList: [
      'whole wheat flour', 'rice bran oil', 'iodized salt', 'wheat gluten',
      'thickener 508', 'acidity regulator 501', 'coriander', 'cumin',
      'turmeric', 'red chilli', 'fenugreek', 'ginger', 'ajwain',
      'salt', 'onion flakes', 'citric acid'
    ],
    nutrition: {
      calories: 352,
      fat: '9.5g',
      saturatedFat: '2.8g',
      carbs: '58.0g',
      sugar: '1.2g',
      protein: '10.5g',
      sodium: '820mg'
    },
    labels: ['⚔️ Compare with: MAGGI Masala Noodles', 'Contains Wheat', 'Uses Rice Bran Oil (No Palm Oil)', 'Whole Wheat Base', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- NAMKEEN: Bikaji Aloo Bhujia vs Haldiram's Aloo Bhujia ---
  {
    id: 'prod_ind_bikaji_aloo_bhujia',
    barcode: '8901491102018',
    name: "Bikaji Aloo Bhujia Sev",
    brand: 'Bikaji Foods',
    category: 'Indian Namkeen & Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Potato flakes, Edible vegetable oil (Palmolein oil), Gram flour (Besan), Rice flour, Corn starch, Spices and condiments (Coriander powder, Red chilli powder, Cumin powder, Black pepper, Dry mango powder, Clove, Cardamom), Iodised salt, Acidity regulator (Citric acid E330), Antioxidant (TBHQ E319).',
    ingredientsList: ['potato flakes', 'palmolein oil', 'besan', 'rice flour', 'corn starch', 'coriander', 'red chilli', 'cumin', 'black pepper', 'amchur', 'clove', 'cardamom', 'salt', 'citric acid', 'TBHQ'],
    nutrition: {
      calories: 564,
      fat: '38g',
      saturatedFat: '16g',
      carbs: '46g',
      sugar: '1.8g',
      protein: '7.2g',
      sodium: '820mg'
    },
    labels: ['⚔️ Compare with: Haldiram\'s Aloo Bhujia', 'Contains Antioxidant TBHQ (E319)', 'FSSAI Green Dot', '100% Vegetarian'],
    verifiedSource: 'curated_database'
  },

  // --- NAMKEEN: Balaji Aloo Sev vs Haldiram's Aloo Bhujia ---
  {
    id: 'prod_ind_balaji_aloo_sev',
    barcode: '8906002480371',
    name: 'Balaji Aloo Sev (Wafers Style)',
    brand: 'Balaji Wafers',
    category: 'Indian Namkeen & Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Potato flakes (40%), Edible vegetable oil (Cottonseed oil), Gram flour (Besan), Rice flour, Spices and condiments (Red chilli, Turmeric, Cumin, Coriander, Black salt, Dry mango powder), Iodised salt, Citric acid (INS 330).',
    ingredientsList: ['potato flakes', 'cottonseed oil', 'besan', 'rice flour', 'red chilli', 'turmeric', 'cumin', 'coriander', 'black salt', 'amchur', 'salt', 'citric acid'],
    nutrition: {
      calories: 548,
      fat: '35g',
      saturatedFat: '12g',
      carbs: '48g',
      sugar: '1.5g',
      protein: '8.0g',
      sodium: '760mg'
    },
    labels: ['⚔️ Compare with: Haldiram\'s Aloo Bhujia', 'Uses Cottonseed Oil (No Palm Oil)', 'No TBHQ Antioxidant', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- GHEE: Patanjali Cow Ghee vs Amul Cow Ghee ---
  {
    id: 'prod_ind_patanjali_cow_ghee',
    barcode: '8904109461004',
    name: 'Patanjali Cow\'s Pure Desi Ghee',
    brand: 'Patanjali Ayurved',
    category: 'Indian Dairy & Cooking Fats',
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80',
    ingredientsText: '100% Pure Cow Milk Fat (Desi Ghee), made from curd (traditional bilona method).',
    ingredientsList: ['ghee', 'milk fat'],
    nutrition: {
      calories: 897,
      fat: '99.5g',
      saturatedFat: '64g',
      carbs: '0g',
      sugar: '0g',
      protein: '0g',
      sodium: '0mg'
    },
    labels: ['⚔️ Compare with: Amul Pure Cow Ghee', 'Contains Milk (Dairy Allergen)', 'FSSAI Green Dot', 'Traditional Bilona Method', 'Vegetarian (Non-Vegan)'],
    verifiedSource: 'curated_database'
  },

  // --- GHEE: Aashirvaad Svasti Ghee vs Amul Cow Ghee ---
  {
    id: 'prod_ind_aashirvaad_svasti_ghee',
    barcode: '8901063092013',
    name: 'Aashirvaad Svasti Pure Cow Ghee',
    brand: 'ITC Aashirvaad',
    category: 'Indian Dairy & Cooking Fats',
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80',
    ingredientsText: '100% Pure Cow Ghee (Clarified Butter from pasteurised cow milk).',
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
    labels: ['⚔️ Compare with: Amul Pure Cow Ghee', 'Contains Milk (Dairy Allergen)', 'FSSAI Green Dot', 'Vegetarian (Non-Vegan)'],
    verifiedSource: 'curated_database'
  },

  // --- BISCUITS: Britannia Marie Gold vs Parle-G ---
  {
    id: 'prod_ind_britannia_marie_gold',
    barcode: '8901063010116',
    name: 'Britannia Marie Gold Biscuits',
    brand: 'Britannia Industries',
    category: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Refined wheat flour (Maida), Sugar, Edible vegetable oil (Palm oil), Invert sugar syrup, Milk solids, Corn starch, Raising agents (Sodium bicarbonate E500ii, Ammonium bicarbonate E503ii), Iodised salt, Dough conditioner (Sodium metabisulphite E223), Emulsifier (Soy lecithin E322), Added flavour (Vanilla).',
    ingredientsList: ['maida', 'sugar', 'palm oil', 'invert sugar', 'milk solids', 'corn starch', 'sodium bicarbonate', 'ammonium bicarbonate', 'salt', 'sodium metabisulphite', 'soy lecithin', 'vanilla'],
    nutrition: {
      calories: 462,
      fat: '14.8g',
      saturatedFat: '7.0g',
      carbs: '75.0g',
      sugar: '24.5g',
      protein: '6.8g',
      sodium: '310mg'
    },
    labels: ['⚔️ Compare with: Parle-G Biscuits', 'Contains Wheat / Gluten', 'Contains Milk', 'Contains Soy Lecithin', 'Contains Sulphites (E223)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- BISCUITS: Sunfeast Dark Fantasy vs Parle-G ---
  {
    id: 'prod_ind_sunfeast_dark_fantasy',
    barcode: '8901725133801',
    name: 'Sunfeast Dark Fantasy Choco Fills',
    brand: 'ITC Sunfeast',
    category: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Refined wheat flour (Maida), Sugar, Edible vegetable oil (Palm oil, Palmolein oil), Cocoa solids (8%), Choco cream filling (Sugar, Hydrogenated vegetable fat, Cocoa powder, Emulsifier INS 322, Flavour), Invert sugar syrup, Milk solids, Raising agents (INS 500ii, INS 503ii), Iodised salt, Emulsifier (Soy lecithin INS 322), Dough conditioner (INS 223).',
    ingredientsList: ['maida', 'sugar', 'palm oil', 'cocoa solids', 'hydrogenated vegetable fat', 'cocoa powder', 'soy lecithin', 'invert sugar', 'milk solids', 'sodium bicarbonate', 'salt', 'sodium metabisulphite'],
    nutrition: {
      calories: 502,
      fat: '24.0g',
      saturatedFat: '13.5g',
      carbs: '65.0g',
      sugar: '30.2g',
      protein: '5.8g',
      sodium: '260mg'
    },
    labels: ['⚔️ Compare with: Parle-G Biscuits', 'Contains Wheat / Gluten', 'Contains Milk', 'Contains Soy', 'Contains Hydrogenated Fat (Trans Fat Risk)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- READY-TO-EAT: ITC Kitchen of India Paneer Butter Masala vs MTR ---
  {
    id: 'prod_ind_itc_paneer_makhani',
    barcode: '8901063055131',
    name: 'Kitchens of India Paneer Makhani (RTE)',
    brand: 'ITC Kitchens of India',
    category: 'Ready-To-Eat Meals',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Paneer (Cottage cheese 22%), Water, Tomato puree, Onion paste, Butter (6%), Cashew nut paste (Kaju 5%), Cream, Refined soybean oil, Spices and condiments (Kashmiri red chilli, Garam masala, Turmeric, Coriander, Cumin, Kasuri methi, Bay leaf), Ginger garlic paste, Iodised salt, Sugar, Acidity regulator (INS 330).',
    ingredientsList: ['paneer', 'butter', 'cashew', 'cream', 'soybean oil', 'garam masala', 'turmeric', 'coriander', 'cumin', 'fenugreek', 'ginger', 'garlic', 'salt', 'sugar', 'citric acid'],
    nutrition: {
      calories: 235,
      fat: '18g',
      saturatedFat: '9g',
      carbs: '9g',
      sugar: '3.5g',
      protein: '8.2g',
      sodium: '580mg'
    },
    labels: ['⚔️ Compare with: MTR Paneer Butter Masala', 'Contains Milk (Paneer/Butter/Cream)', 'Contains Tree Nuts (Cashew)', 'Contains Soy (Soybean Oil)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- READY-TO-EAT: Haldiram's Paneer Makhani vs MTR ---
  {
    id: 'prod_ind_haldiram_paneer_makhani',
    barcode: '8904063204155',
    name: "Haldiram's Ready-To-Eat Paneer Makhani",
    brand: "Haldiram's Delhi",
    category: 'Ready-To-Eat Meals',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Paneer (20%), Water, Tomato puree, Onion, Butter, Cashew nut paste (3.5%), Cream (Malai), Edible vegetable oil (Palmolein), Spices (Garam masala, Kashmiri mirch, Haldi, Dhaniya, Jeera, Kasuri methi), Ginger garlic paste, Iodised salt, Red chilli powder.',
    ingredientsList: ['paneer', 'butter', 'cashew', 'cream', 'palmolein oil', 'garam masala', 'turmeric', 'coriander', 'cumin', 'fenugreek', 'ginger', 'garlic', 'salt', 'red chilli'],
    nutrition: {
      calories: 210,
      fat: '15g',
      saturatedFat: '7.5g',
      carbs: '10g',
      sugar: '3.8g',
      protein: '7.0g',
      sodium: '560mg'
    },
    labels: ['⚔️ Compare with: MTR Paneer Butter Masala', 'Contains Milk (Paneer/Butter/Cream)', 'Contains Tree Nuts (Cashew)', 'Uses Palm Oil', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- PICKLE: Priya Mango Pickle vs Mother's Recipe ---
  {
    id: 'prod_ind_priya_mango_pickle',
    barcode: '8906009100035',
    name: "Priya Mango Pickle (Avakaya Achar)",
    brand: 'Priya Foods (Ushodaya)',
    category: 'Indian Pickles & Chutneys',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Raw mango pieces (55%), Edible mustard oil (Sarson ka tel), Edible common salt, Red chilli powder, Mustard seeds (Rai), Fenugreek seeds (Methi dana), Turmeric powder (Haldi), Compounded asafoetida (Bandhani hing – contains Wheat flour, Gum arabic).',
    ingredientsList: ['mango', 'mustard oil', 'salt', 'red chilli', 'mustard seeds', 'fenugreek', 'turmeric', 'compounded asafoetida'],
    nutrition: {
      calories: 175,
      fat: '11g',
      saturatedFat: '1.2g',
      carbs: '16g',
      sugar: '1.5g',
      protein: '2.8g',
      sodium: '4400mg'
    },
    labels: ['⚔️ Compare with: Mother\'s Recipe Mango Pickle', 'Contains Mustard (Sarson)', 'Hidden Gluten Alert (Compounded Hing contains Wheat)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- MITHAI: Bikano Kaju Katli vs Haldiram's Kaju Katli ---
  {
    id: 'prod_ind_bikano_kaju_katli',
    barcode: '8901059612305',
    name: "Bikano Premium Kaju Katli (Mithai)",
    brand: 'Bikano (Bikanervala)',
    category: 'Traditional Indian Sweets (Mithai)',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Cashew nuts (Kaju 50%), Sugar, Liquid glucose, Desi ghee (Clarified butter), Cardamom powder (Elaichi), Edible silver foil (Vark).',
    ingredientsList: ['cashew', 'sugar', 'liquid glucose', 'ghee', 'milk fat', 'cardamom'],
    nutrition: {
      calories: 505,
      fat: '26g',
      saturatedFat: '6.0g',
      carbs: '56g',
      sugar: '42g',
      protein: '9.0g',
      sodium: '25mg'
    },
    labels: ['⚔️ Compare with: Haldiram\'s Kaju Katli', 'Contains Tree Nuts (Cashew)', 'Contains Milk (Ghee/Desi Ghee)', 'NOT Vegan (has Ghee)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- CHIPS: Lay's Classic Salted vs Kurkure vs Bingo ---
  {
    id: 'prod_ind_lays_classic_salted',
    barcode: '8901491101042',
    name: "Lay's Classic Salted Potato Chips",
    brand: 'PepsiCo India (Frito-Lay)',
    category: 'Chips & Crisps',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Potato, Edible vegetable oil (Palmolein oil and/or Rice bran oil), Iodised salt.',
    ingredientsList: ['potato', 'palmolein oil', 'rice bran oil', 'salt'],
    nutrition: {
      calories: 535,
      fat: '32g',
      saturatedFat: '14g',
      carbs: '55g',
      sugar: '0.5g',
      protein: '6.5g',
      sodium: '680mg'
    },
    labels: ['⚔️ Compare with: Bingo & Kurkure', 'Simple 3-Ingredient Recipe', 'Gluten-Free', 'Vegan', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_kurkure_masala_munch',
    barcode: '8901491100373',
    name: "Kurkure Masala Munch",
    brand: 'PepsiCo India',
    category: 'Chips & Crisps',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Rice meal, Edible vegetable oil (Palmolein oil), Corn meal, Gram meal (Besan), Spices and condiments (Red chilli, Coriander, Cumin, Turmeric, Onion, Ginger, Amchur, Black pepper), Iodised salt, Sugar, Lentil meal, Flavour enhancer (Monosodium glutamate INS 621), Colour (Tartrazine INS 102, Sunset yellow INS 110), Citric acid (INS 330).',
    ingredientsList: ['rice meal', 'palmolein oil', 'corn meal', 'besan', 'red chilli', 'coriander', 'cumin', 'turmeric', 'onion', 'ginger', 'amchur', 'black pepper', 'salt', 'sugar', 'lentil meal', 'monosodium glutamate', 'tartrazine', 'sunset yellow', 'citric acid'],
    nutrition: {
      calories: 524,
      fat: '28g',
      saturatedFat: '12g',
      carbs: '60g',
      sugar: '3.2g',
      protein: '6.0g',
      sodium: '780mg'
    },
    labels: ['⚔️ Compare with: Lay\'s & Bingo', 'Contains MSG (E621)', 'Contains Tartrazine (E102) — Artificial Colour', 'Contains Sunset Yellow (E110)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_bingo_mad_angles',
    barcode: '8901063096011',
    name: "Bingo! Mad Angles Tomato Madness",
    brand: 'ITC Foods',
    category: 'Chips & Crisps',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Corn meal, Edible vegetable oil (Palmolein oil), Rice meal, Seasoning (Tomato powder, Iodised salt, Sugar, Spices (Red chilli, Cumin, Coriander, Black pepper, Turmeric), Citric acid (INS 330), Flavour enhancer (INS 627, INS 631), Anticaking agent (INS 551)).',
    ingredientsList: ['corn meal', 'palmolein oil', 'rice meal', 'tomato powder', 'salt', 'sugar', 'red chilli', 'cumin', 'coriander', 'black pepper', 'turmeric', 'citric acid', 'flavour enhancer 627', 'flavour enhancer 631', 'anticaking agent 551'],
    nutrition: {
      calories: 510,
      fat: '26g',
      saturatedFat: '11g',
      carbs: '62g',
      sugar: '4.0g',
      protein: '5.5g',
      sodium: '720mg'
    },
    labels: ['⚔️ Compare with: Lay\'s & Kurkure', 'No MSG (uses INS 627/631 instead)', 'No Artificial Colours', 'Gluten-Free Base', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- JUICE: Real Fruit Power vs Tropicana vs Paper Boat ---
  {
    id: 'prod_ind_real_mango_juice',
    barcode: '8901764010013',
    name: 'Real Fruit Power Mango Juice',
    brand: 'Dabur (Real)',
    category: 'Fruit Juices & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Mango pulp (Alphonso and Totapuri) (min 24%), Sugar, Water, Acidity regulator (Citric acid INS 330), Antioxidant (Ascorbic acid INS 300), Stabilizer (Pectin INS 440), Colour (Beta-carotene INS 160a(i)), Added flavour (Natural mango flavour).',
    ingredientsList: ['mango pulp', 'sugar', 'water', 'citric acid', 'ascorbic acid', 'pectin', 'beta-carotene', 'natural flavour'],
    nutrition: {
      calories: 63,
      fat: '0g',
      saturatedFat: '0g',
      carbs: '15g',
      sugar: '14g',
      protein: '0.2g',
      sodium: '10mg'
    },
    labels: ['⚔️ Compare with: Tropicana & Paper Boat', 'Contains Added Sugar', 'Contains Natural Colour (Beta-carotene)', 'Vegetarian & Vegan', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_tropicana_mango_delight',
    barcode: '8901023021213',
    name: 'Tropicana Mango Delight',
    brand: 'PepsiCo India (Tropicana)',
    category: 'Fruit Juices & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Water, Sugar, Mango pulp (min 15%), Acidity regulators (Citric acid INS 330, Sodium citrate INS 331(iii)), Antioxidant (Ascorbic acid INS 300), Stabilizers (Pectin INS 440, Xanthan gum INS 415), Colour (Sunset yellow FCF INS 110, Tartrazine INS 102).',
    ingredientsList: ['water', 'sugar', 'mango pulp', 'citric acid', 'sodium citrate', 'ascorbic acid', 'pectin', 'xanthan gum', 'sunset yellow', 'tartrazine'],
    nutrition: {
      calories: 58,
      fat: '0g',
      saturatedFat: '0g',
      carbs: '14g',
      sugar: '13.5g',
      protein: '0.1g',
      sodium: '15mg'
    },
    labels: ['⚔️ Compare with: Real & Paper Boat', 'Contains Added Sugar', 'Contains Artificial Colours (Tartrazine E102, Sunset Yellow E110)', 'Lower Mango Content (15% vs 24%)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_paperboat_aam_panna',
    barcode: '8906080831013',
    name: 'Paper Boat Aam Panna (Green Mango Drink)',
    brand: 'Hector Beverages (Paper Boat)',
    category: 'Fruit Juices & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Water, Sugar, Green mango pulp (Kairi 12%), Cumin extract, Mint extract, Iodised salt, Black pepper extract, Acidity regulator (Citric acid INS 330), Antioxidant (Ascorbic acid INS 300).',
    ingredientsList: ['water', 'sugar', 'green mango pulp', 'cumin extract', 'mint extract', 'salt', 'black pepper extract', 'citric acid', 'ascorbic acid'],
    nutrition: {
      calories: 54,
      fat: '0g',
      saturatedFat: '0g',
      carbs: '13g',
      sugar: '12.5g',
      protein: '0.1g',
      sodium: '95mg'
    },
    labels: ['⚔️ Compare with: Real & Tropicana', 'Contains Added Sugar', 'No Artificial Colours or Flavours', 'Traditional Indian Recipe', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- DAIRY DRINKS: Amul Lassi vs Mother Dairy ---
  {
    id: 'prod_ind_amul_kesar_lassi',
    barcode: '8901262155038',
    name: 'Amul Kesar (Saffron) Lassi',
    brand: 'Amul (GCMMF)',
    category: 'Indian Dairy Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Toned milk, Sugar (12%), Curd (Dahi), Saffron extract (Kesar 0.02%), Cardamom powder, Stabilizer (Carboxymethyl cellulose INS 466).',
    ingredientsList: ['toned milk', 'sugar', 'curd', 'saffron', 'cardamom', 'carboxymethyl cellulose'],
    nutrition: {
      calories: 78,
      fat: '1.5g',
      saturatedFat: '1.0g',
      carbs: '14g',
      sugar: '13g',
      protein: '2.5g',
      sodium: '45mg'
    },
    labels: ['⚔️ Compare with: Mother Dairy Lassi', 'Contains Milk (Dairy Allergen)', 'Contains Added Sugar', 'FSSAI Green Dot', 'Vegetarian (Non-Vegan)'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_mother_dairy_mishti_doi_lassi',
    barcode: '8906009501012',
    name: 'Mother Dairy Classic Sweet Lassi',
    brand: 'Mother Dairy',
    category: 'Indian Dairy Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Toned milk, Sugar (10%), Curd (Dahi), Stabilizers (Pectin INS 440, Carrageenan INS 407), Acidity regulator (Sodium citrate INS 331(iii)), Permitted flavour.',
    ingredientsList: ['toned milk', 'sugar', 'curd', 'pectin', 'carrageenan', 'sodium citrate'],
    nutrition: {
      calories: 72,
      fat: '1.2g',
      saturatedFat: '0.8g',
      carbs: '13g',
      sugar: '12g',
      protein: '2.3g',
      sodium: '50mg'
    },
    labels: ['⚔️ Compare with: Amul Kesar Lassi', 'Contains Milk (Dairy Allergen)', 'Contains Carrageenan (INS 407)', 'Contains Added Sugar', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },

  // --- BREAD: Britannia vs Modern ---
  {
    id: 'prod_ind_britannia_whole_wheat_bread',
    barcode: '8901063040137',
    name: 'Britannia 100% Whole Wheat Bread',
    brand: 'Britannia Industries',
    category: 'Bread & Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Whole wheat flour (Atta), Water, Sugar, Yeast, Refined wheat flour (Maida), Iodised salt, Edible vegetable oil (Soybean oil), Wheat gluten, Soy flour, Preservative (Calcium propionate E282), Emulsifiers (Sodium stearoyl lactylate E481, Glyceryl monostearate E471), Flour treatment agent (Ascorbic acid E300), Acidity regulator (Vinegar E260).',
    ingredientsList: ['whole wheat flour', 'water', 'sugar', 'yeast', 'maida', 'salt', 'soybean oil', 'wheat gluten', 'soy flour', 'calcium propionate', 'sodium stearoyl lactylate', 'glyceryl monostearate', 'ascorbic acid', 'vinegar'],
    nutrition: {
      calories: 247,
      fat: '3.5g',
      saturatedFat: '0.8g',
      carbs: '46g',
      sugar: '5g',
      protein: '9.5g',
      sodium: '450mg'
    },
    labels: ['⚔️ Compare with: Modern Bread', 'Contains Wheat / Gluten', 'Contains Soy', 'Contains Preservative (Calcium Propionate E282)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  },
  {
    id: 'prod_ind_modern_whole_wheat_bread',
    barcode: '8901032008918',
    name: 'Modern 100% Whole Wheat Bread',
    brand: 'Modern Foods (HUL)',
    category: 'Bread & Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    ingredientsText: 'Whole wheat flour (Atta), Water, Sugar, Yeast, Edible vegetable oil (Palm oil), Iodised salt, Wheat gluten, Preservative (Calcium propionate E282), Emulsifiers (DATEM E472e, Soy lecithin E322), Flour treatment agent (Ascorbic acid E300).',
    ingredientsList: ['whole wheat flour', 'water', 'sugar', 'yeast', 'palm oil', 'salt', 'wheat gluten', 'calcium propionate', 'DATEM', 'soy lecithin', 'ascorbic acid'],
    nutrition: {
      calories: 250,
      fat: '4.0g',
      saturatedFat: '1.5g',
      carbs: '45g',
      sugar: '4.5g',
      protein: '9.0g',
      sodium: '480mg'
    },
    labels: ['⚔️ Compare with: Britannia Bread', 'Contains Wheat / Gluten', 'Contains Soy (Lecithin)', 'Contains Palm Oil', 'Contains Preservative (Calcium Propionate E282)', 'FSSAI Green Dot'],
    verifiedSource: 'curated_database'
  }
];
