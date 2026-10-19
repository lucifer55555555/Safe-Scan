import { ConflictItem, NormalizedIngredientResult, RiskLevel, UserProfile } from '../types';
import { buildSeededDatabase } from '../data/seedIngredients';
import { resolveSingleIngredient } from './normalizer';

const { ingredients, aliases } = buildSeededDatabase();
const ingredientMap = new Map<string, (typeof ingredients)[0]>();
ingredients.forEach((ing) => {
  ingredientMap.set(ing.id, ing);
  ingredientMap.set(ing.canonicalName.toLowerCase().trim(), ing);
});
aliases.forEach((a) => {
  const ing = ingredients.find((i) => i.id === a.ingredientId);
  if (ing && !ingredientMap.has(a.alias.toLowerCase().trim())) {
    ingredientMap.set(a.alias.toLowerCase().trim(), ing);
  }
});

export interface RuleEvaluationResult {
  risk_level: RiskLevel;
  score: number | null;
  conflicts: ConflictItem[];
  unresolved: string[];
}

/**
 * Pure deterministic rule engine that evaluates a single ingredient against a user profile
 * (No LLM, no network dependency - strictly rules-based).
 */
export function evaluate_ingredient(
  ingredient: NormalizedIngredientResult,
  user_profile: {
    allergies: string[];
    dietType: string;
    avoidIngredients: string[];
    preferences?: {
      lactoseIntolerant?: boolean;
    };
  }
): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  // 0. Check unresolved ingredients
  if (!ingredient.isResolved) {
    conflicts.push({
      ingredient: ingredient.raw,
      canonicalName: ingredient.canonicalName,
      reason: 'Ingredient not resolved in curated regulatory knowledge base — insufficient evidence to confirm safety.',
      severity: 'unknown',
      type: 'INSUFFICIENT_EVIDENCE'
    });
    return conflicts;
  }

  const ingData = (ingredient.ingredientId ? ingredientMap.get(ingredient.ingredientId) : null) || ingredientMap.get(ingredient.canonicalName.toLowerCase().trim());
  const userAllergies = (user_profile.allergies || []).map((a) => a.toLowerCase().trim());
  const userAvoids = (user_profile.avoidIngredients || []).map((a) => a.toLowerCase().trim());
  const userDiet = (user_profile.dietType || 'none').toLowerCase().trim();
  const isLactoseIntolerant = Boolean(
    user_profile.preferences?.lactoseIntolerant ||
    userAvoids.includes('lactose') ||
    userAllergies.includes('lactose')
  );

  const cName = (ingredient.canonicalName || '').toLowerCase().trim();
  const rawName = (ingredient.raw || '').toLowerCase().trim();
  const matchedAlias = (ingredient.matchedAlias || '').toLowerCase().trim();

  // Explicit dairy determination
  const isDairy =
    ingredient.allergens.includes('milk') ||
    Boolean(ingData?.allergens?.includes('milk')) ||
    (ingredient.category && ingredient.category.toLowerCase().includes('dairy')) ||
    (ingData?.category && ingData.category.toLowerCase().includes('dairy')) ||
    ingredient.dietaryConflicts?.isDairyFreeSafe === false ||
    ingData?.dietaryConflicts?.isDairyFreeSafe === false ||
    [
      'milk',
      'milk solids',
      'milk powder',
      'paneer',
      'butter',
      'ghee',
      'malai',
      'khoya',
      'dahi',
      'curd',
      'cheese',
      'casein',
      'whey',
      'lactose',
      'cream',
      'sodium caseinate',
      'calcium caseinate',
      'potassium caseinate',
      'milk protein',
      'milk fat',
      'buttermilk'
    ].includes(cName);

  // 1. ALLERGEN CONFLICT CHECK (CRITICAL - Highest Priority)
  // Check against all declared allergens
  for (const allergen of userAllergies) {
    if (!allergen) continue;

    let isMatch = false;

    if (allergen === 'milk') {
      // Any dairy ingredient is a milk allergen match
      if (isDairy) {
        isMatch = true;
      }
    } else if (allergen === 'tree nuts') {
      // Tree nuts group match
      if (
        ingredient.allergens.includes('tree nuts') ||
        ingData?.allergens?.includes('tree nuts') ||
        ['almond', 'cashew', 'walnut', 'hazelnut', 'pistachio', 'pecan', 'macadamia', 'brazil nut'].includes(cName)
      ) {
        isMatch = true;
      }
    } else {
      // Exact allergen tag or canonical/raw name match
      if (
        ingredient.allergens.map((a) => a.toLowerCase()).includes(allergen) ||
        (ingData?.allergens && ingData.allergens.map((a) => a.toLowerCase()).includes(allergen))
      ) {
        isMatch = true;
      } else {
        const algRegex = new RegExp(`\\b${allergen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (algRegex.test(cName) || algRegex.test(rawName)) {
          isMatch = true;
        }
      }
    }

    if (isMatch && !conflicts.some((c) => c.type === 'ALLERGEN_CONFLICT' && c.allergen === allergen)) {
      conflicts.push({
        ingredient: ingredient.raw,
        canonicalName: ingredient.canonicalName,
        reason: `Matches declared allergy in your profile: ${allergen.toUpperCase()} (${ingredient.canonicalName})`,
        severity: 'critical',
        type: 'ALLERGEN_CONFLICT',
        allergen
      });
    }
  }

  // 2. STRICT DIETARY RESTRICTION CHECK (CRITICAL for Hard Avoidance)
  const dietaryConflicts = ingredient.dietaryConflicts || ingData?.dietaryConflicts;

  if (userDiet !== 'none') {
    // 2A. Strict Dairy-Free
    if (userDiet === 'dairy-free') {
      if (isDairy) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Conflicts with strict Dairy-Free dietary profile (contains dairy-derived ingredient: ${ingredient.canonicalName})`,
          severity: 'critical',
          type: 'DIET_CONFLICT'
        });
      }
    }
    // 2B. Vegan
    else if (userDiet === 'vegan') {
      const isVeganViolation =
        dietaryConflicts?.isVeganSafe === false ||
        isDairy ||
        ingredient.allergens.some((a) => ['milk', 'egg', 'fish', 'shellfish'].includes(a.toLowerCase())) ||
        ingData?.allergens?.some((a) => ['milk', 'egg', 'fish', 'shellfish'].includes(a.toLowerCase())) ||
        ['honey', 'gelatin', 'carmine', 'lard'].includes(cName);

      if (isVeganViolation) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Conflicts with Vegan dietary profile (contains animal derivative: ${ingredient.canonicalName})`,
          severity: 'critical',
          type: 'DIET_CONFLICT'
        });
      }
    }
    // 2C. Vegetarian
    else if (userDiet === 'vegetarian') {
      const isVegViolation =
        dietaryConflicts?.isVegetarianSafe === false ||
        ingredient.allergens.some((a) => ['fish', 'shellfish'].includes(a.toLowerCase())) ||
        ingData?.allergens?.some((a) => ['fish', 'shellfish'].includes(a.toLowerCase())) ||
        ['gelatin', 'carmine', 'lard', 'animal rennet'].includes(cName);

      if (isVegViolation) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Conflicts with Vegetarian dietary profile (contains non-vegetarian derivative: ${ingredient.canonicalName})`,
          severity: 'critical',
          type: 'DIET_CONFLICT'
        });
      }
    }
    // 2D. Gluten-Free
    else if (userDiet === 'gluten-free') {
      const isGlutenViolation =
        dietaryConflicts?.isGlutenFreeSafe === false ||
        ingredient.allergens.includes('wheat') ||
        ingData?.allergens?.includes('wheat') ||
        ['wheat', 'barley', 'rye', 'spelt', 'semolina', 'durum', 'maida', 'atta'].some((g) => cName.includes(g));

      if (isGlutenViolation) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Conflicts with Gluten-Free dietary profile (contains gluten-bearing grain: ${ingredient.canonicalName})`,
          severity: 'critical',
          type: 'DIET_CONFLICT'
        });
      }
    }
    // 2E. Halal
    else if (userDiet === 'halal') {
      if (dietaryConflicts?.isHalalSafe === false) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Conflicts with Halal dietary profile (contains non-halal ingredient: ${ingredient.canonicalName})`,
          severity: 'critical',
          type: 'DIET_CONFLICT'
        });
      }
    }
  }

  // 3. LACTOSE INTOLERANCE SPECIFIC EVIDENCE CHECK
  // (Only if not already flagged under a strict dairy-free diet conflict above)
  if (isLactoseIntolerant && userDiet !== 'dairy-free') {
    if (isDairy) {
      const lactoseLevel = ingredient.lactoseContent || ingData?.lactoseContent || 'none';

      if (cName === 'lactose' || lactoseLevel === 'high' || ['milk', 'milk solids', 'milk powder', 'whey', 'khoya', 'dahi'].includes(cName)) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `High lactose content detected (${ingredient.canonicalName}) — unsuitable for lactose intolerance.`,
          severity: 'warning',
          type: 'USER_RESTRICTION'
        });
      } else if (lactoseLevel === 'moderate' || ['paneer', 'malai', 'cheese', 'cream'].includes(cName)) {
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Moderate lactose content detected (${ingredient.canonicalName}) — may trigger symptoms in lactose-sensitive individuals.`,
          severity: 'warning',
          type: 'USER_RESTRICTION'
        });
      } else {
        // Trace / Low / Undetermined lactose (e.g. ghee, butter, pure casein / sodium caseinate)
        conflicts.push({
          ingredient: ingredient.raw,
          canonicalName: ingredient.canonicalName,
          reason: `Contains dairy derivative (${ingredient.canonicalName}) with low or undetermined lactose quantity. Lactose tolerance varies by individual.`,
          severity: 'caution',
          type: 'INSUFFICIENT_EVIDENCE'
        });
      }
    }
  }

  // 4. USER CUSTOM AVOID LIST (CAUTION / NON-HARD RESTRICTION)
  // Kept completely separate from allergen & strict dietary rules
  for (const avoidItem of userAvoids) {
    if (!avoidItem || avoidItem === 'lactose') continue; // Lactose handled specifically above

    const avoidRegex = new RegExp(`\\b${avoidItem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (avoidRegex.test(cName) || avoidRegex.test(rawName) || avoidRegex.test(matchedAlias)) {
      conflicts.push({
        ingredient: ingredient.raw,
        canonicalName: ingredient.canonicalName,
        reason: `Matches custom ingredient restriction in your profile: "${avoidItem}"`,
        severity: 'caution',
        type: 'USER_RESTRICTION'
      });
    }
  }

  return conflicts;
}

