import { buildSeededDatabase } from '../data/seedIngredients';
import { NormalizedIngredientResult } from '../types';

const { ingredients, aliases } = buildSeededDatabase();

// Pre-built index for fast lookup
const aliasLookupMap = new Map<string, { ingredientId: string; canonicalName: string }>();
aliases.forEach((a) => {
  aliasLookupMap.set(a.alias.toLowerCase().trim(), {
    ingredientId: a.ingredientId,
    canonicalName: a.canonicalName
  });
});

const ingredientMap = new Map<string, (typeof ingredients)[0]>();
ingredients.forEach((ing) => {
  ingredientMap.set(ing.id, ing);
  ingredientMap.set(ing.canonicalName.toLowerCase().trim(), ing);
});

/**
 * Tokenizes raw ingredient strings handling nested parentheses, brackets, commas, semicolons, bullets, and percentage declarations.
 * Example: "Chocolate (sugar 24%, cocoa mass, emulsifier (soy lecithin E322)), wheat flour, salt. May contain: tree nuts."
 */
export function splitIngredientList(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  // Remove leading prefixes and trailing periods
  let cleaned = rawText
    .replace(/^ingredients\s*:\s*/i, '')
    .replace(/\.$/, '')
    .trim();

  // Extract separate "Contains:" or "May contain:" clauses if present
  const tokens: string[] = [];
  let currentToken = '';
  let depth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (char === '(' || char === '[' || char === '{') {
      depth++;
      currentToken += char;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
      currentToken += char;
    } else if ((char === ',' || char === ';' || char === '•' || char === '\n') && depth === 0) {
      if (currentToken.trim()) {
        tokens.push(currentToken.trim());
      }
      currentToken = '';
    } else {
      currentToken += char;
    }
  }

  if (currentToken.trim()) {
    tokens.push(currentToken.trim());
  }

  return tokens;
}

/**
 * Strips percentages, e.g. "2.5%", "24%", asterisks, and noise
 */
