import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  Percent,
  Cpu,
  ArrowRight,
  Scale,
  Workflow,
  FileDown,
  Printer,
  Check,
  X
} from 'lucide-react';
import { AssessmentResponse, EvidenceItem, NormalizedIngredientResult } from '../../types';
import { EvidenceModal } from '../EvidenceModal';
import { IngredientModal } from '../IngredientModal';
import { ReportModal } from '../ReportModal';
import { db } from '../../services/database';

interface AssessmentResultScreenProps {
  assessment: AssessmentResponse | null;
  onRerunScan: () => void;
  setActiveTab: (tab: string) => void;
  onCompareProduct?: (assessment: AssessmentResponse) => void;
}

export const AssessmentResultScreen: React.FC<AssessmentResultScreenProps> = ({
  assessment,
  onRerunScan,
  setActiveTab,
  onCompareProduct
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<any | null>(null);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  if (!assessment) {
    return (
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] text-neutral-400 flex items-center justify-center mx-auto border border-[#333]">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">No Active Assessment</h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans">
          Scan a product barcode or capture an ingredient label to generate an evidence-cited safety assessment.
        </p>
        <button
          onClick={onRerunScan}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  const {
    risk_level,
    score,
    conflicts,
    unresolved_ingredients,
    evidence,
    confidence,
    explanation,
    normalized_ingredients,
    product
  } = assessment;

  // Determine styling theme based on Risk Level
  const isCritical = risk_level === 'CRITICAL';
  const isWarning = risk_level === 'WARNING';
  const isCaution = risk_level === 'CAUTION';
  const isUnknown = risk_level === 'UNKNOWN';
  const isClear = risk_level === 'NO_MATCH';

  // Section 7: Safety Hierarchy Status Mapping
  const getStatusBadge = () => {
    if (isCritical || isWarning) {
      return {
        category: 'NOT SUITABLE',
        title: isCritical ? 'NOT SUITABLE FOR YOU' : 'DIETARY MISMATCH',
        subtitle: `Direct conflicts with your active safety rules (${conflicts.length} conflict(s))`,
        badgeClass: 'bg-rose-500 text-black font-black font-mono shadow-lg shadow-rose-500/30',
        cardBg: 'bg-gradient-to-b from-rose-950/50 via-[#121212] to-[#121212] border-rose-500/60',
        icon: AlertOctagon,
        iconColor: 'text-rose-400',
        reasonSummary: `Contains ${conflicts.map((c) => c.canonicalName || c.ingredient).join(', ')}.`
      };
    }
    if (isCaution || isUnknown) {
      const unknownMsg = unresolved_ingredients.length > 0
        ? `We could not confidently identify: ${unresolved_ingredients.join(', ')}. The product has NOT been classified as safe.`
        : `Restricted ingredient or custom avoidance rule flagged (${conflicts.length} item(s)).`;

      return {
        category: 'CAUTION',
        title: 'CAUTION ADVISED',
        subtitle: 'Product has NOT been classified as safe. Please verify the physical packaging.',
        badgeClass: 'bg-amber-500 text-black font-black font-mono shadow-lg shadow-amber-500/30',
        cardBg: 'bg-gradient-to-b from-amber-950/40 via-[#121212] to-[#121212] border-amber-500/50',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        reasonSummary: unknownMsg
      };
    }
    return {
      category: 'SAFE',
      title: 'SAFE & VERIFIED',
      subtitle: 'All recognized ingredients satisfy your allergy and dietary profile.',
      badgeClass: 'bg-emerald-500 text-black font-black font-mono shadow-lg shadow-emerald-500/30',
      cardBg: 'bg-gradient-to-b from-emerald-950/50 via-[#121212] to-[#121212] border-emerald-500/60',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      reasonSummary: 'No allergen triggers, dietary conflicts, or restricted additives found.'
    };
  };

  const status = getStatusBadge();

  // Detected Allergens list
  const detectedAllergenList = Array.from(
    new Set(
      normalized_ingredients
        .flatMap((n) => n.allergens || [])
        .filter(Boolean)
    )
  );

  // Compute Dietary Compatibility
  const isVegan = !normalized_ingredients.some((n) => {
    const ing = n.ingredientId ? db.ingredients.get(n.ingredientId) : null;
    return ing?.dietaryConflicts?.isVeganSafe === false;
  });
  const isVegetarian = !normalized_ingredients.some((n) => {
    const ing = n.ingredientId ? db.ingredients.get(n.ingredientId) : null;
    return ing?.dietaryConflicts?.isVegetarianSafe === false;
  });
  const isGlutenFree = !normalized_ingredients.some((n) => {
    const ing = n.ingredientId ? db.ingredients.get(n.ingredientId) : null;
    return ing?.dietaryConflicts?.isGlutenFreeSafe === false || n.allergens.includes('wheat');
  });
  const isHalal = !normalized_ingredients.some((n) => {
    const ing = n.ingredientId ? db.ingredients.get(n.ingredientId) : null;
    return ing?.dietaryConflicts?.isHalalSafe === false;
  });

  const handleOpenIngredient = (norm: NormalizedIngredientResult) => {
    const found = norm.ingredientId ? db.ingredients.get(norm.ingredientId) : null;
    if (found) {
      setSelectedIngredient(found);
    } else {
      setSelectedIngredient({
        id: 'tmp',
        canonicalName: norm.canonicalName,
        description: norm.isResolved
          ? (norm.notes || 'Identified candidate ingredient')
          : 'UNKNOWN INGREDIENT: Safe identification was not possible in the curated regulatory knowledge base. The product assessment has been downgraded to CAUTION to avoid false negative risk. Please verify this ingredient manually on physical packaging.',
        category: norm.category || (norm.isResolved ? 'ingredient' : 'unresolved / unknown'),
        allergens: norm.allergens || [],
        notes: norm.isResolved ? norm.notes : 'Quarantined for manual inspection.'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. TOP SUMMARY CARD */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${status.cardBg} shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className={`px-3 py-1 rounded-md text-xs tracking-wider uppercase ${status.badgeClass}`}>
                {status.category}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#0a0a0a] text-neutral-200 border border-[#2a2a2a]">
                Suitability Score:{' '}
                {score !== null ? (
                  <strong className={score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                    {score} / 100
                  </strong>
                ) : (
                  <strong className="text-amber-400">Score Suppressed (Unknown Ingredient)</strong>
                )}
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                {product?.name || 'Scanned Food Product'}
              </h1>
              {product?.brand && (
                <p className="text-xs sm:text-sm font-bold text-neutral-400 font-mono mt-0.5 uppercase tracking-wide">
                  {product.brand} {product.barcode ? `· EAN: ${product.barcode}` : ''}
                </p>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-xl">{status.subtitle}</p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              id="export-report-btn"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-200 text-xs font-bold border border-[#333] transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compare</span>
            </button>
            <button
              onClick={onRerunScan}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-neutral-300 text-xs font-bold border border-[#333] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Again</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION 7: SAFETY HIERARCHY DETAILS */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
            Reason for Classification
          </span>
          <p className="text-sm font-bold text-white font-display">
            {status.reasonSummary}
          </p>
        </div>

        {/* Major Allergen Flags in Formulation vs Personal Profile */}
        <div className="pt-3 border-t border-[#222] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
              Allergens In Product Formulation
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              (FALCPA & FSSAI 8/9 Major Groups)
            </span>
          </div>

          {detectedAllergenList.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {detectedAllergenList.map((alg) => {
                  const isUserConflict = conflicts.some(
                    (c) => c.type === 'ALLERGEN_CONFLICT' && String(c.allergen || '').toLowerCase() === String(alg).toLowerCase()
                  );
                  return (
                    <span
                      key={alg}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center space-x-1.5 border ${
                        isUserConflict
                          ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-sm shadow-rose-500/20'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      {isUserConflict ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      <span>{alg}</span>
                      {isUserConflict ? (
                        <span className="text-[9px] bg-rose-500 text-black px-1.5 py-0.2 rounded font-black tracking-tight">
                          YOUR ALLERGY CONFLICT
                        </span>
                      ) : (
                        <span className="text-[9px] text-neutral-400 font-normal">
                          (in recipe)
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              {!conflicts.some((c) => c.type === 'ALLERGEN_CONFLICT') && (
                <p className="text-[11px] font-mono text-emerald-400/90 flex items-center space-x-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    None of the formulation's allergens conflict with your profile (You have 0 active allergy triggers selected in your Profile).
                  </span>
                </p>
              )}
            </div>
          ) : (
            <span className="text-xs text-neutral-400 font-mono flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>No major allergens detected in declared ingredient list.</span>
            </span>
          )}
        </div>

        {/* Dietary Compatibility Grid */}
        <div className="pt-3 border-t border-[#222]">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider block mb-2">
            Dietary Compatibility
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold">
            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isVegan
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span>Vegan</span>
              <span>{isVegan ? '✓' : '✕'}</span>
            </div>

            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isVegetarian
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span>Vegetarian</span>
              <span>{isVegetarian ? '✓' : '✕'}</span>
            </div>

            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isGlutenFree
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span>Gluten-Free</span>
              <span>{isGlutenFree ? '✓' : '✕'}</span>
            </div>

            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isHalal
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <span>Halal</span>
              <span>{isHalal ? '✓' : '?'}</span>
            </div>
          </div>
        </div>

        {/* Unknown Ingredients Alert */}
        {unresolved_ingredients.length > 0 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs text-amber-300">
            <div className="flex items-center space-x-1.5 font-bold font-mono uppercase">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>We could not confidently identify ({unresolved_ingredients.length}):</span>
            </div>
            <p className="font-mono text-white text-sm">{unresolved_ingredients.join(', ')}</p>
            <p className="text-amber-300 text-[11px] leading-relaxed">
              The product has NOT been classified as safe. Numeric score is suppressed. Please verify physical packaging.
            </p>
          </div>
        )}
      </div>

      {/* 3. SECTION 8: "HOW SAFESCAN DECIDED" AUDIT TRAIL */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display">
              HOW SAFESCAN DECIDED
            </h2>
          </div>
          <span className="text-[10px] font-mono bg-[#181818] text-neutral-400 px-2 py-0.5 rounded border border-[#2a2a2a]">
            Auditable Pipeline Execution
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono text-neutral-300">
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Input processed (Method: {assessment.scanned_method.toUpperCase()})</span>
          </div>
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Ingredients normalized ({normalized_ingredients.length} tokens resolved & taxonomy mapped)</span>
          </div>
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Safety rules evaluated (FDA 9 allergens + active dietary profiles)</span>
          </div>
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Unknown ingredients checked ({unresolved_ingredients.length} quarantined tokens)</span>
          </div>
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Regulatory evidence retrieved ({evidence.length} FDA / EFSA chunks linked)</span>
          </div>
          <div className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Final deterministic assessment generated ({status.category})</span>
          </div>
        </div>
      </div>

      {/* 4. GROUNDED AI EXPLANATION */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Evidence-Grounded AI Explanation</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
            Strict RAG Grounding
          </span>
        </div>
        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#222] text-neutral-200 text-sm leading-relaxed whitespace-pre-line font-medium font-sans">
          {explanation}
        </div>
      </div>

      {/* 5. SECTION 9: TRANSPARENT REGULATORY EVIDENCE */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display">
              REGULATORY EVIDENCE
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono text-[11px]">FDA & EFSA Indexed Corpus</span>
        </div>

        {evidence.length > 0 ? (
          <div className="space-y-3">
            {evidence.map((ev, i) => (
              <div
                key={i}
                id={`evidence-card-${i}`}
                onClick={() => setSelectedEvidence(ev)}
                className="bg-[#0a0a0a] rounded-xl p-4 border border-[#262626] hover:border-emerald-500/50 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Source: {ev.organization}
                  </span>
                  <span className="text-[10px] text-neutral-400">{ev.publicationDate}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm font-display">
                    Document: {ev.title}
                  </h4>
                  <p className="text-xs text-neutral-300 italic mt-1 font-serif">
                    Relevant excerpt: "{ev.excerpt}"
                  </p>
                </div>
                <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs text-emerald-400 font-mono">
                  <span className="truncate max-w-md text-[11px] text-neutral-400">Source: {ev.url}</span>
                  <span className="font-bold shrink-0">View Full Citation →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#222] text-xs text-neutral-400 space-y-1">
            <span className="font-bold uppercase font-mono text-neutral-300 block">
              REGULATORY EVIDENCE UNAVAILABLE
            </span>
            <p>
              The safety engine completed its deterministic analysis, but supporting regulatory evidence could not be retrieved for these specific ingredients.
            </p>
          </div>
        )}
      </div>

      {/* 6. NORMALIZED INGREDIENT CANDIDATES */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest flex items-center space-x-2 font-display">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Normalized Ingredients ({normalized_ingredients.length})</span>
          </h2>
          <span className="text-xs text-neutral-400 font-mono text-[11px]">Click for classification details</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {normalized_ingredients.map((norm, idx) => {
            const hasAllergen = norm.allergens && norm.allergens.length > 0;
            const isUnresolved = !norm.isResolved;

            return (
              <button
                key={idx}
                onClick={() => handleOpenIngredient(norm)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all hover:scale-[1.02] cursor-pointer ${
                  isUnresolved
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-mono'
                    : hasAllergen
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20'
                    : 'bg-[#0a0a0a] border-[#2a2a2a] text-neutral-300 hover:border-neutral-600'
                }`}
              >
                <span className="capitalize">{norm.canonicalName}</span>
                {isUnresolved && (
                  <span className="text-[9px] font-mono bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded">
                    UNKNOWN
                  </span>
                )}
                {hasAllergen && (
                  <span className="text-[9px] font-mono bg-rose-500 text-black font-extrabold px-1.5 py-0.2 rounded">
                    {norm.allergens.join(', ')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. MANDATORY DISCLAIMER */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-xs text-amber-300 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-200 uppercase tracking-wider text-[11px] font-mono">
            Mandatory Disclaimer
          </p>
          <p className="leading-relaxed font-sans">
            SafeScan AI is an informational food label analysis tool and does not provide medical certification or clinical diagnosis. Verify product ingredients with physical packaging.
          </p>
        </div>
      </div>

      {/* Modals */}
      <EvidenceModal evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
      <IngredientModal ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />
      <ReportModal
        assessment={assessment}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
