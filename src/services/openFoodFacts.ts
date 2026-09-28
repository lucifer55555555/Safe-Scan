import { db } from './database';
import { Product } from '../types';

/**
 * Looks up product data from Open Food Facts API (with local database caching & offline fallback)
 */
export async function lookupProductByBarcode(barcode: string): Promise<Product | null> {
  const cleanBarcode = barcode.trim();
  if (!cleanBarcode) return null;

  // 1. Check local database cache
  const cached = db.getProductByBarcode(cleanBarcode);
  if (cached) {
    return cached;
  }

  // 2. Fetch from Open Food Facts live API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanBarcode)}.json`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SafeScanAI-SmartLabelScanner/1.0 (https://safescan.ai; support@safescan.ai)'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const rawIngredientsText = p.ingredients_text_en || p.ingredients_text || '';
        const tags = (p.ingredients_tags || []).map((t: string) => t.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '));

        const product: Product = {
          id: `off_${cleanBarcode}`,
          barcode: cleanBarcode,
          name: p.product_name || p.product_name_en || 'Scanned Packaged Product',
          brand: p.brands || 'Commercial Brand',
          category: p.categories?.split(',')[0]?.trim() || 'Packaged Food',
          imageUrl: p.image_front_url || p.image_url || undefined,
          ingredientsText: rawIngredientsText || tags.join(', '),
          ingredientsList: tags.length > 0 ? tags : rawIngredientsText.split(',').map((s: string) => s.trim()),
          nutrition: {
            calories: p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'],
            fat: p.nutriments?.fat_100g ? `${p.nutriments.fat_100g}g` : undefined,
            saturatedFat: p.nutriments?.['saturated-fat_100g'] ? `${p.nutriments['saturated-fat_100g']}g` : undefined,
            carbs: p.nutriments?.carbohydrates_100g ? `${p.nutriments.carbohydrates_100g}g` : undefined,
            sugar: p.nutriments?.sugars_100g ? `${p.nutriments.sugars_100g}g` : undefined,
            protein: p.nutriments?.proteins_100g ? `${p.nutriments.proteins_100g}g` : undefined,
            sodium: p.nutriments?.sodium_100g ? `${Math.round(p.nutriments.sodium_100g * 1000)}mg` : undefined
          },
          labels: p.labels_tags?.map((l: string) => l.replace(/^[a-z]{2}:/, '')) || [],
          verifiedSource: 'openfoodfacts'
        };

        // Cache product in local database
        db.saveProduct(product);
        return product;
      }
    }
  } catch (error) {
    console.warn(`Open Food Facts API lookup failed for ${cleanBarcode}:`, error);
  }

  return null;
}
