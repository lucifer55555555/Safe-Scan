import { Allergen, Ingredient, IngredientAlias } from '../types';

export const FDA_ALLERGENS: Allergen[] = [
  {
    id: 'allergen_peanut',
    name: 'peanut',
    description: 'Arachis hypogaea, a legume and one of the top causes of severe food-induced anaphylaxis.',
    fdaRecognized: true,
    commonDerivatives: ['peanut butter', 'arachis oil', 'peanut flour', 'groundnuts', 'monkey nuts', 'valencia peanuts']
  },
  {
    id: 'allergen_milk',
    name: 'milk',
    description: 'Bovine milk and dairy components containing casein, whey proteins, and lactose.',
    fdaRecognized: true,
    commonDerivatives: ['casein', 'sodium caseinate', 'whey', 'whey protein', 'lactalbumin', 'milk solids', 'butter', 'ghee', 'curds', 'cheese']
  },
  {
    id: 'allergen_egg',
    name: 'egg',
    description: 'Poultry egg whites and yolks containing ovalbumin, ovomucoid, and lysozyme.',
    fdaRecognized: true,
    commonDerivatives: ['albumin', 'ovalbumin', 'egg yolk', 'egg white', 'lysozyme', 'ovomucin', 'globulin', 'meringue powder']
  },
  {
    id: 'allergen_tree_nuts',
    name: 'tree nuts',
    description: 'True botanical nuts and seeds including almonds, walnuts, cashews, pecans, hazelnuts, pistachios, macadamias, and brazil nuts.',
    fdaRecognized: true,
    commonDerivatives: ['almond flour', 'cashew butter', 'walnut oil', 'hazelnut paste', 'praline', 'marzipan', 'gianduja', 'pistachio paste']
  },
  {
    id: 'allergen_soy',
    name: 'soy',
    description: 'Soybeans (Glycine max) and soy-derived proteins, isoflavones, and emulsifiers.',
    fdaRecognized: true,
    commonDerivatives: ['soy lecithin', 'soy protein isolate', 'tofu', 'edamame', 'textured vegetable protein', 'hydrolyzed soy protein', 'soya']
  },
  {
    id: 'allergen_wheat',
    name: 'wheat',
    description: 'Wheat grains (Triticum genus) and gluten-containing grain fractions.',
    fdaRecognized: true,
    commonDerivatives: ['semolina', 'durum', 'spelt', 'farina', 'vital wheat gluten', 'wheat starch', 'graham flour', 'kamut', 'bulgur']
  },
  {
    id: 'allergen_fish',
    name: 'fish',
    description: 'Finned fish species containing parvalbumin proteins, such as cod, salmon, tuna, anchovy, and tilapia.',
    fdaRecognized: true,
    commonDerivatives: ['fish sauce', 'fish gelatin', 'anchovy paste', 'surimi', 'isinglass', 'fish oil']
  },
  {
    id: 'allergen_shellfish',
    name: 'shellfish',
    description: 'Crustaceans (shrimp, crab, lobster, prawn) and mollusks containing tropomyosin.',
    fdaRecognized: true,
    commonDerivatives: ['shrimp powder', 'krill meal', 'crab extract', 'clam juice', 'oyster sauce', 'chitosan', 'glucosamine']
  },
  {
    id: 'allergen_sesame',
    name: 'sesame',
    description: 'Sesamum indicum seeds and sesame paste, recognized as the 9th major food allergen under the US FASTER Act.',
    fdaRecognized: true,
    commonDerivatives: ['tahini', 'sesame oil', 'sesamum indicum', 'benne seeds', 'gingelly', 'til']
  }
];

export interface RawIngredientDefinition {
  canonicalName: string;
  description: string;
  category: string;
  eNumber?: string;
  allergens: string[];
  aliases: string[];
  dietaryConflicts?: {
    isVeganSafe: boolean;
    isVegetarianSafe: boolean;
    isGlutenFreeSafe: boolean;
    isHalalSafe: boolean;
  };
  notes?: string;
}