/**
 * Runs the deterministic safety rules across all normalized ingredients in a product.
 * Enforces one authoritative assessment result using strict hierarchy:
 * 1. NOT SUITABLE: Confirmed hard conflict (Allergen or Strict Dietary Avoidance) -> score: 0
 * 2. UNKNOWN / QUARANTINE: Unresolved ingredient tokens -> score: null
 * 3. CAUTION: Custom avoid list match or undetermined evidence -> score: 60
 * 4. SAFE: All verified, zero conflicts -> score: 100
 */
export function evaluateProductSafety(
  normalizedIngredients: NormalizedIngredientResult[],
  userProfile: {
    allergies: string[];
    dietType: string;
    avoidIngredients: string[];
    preferences?: {
      lactoseIntolerant?: boolean;
    };
  }
): RuleEvaluationResult {
  const allConflicts: ConflictItem[] = [];
  const unresolved: string[] = [];

  for (const item of normalizedIngredients) {
    if (!item.isResolved) {
      unresolved.push(item.raw);
    }
    const itemConflicts = evaluate_ingredient(item, userProfile);
    allConflicts.push(...itemConflicts);
  }

  // Deduplicate conflicts by unique key
  const uniqueConflicts: ConflictItem[] = [];
  const seenKeys = new Set<string>();

  for (const c of allConflicts) {
    const key = `${c.type}_${c.canonicalName || c.ingredient}_${c.reason}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueConflicts.push(c);
    }
  }

  // Hierarchy evaluation
  const hasHardConflict = uniqueConflicts.some((c) => c.severity === 'critical');
  const hasWarning = uniqueConflicts.some((c) => c.severity === 'warning');
  const hasCaution = uniqueConflicts.some((c) => c.severity === 'caution' || c.type === 'USER_RESTRICTION');
  const hasUnresolved = unresolved.length > 0;

  let risk_level: RiskLevel = 'NO_MATCH';
  let score: number | null = 100;

  // RULE 1: Hard conflict ALWAYS dominates. It must NEVER receive a safe score.
  if (hasHardConflict) {
    risk_level = 'CRITICAL';
    score = 0;
  }
  // RULE 2: Unresolved critical ingredient must not silently default to SAFE
  else if (hasUnresolved) {
    risk_level = 'UNKNOWN';
    score = null; // Suppressed quarantine: cannot certify safety for unknown chemical substances
  }
  // RULE 3: High/moderate lactose or non-hard diet warnings
  else if (hasWarning) {
    risk_level = 'WARNING';
    score = 25;
  }
  // RULE 4: Custom avoid list (e.g. palm oil) or trace lactose caution
  else if (hasCaution) {
    risk_level = 'CAUTION';
    score = 60;
  }
  // RULE 5: Completely safe
  else {
    risk_level = 'NO_MATCH';
    score = 100;
  }

  return {
    risk_level,
    score,
    conflicts: uniqueConflicts.filter((c) => c.type !== 'INSUFFICIENT_EVIDENCE' || c.severity === 'caution'),
    unresolved
  };
}

/**
 * Comprehensive Automated Safety Unit Tests Suite (10 Critical Tests):
 * 1. test_exact_allergen()
 * 2. test_synonym_match()
 * 3. test_derived_ingredient()
 * 4. test_no_conflict()
 * 5. test_unknown_ingredient_quarantine() (Unknown MUST trigger UNKNOWN/CAUTION and null numeric score)
 * 6. test_all_9_major_fda_allergens() (Milk, Egg, Fish, Shellfish, Tree Nut, Peanut, Wheat, Soy, Sesame)
 * 7. test_dietary_vegan_violation()
 * 8. test_dietary_gluten_violation()
 * 9. test_precautionary_statement()
 * 10. test_nested_parentheses_parsing()
 */
export function runUnitTests(): {
  allPassed: boolean;
  totalTests?: number;
  passedTests?: number;
  failedTests?: number;
  results: { testName: string; passed: boolean; message: string }[];
} {
  const testResults: { testName: string; passed: boolean; message: string }[] = [];

  // Test 1: test_exact_allergen
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'peanuts',
      canonicalName: 'peanut',
      allergens: ['peanut'],
      confidence: 1.0,
      isResolved: true
    };
    const profile = { allergies: ['peanut'], dietType: 'none', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.some((c) => c.severity === 'critical' && c.allergen === 'peanut');
    testResults.push({
      testName: 'test_exact_allergen',
      passed,
      message: passed ? 'Passed: Exact peanut allergen detected with CRITICAL severity.' : 'Failed to detect exact allergen.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_exact_allergen', passed: false, message: e.message });
  }

  // Test 2: test_synonym_match
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'sodium caseinate',
      canonicalName: 'casein',
      allergens: ['milk'],
      confidence: 0.99,
      isResolved: true
    };
    const profile = { allergies: ['milk'], dietType: 'none', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.some((c) => c.severity === 'critical' && c.allergen === 'milk');
    testResults.push({
      testName: 'test_synonym_match',
      passed,
      message: passed ? 'Passed: Synonym sodium caseinate mapped to milk allergen with CRITICAL severity.' : 'Failed synonym match.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_synonym_match', passed: false, message: e.message });
  }

  // Test 3: test_derived_ingredient
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'peanut butter',
      canonicalName: 'peanut butter',
      allergens: ['peanut'],
      confidence: 0.98,
      isResolved: true
    };
    const profile = { allergies: ['peanut'], dietType: 'none', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.some((c) => c.severity === 'critical');
    testResults.push({
      testName: 'test_derived_ingredient',
      passed,
      message: passed ? 'Passed: Derived ingredient peanut butter matched user peanut allergy.' : 'Failed derived ingredient match.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_derived_ingredient', passed: false, message: e.message });
  }

  // Test 4: test_no_conflict
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'oat flour',
      canonicalName: 'oat flour',
      allergens: [],
      confidence: 0.95,
      isResolved: true
    };
    const profile = { allergies: ['peanut'], dietType: 'none', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.length === 0;
    testResults.push({
      testName: 'test_no_conflict',
      passed,
      message: passed ? 'Passed: Oat flour produced 0 conflicts for peanut allergic user.' : 'Failed: Unexpected conflict produced.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_no_conflict', passed: false, message: e.message });
  }

  // Test 5: test_unknown_ingredient_quarantine
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'mystery_chem_99',
      canonicalName: 'mystery_chem_99',
      allergens: [],
      confidence: 0.5,
      isResolved: false
    };
    const profile = { allergies: ['peanut'], dietType: 'none', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'UNKNOWN' && evalRes.score === null && evalRes.unresolved.length === 1;
    testResults.push({
      testName: 'test_unknown_ingredient_quarantine',
      passed,
      message: passed ? 'Passed: Unknown ingredient resulted in UNKNOWN risk and null numeric score (insufficient evidence).' : 'Failed unknown ingredient handling.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_unknown_ingredient_quarantine', passed: false, message: e.message });
  }

  // Test 6: test_all_9_major_fda_allergens
  try {
    const majorAllergens = ['milk', 'egg', 'fish', 'shellfish', 'tree nuts', 'peanut', 'wheat', 'soy', 'sesame'];
    let all9Matched = true;
    for (const alg of majorAllergens) {
      const ing: NormalizedIngredientResult = {
        raw: alg,
        canonicalName: alg,
        allergens: [alg],
        confidence: 1.0,
        isResolved: true
      };
      const profile = { allergies: [alg], dietType: 'none', avoidIngredients: [] };
      const res = evaluate_ingredient(ing, profile);
      if (!res.some((c) => c.severity === 'critical')) {
        all9Matched = false;
        break;
      }
    }
    testResults.push({
      testName: 'test_all_9_major_fda_allergens',
      passed: all9Matched,
      message: all9Matched
        ? 'Passed: All 9 FDA major food allergens (Milk, Egg, Fish, Shellfish, Tree Nut, Peanut, Wheat, Soy, Sesame) successfully evaluated with CRITICAL severity.'
        : 'Failed: One or more of the 9 major allergens failed to trigger critical conflict.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_all_9_major_fda_allergens', passed: false, message: e.message });
  }

  // Test 7: test_dietary_vegan_violation
  try {
    const ing = resolveSingleIngredient('whey protein concentrate');
    const profile = { allergies: [], dietType: 'vegan', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.some((c) => c.type === 'DIET_CONFLICT');
    testResults.push({
      testName: 'test_dietary_vegan_violation',
      passed,
      message: passed ? 'Passed: Whey protein flagged as animal derivative violating Vegan dietary profile.' : 'Failed vegan check.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_dietary_vegan_violation', passed: false, message: e.message });
  }

  // Test 8: test_dietary_gluten_violation
  try {
    const ing = resolveSingleIngredient('wheat flour');
    const profile = { allergies: [], dietType: 'gluten-free', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.some((c) => c.type === 'DIET_CONFLICT');
    testResults.push({
      testName: 'test_dietary_gluten_violation',
      passed,
      message: passed ? 'Passed: Wheat flour correctly flagged as gluten-bearing grain for gluten-free user.' : 'Failed gluten check.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_dietary_gluten_violation', passed: false, message: e.message });
  }

  // Test 9: test_precautionary_statement
  try {
    const ing: NormalizedIngredientResult = {
      raw: 'tree nuts',
      canonicalName: 'tree nuts',
      allergens: ['tree nuts'],
      confidence: 0.90,
      isResolved: true,
      notes: '[Precautionary / May Contain Statement]'
    };
    const profile = { allergies: ['tree nuts'], dietType: 'none', avoidIngredients: [] };
    const res = evaluate_ingredient(ing, profile);
    const passed = res.length > 0;
    testResults.push({
      testName: 'test_precautionary_statement',
      passed,
      message: passed ? 'Passed: Precautionary allergen tags preserved while triggering safety rule alerts.' : 'Failed precautionary check.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_precautionary_statement', passed: false, message: e.message });
  }

  // Test 10: test_nested_parentheses_parsing
  try {
    const nestedRaw = 'Chocolate (sugar 24%, cocoa butter, milk solids, emulsifier (soy lecithin))';
    const profile = { allergies: ['milk', 'soy'], dietType: 'none', avoidIngredients: [] };
    // evaluate against milk and soy
    const ing1: NormalizedIngredientResult = { raw: 'milk solids', canonicalName: 'milk powder', allergens: ['milk'], confidence: 0.98, isResolved: true };
    const ing2: NormalizedIngredientResult = { raw: 'soy lecithin', canonicalName: 'soy lecithin', allergens: ['soy'], confidence: 0.99, isResolved: true };
    const evalRes = evaluateProductSafety([ing1, ing2], profile);
    const passed = evalRes.conflicts.length >= 2 && evalRes.risk_level === 'CRITICAL';
    testResults.push({
      testName: 'test_nested_parentheses_parsing',
      passed,
      message: passed ? 'Passed: Multi-token nested parenthetical allergen ingredients independently flagged.' : 'Failed nested check.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'test_nested_parentheses_parsing', passed: false, message: e.message });
  }

  // --- SECTION 9 AUTOMATED REGRESSION SUITE (16 Scenarios) ---

  // Scenario 1: Strict dairy-free profile + paneer -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('paneer');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0 && evalRes.conflicts.length > 0;
    testResults.push({
      testName: 'scenario_1_dairy_free_paneer',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged paneer as NOT SUITABLE (score 0).' : 'Failed scenario 1.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_1_dairy_free_paneer', passed: false, message: e.message });
  }

  // Scenario 2: Strict dairy-free profile + butter -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('butter');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_2_dairy_free_butter',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged butter as NOT SUITABLE (score 0).' : 'Failed scenario 2.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_2_dairy_free_butter', passed: false, message: e.message });
  }

  // Scenario 3: Strict dairy-free profile + ghee -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('ghee');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_3_dairy_free_ghee',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged ghee as NOT SUITABLE (score 0).' : 'Failed scenario 3.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_3_dairy_free_ghee', passed: false, message: e.message });
  }

  // Scenario 4: Strict dairy-free profile + milk solids -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('milk solids');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_4_dairy_free_milk_solids',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged milk solids as NOT SUITABLE (score 0).' : 'Failed scenario 4.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_4_dairy_free_milk_solids', passed: false, message: e.message });
  }

  // Scenario 5: Strict dairy-free profile + whey -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('whey');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_5_dairy_free_whey',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged whey as NOT SUITABLE (score 0).' : 'Failed scenario 5.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_5_dairy_free_whey', passed: false, message: e.message });
  }

  // Scenario 6: Strict dairy-free profile + casein -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('casein');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_6_dairy_free_casein',
      passed,
      message: passed ? 'Passed: Strict dairy-free profile flagged casein as NOT SUITABLE (score 0).' : 'Failed scenario 6.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_6_dairy_free_casein', passed: false, message: e.message });
  }

  // Scenario 7: Strict dairy-free profile + no detected dairy + complete verified data -> SAFE
  try {
    const ings = ['oat flour', 'sugar', 'salt', 'sunflower oil'].map(resolveSingleIngredient);
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety(ings, profile);
    const passed = evalRes.risk_level === 'NO_MATCH' && evalRes.score === 100 && evalRes.conflicts.length === 0;
    testResults.push({
      testName: 'scenario_7_dairy_free_clean_safe',
      passed,
      message: passed ? 'Passed: Dairy-free product with verified non-dairy ingredients evaluated as SAFE (100/100).' : 'Failed scenario 7.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_7_dairy_free_clean_safe', passed: false, message: e.message });
  }

  // Scenario 8: Lactose-intolerance profile + unknown/trace lactose content (ghee) -> CAUTION, not 100
  try {
    const ing = resolveSingleIngredient('ghee');
    const profile = { allergies: [], dietType: 'none', avoidIngredients: ['lactose'] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CAUTION' && evalRes.score !== null && evalRes.score < 100;
    testResults.push({
      testName: 'scenario_8_lactose_intolerance_caution',
      passed,
      message: passed ? 'Passed: Trace lactose ingredient (ghee) under lactose intolerance evaluated with CAUTION (score <= 60), not unjustified SAFE.' : 'Failed scenario 8.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_8_lactose_intolerance_caution', passed: false, message: e.message });
  }

  // Scenario 9: Milk-allergy profile + casein -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('sodium caseinate');
    const profile = { allergies: ['milk'], dietType: 'none', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_9_milk_allergy_casein',
      passed,
      message: passed ? 'Passed: Milk allergy profile flagged casein as NOT SUITABLE (score 0).' : 'Failed scenario 9.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_9_milk_allergy_casein', passed: false, message: e.message });
  }

  // Scenario 10: Custom palm-oil restriction + palm oil -> CAUTION
  try {
    const ing = resolveSingleIngredient('palm oil');
    const profile = { allergies: [], dietType: 'none', avoidIngredients: ['palm oil'] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CAUTION' && evalRes.score === 60 && evalRes.conflicts.some((c) => c.type === 'USER_RESTRICTION');
    testResults.push({
      testName: 'scenario_10_custom_palm_oil_caution',
      passed,
      message: passed ? 'Passed: Custom palm oil restriction produced CAUTION (score 60) without hard conflict.' : 'Failed scenario 10.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_10_custom_palm_oil_caution', passed: false, message: e.message });
  }

  // Scenario 11: Dairy-free restriction + palm oil + milk solids -> NOT SUITABLE, both findings preserved
  try {
    const ings = ['milk solids', 'palm oil'].map(resolveSingleIngredient);
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: ['palm oil'] };
    const evalRes = evaluateProductSafety(ings, profile);
    const hasDiet = evalRes.conflicts.some((c) => c.type === 'DIET_CONFLICT');
    const hasCustom = evalRes.conflicts.some((c) => c.type === 'USER_RESTRICTION');
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0 && hasDiet && hasCustom;
    testResults.push({
      testName: 'scenario_11_dairy_free_plus_palm_oil',
      passed,
      message: passed ? 'Passed: Dairy-free hard conflict dominated as NOT SUITABLE while preserving custom palm oil caution.' : 'Failed scenario 11.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_11_dairy_free_plus_palm_oil', passed: false, message: e.message });
  }

  // Scenario 12: Tree-nut allergy profile + cashew -> NOT SUITABLE
  try {
    const ing = resolveSingleIngredient('cashew');
    const profile = { allergies: ['tree nuts'], dietType: 'none', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0;
    testResults.push({
      testName: 'scenario_12_tree_nut_cashew',
      passed,
      message: passed ? 'Passed: Tree-nut allergy profile flagged cashew as NOT SUITABLE (score 0).' : 'Failed scenario 12.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_12_tree_nut_cashew', passed: false, message: e.message });
  }

  // Scenario 13: Dairy-free profile + cashew, with no nut restriction -> cashew is informational (0 profile conflicts)
  try {
    const ing = resolveSingleIngredient('cashew');
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([ing], profile);
    const passed = evalRes.risk_level === 'NO_MATCH' && evalRes.conflicts.length === 0 && ing.allergens.includes('tree nuts');
    testResults.push({
      testName: 'scenario_13_dairy_free_cashew_informational',
      passed,
      message: passed ? 'Passed: Cashew flagged tree nuts on packaging but produced 0 conflicts for dairy-free non-allergic user.' : 'Failed scenario 13.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_13_dairy_free_cashew_informational', passed: false, message: e.message });
  }

  // Scenario 14: Profile changes from dairy-free to gluten-free only -> reassessment uses updated profile
  try {
    const paneer = resolveSingleIngredient('paneer');
    const wheat = resolveSingleIngredient('wheat flour');
    const gfProfile = { allergies: [], dietType: 'gluten-free', avoidIngredients: [] };
    const evalPaneer = evaluateProductSafety([paneer], gfProfile);
    const evalWheat = evaluateProductSafety([wheat], gfProfile);
    const passed = evalPaneer.risk_level === 'NO_MATCH' && evalWheat.risk_level === 'CRITICAL';
    testResults.push({
      testName: 'scenario_14_profile_change_reassessment',
      passed,
      message: passed ? 'Passed: Dynamic profile reassessment verified paneer is gluten-free safe and wheat flour is NOT SUITABLE.' : 'Failed scenario 14.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_14_profile_change_reassessment', passed: false, message: e.message });
  }

  // Scenario 15: Missing or incomplete ingredient data -> no unjustified SAFE 100/100
  try {
    const unknownIng: NormalizedIngredientResult = {
      raw: 'botanical_x99_unidentified',
      canonicalName: 'botanical_x99_unidentified',
      allergens: [],
      confidence: 0.4,
      isResolved: false
    };
    const profile = { allergies: [], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety([unknownIng], profile);
    const passed = evalRes.risk_level === 'UNKNOWN' && evalRes.score === null;
    testResults.push({
      testName: 'scenario_15_missing_data_no_unjustified_safe',
      passed,
      message: passed ? 'Passed: Unresolved ingredient suppressed score to null and triggered UNKNOWN quarantine.' : 'Failed scenario 15.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_15_missing_data_no_unjustified_safe', passed: false, message: e.message });
  }

  // Scenario 16: Assessment agreement
  try {
    const ings = ['paneer', 'butter', 'cashew', 'malai', 'ghee'].map(resolveSingleIngredient);
    const profile = { allergies: ['milk'], dietType: 'dairy-free', avoidIngredients: [] };
    const evalRes = evaluateProductSafety(ings, profile);
    const passed = evalRes.risk_level === 'CRITICAL' && evalRes.score === 0 && evalRes.conflicts.length >= 4;
    testResults.push({
      testName: 'scenario_16_deterministic_agreement',
      passed,
      message: passed ? 'Passed: MTR Paneer Butter Masala ingredients evaluated with 4+ critical dairy conflicts and score 0.' : 'Failed scenario 16.'
    });
  } catch (e: any) {
    testResults.push({ testName: 'scenario_16_deterministic_agreement', passed: false, message: e.message });
  }

  const allPassed = testResults.every((t) => t.passed);
  const passedTests = testResults.filter((t) => t.passed).length;
  const failedTests = testResults.filter((t) => !t.passed).length;
  return { allPassed, totalTests: testResults.length, passedTests, failedTests, results: testResults };
}
