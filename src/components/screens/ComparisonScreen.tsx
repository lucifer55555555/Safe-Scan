import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Zap
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { analyzeAssessment } from '../../services/apiClient';
import { AssessmentResponse, Product, UserProfile } from '../../types';

interface ComparisonScreenProps {
  profile: UserProfile | null;
  onSelectAssessment: (assessment: AssessmentResponse) => void;
  setActiveTab: (tab: string) => void;
}

export const ComparisonScreen: React.FC<ComparisonScreenProps> = ({
  profile,
  onSelectAssessment,
  setActiveTab
}) => {
  const [productAIndex, setProductAIndex] = useState<number>(0); // Chocolate Biscuit
  const [productBIndex, setProductBIndex] = useState<number>(1); // Almond Granola Bar

  const [assessmentA, setAssessmentA] = useState<AssessmentResponse | null>(null);
  const [assessmentB, setAssessmentB] = useState<AssessmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasCompared, setHasCompared] = useState<boolean>(false);

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const prodA = SAMPLE_PRODUCTS[productAIndex];
      const prodB = SAMPLE_PRODUCTS[productBIndex];

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

  const getRiskColor = (risk: string) => {
    if (risk === 'CRITICAL') return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (risk === 'WARNING' || risk === 'CAUTION') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (risk === 'UNKNOWN') return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  // Determine recommendation strictly respecting hard allergen & dietary safety constraints over numeric score
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
        badge: 'Product B is Recommended',
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains ${criticalConflictsA.map((c) => c.ingredient).join(', ')}, which directly conflicts with your declared allergen profile.`
      };
    }
    if (criticalConflictsB.length > 0 && criticalConflictsA.length === 0) {
      return {
        winner: assessmentA.product.name,
        badge: 'Product A is Recommended',
        reason: `${assessmentA.product.name} is recommended because ${assessmentB.product.name} contains ${criticalConflictsB.map((c) => c.ingredient).join(', ')}, which directly conflicts with your declared allergen profile.`
      };
    }

    // 2. Dietary violation check
    const dietConflictsA = assessmentA.conflicts.filter((c) => c.severity === 'warning');
    const dietConflictsB = assessmentB.conflicts.filter((c) => c.severity === 'warning');

    if (dietConflictsA.length > 0 && dietConflictsB.length === 0) {
      return {
        winner: assessmentB.product.name,
        badge: 'Product B is Recommended',
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains ingredients (${dietConflictsA.map((c) => c.ingredient).join(', ')}) violating your dietary preference.`
      };
    }
    if (dietConflictsB.length > 0 && dietConflictsA.length === 0) {
      return {
        winner: assessmentA.product.name,
        badge: 'Product A is Recommended',
        reason: `${assessmentA.product.name} is recommended because ${assessmentB.product.name} contains ingredients (${dietConflictsB.map((c) => c.ingredient).join(', ')}) violating your dietary preference.`
      };
    }

    // 3. Unresolved / Unknown quarantine check
    if (assessmentA.unresolved_ingredients.length > 0 && assessmentB.unresolved_ingredients.length === 0 && rankB > rankA) {
      return {
        winner: assessmentB.product.name,
        badge: 'Product B is Verified',
        reason: `${assessmentB.product.name} is recommended because ${assessmentA.product.name} contains unverified ingredients (${assessmentA.unresolved_ingredients.join(', ')}).`
      };
    }
    if (assessmentB.unresolved_ingredients.length > 0 && assessmentA.unresolved_ingredients.length === 0 && rankA > rankB) {
      return {
        winner: assessmentA.product.name,
        badge: 'Product A is Verified',
        reason: `${assessmentA.product.name} is recommended because ${assessmentB.product.name} contains unverified ingredients (${assessmentB.unresolved_ingredients.join(', ')}).`
      };
    }

    // 4. Secondary Score Comparison if risk levels match
    const scoreA = assessmentA.score ?? -1;
    const scoreB = assessmentB.score ?? -1;

    if (scoreA > scoreB) {
      return {
        winner: assessmentA.product.name,
        badge: 'Product A is Recommended',
        reason: `${assessmentA.product.name} has a higher suitability score (${scoreA}/100 vs ${scoreB}/100) under your active profile.`
      };
    } else if (scoreB > scoreA) {
      return {
        winner: assessmentB.product.name,
        badge: 'Product B is Recommended',
        reason: `${assessmentB.product.name} has a higher suitability score (${scoreB}/100 vs ${scoreA}/100) under your active profile.`
      };
    } else {
      return {
        winner: 'Equal Suitability',
        badge: 'Equivalent Match',
        reason: `Both products have equivalent risk levels and suitability scores (${scoreA !== -1 ? `${scoreA}/100` : 'Unrated'}) under your active profile.`
      };
    }
  };

  const rec = getRecommendation();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">Product Safety Comparison</h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Compare two food items side-by-side against your allergy rules and dietary profile.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={isLoading}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{isLoading ? 'Analyzing...' : 'Run Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product A Selection */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Product A</span>
            <span className="text-[10px] font-mono text-neutral-400">Select Preset</span>
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
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-400 italic line-clamp-2">
            Ingredients: {SAMPLE_PRODUCTS[productAIndex].ingredientsText}
          </p>
        </div>

        {/* Product B Selection */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">Product B</span>
            <span className="text-[10px] font-mono text-neutral-400">Select Preset</span>
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
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-400 italic line-clamp-2">
            Ingredients: {SAMPLE_PRODUCTS[productBIndex].ingredientsText}
          </p>
        </div>
      </div>

      {/* COMPARISON RESULTS */}
      {hasCompared && assessmentA && assessmentB && (
        <div className="space-y-6">
          {/* Recommendation Banner */}
          {rec && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start space-x-3.5">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-black">
                    {rec.badge}
                  </span>
                  <h3 className="font-extrabold text-white text-sm font-display">{rec.winner}</h3>
                </div>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed font-sans">{rec.reason}</p>
              </div>
            </div>
          )}

          {/* Comparison Matrix Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card A */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Product A</span>
                  <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md border ${getRiskColor(assessmentA.risk_level)}`}>
                    {assessmentA.risk_level}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-black text-white font-display">{assessmentA.product.name}</h2>
                  <p className="text-xs text-neutral-400 font-mono uppercase">{assessmentA.product.brand}</p>
                </div>

                {/* Score */}
                <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#222] flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Suitability Score:</span>
                  <span className="text-base font-black text-white">
                    {assessmentA.score !== null ? `${assessmentA.score}/100` : 'N/A (Unresolved)'}
                  </span>
                </div>

                {/* Detected Conflicts */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Profile Conflicts ({assessmentA.conflicts.length})
                  </span>
                  {assessmentA.conflicts.length > 0 ? (
                    <div className="space-y-1">
                      {assessmentA.conflicts.map((c, i) => (
                        <div key={i} className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px]">
                          ❌ {c.canonicalName || c.ingredient}: {c.reason}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 font-mono text-xs">✓ No conflicts with your profile</p>
                  )}
                </div>

                {/* Unresolved */}
                {assessmentA.unresolved_ingredients.length > 0 && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                    ⚠ {assessmentA.unresolved_ingredients.length} Unresolved ingredient(s): {assessmentA.unresolved_ingredients.join(', ')}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onSelectAssessment(assessmentA);
                  setActiveTab('assessment');
                }}
                className="mt-4 w-full py-2 bg-[#181818] hover:bg-[#222] border border-[#333] text-neutral-200 text-xs font-bold rounded-xl transition-all font-mono"
              >
                View Full Assessment A
              </button>
            </div>

            {/* Card B */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase">Product B</span>
                  <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md border ${getRiskColor(assessmentB.risk_level)}`}>
                    {assessmentB.risk_level}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-black text-white font-display">{assessmentB.product.name}</h2>
                  <p className="text-xs text-neutral-400 font-mono uppercase">{assessmentB.product.brand}</p>
                </div>

                {/* Score */}
                <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#222] flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400">Suitability Score:</span>
                  <span className="text-base font-black text-white">
                    {assessmentB.score !== null ? `${assessmentB.score}/100` : 'N/A (Unresolved)'}
                  </span>
                </div>

                {/* Detected Conflicts */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                    Profile Conflicts ({assessmentB.conflicts.length})
                  </span>
                  {assessmentB.conflicts.length > 0 ? (
                    <div className="space-y-1">
                      {assessmentB.conflicts.map((c, i) => (
                        <div key={i} className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px]">
                          ❌ {c.canonicalName || c.ingredient}: {c.reason}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 font-mono text-xs">✓ No conflicts with your profile</p>
                  )}
                </div>

                {/* Unresolved */}
                {assessmentB.unresolved_ingredients.length > 0 && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                    ⚠ {assessmentB.unresolved_ingredients.length} Unresolved ingredient(s): {assessmentB.unresolved_ingredients.join(', ')}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onSelectAssessment(assessmentB);
                  setActiveTab('assessment');
                }}
                className="mt-4 w-full py-2 bg-[#181818] hover:bg-[#222] border border-[#333] text-neutral-200 text-xs font-bold rounded-xl transition-all font-mono"
              >
                View Full Assessment B
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
