import { buildSeededDatabase, FDA_ALLERGENS } from '../data/seedIngredients';
import { SCIENTIFIC_CHUNKS, SCIENTIFIC_SOURCES } from '../data/scientificCorpus';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import {
  Allergen,
  AssessmentResponse,
  Ingredient,
  IngredientAlias,
  Product,
  ScanRecord,
  ScientificChunk,
  ScientificSource,
  User,
  UserProfile
} from '../types';

class InDatabase {
  users: Map<string, User> = new Map();
  profiles: Map<string, UserProfile> = new Map();
  allergens: Map<string, Allergen> = new Map();
  ingredients: Map<string, Ingredient> = new Map();
  aliases: Map<string, IngredientAlias> = new Map();
  products: Map<string, Product> = new Map();
  productsByBarcode: Map<string, Product> = new Map();
  sources: Map<string, ScientificSource> = new Map();
  chunks: Map<string, ScientificChunk> = new Map();
  scans: ScanRecord[] = [];
  unresolvedLog: { id: string; ingredientText: string; scanId?: string; createdAt: string; count: number }[] = [];

  constructor() {
    this.seed();
    this.loadFromDisk();
  }

  seed() {
    // 1. Seed allergens
    FDA_ALLERGENS.forEach((a) => this.allergens.set(a.id, a));

    // 2. Seed ingredients & aliases
    const { ingredients, aliases } = buildSeededDatabase();
    ingredients.forEach((i) => this.ingredients.set(i.id, i));
    aliases.forEach((a) => this.aliases.set(a.id, a));

    // 3. Seed scientific sources & chunks
    SCIENTIFIC_SOURCES.forEach((s) => this.sources.set(s.id, s));
    SCIENTIFIC_CHUNKS.forEach((c) => this.chunks.set(c.id, c));

    // 4. Seed sample products
    SAMPLE_PRODUCTS.forEach((p) => {
      this.products.set(p.id, p);
      if (p.barcode) this.productsByBarcode.set(p.barcode, p);
    });

    // 5. Seed default demo user (Section 10 reference walkthrough: Peanut allergy + Vegetarian)
    const defaultUserId = 'usr_demo_walkthrough';
    const defaultProfile: UserProfile = {
      id: 'prof_demo',
      userId: defaultUserId,
      dietType: 'vegetarian',
      allergies: ['peanut'],
      avoidIngredients: ['titanium dioxide', 'palm oil'],
      preferences: {
        avoidArtificialColors: true,
        avoidPreservatives: false,
        avoidAddedSugars: false
      }
    };

    const defaultUser: User = {
      id: defaultUserId,
      name: 'Alex Rivera',
      email: 'alex@safescan.ai',
      profile: defaultProfile
    };

    this.users.set(defaultUserId, defaultUser);
    this.profiles.set(defaultUserId, defaultProfile);
  }

  private loadFromDisk() {
    try {
      if (typeof window === 'undefined' && typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const dbDir = path.join(process.cwd(), 'data');
        const dbFile = path.join(dbDir, 'safescan_db.json');

        if (fs.existsSync(dbFile)) {
          const raw = fs.readFileSync(dbFile, 'utf-8');
          const data = JSON.parse(raw);

          if (Array.isArray(data.users)) {
            data.users.forEach((u: User) => this.users.set(u.id, u));
          }
          if (Array.isArray(data.profiles)) {
            data.profiles.forEach((p: UserProfile) => this.profiles.set(p.userId, p));
          }
          if (Array.isArray(data.customIngredients)) {
            data.customIngredients.forEach((i: Ingredient) => this.ingredients.set(i.id, i));
          }
          if (Array.isArray(data.customAliases)) {
            data.customAliases.forEach((a: IngredientAlias) => this.aliases.set(a.id, a));
          }
          if (Array.isArray(data.scans)) {
            this.scans = data.scans;
          }
          if (Array.isArray(data.unresolvedLog)) {
            this.unresolvedLog = data.unresolvedLog;
          }
        }
      }
    } catch (err) {
      // Graceful fallback if in browser environment
    }
  }

