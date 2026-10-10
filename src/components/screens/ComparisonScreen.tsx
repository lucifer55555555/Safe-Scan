import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Zap,
  Swords,
  Trophy,
  Flame,
  ShieldCheck,
  ChevronRight,
  Check,
  X,
  Droplet,
  Heart,
  Leaf
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { analyzeAssessment } from '../../services/apiClient';
import { AssessmentResponse, Product, UserProfile } from '../../types';

interface ComparisonScreenProps {
  profile: UserProfile | null;
  initialPair?: { prodAId?: string; prodBId?: string } | null;
  onSelectAssessment: (assessment: AssessmentResponse) => void;
  setActiveTab: (tab: string) => void;
}

export const ComparisonScreen: React.FC<ComparisonScreenProps> = ({
  profile,
  initialPair,
  onSelectAssessment,
  setActiveTab
}) => {
  // Find indices for popular defaults: MAGGI vs YiPPee if available
  const defaultAIdx = Math.max(0, SAMPLE_PRODUCTS.findIndex((p) => p.id === 'prod_ind_maggi_masala_noodles'));
  const defaultBIdx = Math.max(0, SAMPLE_PRODUCTS.findIndex((p) => p.id === 'prod_ind_yippee_magic_masala'));

  const [productAIndex, setProductAIndex] = useState<number>(defaultAIdx !== -1 ? defaultAIdx : 0);
  const [productBIndex, setProductBIndex] = useState<number>(defaultBIdx !== -1 ? defaultBIdx : 1);

  const [assessmentA, setAssessmentA] = useState<AssessmentResponse | null>(null);
  const [assessmentB, setAssessmentB] = useState<AssessmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasCompared, setHasCompared] = useState<boolean>(false);

  // Handle incoming initialPair from ScanScreen
  useEffect(() => {
    if (initialPair?.prodAId && initialPair?.prodBId) {
      const idxA = SAMPLE_PRODUCTS.findIndex((p) => p.id === initialPair.prodAId);
      const idxB = SAMPLE_PRODUCTS.findIndex((p) => p.id === initialPair.prodBId);
      if (idxA !== -1 && idxB !== -1) {
        setProductAIndex(idxA);
        setProductBIndex(idxB);
        executeComparison(idxA, idxB);
      }
    }
  }, [initialPair]);

  // Popular Brand Battle Presets
  const battlePresets = [
    {
      id: 'noodles',
      title: '🍜 Instant Noodles Battle',
      brandA: 'MAGGI 2-Minute',
      brandB: 'Sunfeast YiPPee!',
      prodAId: 'prod_ind_maggi_masala_noodles',
      prodBId: 'prod_ind_yippee_magic_masala',
      highlight: 'Palm Oil vs Palm Oil & Groundnut Allergen'
    },
    {
      id: 'biscuits',
      title: '🍪 Tea-Time Biscuits Battle',
      brandA: 'Parle-G Glucose',
      brandB: 'Britannia Marie Gold',
      prodAId: 'prod_ind_parle_g_biscuit',
      prodBId: 'prod_ind_britannia_marie_gold',
      highlight: 'Invert Sugar vs Wheat Fibre & Zero Transfat'
    },
    {
      id: 'namkeen',
      title: '🥨 Aloo Bhujia Rivalry',
      brandA: "Haldiram's Bhujia",
      brandB: 'Bikaji Bhujia',
      prodAId: 'prod_ind_haldirams_aloo_bhujia',
      prodBId: 'prod_ind_bikaji_aloo_bhujia',
      highlight: 'Cottonseed Oil vs Groundnut Oil & Spices'
    },
    {
      id: 'ghee',
      title: '🧈 Pure Cow Ghee Battle',
      brandA: 'Amul Cow Ghee',
      brandB: 'Patanjali Desi Ghee',
      prodAId: 'prod_ind_amul_cow_ghee',
      prodBId: 'prod_ind_patanjali_desi_ghee',
      highlight: '100% Pure Milk Fat · Zero Additives'
    },
    {
      id: 'juice',
      title: '🧃 Fruit Juice Battle',
      brandA: 'Real Mixed Fruit',
      brandB: 'Tropicana 100%',
      prodAId: 'prod_ind_real_mixed_fruit_juice',
      prodBId: 'prod_ind_tropicana_mixed_fruit',
      highlight: 'Added Sugar & Preservatives vs No Added Sugar'
    },
    {
      id: 'bread',
      title: '🍞 Whole Wheat Bread Battle',
      brandA: 'Britannia 100% Wheat',
      brandB: 'Modern 100% Wheat',
      prodAId: 'prod_ind_britannia_whole_wheat_bread',
      prodBId: 'prod_ind_modern_whole_wheat_bread',
      highlight: 'Atta Percentage & Preservative E282'
    }
  ];

  const handleSelectPreset = (preset: typeof battlePresets[0]) => {
    const idxA = SAMPLE_PRODUCTS.findIndex((p) => p.id === preset.prodAId);
    const idxB = SAMPLE_PRODUCTS.findIndex((p) => p.id === preset.prodBId);
    if (idxA !== -1 && idxB !== -1) {
      setProductAIndex(idxA);
      setProductBIndex(idxB);
      executeComparison(idxA, idxB);
    }
  };

  const executeComparison = async (idxA: number, idxB: number) => {
    setIsLoading(true);
    try {
      const prodA = SAMPLE_PRODUCTS[idxA];
      const prodB = SAMPLE_PRODUCTS[idxB];

      const [resA, resB] = await Promise.all([
        analyzeAssessment({
          ingredients: prodA.ingredientsList,
          user_id: profile?.userId || 'usr_demo_walkthrough',
          product_id: prodA.id,
          product_name: prodA.name,
          brand: prodA.brand,
          barcode: prodA.barcode,
          scan_method: 'barcode'
        }),
        analyzeAssessment({
          ingredients: prodB.ingredientsList,
          user_id: profile?.userId || 'usr_demo_walkthrough',
          product_id: prodB.id,
          product_name: prodB.name,
          brand: prodB.brand,
          barcode: prodB.barcode,
          scan_method: 'barcode'
        })
      ]);

      setAssessmentA(resA);
      setAssessmentB(resB);
      setHasCompared(true);
    } catch (e) {
      console.error('Error running comparison:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = () => {
    executeComparison(productAIndex, productBIndex);
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'CRITICAL') return 'text-rose-400 bg-rose-500/10 border-rose-500/40';
    if (risk === 'WARNING' || risk === 'CAUTION') return 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    if (risk === 'UNKNOWN') return 'text-amber-300 bg-amber-500/10 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40';
  };

  // Determine recommendation strictly respecting hard allergen & dietary safety constraints
  const getRecommendation = () => {
    if (!assessmentA || !assessmentB) return null;

    const riskRank: Record<string, number> = {
      NO_MATCH: 5,
      SAFE: 5,
      CAUTION: 3,
      UNKNOWN: 2,
      WARNING: 1,
      CRITICAL: 0
    };

    const rankA = riskRank[assessmentA.risk_level] ?? 2;
    const rankB = riskRank[assessmentB.risk_level] ?? 2;

    const criticalConflictsA = assessmentA.conflicts.filter((c) => c.severity === 'critical');
    const criticalConflictsB = assessmentB.conflicts.filter((c) => c.severity === 'critical');

    // 1. Hard allergen conflict check
    if (criticalConflictsA.length > 0 && criticalConflictsB.length === 0) {
      return {
        winner: assessmentB.product.name,
        winnerLetter: 'B',
        badge: `${assessmentB.product.brand} is Safer for You`,
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains ${criticalConflictsA.map((c) => c.ingredient).join(', ')}, which directly conflicts with your allergen profile.`
      };
    }
    if (criticalConflictsB.length > 0 && criticalConflictsA.length === 0) {
      return {
        winner: assessmentA.product.name,
        winnerLetter: 'A',
        badge: `${assessmentA.product.brand} is Safer for You`,
        reason: `${assessmentA.product.name} is recommended because ${assessmentB.product.name} contains ${criticalConflictsB.map((c) => c.ingredient).join(', ')}, which directly conflicts with your allergen profile.`
      };
    }

    // 2. Dietary violation check
    const dietConflictsA = assessmentA.conflicts.filter((c) => c.severity === 'warning');
    const dietConflictsB = assessmentB.conflicts.filter((c) => c.severity === 'warning');

    if (dietConflictsA.length > 0 && dietConflictsB.length === 0) {
      return {
        winner: assessmentB.product.name,
        winnerLetter: 'B',
        badge: `${assessmentB.product.brand} Fits Your Diet`,
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains ingredients (${dietConflictsA.map((c) => c.ingredient).join(', ')}) violating your dietary preference.`
      };
    }
    if (dietConflictsB.length > 0 && dietConflictsA.length === 0) {
      return {
        winner: assessmentA.product.name,
        winnerLetter: 'A',
        badge: `${assessmentA.product.brand} Fits Your Diet`,
        reason: `${assessmentA.product.name} is recommended because ${assessmentB.product.name} contains ingredients (${dietConflictsB.map((c) => c.ingredient).join(', ')}) violating your dietary preference.`
      };
    }

    // 3. Unresolved / Unknown quarantine check
    if (assessmentA.unresolved_ingredients.length > 0 && assessmentB.unresolved_ingredients.length === 0 && rankB > rankA) {
      return {
        winner: assessmentB.product.name,
        winnerLetter: 'B',
        badge: `${assessmentB.product.brand} is Verified Safe`,
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains unverified ingredients (${assessmentA.unresolved_ingredients.join(', ')}).`
      };
    }

    // 4. Secondary Score Comparison if risk levels match
    const scoreA = assessmentA.score ?? -1;
    const scoreB = assessmentB.score ?? -1;

    if (scoreA > scoreB) {
      return {
        winner: assessmentA.product.name,
        winnerLetter: 'A',
        badge: `${assessmentA.product.brand} has Higher Safety Score`,
        reason: `${assessmentA.product.name} scored ${scoreA}/100 vs ${scoreB}/100 for ${assessmentB.product.name} under your active profile.`
      };
    } else if (scoreB > scoreA) {
      return {
        winner: assessmentB.product.name,
        winnerLetter: 'B',
        badge: `${assessmentB.product.brand} has Higher Safety Score`,
        reason: `${assessmentB.product.name} scored ${scoreB}/100 vs ${scoreA}/100 for ${assessmentA.product.name} under your active profile.`
      };
    } else {
      return {
        winner: 'Equal Safety Compatibility',
        winnerLetter: 'EQUAL',
        badge: 'Equally Compatible',
        reason: `Both products have equivalent risk levels and suitability scores (${scoreA !== -1 ? `${scoreA}/100` : 'Safe'}) under your active profile.`
      };
    }
  };

  const rec = getRecommendation();
  const prodA = SAMPLE_PRODUCTS[productAIndex];
  const prodB = SAMPLE_PRODUCTS[productBIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg">
            <Swords className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Brand-vs-Brand Safety Battle
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                Direct Rivalry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Compare competing Indian grocery brands side-by-side against your allergies & dietary rules.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={isLoading}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>{isLoading ? 'Analyzing Both Labels...' : 'Run Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* 1. POPULAR BRAND BATTLES PRESETS */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider font-display">
              Popular Indian Brand Battles (1-Click Compare)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">Click to compare instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {battlePresets.map((preset) => {
            const isSelected =
              prodA.id === preset.prodAId && prodB.id === preset.prodBId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                    : 'bg-[#0a0a0a] border-[#262626] hover:border-emerald-500/40 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {preset.title}
                  </span>
                  <Swords className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                  <span className="text-emerald-400 font-bold">{preset.brandA}</span>
                  <span className="text-neutral-500 text-[10px]">vs</span>
                  <span className="text-teal-400 font-bold">{preset.brandB}</span>
                </div>
                <p className="text-[9px] text-neutral-500 font-mono mt-1 line-clamp-1">
                  {preset.highlight}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRODUCT SELECTORS WITH VISUAL PREVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product A Selector */}
        <div className="bg-[#121212] border-2 border-emerald-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500 text-black flex items-center justify-center font-black text-[11px]">A</span>
              <span>Product A</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">{prodA.category}</span>
          </div>

          <select
            value={productAIndex}
            onChange={(e) => {
              setProductAIndex(Number(e.target.value));
              setHasCompared(false);
            }}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          >
            {SAMPLE_PRODUCTS.map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.brand} — {p.name}
              </option>
            ))}
          </select>

          {/* Visual Product A Card Preview */}
          <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#222]">
            {prodA.imageUrl && (
              <img
                src={prodA.imageUrl}
                alt={prodA.name}
                className="w-12 h-12 rounded-lg object-cover border border-[#333] shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate font-display">{prodA.name}</p>
              <p className="text-[10px] text-neutral-400 font-mono truncate">{prodA.brand} · EAN: {prodA.barcode}</p>
            </div>
          </div>
        </div>

        {/* Product B Selector */}
        <div className="bg-[#121212] border-2 border-teal-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-teal-500 text-black flex items-center justify-center font-black text-[11px]">B</span>
              <span>Product B</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">{prodB.category}</span>
          </div>

          <select
            value={productBIndex}
            onChange={(e) => {
              setProductBIndex(Number(e.target.value));
              setHasCompared(false);
            }}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
          >
            {SAMPLE_PRODUCTS.map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.brand} — {p.name}
              </option>
            ))}
          </select>

          {/* Visual Product B Card Preview */}
          <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#222]">
            {prodB.imageUrl && (
              <img
                src={prodB.imageUrl}
                alt={prodB.name}
                className="w-12 h-12 rounded-lg object-cover border border-[#333] shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate font-display">{prodB.name}</p>
              <p className="text-[10px] text-neutral-400 font-mono truncate">{prodB.brand} · EAN: {prodB.barcode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPARISON RESULTS */}
      {hasCompared && assessmentA && assessmentB && (
        <div className="space-y-6 animate-in fade-in">
          {/* Winner Recommendation Banner */}
          {rec && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-emerald-950/70 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg">
                  <Trophy className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-500 text-black shadow-md">
                      {rec.badge}
                    </span>
                    <h2 className="font-extrabold text-white text-base font-display">
                      {rec.winner}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed font-sans">
                    {rec.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Head-to-Head Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card A */}
            <div className={`bg-[#121212] border-2 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all ${
              rec?.winnerLetter === 'A' ? 'border-emerald-500/80 ring-2 ring-emerald-500/20' : 'border-[#262626]'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">A</span>
                    <span>{assessmentA.product.brand}</span>
                  </span>
                  <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md border ${getRiskColor(assessmentA.risk_level)}`}>
                    {assessmentA.risk_level}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {prodA.imageUrl && (
                    <img
                      src={prodA.imageUrl}
                      alt={assessmentA.product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#333] shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-black text-white font-display leading-tight">
                      {assessmentA.product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono">EAN: {assessmentA.product.barcode}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#222] flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Safety Score:</span>
                  <span className={`text-base font-black ${
                    assessmentA.score === null ? 'text-amber-400' : assessmentA.score >= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {assessmentA.score !== null ? `${assessmentA.score} / 100` : 'Suppressed (Quarantine)'}
                  </span>
                </div>

                {/* Conflicts */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Profile Conflicts ({assessmentA.conflicts.length})
                  </span>
                  {assessmentA.conflicts.length > 0 ? (
                    <div className="space-y-1">
                      {assessmentA.conflicts.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px]">
                          ❌ <strong>{c.canonicalName || c.ingredient}</strong>: {c.reason}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 font-mono text-xs p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      ✓ No conflicts detected with your health profile
                    </p>
                  )}
                </div>

                {/* Allergens in recipe */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Allergens In Product Formulation:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(assessmentA.normalized_ingredients.flatMap((n) => n.allergens || []))).map((alg) => (
                      <span key={alg} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1c1c1c] text-neutral-300 border border-[#333]">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectAssessment(assessmentA);
                  setActiveTab('assessment');
                }}
                className="mt-4 w-full py-2.5 bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-emerald-500/40 text-neutral-200 text-xs font-bold rounded-xl transition-all font-mono cursor-pointer"
              >
                Inspect Full Product A Assessment →
              </button>
            </div>

            {/* Card B */}
            <div className={`bg-[#121212] border-2 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all ${
              rec?.winnerLetter === 'B' ? 'border-teal-500/80 ring-2 ring-teal-500/20' : 'border-[#262626]'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-teal-500 text-black flex items-center justify-center font-bold text-[10px]">B</span>
                    <span>{assessmentB.product.brand}</span>
                  </span>
                  <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md border ${getRiskColor(assessmentB.risk_level)}`}>
                    {assessmentB.risk_level}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {prodB.imageUrl && (
                    <img
                      src={prodB.imageUrl}
                      alt={assessmentB.product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#333] shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-black text-white font-display leading-tight">
                      {assessmentB.product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono">EAN: {assessmentB.product.barcode}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#222] flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Safety Score:</span>
                  <span className={`text-base font-black ${
                    assessmentB.score === null ? 'text-amber-400' : assessmentB.score >= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {assessmentB.score !== null ? `${assessmentB.score} / 100` : 'Suppressed (Quarantine)'}
                  </span>
                </div>

                {/* Conflicts */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Profile Conflicts ({assessmentB.conflicts.length})
                  </span>
                  {assessmentB.conflicts.length > 0 ? (
                    <div className="space-y-1">
                      {assessmentB.conflicts.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px]">
                          ❌ <strong>{c.canonicalName || c.ingredient}</strong>: {c.reason}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 font-mono text-xs p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      ✓ No conflicts detected with your health profile
                    </p>
                  )}
                </div>

                {/* Allergens in recipe */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Allergens In Product Formulation:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(assessmentB.normalized_ingredients.flatMap((n) => n.allergens || []))).map((alg) => (
                      <span key={alg} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1c1c1c] text-neutral-300 border border-[#333]">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectAssessment(assessmentB);
                  setActiveTab('assessment');
                }}
                className="mt-4 w-full py-2.5 bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-teal-500/40 text-neutral-200 text-xs font-bold rounded-xl transition-all font-mono cursor-pointer"
              >
                Inspect Full Product B Assessment →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