export function cleanIngredientString(text: string): string {
  return text
    .replace(/\b\d+(\.\d+)?%\b/g, '') // remove 24%, 2.5%
    .replace(/\b(organic|natural|artificial|pure|enriched|bleached|unbleached|powdered|dried|fresh|ground|roasted|pasteurized|cold-pressed|fractionated)\b/gi, '')
    .replace(/\b(less than \d+%|contains 2% or less of)\b/gi, '')
    .replace(/[*†‡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Recursively extracts and normalizes ingredient tokens including nested parentheticals
 */
export function normalizeIngredients(rawList: string[] | string): NormalizedIngredientResult[] {
  const inputList = Array.isArray(rawList) ? rawList : splitIngredientList(rawList);
  const results: NormalizedIngredientResult[] = [];
  const processedTokens = new Set<string>();

  for (const rawToken of inputList) {
    const trimmed = rawToken.trim();
    if (!trimmed) continue;

    // Check for precautionary statement: e.g. "may contain tree nuts, milk"
    const isPrecautionary = /may contain/i.test(trimmed);
    const cleanToken = trimmed.replace(/^may contain\s*:\s*/i, '').replace(/^contains\s*:\s*/i, '');

    // Check if token has nested parentheticals: e.g. "Chocolate (sugar, cocoa butter, milk solids, emulsifier (soy lecithin))"
    const parentheticalMatch = cleanToken.match(/^([^(]+)\s*\((.+)\)$/);
    if (parentheticalMatch) {
      const outerPart = parentheticalMatch[1].trim();
      const innerPart = parentheticalMatch[2].trim();

      // Normalize parent element
      const outerNormalized = resolveSingleIngredient(outerPart);
      if (outerNormalized && !processedTokens.has(outerNormalized.canonicalName.toLowerCase())) {
        if (isPrecautionary) {
          outerNormalized.notes = (outerNormalized.notes ? outerNormalized.notes + ' ' : '') + '[Precautionary / May Contain Statement]';
        }
        results.push(outerNormalized);
        processedTokens.add(outerNormalized.canonicalName.toLowerCase());
      }

      // Split inner items (recursively normalizing nested parentheses if any)
      const innerTokens = splitIngredientList(innerPart);
      for (const innerTok of innerTokens) {
        const nestedChildren = normalizeIngredients([innerTok]);
        for (const child of nestedChildren) {
          if (!processedTokens.has(child.canonicalName.toLowerCase())) {
            if (isPrecautionary) {
              child.notes = (child.notes ? child.notes + ' ' : '') + '[Precautionary / May Contain Statement]';
            }
            results.push(child);
            processedTokens.add(child.canonicalName.toLowerCase());
          }
        }
      }
      continue;
    }

    // Direct single resolution
    const normalized = resolveSingleIngredient(cleanToken);
    if (normalized && !processedTokens.has(normalized.canonicalName.toLowerCase())) {
      if (isPrecautionary) {
        normalized.notes = (normalized.notes ? normalized.notes + ' ' : '') + '[Precautionary / May Contain Statement]';
      }
      results.push(normalized);
      processedTokens.add(normalized.canonicalName.toLowerCase());
    }
  }

  return results;
}

/**
 * Resolves a single ingredient candidate against the alias database
 */
export function resolveSingleIngredient(raw: string): NormalizedIngredientResult {
  const normalizedRaw = raw.toLowerCase().trim();
  const cleaned = cleanIngredientString(normalizedRaw);

  // 1. Direct exact alias match
  if (aliasLookupMap.has(normalizedRaw)) {
    const match = aliasLookupMap.get(normalizedRaw)!;
    const ing = ingredientMap.get(match.ingredientId);
    return {
      raw,
      canonicalName: match.canonicalName,
      ingredientId: match.ingredientId,
      matchedAlias: normalizedRaw,
      category: ing?.category || 'additive',
      allergens: ing?.allergens || [],
      dietaryConflicts: ing?.dietaryConflicts,
      confidence: 0.99,
      isResolved: true,
      notes: ing?.description
    };
  }

  // 2. Cleaned exact match
  if (cleaned && aliasLookupMap.has(cleaned)) {
    const match = aliasLookupMap.get(cleaned)!;
    const ing = ingredientMap.get(match.ingredientId);
    return {
      raw,
      canonicalName: match.canonicalName,
      ingredientId: match.ingredientId,
      matchedAlias: cleaned,
      category: ing?.category || 'additive',
      allergens: ing?.allergens || [],
      dietaryConflicts: ing?.dietaryConflicts,
      confidence: 0.95,
      isResolved: true,
      notes: ing?.description
    };
  }

  // 3. Substring / Regex alias matching (e.g. "peanut butter crunch" -> peanut butter -> peanut)
  for (const [alias, data] of aliasLookupMap.entries()) {
    if (alias.length >= 4 && (normalizedRaw.includes(alias) || cleaned.includes(alias))) {
      const ing = ingredientMap.get(data.ingredientId);
      return {
        raw,
        canonicalName: data.canonicalName,
        ingredientId: data.ingredientId,
        matchedAlias: alias,
        category: ing?.category || 'additive',
        allergens: ing?.allergens || [],
        dietaryConflicts: ing?.dietaryConflicts,
        confidence: 0.90,
        isResolved: true,
        notes: ing?.description
      };
    }
  }

  // 4. E-number direct match (e.g. E322, E120, E171)
  const eNumberMatch = normalizedRaw.match(/\b(e\s*\d{3,4}[a-z]?)\b/i);
  if (eNumberMatch) {
    const formattedENumber = eNumberMatch[1].replace(/\s+/g, '').toUpperCase();
    for (const ing of ingredients) {
      if (ing.eNumber && ing.eNumber.toUpperCase() === formattedENumber) {
        return {
          raw,
          canonicalName: ing.canonicalName,
          ingredientId: ing.id,
          matchedAlias: formattedENumber,
          category: ing.category,
          allergens: ing.allergens,
          dietaryConflicts: ing.dietaryConflicts,
          confidence: 0.98,
          isResolved: true,
          notes: ing.description
        };
      }
    }
  }

  // 5. Unresolved / Unknown ingredient
  return {
    raw,
    canonicalName: raw.trim(),
    allergens: [],
    confidence: 0.50,
    isResolved: false,
    notes: 'Unresolved ingredient - not found in curated safety knowledge base.'
  };
}