  private saveToDisk() {
    try {
      if (typeof window === 'undefined' && typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const dbDir = path.join(process.cwd(), 'data');
        const dbFile = path.join(dbDir, 'safescan_db.json');

        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        const data = {
          users: Array.from(this.users.values()),
          profiles: Array.from(this.profiles.values()),
          customIngredients: Array.from(this.ingredients.values()).filter((i) => i.id.startsWith('ing_')),
          customAliases: Array.from(this.aliases.values()).filter((a) => a.id.startsWith('alias_')),
          scans: this.scans,
          unresolvedLog: this.unresolvedLog
        };
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (err) {
      // Graceful fallback if in browser environment
    }
  }

  // User & Profile
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const existing = this.profiles.get(userId) || {
      id: `prof_${Date.now()}`,
      userId,
      dietType: 'none',
      allergies: [],
      avoidIngredients: []
    };

    const updated: UserProfile = { ...existing, ...updates };
    this.profiles.set(userId, updated);

    const user = this.users.get(userId);
    if (user) {
      user.profile = updated;
      this.users.set(userId, user);
    }
    this.saveToDisk();
    return updated;
  }

  // Products
  getProductByBarcode(barcode: string): Product | undefined {
    return this.productsByBarcode.get(barcode);
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  saveProduct(product: Product): Product {
    this.products.set(product.id, product);
    if (product.barcode) {
      this.productsByBarcode.set(product.barcode, product);
    }
    this.saveToDisk();
    return product;
  }

  // Scans & Assessments
  saveScan(scan: ScanRecord): ScanRecord {
    this.scans.unshift(scan);
    this.saveToDisk();
    return scan;
  }

  getScansByUser(userId: string): ScanRecord[] {
    return this.scans.filter((s) => s.userId === userId);
  }

  getScanById(scanId: string): ScanRecord | undefined {
    return this.scans.find((s) => s.id === scanId);
  }

  // Admin Knowledge Base CRUD
  addIngredient(ing: Omit<Ingredient, 'id'>, initialAliases: string[] = []): Ingredient {
    const id = `ing_${Date.now()}_${ing.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const newIngredient: Ingredient = { ...ing, id };
    this.ingredients.set(id, newIngredient);

    // Add self alias
    const selfAliasId = `alias_${Date.now()}_self`;
    this.aliases.set(selfAliasId, {
      id: selfAliasId,
      ingredientId: id,
      alias: ing.canonicalName.toLowerCase().trim(),
      canonicalName: ing.canonicalName
    });

    initialAliases.forEach((aliasStr, idx) => {
      const aId = `alias_${Date.now()}_${idx}`;
      this.aliases.set(aId, {
        id: aId,
        ingredientId: id,
        alias: aliasStr.toLowerCase().trim(),
        canonicalName: ing.canonicalName
      });
    });

    this.saveToDisk();
    return newIngredient;
  }

  addAlias(ingredientId: string, alias: string): IngredientAlias | null {
    const ing = this.ingredients.get(ingredientId);
    if (!ing) return null;

    const id = `alias_${Date.now()}`;
    const newAlias: IngredientAlias = {
      id,
      ingredientId,
      alias: alias.toLowerCase().trim(),
      canonicalName: ing.canonicalName
    };
    this.aliases.set(id, newAlias);
    this.saveToDisk();
    return newAlias;
  }

  logUnresolved(ingredientText: string, scanId?: string) {
    const clean = ingredientText.trim().toLowerCase();
    const existing = this.unresolvedLog.find((u) => u.ingredientText === clean);
    if (existing) {
      existing.count += 1;
    } else {
      this.unresolvedLog.unshift({
        id: `unres_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ingredientText: clean,
        scanId,
        createdAt: new Date().toISOString(),
        count: 1
      });
    }
    this.saveToDisk();
  }

  getAdminStats() {
    return {
      totalUsers: this.users.size,
      totalScans: this.scans.length,
      totalIngredients: this.ingredients.size,
      totalAliases: this.aliases.size,
      totalSources: this.sources.size,
      totalChunks: this.chunks.size,
      totalAllergens: `${this.allergens.size} Major`,
      totalProducts: this.products.size,
      totalScientificChunks: this.chunks.size,
      unresolvedCount: this.unresolvedLog.length,
      mostDetectedAllergens: [
        { name: 'Peanut', count: 18 },
        { name: 'Milk', count: 14 },
        { name: 'Wheat / Gluten', count: 11 },
        { name: 'Soy', count: 9 },
        { name: 'Tree Nuts', count: 7 },
        { name: 'Sesame', count: 5 }
      ]
    };
  }
}

export const db = new InDatabase();

