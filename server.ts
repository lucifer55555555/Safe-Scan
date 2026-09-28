import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './src/services/database';
import { normalizeIngredients } from './src/services/normalizer';
import { evaluateProductSafety, runUnitTests } from './src/services/rulesEngine';
import { retrieveEvidence } from './src/services/ragService';
import { generateGroundedExplanation } from './src/services/geminiService';
import { lookupProductByBarcode } from './src/services/openFoodFacts';
import { runEvaluationBenchmark } from './src/services/evaluator';
import { AssessmentResponse, ScanRecord } from './src/types';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Router - Base Path: /api/v1
  const apiRouter = express.Router();

  // Health check
  apiRouter.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SafeScan AI Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Auth: Register & Login (JWT / Demo profile)
  apiRouter.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const userId = `usr_${Date.now()}`;
    const user = {
      id: userId,
      name,
      email,
      profile: {
        id: `prof_${Date.now()}`,
        userId,
        dietType: 'none' as const,
        allergies: [],
        avoidIngredients: []
      }
    };
    db.users.set(userId, user);
    db.profiles.set(userId, user.profile);
    res.json({ user, token: `token_${userId}` });
  });

  apiRouter.post('/auth/login', (req, res) => {
    const { email } = req.body;
    let user = Array.from(db.users.values()).find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      // Default to demo user
      user = db.getUser('usr_demo_walkthrough');
    }
    res.json({ user, token: `token_${user?.id}` });
  });

  // User Profile
  apiRouter.get('/users/profile', (req, res) => {
    const userId = (req.query.user_id as string) || 'usr_demo_walkthrough';
    const profile = db.getProfile(userId) || db.getProfile('usr_demo_walkthrough');
    res.json(profile);
  });

  apiRouter.put('/users/profile', (req, res) => {
    const userId = (req.body.user_id as string) || 'usr_demo_walkthrough';
    const updated = db.updateProfile(userId, req.body);
    res.json(updated);
  });

  // Product Lookup (Open Food Facts + Cached Database)
  apiRouter.get('/products/:barcode', async (req, res) => {
    const barcode = req.params.barcode;
    const product = await lookupProductByBarcode(barcode);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found for barcode',
        barcode,
        suggestion: 'Switch to OCR ingredient label scanner'
      });
    }
    res.json(product);
  });

  // Normalization Endpoint
  apiRouter.post('/ingredients/normalize', (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients list is required' });
    }
    const normalized = normalizeIngredients(ingredients);
    res.json({
      raw_count: Array.isArray(ingredients) ? ingredients.length : 1,
      normalized_count: normalized.length,
      normalized
    });
  });

  // Full Assessment Pipeline: /api/v1/assessment/analyze
  // Exact contract per Section 6
  apiRouter.post('/assessment/analyze', async (req, res) => {
    try {
      const {
        ingredients,
        user_id = 'usr_demo_walkthrough',
        product_id,
        barcode,
        product_name,
        brand,
        scan_method = 'manual',
        ocr_text,
        ocr_confidence = 0.97
      } = req.body;

      if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
        return res.status(400).json({ error: 'No ingredients provided for analysis' });
      }

      // 1. Fetch user profile
      const userProfile = db.getProfile(user_id) || db.getProfile('usr_demo_walkthrough')!;

      // 2. Normalize ingredients
      const normalized = normalizeIngredients(ingredients);

      // 3. Log unresolved ingredients to knowledge base queue
      for (const item of normalized) {
        if (!item.isResolved) {
          db.logUnresolved(item.raw);
        }
      }

      // 4. Deterministic safety rules engine evaluation (RULES DECIDE)
      const ruleResult = evaluateProductSafety(normalized, {
        allergies: userProfile.allergies || [],
        dietType: userProfile.dietType || 'none',
        avoidIngredients: userProfile.avoidIngredients || []
      });

      // 5. RAG Retrieval from FDA / EFSA scientific corpus
      const targetIngredientsForEvidence = ruleResult.conflicts.length > 0
        ? ruleResult.conflicts.map((c) => c.canonicalName || c.ingredient)
        : normalized.map((n) => n.canonicalName);

      const ragResult = retrieveEvidence(targetIngredientsForEvidence, 3);

      // 6. Calculate confidence scores
      const ingredientMatchingConfidence = normalized.length > 0
        ? Number((normalized.reduce((acc, curr) => acc + curr.confidence, 0) / normalized.length).toFixed(2))
        : 0.95;

      const overallConfidence = Number(
        (ocr_confidence * 0.4 + ingredientMatchingConfidence * 0.4 + (ragResult.evidenceConfidence === 'high' ? 0.98 : 0.85) * 0.2).toFixed(2)
      );

      // 7. Grounded LLM Explanation (EXPLANATION ONLY, BOUND TO RETRIEVED EVIDENCE)
      const explanation = await generateGroundedExplanation({
        productName: product_name,
        riskLevel: ruleResult.risk_level,
        conflicts: ruleResult.conflicts,
        unresolved: ruleResult.unresolved,
        evidence: ragResult.evidenceItems,
        userProfile: {
          allergies: userProfile.allergies || [],
          dietType: userProfile.dietType || 'none',
          avoidIngredients: userProfile.avoidIngredients || []
        }
      });

      const assessmentId = `assess_${Date.now()}`;
      const status = ruleResult.risk_level === 'CRITICAL'
        ? 'warning'
        : ruleResult.risk_level === 'WARNING' || ruleResult.risk_level === 'CAUTION'
        ? 'caution'
        : ruleResult.risk_level === 'UNKNOWN'
        ? 'unknown'
        : 'clear';

      const assessmentResponse: AssessmentResponse = {
        id: assessmentId,
        status,
        score: ruleResult.score,
        risk_level: ruleResult.risk_level,
        conflicts: ruleResult.conflicts,
        unresolved_ingredients: ruleResult.unresolved,
        evidence: ragResult.evidenceItems,
        confidence: {
          ocr: ocr_confidence,
          ingredient_matching: ingredientMatchingConfidence,
          evidence: ragResult.evidenceConfidence,
          overall: overallConfidence
        },
        explanation,
        normalized_ingredients: normalized,
        product: {
          id: product_id,
          name: product_name || 'Scanned Food Product',
          brand: brand,
          barcode: barcode
        },
        scanned_method: scan_method,
        created_at: new Date().toISOString()
      };

      // Save scan record into database
      const scanRecord: ScanRecord = {
        id: `scan_${Date.now()}`,
        userId: user_id,
        productId: product_id,
        productName: product_name || 'Food Product',
        brand: brand,
        scanMethod: scan_method === 'ocr' ? 'ocr' : 'barcode',
        ocrText: ocr_text,
        assessment: assessmentResponse,
        createdAt: new Date().toISOString()
      };
      db.saveScan(scanRecord);

      return res.json(assessmentResponse);
    } catch (err: any) {
      console.error('Assessment analysis error:', err);
      res.status(500).json({ error: 'Failed to complete safety assessment', details: err.message });
    }
  });

  // Fetch past assessment by scan ID
  apiRouter.get('/assessment/:id', (req, res) => {
    const scan = db.getScanById(req.params.id);
    if (!scan) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(scan.assessment);
  });

  // Scan History
  apiRouter.get('/scans/history', (req, res) => {
    const userId = (req.query.user_id as string) || 'usr_demo_walkthrough';
    const scans = db.getScansByUser(userId);
    res.json(scans);
  });

  // Ingredients Knowledge Base Search & Detail
  apiRouter.get('/ingredients', (req, res) => {
    const search = ((req.query.q as string) || '').toLowerCase().trim();
    const allIngredients = Array.from(db.ingredients.values());
    if (!search) {
      return res.json(allIngredients.slice(0, 100));
    }
    const filtered = allIngredients.filter(
      (i) =>
        i.canonicalName.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search) ||
        i.category.toLowerCase().includes(search) ||
        (i.eNumber && i.eNumber.toLowerCase().includes(search)) ||
        i.allergens.some((a) => a.toLowerCase().includes(search))
    );
    res.json(filtered);
  });

  apiRouter.get('/ingredients/:id', (req, res) => {
    const ing = db.ingredients.get(req.params.id);
    if (!ing) return res.status(404).json({ error: 'Ingredient not found' });
    res.json(ing);
  });

  // Scientific Sources
  apiRouter.get('/sources', (req, res) => {
    res.json(Array.from(db.sources.values()));
  });

  apiRouter.get('/sources/:id', (req, res) => {
    const src = db.sources.get(req.params.id);
    if (!src) return res.status(404).json({ error: 'Source not found' });
    res.json(src);
  });

  // Admin Routes (Phase 10)
  apiRouter.get('/admin/stats', (req, res) => {
    res.json(db.getAdminStats());
  });

  apiRouter.post('/admin/ingredients', (req, res) => {
    const { canonicalName, description, category, allergens, aliases, dietaryConflicts, eNumber } = req.body;
    if (!canonicalName) {
      return res.status(400).json({ error: 'canonicalName is required' });
    }
    const newIng = db.addIngredient(
      {
        canonicalName,
        description: description || '',
        category: category || 'additive',
        allergens: allergens || [],
        dietaryConflicts,
        eNumber
      },
      aliases || []
    );
    res.status(201).json(newIng);
  });

  apiRouter.post('/admin/aliases', (req, res) => {
    const { ingredientId, alias } = req.body;
    if (!ingredientId || !alias) {
      return res.status(400).json({ error: 'ingredientId and alias are required' });
    }
    const newAlias = db.addAlias(ingredientId, alias);
    if (!newAlias) return res.status(404).json({ error: 'Ingredient not found' });
    res.status(201).json(newAlias);
  });

  apiRouter.get('/admin/unresolved', (req, res) => {
    res.json(db.unresolvedLog);
  });

  // Evaluation Benchmark & 5 Unit Tests (Phase 5 & 11)
  apiRouter.get('/evaluation/unittests', (req, res) => {
    res.json(runUnitTests());
  });

  apiRouter.get('/evaluation/report', (req, res) => {
    const report = runEvaluationBenchmark();
    res.json(report);
  });

  // Mount API Router
  app.use('/api/v1', apiRouter);

  // Vite middleware for dev or Static Files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafeScan AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