export const SEED_INGREDIENTS_DATA: RawIngredientDefinition[] = [
  // --- PEANUT INGREDIENTS ---
  {
    canonicalName: 'peanut',
    description: 'Peanut kernels, whole, split, or crushed (Arachis hypogaea). Major FDA allergen.',
    category: 'legume / nut',
    allergens: ['peanut'],
    aliases: ['peanuts', 'roasted peanuts', 'groundnut', 'groundnuts', 'monkey nuts', 'arachis hypogaea', 'valencia peanuts', 'spanish peanuts', 'runner peanuts'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'peanut butter',
    description: 'Paste made from ground dry-roasted peanuts. Direct allergen match for peanuts.',
    category: 'spread',
    allergens: ['peanut'],
    aliases: ['peanut paste', 'smooth peanut butter', 'crunchy peanut butter', 'creamy peanut butter', 'ground peanut butter', 'pure peanut butter'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'peanut oil',
    description: 'Oil extracted from peanuts. Unrefined / cold-pressed oils carry severe allergenic risk.',
    category: 'fat / oil',
    allergens: ['peanut'],
    aliases: ['arachis oil', 'groundnut oil', 'cold pressed peanut oil', 'unrefined peanut oil', 'pure peanut oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'peanut flour',
    description: 'Defatted and finely ground peanut protein meal.',
    category: 'flour / protein',
    allergens: ['peanut'],
    aliases: ['defatted peanut flour', 'peanut protein powder', 'peanut meal'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- MILK / DAIRY INGREDIENTS ---
  {
    canonicalName: 'milk',
    description: 'Bovine dairy milk, pasteurized whole or skimmed. Major FDA allergen.',
    category: 'dairy',
    allergens: ['milk'],
    aliases: ['cow milk', 'cows milk', 'whole milk', 'skim milk', 'skimmed milk', 'pasteurized milk', 'fresh milk', 'fluid milk', 'organic milk'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'milk solids',
    description: 'Dry matter component of milk including caseins, whey, and lactose.',
    category: 'dairy component',
    allergens: ['milk'],
    aliases: ['dairy solids', 'nonfat milk solids', 'dry milk solids', 'skimmed milk solids', 'non fat dry milk solids', 'milk powder solids'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'casein',
    description: 'Principal protein of bovine milk (approx 80% of total milk protein). Severe allergen.',
    category: 'protein',
    allergens: ['milk'],
    aliases: ['caseinate', 'sodium caseinate', 'calcium caseinate', 'potassium caseinate', 'micellar casein', 'hydrolyzed casein', 'acid casein', 'rennet casein'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'whey',
    description: 'Water-soluble milk proteins remaining after curdling and cheese production.',
    category: 'protein',
    allergens: ['milk'],
    aliases: ['whey protein', 'whey powder', 'whey protein isolate', 'whey protein concentrate', 'sweet whey', 'demineralized whey', 'hydrolyzed whey protein', 'wpi', 'wpc'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'butter',
    description: 'Dairy fat emulsion made by churning cream.',
    category: 'dairy fat',
    allergens: ['milk'],
    aliases: ['butter fat', 'butterfat', 'anhydrous milk fat', 'butter oil', 'churned butter', 'salted butter', 'unsalted butter', 'dairy butter'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'ghee',
    description: 'Clarified butter originating in ancient India, containing trace milk proteins.',
    category: 'dairy fat',
    allergens: ['milk'],
    aliases: ['clarified butter', 'desi ghee', 'pure cow ghee', 'butter ghee'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cheese',
    description: 'Dairy product made from curdled milk proteins with bacterial or rennet cultures.',
    category: 'dairy',
    allergens: ['milk'],
    aliases: ['cheddar', 'mozzarella', 'parmesan', 'cheese powder', 'processed cheese', 'feta', 'cream cheese'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'lactose',
    description: 'Disaccharide sugar derived from dairy milk. May contain trace whey proteins.',
    category: 'sugar / sweetener',
    allergens: ['milk'],
    aliases: ['milk sugar', 'lactose monohydrate'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cream',
    description: 'High-fat dairy layer skimmed from milk.',
    category: 'dairy',
    allergens: ['milk'],
    aliases: ['heavy cream', 'whipping cream', 'sour cream', 'clotted cream', 'dairy cream', 'sweet cream'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- EGG INGREDIENTS ---
  {
    canonicalName: 'egg',
    description: 'Poultry egg whole. Major FDA allergen.',
    category: 'poultry / protein',
    allergens: ['egg'],
    aliases: ['eggs', 'whole egg', 'pasteurized egg', 'dried egg', 'egg powder', 'liquid egg', 'fresh egg'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'egg white',
    description: 'Clear liquid (albumen) contained within an egg, high in ovalbumin and ovomucoid.',
    category: 'protein',
    allergens: ['egg'],
    aliases: ['egg albumen', 'albumen', 'egg white solids', 'powdered egg white', 'dried egg whites', 'liquid egg whites'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'egg yolk',
    description: 'Nutrient-bearing yellow portion of an egg, containing vitellin and livetin proteins.',
    category: 'fat / protein',
    allergens: ['egg'],
    aliases: ['egg yolk powder', 'dried egg yolk', 'pasteurized egg yolk', 'liquid egg yolk'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'ovalbumin',
    description: 'Main protein in egg white (approx 54%), strong allergenic trigger.',
    category: 'protein',
    allergens: ['egg'],
    aliases: ['lysozyme from egg', 'ovomucoid', 'ovoglobulin', 'conalbumin', 'ovotransferrin'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- SOY INGREDIENTS ---
  {
    canonicalName: 'soy',
    description: 'Soybeans (Glycine max). Major FDA allergen.',
    category: 'legume',
    allergens: ['soy'],
    aliases: ['soybean', 'soybeans', 'soya', 'edamame', 'whole soybeans', 'defatted soya', 'soy flour', 'soya flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'soy lecithin',
    description: 'Phospholipid emulsifier extracted from soybean oil. E322. High-volume food additive.',
    category: 'emulsifier',
    eNumber: 'E322',
    allergens: ['soy'],
    aliases: ['lecithin from soy', 'soya lecithin', 'soylecithin', 'e322 soy', 'emulsifier (soy lecithin)', 'emulsifier 322 (soy)', 'soybean lecithin'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'soy protein',
    description: 'Isolated and purified protein fraction from defatted soy flakes.',
    category: 'protein',
    allergens: ['soy'],
    aliases: ['soy protein isolate', 'soya protein isolate', 'soy protein concentrate', 'textured soy protein', 'textured vegetable protein (soy)', 'hydrolyzed soy protein'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'tofu',
    description: 'Coagulated soybean milk curd.',
    category: 'legume / protein',
    allergens: ['soy'],
    aliases: ['bean curd', 'soy curd', 'silken tofu', 'firm tofu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'soy sauce',
    description: 'Fermented condiment made from soybeans, roasted wheat grain, water, and salt.',
    category: 'sauce / condiment',
    allergens: ['soy', 'wheat'],
    aliases: ['soya sauce', 'shoyu', 'tamari', 'dark soy sauce', 'light soy sauce'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },

  // --- WHEAT & GLUTEN INGREDIENTS ---
  {
    canonicalName: 'wheat',
    description: 'Triticum genus grain. Major FDA allergen and primary source of gluten.',
    category: 'cereal / grain',
    allergens: ['wheat'],
    aliases: ['whole wheat', 'wheat grain', 'wheat berries', 'refined wheat'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'wheat flour',
    description: 'Milled endosperm of wheat kernels, ubiquitous in baking.',
    category: 'flour',
    allergens: ['wheat'],
    aliases: ['enriched wheat flour', 'unbleached wheat flour', 'bleached wheat flour', 'all purpose flour', 'refined wheat flour (maida)', 'maida', 'atta', 'whole wheat flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'semolina',
    description: 'Coarse purified wheat middlings of durum wheat used in pasta and couscous.',
    category: 'flour / grain',
    allergens: ['wheat'],
    aliases: ['durum semolina', 'suji', 'sooji', 'durum wheat semolina', 'couscous'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'vital wheat gluten',
    description: 'Natural protein extracted from wheat flour containing gliadin and glutenin.',
    category: 'protein / binder',
    allergens: ['wheat'],
    aliases: ['wheat gluten', 'gluten', 'wheat protein', 'seitan', 'isolated wheat gluten'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'spelt',
    description: 'Ancient subspecies of wheat (Triticum spelta), contains gluten and wheat allergens.',
    category: 'grain',
    allergens: ['wheat'],
    aliases: ['dinkel wheat', 'hulled wheat', 'spelt flour', 'organic spelt'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'wheat starch',
    description: 'Starch extracted from wheat endosperm, may contain residual gluten fractions.',
    category: 'starch',
    allergens: ['wheat'],
    aliases: ['modified wheat starch', 'pregelatinized wheat starch'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },

  // --- TREE NUTS INGREDIENTS ---
  {
    canonicalName: 'almond',
    description: 'Seed of Prunus dulcis. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['almonds', 'roasted almonds', 'sliced almonds', 'blanched almonds', 'almond flour', 'almond meal', 'almond paste', 'marzipan', 'almond butter', 'almond milk'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cashew',
    description: 'Seed of Anacardium occidentale. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['cashews', 'roasted cashews', 'cashew nuts', 'cashew butter', 'cashew paste', 'cashew flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'walnut',
    description: 'Nut of Juglans regia. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['walnuts', 'english walnuts', 'black walnuts', 'walnut pieces', 'walnut oil', 'walnut flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'hazelnut',
    description: 'Nut of the hazel tree (Corylus avellana). High cross-reactivity with birch pollen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['hazelnuts', 'filbert', 'filberts', 'cobnut', 'hazelnut paste', 'praline paste', 'gianduja', 'hazelnut butter'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'pecan',
    description: 'Nut of Carya illinoinensis. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['pecans', 'pecan nuts', 'pecan halves', 'pecan pieces', 'pecan butter'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'pistachio',
    description: 'Seed of Pistacia vera. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['pistachios', 'pistachio nuts', 'roasted pistachios', 'pistachio paste', 'pistachio flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'macadamia',
    description: 'Nut of Macadamia integrifolia. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['macadamia nuts', 'macadamias', 'queensland nut', 'macadamia oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'brazil nut',
    description: 'Seed of Bertholletia excelsa. Major FDA tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['brazil nuts', 'pará nut', 'cream nut'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'pine nut',
    description: 'Edible seeds of pines (Pinus spp.). Recognized as tree nut allergen.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['pine nuts', 'pignoli', 'pinon', 'pignon', 'cedar nuts'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- SESAME INGREDIENTS ---
  {
    canonicalName: 'sesame',
    description: 'Seeds of Sesamum indicum. 9th Major US allergen under FASTER Act.',
    category: 'seed',
    allergens: ['sesame'],
    aliases: ['sesame seeds', 'white sesame', 'black sesame', 'toasted sesame', 'sesamum indicum', 'benne', 'benne seeds', 'til'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'tahini',
    description: 'Middle Eastern paste made from toasted ground hulled sesame seeds.',
    category: 'paste / spread',
    allergens: ['sesame'],
    aliases: ['tahina', 'sesame paste', 'sesame butter', 'ground sesame seeds'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sesame oil',
    description: 'Edible vegetable oil derived from sesame seeds.',
    category: 'fat / oil',
    allergens: ['sesame'],
    aliases: ['toasted sesame oil', 'dark sesame oil', 'gingelly oil', 'til oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- FISH & SHELLFISH INGREDIENTS ---
  {
    canonicalName: 'fish',
    description: 'Finned aquatic vertebrates. Major FDA allergen.',
    category: 'seafood / fish',
    allergens: ['fish'],
    aliases: ['cod', 'salmon', 'tuna', 'anchovy', 'anchovies', 'tilapia', 'halibut', 'trout', 'fish gelatin', 'fish sauce', 'surimi', 'isinglass'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'shellfish',
    description: 'Aquatic invertebrates (crustaceans and mollusks). Major FDA allergen.',
    category: 'seafood / shellfish',
    allergens: ['shellfish'],
    aliases: ['shrimp', 'prawns', 'crab', 'lobster', 'crawfish', 'crayfish', 'krill', 'clams', 'oysters', 'mussels', 'scallops', 'squid', 'calamari', 'octopus', 'chitosan'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- ANIMAL DERIVATIVES / DIETARY RESTRICTIONS (VEGAN / VEGETARIAN CONFLICTS) ---
  {
    canonicalName: 'gelatin',
    description: 'Collagen protein derived from animal skins, connective tissues, and bones (bovine/porcine).',
    category: 'gelling agent / protein',
    eNumber: 'E441',
    allergens: [],
    aliases: ['gelatine', 'bovine gelatin', 'porcine gelatin', 'animal gelatin', 'pork gelatin', 'beef gelatin', 'e441'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: false }
  },
  {
    canonicalName: 'carmine',
    description: 'Red pigment derived from crushed cochineal scale insects (Dactylopius coccus). E120.',
    category: 'color',
    eNumber: 'E120',
    allergens: [],
    aliases: ['cochineal', 'cochineal extract', 'carminic acid', 'natural red 4', 'crimson lake', 'e120'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: false }
  },
  {
    canonicalName: 'lard',
    description: 'Rendered fat from the adipose tissue of pigs.',
    category: 'animal fat',
    allergens: [],
    aliases: ['pork fat', 'rendered pork fat', 'animal fat (pork)'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: false }
  },
  {
    canonicalName: 'tallow',
    description: 'Rendered fat of cattle or sheep.',
    category: 'animal fat',
    allergens: [],
    aliases: ['beef tallow', 'mutton tallow', 'beef fat', 'animal shortening'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'animal rennet',
    description: 'Complex of digestive enzymes harvested from the stomach lining of slaughtered calves.',
    category: 'enzyme',
    allergens: [],
    aliases: ['calf rennet', 'traditional rennet', 'rennet (animal)'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: false, isGlutenFreeSafe: true, isHalalSafe: false }
  },
  {
    canonicalName: 'honey',
    description: 'Sweet viscous food substance made by honey bees.',
    category: 'sweetener',
    allergens: [],
    aliases: ['pure honey', 'raw honey', 'blossom honey', 'clover honey'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },

  // --- COMMON BASE INGREDIENTS & ADDITIVES ---
  {
    canonicalName: 'sugar',
    description: 'Purified sucrose crystallized from sugar cane or sugar beet.',
    category: 'sweetener',
    allergens: [],
    aliases: ['cane sugar', 'beet sugar', 'white sugar', 'granulated sugar', 'sucrose', 'raw sugar', 'brown sugar', 'icing sugar'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cocoa powder',
    description: 'Unsweetened powder obtained by grinding cocoa beans and extracting the cocoa butter.',
    category: 'cocoa / chocolate',
    allergens: [],
    aliases: ['cacao powder', 'defatted cocoa', 'dutch process cocoa', 'alkalized cocoa powder', 'cocoa solids'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cocoa butter',
    description: 'Pale-yellow, edible vegetable fat extracted from the cocoa bean.',
    category: 'fat / cocoa',
    allergens: [],
    aliases: ['cacao butter', 'theobroma oil', 'cocoa fat'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cocoa mass',
    description: 'Pure cocoa liquor produced from whole cocoa beans ground into a smooth paste.',
    category: 'cocoa / chocolate',
    allergens: [],
    aliases: ['cocoa liquor', 'chocolate liquor', 'cacao mass', 'unsweetened chocolate'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'palm oil',
    description: 'Edible vegetable oil derived from the mesocarp of the fruit of the oil palms.',
    category: 'fat / oil',
    allergens: [],
    aliases: ['fractionated palm oil', 'palmolein', 'palm fat', 'sustainable palm oil', 'refined palm oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sunflower lecithin',
    description: 'Phospholipid emulsifier extracted from sunflower seeds. Allergen-free alternative to soy lecithin.',
    category: 'emulsifier',
    eNumber: 'E322',
    allergens: [],
    aliases: ['lecithin from sunflower', 'e322 sunflower', 'sunflower seed lecithin'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'salt',
    description: 'Mineral composed primarily of sodium chloride (NaCl).',
    category: 'mineral / seasoning',
    allergens: [],
    aliases: ['sodium chloride', 'table salt', 'sea salt', 'iodized salt', 'rock salt'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'high fructose corn syrup',
    description: 'Liquid sweetener made from corn starch broken down into glucose and fructose.',
    category: 'sweetener',
    allergens: [],
    aliases: ['hfcs', 'glucose-fructose syrup', 'isoglucose', 'corn syrup solids', 'corn syrup'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'aspartame',
    description: 'Artificial non-saccharide sweetener. E951. Source of phenylalanine.',
    category: 'artificial sweetener',
    eNumber: 'E951',
    allergens: [],
    aliases: ['nutrasweet', 'equal', 'e951', 'artificial sweetener aspartame'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sucralose',
    description: 'Zero-calorie artificial sweetener chlorinated from sucrose. E955.',
    category: 'artificial sweetener',
    eNumber: 'E955',
    allergens: [],
    aliases: ['splenda', 'e955'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'acesulfame potassium',
    description: 'Calorie-free sugar substitute. E950.',
    category: 'artificial sweetener',
    eNumber: 'E950',
    allergens: [],
    aliases: ['acesulfame k', 'ace k', 'e950', 'potassium acesulfame'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sodium benzoate',
    description: 'Widely used food preservative (salt of benzoic acid). E211.',
    category: 'preservative',
    eNumber: 'E211',
    allergens: [],
    aliases: ['e211', 'benzoate of soda'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'potassium sorbate',
    description: 'Potassium salt of sorbic acid used to inhibit mold and yeast. E202.',
    category: 'preservative',
    eNumber: 'E202',
    allergens: [],
    aliases: ['e202', 'sorbate'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'bha',
    description: 'Butylated hydroxyanisole synthetic antioxidant food additive. E320.',
    category: 'antioxidant / preservative',
    eNumber: 'E320',
    allergens: [],
    aliases: ['e320', 'butylated hydroxyanisole'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'bht',
    description: 'Butylated hydroxytoluene fat-soluble antioxidant food preservative. E321.',
    category: 'antioxidant / preservative',
    eNumber: 'E321',
    allergens: [],
    aliases: ['e321', 'butylated hydroxytoluene'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'monosodium glutamate',
    description: 'Sodium salt of glutamic acid, umami flavor enhancer. E621.',
    category: 'flavor enhancer',
    eNumber: 'E621',
    allergens: [],
    aliases: ['msg', 'e621', 'sodium glutamate', 'flavour enhancer 621'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'tartrazine',
    description: 'Synthetic lemon yellow azo dye food coloring. E102 / FD&C Yellow 5.',
    category: 'artificial color',
    eNumber: 'E102',
    allergens: [],
    aliases: ['fd&c yellow 5', 'yellow 5', 'e102', 'ci 19140'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'allura red ac',
    description: 'Red azo dye food coloring. E129 / FD&C Red 40.',
    category: 'artificial color',
    eNumber: 'E129',
    allergens: [],
    aliases: ['fd&c red 40', 'red 40', 'e129', 'ci 16035'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'brilliant blue fcf',
    description: 'Synthetic blue dye food coloring. E133 / FD&C Blue 1.',
    category: 'artificial color',
    eNumber: 'E133',
    allergens: [],
    aliases: ['fd&c blue 1', 'blue 1', 'e133'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'titanium dioxide',
    description: 'White mineral pigment banned in EU food as E171 due to genotoxicity concerns.',
    category: 'color',
    eNumber: 'E171',
    allergens: [],
    aliases: ['e171', 'ci 77891', 'titanium white'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'xanthan gum',
    description: 'Polysaccharide thickening agent produced by bacterial fermentation. E415.',
    category: 'thickener / stabilizer',
    eNumber: 'E415',
    allergens: [],
    aliases: ['e415', 'gum xanthan'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'carrageenan',
    description: 'Sulfated polysaccharides extracted from red edible seaweeds. E407.',
    category: 'thickener / gelling agent',
    eNumber: 'E407',
    allergens: [],
    aliases: ['e407', 'irish moss extract', 'semi-refined carrageenan'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'baking powder',
    description: 'Dry chemical leavening agent containing sodium bicarbonate, an acid, and starch.',
    category: 'leavening agent',
    allergens: [],
    aliases: ['leavening', 'raising agents', 'double acting baking powder'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sodium bicarbonate',
    description: 'Baking soda, chemical leavening agent. E500(ii).',
    category: 'leavening agent',
    eNumber: 'E500',
    allergens: [],
    aliases: ['baking soda', 'sodium hydrogen carbonate', 'e500', 'e500ii', 'raising agent 500'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'vanilla extract',
    description: 'Flavoring solution made by macerating vanilla beans in ethyl alcohol and water.',
    category: 'flavoring',
    allergens: [],
    aliases: ['natural vanilla flavor', 'pure vanilla extract', 'vanilla bean paste', 'vanillin', 'artificial vanilla flavor'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'oat flour',
    description: 'Flour made from ground whole oats (Avena sativa). Naturally gluten-free unless cross-contaminated.',
    category: 'grain / flour',
    allergens: [],
    aliases: ['rolled oats', 'oats', 'oatmeal', 'whole grain oats', 'oat flakes'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'rice flour',
    description: 'Flour made from finely milled white or brown rice (Oryza sativa). Gluten-free.',
    category: 'grain / flour',
    allergens: [],
    aliases: ['white rice flour', 'brown rice flour', 'rice powder', 'rice starch'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN DAIRY & TRADITIONAL INGREDIENTS ---
  {
    canonicalName: 'paneer',
    description: 'Fresh acid-set non-melting cottage cheese traditional in Indian cuisine. Rich in bovine casein and whey.',
    category: 'dairy / protein',
    allergens: ['milk'],
    aliases: ['indian cottage cheese', 'cottage cheese (paneer)', 'fresh paneer', 'malai paneer', 'paneer cubes'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'Primary Indian dairy staple; contains high concentrations of bovine casein proteins.'
  },
  {
    canonicalName: 'ghee',
    description: 'Clarified butterfat traditional in Indian cuisine made by simmering butter. Contains trace milk solids.',
    category: 'dairy / fat',
    allergens: ['milk'],
    aliases: ['desi ghee', 'clarified butter (ghee)', 'cow ghee', 'shuddh ghee', 'pure cow ghee', 'usli ghee', 'butter oil'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'While water-soluble proteins are low (<0.1%), severe milk-allergic individuals may react.'
  },
  {
    canonicalName: 'khoya',
    description: 'Heat-desiccated dried whole milk solids used as the foundation for Indian sweets (mithai).',
    category: 'dairy / confectionery',
    allergens: ['milk'],
    aliases: ['mawa', 'khoa', 'evaporated milk solids', 'condensed milk solids', 'khoya mawa'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'dahi',
    description: 'Traditional Indian cultured yogurt / curd made from fermented cow or buffalo milk.',
    category: 'dairy',
    allergens: ['milk'],
    aliases: ['curd', 'indian curd', 'yogurt (dahi)', 'hung curd', 'plain curd', 'chaas', 'lassi curd'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'malai',
    description: 'Traditional Indian clotted cream skimmed from heated whole milk.',
    category: 'dairy',
    allergens: ['milk'],
    aliases: ['milk cream', 'clotted cream', 'fresh malai', 'dairy cream'],
    dietaryConflicts: { isVeganSafe: false, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN GRAINS & FLOURS ---
  {
    canonicalName: 'atta',
    description: 'Whole wheat flour milled from hard durum or sharbati wheat, staple for Indian flatbreads (roti, chapati).',
    category: 'grain / flour',
    allergens: ['wheat'],
    aliases: ['whole wheat flour (atta)', 'chakki atta', 'gehun ka atta', 'sharbati atta', 'chapati flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'maida',
    description: 'Finely milled and refined wheat flour used widely in Indian pastries, biscuits, and compounding.',
    category: 'grain / flour',
    allergens: ['wheat'],
    aliases: ['refined wheat flour (maida)', 'all-purpose flour (maida)', 'refined flour', 'white flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'suji',
    description: 'Granular durum wheat semolina used for halwa, upma, and Indian confectionery.',
    category: 'grain / flour',
    allergens: ['wheat'],
    aliases: ['rava', 'sooji', 'semolina (suji)', 'bombay rava', 'durum wheat semolina', 'rava flour'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true }
  },
  {
    canonicalName: 'besan',
    description: 'Flour ground from Bengal gram (chana dal / chickpeas), staple in Indian namkeens and pakoras.',
    category: 'grain / flour',
    allergens: [],
    aliases: ['gram flour', 'chickpea flour (besan)', 'bengal gram flour', 'chana flour', 'kadala maavu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'Naturally gluten-free; check facility certification to avoid wheat stone-mill cross-contact.'
  },
  {
    canonicalName: 'poha',
    description: 'De-husked flattened rice flakes used for traditional Indian breakfast and snack formulations.',
    category: 'grain',
    allergens: [],
    aliases: ['flattened rice', 'beaten rice', 'aval', 'chiwda', 'flattened rice flakes'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'sabudana',
    description: 'Tapioca starch pearl sago used in Indian fasting foods (khichdi, vada, kheer).',
    category: 'starch',
    allergens: [],
    aliases: ['tapioca sago', 'sago pearls', 'tapioca pearls', 'javvarisi'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN SPICES, CONDIMENTS & SWEETENERS ---
  {
    canonicalName: 'compounded asafoetida',
    description: 'Compounded spice powder blending Ferula resin with edible Maida (wheat flour) and gum arabic.',
    category: 'spice / allergen hazard',
    allergens: ['wheat'],
    aliases: ['hing', 'asafoetida', 'bandhani hing', 'hing powder', 'compounded hing', 'asafoetida compound'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: false, isHalalSafe: true },
    notes: 'WARNING: Commercial compounded hing contains wheat flour / gluten carrier unless certified pure resin.'
  },
  {
    canonicalName: 'mustard seeds',
    description: 'Seeds of Brassica nigra / juncea and cold-pressed Kachi Ghani mustard oil, staple in Indian tempering.',
    category: 'spice / oil',
    allergens: [],
    aliases: ['rai', 'sarson', 'mustard oil', 'kachi ghani mustard oil', 'sarson ka tel', 'black mustard seeds', 'yellow mustard'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'Potent thermal-stable Sin a 1 allergen; ubiquitous in Indian pickles (achar) and tadkas.'
  },
  {
    canonicalName: 'turmeric',
    description: 'Dried rhizome of Curcuma longa containing bioactive curcuminoids.',
    category: 'spice',
    eNumber: 'E100',
    allergens: [],
    aliases: ['haldi', 'curcumin', 'turmeric powder', 'e100', 'curcuma'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'cumin',
    description: 'Aromatic dried seeds of Cuminum cyminum used in Indian tadkas and spice blends.',
    category: 'spice',
    allergens: [],
    aliases: ['jeera', 'zeera', 'cumin seeds', 'cumin powder', 'roasted jeera'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'coriander',
    description: 'Dried seeds and leaves of Coriandrum sativum, staple in Indian curry bases.',
    category: 'spice',
    allergens: [],
    aliases: ['dhaniya', 'dhania', 'coriander powder', 'coriander seeds', 'cilantro'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'fenugreek',
    description: 'Seeds and dried leaves (Kasuri Methi) of Trigonella foenum-graecum.',
    category: 'spice',
    allergens: [],
    aliases: ['methi', 'kasuri methi', 'fenugreek seeds', 'fenugreek leaves', 'kasoori methi'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'carom seeds',
    description: 'Aromatic thymol-rich seeds of Trachyspermum ammi used in Indian doughs and digestive foods.',
    category: 'spice',
    allergens: [],
    aliases: ['ajwain', 'omam', 'bishop weed', 'ajwain seeds'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'garam masala',
    description: 'Traditional Indian whole spice blend of cinnamon, cardamom, cloves, cumin, coriander, and black pepper.',
    category: 'spice blend',
    allergens: [],
    aliases: ['indian spice blend', 'garam masala powder', 'whole garam masala'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'jaggery',
    description: 'Traditional unrefined non-centrifugal cane sugar widely consumed in Indian cooking and sweets.',
    category: 'sweetener',
    allergens: [],
    aliases: ['gur', 'gud', 'palm jaggery', 'organic jaggery', 'bellam', 'vellam', 'desi gud'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN TREE NUTS & SEEDS ---
  {
    canonicalName: 'cashew',
    description: 'Kidney-shaped tree nut (Anacardium occidentale) fundamental in Indian gravies and Kaju sweets.',
    category: 'tree nut',
    allergens: ['tree nuts'],
    aliases: ['kaju', 'cashew nuts', 'kaju pieces', 'kaju paste', 'cashew butter', 'broken cashew'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'Major allergen; key component in Kaju Katli and Shahi curries.'
  },
  {
    canonicalName: 'sesame seeds',
    description: 'Seeds of Sesamum indicum and gingelly oil, core to Indian sweets (Til Laddu) and snacks.',
    category: 'seed / allergen',
    allergens: ['sesame'],
    aliases: ['til', 'safed til', 'kala til', 'gingelly seeds', 'sesame oil (til tel)', 'til oil', 'gingelly oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN ANCIENT GRAINS & MILLETS ---
  {
    canonicalName: 'ragi',
    description: 'Finger millet (Eleusine coracana / Nachni), nutrient-rich gluten-free ancient grain widely consumed in South & West India.',
    category: 'millet / flour',
    allergens: [],
    aliases: ['nachni', 'finger millet', 'ragi flour', 'nachni atta', 'kezhvaragu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'bajra',
    description: 'Pearl millet (Pennisetum glaucum), traditional iron-rich millet used for bhakri in Rajasthan and Gujarat.',
    category: 'millet / flour',
    allergens: [],
    aliases: ['pearl millet', 'bajra flour', 'bajra atta', 'cumbu', 'sajje'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'jowar',
    description: 'Sorghum grain (Sorghum bicolor), high-fiber gluten-free staple flour for flatbreads.',
    category: 'millet / flour',
    allergens: [],
    aliases: ['sorghum', 'sorghum flour', 'jowar flour', 'jowar atta', 'cholam', 'jola'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'kuttu atta',
    description: 'Buckwheat flour (Fagopyrum esculentum), traditional Indian Vrat / fasting food grain.',
    category: 'fasting flour',
    allergens: [],
    aliases: ['buckwheat', 'buckwheat flour', 'kuttu', 'kuttu flour', 'phaphar'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'rajgira',
    description: 'Amaranth grain / flour (Amaranthus cruentus) consumed in Indian fasts and chikki snacks.',
    category: 'fasting grain',
    allergens: [],
    aliases: ['amaranth', 'amaranth flour', 'ramdana', 'rajgira flour', 'chawli atta'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN PULSES & DALS ---
  {
    canonicalName: 'chana dal',
    description: 'Split Bengal gram lentils (Cicer arietinum), core component of Besan and South Indian tadka mixes.',
    category: 'pulse / legume',
    allergens: [],
    aliases: ['split bengal gram', 'bengal gram dal', 'chana pulse', 'senagapappu', 'kadalai paruppu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'toor dal',
    description: 'Split pigeon peas (Cajanus cajan / Arhar dal), essential protein staple in Indian Dal Fry and Sambhar.',
    category: 'pulse / legume',
    allergens: [],
    aliases: ['arhar dal', 'pigeon peas', 'split pigeon peas', 'tuvar dal', 'thovarai paruppu', 'kandi pappu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'moong dal',
    description: 'Split green gram lentils (Vigna radiata), light digestible legume used in Khichdi and Moong Halwa.',
    category: 'pulse / legume',
    allergens: [],
    aliases: ['split green gram', 'yellow moong dal', 'mung dal', 'green gram', 'paasi paruppu', 'pesara pappu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'urad dal',
    description: 'Split black gram (Vigna mungo), key fermenting lentil for Idli, Dosa batter, and Dal Makhani.',
    category: 'pulse / legume',
    allergens: [],
    aliases: ['split black gram', 'black gram', 'white urad dal', 'ulundhu', 'minapa pappu'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  // --- INDIAN SPECIALTY FATS, ADDITIVES & SWEETENERS ---
  {
    canonicalName: 'vanaspati',
    description: 'Hydrogenated vegetable fat (Dalda) used in commercial Indian confectionery and fried snacks.',
    category: 'hydrogenated fat',
    allergens: [],
    aliases: ['dalda', 'hydrogenated vegetable oil', 'vegetable ghee', 'vanaspati ghee', 'partially hydrogenated oil'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'Trans-fat heavy hydrogenated fat commonly found in commercial Indian bakery goods.'
  },
  {
    canonicalName: 'vark',
    description: 'Ultra-thin edible silver leaf foil (Chandi ka Vark) applied on traditional Indian sweets (Kaju Katli, Barfi).',
    category: 'edible foil / decorative',
    allergens: [],
    aliases: ['chandi vark', 'chandi ka vark', 'silver vark', 'edible silver foil', 'silver leaf', 'varak'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'hydrolysed groundnut protein',
    description: 'Hydrolyzed peanut protein extract used as a savory flavor enhancer in Indian noodles and tastemakers.',
    category: 'flavor enhancer / allergen',
    allergens: ['peanut'],
    aliases: ['hydrolyzed groundnut protein', 'groundnut protein', 'hydrolyzed peanut protein', 'peanut protein extract'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true },
    notes: 'CRITICAL PEANUT ALLERGEN: Hidden in instant noodle seasoning sachets (e.g. Maggi Tastemaker).'
  },
  {
    canonicalName: 'amchur',
    description: 'Sun-dried unripe green mango powder used as an acidic souring agent in Indian chaat and namkeens.',
    category: 'spice / souring agent',
    allergens: [],
    aliases: ['amchoor', 'dry mango powder', 'raw mango powder', 'mango powder'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'kala namak',
    description: 'Volcanic rock salt containing sulfur compounds, providing characteristic tangy aroma in Indian chaats.',
    category: 'salt / seasoning',
    allergens: [],
    aliases: ['black salt', 'indian black salt', 'saindhav namak', 'sanchal'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  },
  {
    canonicalName: 'kesar',
    description: 'Saffron stigma threads of Crocus sativus, providing aroma and yellow hue in Indian desserts and Biryani.',
    category: 'spice / natural color',
    allergens: [],
    aliases: ['saffron', 'zafran', 'keshar', 'saffron strands', 'kumkuma'],
    dietaryConflicts: { isVeganSafe: true, isVegetarianSafe: true, isGlutenFreeSafe: true, isHalalSafe: true }
  }
];

// Helper to generate normalized database format
export function buildSeededDatabase(): {
  allergens: Allergen[];
  ingredients: Ingredient[];
  aliases: IngredientAlias[];
} {
  const ingredients: Ingredient[] = [];
  const aliases: IngredientAlias[] = [];

  SEED_INGREDIENTS_DATA.forEach((item, index) => {
    const ingredientId = `ing_${index + 1}_${item.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const ingredient: Ingredient = {
      id: ingredientId,
      canonicalName: item.canonicalName,
      description: item.description,
      category: item.category,
      eNumber: item.eNumber,
      allergens: item.allergens,
      dietaryConflicts: item.dietaryConflicts,
      notes: item.notes
    };
    ingredients.push(ingredient);

    // Add canonical name as self-alias
    aliases.push({
      id: `alias_${aliases.length + 1}`,
      ingredientId,
      alias: item.canonicalName.toLowerCase().trim(),
      canonicalName: item.canonicalName
    });

    // Add all synonyms / variants
    item.aliases.forEach((aliasStr) => {
      const cleaned = aliasStr.toLowerCase().trim();
      if (cleaned && cleaned !== item.canonicalName.toLowerCase().trim()) {
        aliases.push({
          id: `alias_${aliases.length + 1}`,
          ingredientId,
          alias: cleaned,
          canonicalName: item.canonicalName
        });
      }
    });
  });

  return {
    allergens: FDA_ALLERGENS,
    ingredients,
    aliases
  };
}
