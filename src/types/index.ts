export type RiskLevel =
  | 'CRITICAL'
  | 'WARNING'
  | 'CAUTION'
  | 'INFORMATIONAL'
  | 'NO_MATCH'
  | 'UNKNOWN';

export type AllergenType =
  | 'milk'
  | 'egg'
  | 'peanut'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'shellfish'
  | 'tree nuts'
  | 'sesame';

export type DietType =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'halal'
  | 'kosher'
  | 'pescatarian';

export interface Allergen {
  id: string;
  name: AllergenType | string;
  description: string;
  fdaRecognized: boolean;
  commonDerivatives: string[];
}

export interface UserProfile {
  id: string;
  userId: string;
  dietType: DietType;
  allergies: string[]; // allergen names or IDs (e.g. ['peanut', 'milk'])
  avoidIngredients: string[]; // custom free-text ingredients to avoid (e.g. ['tartrazine', 'palm oil', 'aspartame'])
  preferences?: {
    avoidArtificialColors?: boolean;
    avoidPreservatives?: boolean;
    avoidAddedSugars?: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
}

export interface Ingredient {
  id: string;
  canonicalName: string;
  description: string;
  category: string; // 'emulsifier' | 'preservative' | 'sweetener' | 'color' | 'protein' | 'flour' | 'fat' | 'additive' | 'flavor' | 'other'
  eNumber?: string;
  allergens: string[]; // Allergen IDs / names it resolves to (e.g. 'milk' for casein)
  dietaryConflicts?: {
    isVeganSafe: boolean;
    isVegetarianSafe: boolean;
    isGlutenFreeSafe: boolean;
    isHalalSafe: boolean;
  };
  notes?: string;
}

export interface IngredientAlias {
  id: string;
  ingredientId: string;
  alias: string;
  canonicalName: string;
}

export interface ScientificSource {
  id: string;
  title: string;
  organization: 'FDA' | 'EFSA' | 'FSSAI' | 'WHO' | 'CODEX';
  url: string;
  sourceType: 'allergen_guidance' | 'additive_info' | 'gras_notice' | 'hazard_assessment' | 'regulation';
  publicationDate: string;
  summary: string;
}

export interface ScientificChunk {
  id: string;
  sourceId: string;
  text: string;
  metadata: {
    ingredient: string;
    org: string;
    topic: string;
    section?: string;
    keywords: string[];
  };
  similarityScore?: number;
}

export interface Product {
  id: string;
  barcode?: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  ingredientsText: string;
  ingredientsList: string[];
  nutrition?: {
    calories?: number;
    fat?: string;
    saturatedFat?: string;
    carbs?: string;
    sugar?: string;
    protein?: string;
    sodium?: string;
  };
  labels?: string[];
  verifiedSource?: 'openfoodfacts' | 'curated_database' | 'user_scan';
}

export interface OcrToken {
  text: string;
  confidence: number; // 0 to 1
  isClean: boolean;
}

export interface NormalizedIngredientResult {
  raw: string;
  canonicalName: string;
  ingredientId?: string;
  matchedAlias?: string;
  category?: string;
  allergens: string[];
  dietaryConflicts?: {
    isVeganSafe: boolean;
    isVegetarianSafe: boolean;
    isGlutenFreeSafe: boolean;
    isHalalSafe: boolean;
  };
  confidence: number;
  isResolved: boolean;
  notes?: string;
}

export interface ConflictItem {
  ingredient: string;
  canonicalName?: string;
  reason: string;
  severity: 'critical' | 'warning' | 'caution' | 'informational' | 'unknown';
  type: 'ALLERGEN_CONFLICT' | 'DIET_CONFLICT' | 'USER_RESTRICTION' | 'INSUFFICIENT_EVIDENCE' | 'UNKNOWN';
  allergen?: string;
}

export interface EvidenceItem {
  source: string;
  title: string;
  url: string;
  excerpt?: string;
  organization: string;
  publicationDate?: string;
}

export interface ConfidenceScores {
  ocr: number;
  ingredient_matching: number;
  evidence: 'high' | 'medium' | 'low';
  overall: number;
}

export interface AssessmentResponse {
  id?: string;
  status: 'warning' | 'caution' | 'clear' | 'unknown';
  score: number | null; // 0 - 100 or null if unknown
  risk_level: RiskLevel;
  conflicts: ConflictItem[];
  unresolved_ingredients: string[];
  evidence: EvidenceItem[];
  confidence: ConfidenceScores;
  explanation: string;
  normalized_ingredients: NormalizedIngredientResult[];
  product?: {
    id?: string;
    name?: string;
    brand?: string;
    barcode?: string;
    imageUrl?: string;
  };
  scanned_method?: 'barcode' | 'ocr' | 'manual';
  created_at?: string;
}

export interface ScanRecord {
  id: string;
  userId: string;
  productId?: string;
  productName: string;
  brand?: string;
  scanMethod: 'barcode' | 'ocr';
  ocrText?: string;
  assessment: AssessmentResponse;
  createdAt: string;
}

export interface BenchmarkSample {
  productId: string;
  productName: string;
  barcode?: string;
  rawIngredients: string;
  normalizedIngredients: string[];
  allergens: string[];
  userProfile: {
    allergies: string[];
    dietType: DietType;
    avoidIngredients: string[];
  };
  expectedConflicts: string[];
  expectedRisk: RiskLevel;
  expectedScore: number | null;
}
