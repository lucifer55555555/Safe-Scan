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
  X,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  Ban,
  CircleAlert,
  Flame,
  Heart,
  Leaf,
  Wheat,
  Eye,
  ThumbsDown,
  ThumbsUp,
  CircleX,
  CircleCheck,
  TriangleAlert,
  OctagonX,
  Skull
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
  const [showFullAudit, setShowFullAudit] = useState<boolean>(false);

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
  const hasProblem = isCritical || isWarning || isCaution || isUnknown;

  // Section 7: Safety Hierarchy Status Mapping
  const getStatusBadge = () => {
    if (isCritical || isWarning) {
      return {
        category: 'NOT SUITABLE',
        title: isCritical ? 'DO NOT CONSUME' : 'NOT SUITABLE FOR YOU',
        subtitle: `This product contains ingredients that directly conflict with your safety profile.`,
        badgeClass: 'bg-rose-500 text-black font-black font-mono shadow-lg shadow-rose-500/30',
        cardBg: 'bg-gradient-to-b from-rose-950/60 via-[#121212] to-[#121212] border-rose-500/70',
        heroBg: 'from-rose-600 to-rose-800',
        heroGlow: 'shadow-rose-500/40',
        icon: OctagonX,
        iconColor: 'text-rose-400',
        emoji: '🚫',
        reasonSummary: `Contains ${conflicts.map((c) => c.canonicalName || c.ingredient).join(', ')}.`
      };
    }
    if (isCaution || isUnknown) {
      const unknownMsg = unresolved_ingredients.length > 0
        ? `We could not confidently identify: ${unresolved_ingredients.join(', ')}. The product has NOT been classified as safe.`
        : `Restricted ingredient or custom avoidance rule flagged (${conflicts.length} item(s)).`;

      return {
        category: 'CAUTION',
        title: 'PROCEED WITH CAUTION',
        subtitle: 'This product has NOT been classified as safe. Please verify the physical packaging.',
        badgeClass: 'bg-amber-500 text-black font-black font-mono shadow-lg shadow-amber-500/30',
        cardBg: 'bg-gradient-to-b from-amber-950/50 via-[#121212] to-[#121212] border-amber-500/60',
        heroBg: 'from-amber-500 to-amber-700',
        heroGlow: 'shadow-amber-500/40',
        icon: TriangleAlert,
        iconColor: 'text-amber-400',
        emoji: '⚠️',
        reasonSummary: unknownMsg
      };
    }
    return {
      category: 'SAFE',
      title: 'SAFE TO CONSUME',
      subtitle: 'All ingredients checked — no conflicts with your allergy and dietary profile.',
      badgeClass: 'bg-emerald-500 text-black font-black font-mono shadow-lg shadow-emerald-500/30',
      cardBg: 'bg-gradient-to-b from-emerald-950/50 via-[#121212] to-[#121212] border-emerald-500/60',
      heroBg: 'from-emerald-500 to-emerald-700',
      heroGlow: 'shadow-emerald-500/40',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      emoji: '✅',
      reasonSummary: 'No allergen triggers, dietary conflicts, or restricted additives found.'
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

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

  // Group conflicts by type for clear display
  const allergenConflicts = conflicts.filter(c => c.type === 'ALLERGEN_CONFLICT');
  const dietConflicts = conflicts.filter(c => c.type === 'DIET_CONFLICT');
  const userRestrictions = conflicts.filter(c => c.type === 'USER_RESTRICTION');
  const unknownConflicts = conflicts.filter(c => c.type === 'UNKNOWN' || c.type === 'INSUFFICIENT_EVIDENCE');

  // Get conflict severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-rose-500/20', border: 'border-rose-500/60', text: 'text-rose-300', badge: 'bg-rose-500 text-white', dot: 'bg-rose-500' };
      case 'warning': return { bg: 'bg-orange-500/20', border: 'border-orange-500/60', text: 'text-orange-300', badge: 'bg-orange-500 text-white', dot: 'bg-orange-500' };
      case 'caution': return { bg: 'bg-amber-500/20', border: 'border-amber-500/60', text: 'text-amber-300', badge: 'bg-amber-500 text-black', dot: 'bg-amber-500' };
      default: return { bg: 'bg-neutral-500/20', border: 'border-neutral-500/60', text: 'text-neutral-300', badge: 'bg-neutral-500 text-white', dot: 'bg-neutral-500' };
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      {/* ================================================================== */}
      {/* 1. HERO VERDICT BANNER — The first thing anyone sees                */}
      {/* ================================================================== */}
      <div className={`relative rounded-3xl border-2 overflow-hidden shadow-2xl ${
        hasProblem
          ? (isCritical || isWarning ? 'border-rose-500/80' : 'border-amber-500/70')
          : 'border-emerald-500/70'
      }`}>
        {/* Animated background glow for unsafe products */}
        {(isCritical || isWarning) && (
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-rose-950/80 animate-pulse" style={{ animationDuration: '3s' }} />
        )}
        {(isCaution || isUnknown) && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60" />
        )}
        {isClear && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-emerald-950/60" />
        )}

        <div className="relative p-6 sm:p-8">
          {/* Top Row: Verdict Badge + Score + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              {/* Large Verdict Icon + Badge */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${status.heroGlow} ${
                  hasProblem
                    ? (isCritical || isWarning ? 'bg-rose-500/30 border-2 border-rose-500/60' : 'bg-amber-500/30 border-2 border-amber-500/60')
                    : 'bg-emerald-500/30 border-2 border-emerald-500/60'
                }`}>
                  <StatusIcon className={`w-10 h-10 sm:w-12 sm:h-12 ${status.iconColor}`} />
                </div>
                <div>
                  <span className={`inline-block px-4 py-1.5 rounded-lg text-sm sm:text-base tracking-wider uppercase ${status.badgeClass}`}>
                    {status.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-1.5">
                    {status.title}
                  </h1>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white/90 font-display">
                  {product?.name || 'Scanned Food Product'}
                </h2>
                {product?.brand && (
                  <p className="text-xs font-bold text-neutral-400 font-mono mt-0.5 uppercase tracking-wide">
                    {product.brand} {product.barcode ? `· EAN: ${product.barcode}` : ''}
                  </p>
                )}
              </div>

              {/* Suitability Score Bar */}
              <div className="max-w-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">Safety Score</span>
                  <span className={`text-sm font-black font-mono ${
                    score === null ? 'text-amber-400' : score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {score !== null ? `${score} / 100` : 'SUPPRESSED'}
                  </span>
                </div>
                <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333]">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      score === null ? 'bg-amber-500/50 w-0' : score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: score !== null ? `${score}%` : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
      </div>

      {/* ================================================================== */}
      {/* 2. PROBLEMS FOUND — Big, unmissable conflict cards                  */}
      {/*    Only shows when there ARE problems                               */}
      {/* ================================================================== */}
      {hasProblem && conflicts.length > 0 && (
        <div className={`rounded-2xl border-2 overflow-hidden shadow-xl ${
          isCritical || isWarning ? 'border-rose-500/50' : 'border-amber-500/50'
        }`}>
          {/* Section Header */}
          <div className={`px-6 py-4 flex items-center justify-between ${
            isCritical || isWarning
              ? 'bg-gradient-to-r from-rose-950/80 to-rose-900/40'
              : 'bg-gradient-to-r from-amber-950/80 to-amber-900/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isCritical || isWarning ? 'bg-rose-500/30' : 'bg-amber-500/30'
              }`}>
                <ShieldAlert className={`w-5 h-5 ${isCritical || isWarning ? 'text-rose-400' : 'text-amber-400'}`} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide font-display">
                  {conflicts.length} Problem{conflicts.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-[11px] text-neutral-300 font-mono">These issues affect YOUR specific health profile</p>
              </div>
            </div>
            <span className={`text-xs font-black font-mono px-3 py-1 rounded-lg ${
              isCritical || isWarning ? 'bg-rose-500 text-black' : 'bg-amber-500 text-black'
            }`}>
              ACTION REQUIRED
            </span>
          </div>

          {/* Individual Conflict Cards */}
          <div className="bg-[#0d0d0d] p-4 sm:p-6 space-y-3">
            {conflicts.map((conflict, idx) => {
              const colors = getSeverityColor(conflict.severity);
              return (
                <div
                  key={idx}
                  className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 sm:p-5 space-y-3 transition-all hover:scale-[1.005]`}
                >
                  {/* Conflict Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                        {conflict.type === 'ALLERGEN_CONFLICT' ? (
                          <Skull className={`w-5 h-5 ${colors.text}`} />
                        ) : conflict.type === 'DIET_CONFLICT' ? (
                          <Ban className={`w-5 h-5 ${colors.text}`} />
                        ) : (
                          <CircleAlert className={`w-5 h-5 ${colors.text}`} />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-black uppercase tracking-wide ${colors.text}`}>
                          {conflict.canonicalName || conflict.ingredient}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                          {conflict.type === 'ALLERGEN_CONFLICT' ? '⚠ Allergen Match' :
                           conflict.type === 'DIET_CONFLICT' ? '🚫 Dietary Violation' :
                           conflict.type === 'USER_RESTRICTION' ? '✋ Custom Restriction' :
                           '❓ Insufficient Evidence'}
                        </span>
                      </div>
                    </div>
                    <span className={`${colors.badge} text-[10px] font-black font-mono px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0`}>
                      {conflict.severity}
                    </span>
                  </div>

                  {/* Plain Language Reason */}
                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-white/5">
                    <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                      {conflict.reason}
                    </p>
                  </div>

                  {/* Allergen tag if applicable */}
                  {conflict.allergen && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Allergen Group:</span>
                      <span className={`${colors.badge} text-xs font-black font-mono px-2.5 py-0.5 rounded-md uppercase`}>
                        {conflict.allergen}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">— FDA FALCPA Major Allergen</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 2b. SAFE PRODUCT — Clear positive reinforcement when no problems    */}
      {/* ================================================================== */}
      {!hasProblem && (
        <div className="rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-emerald-950/80 to-emerald-900/40 px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-emerald-300 uppercase tracking-wide font-display">
                No Problems Detected
              </h2>
              <p className="text-sm text-emerald-200/80 mt-0.5">
                All {normalized_ingredients.length} ingredients have been verified against your allergy profile and dietary preferences. No conflicts found.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 3. WHAT THIS MEANS FOR YOU — Plain language summary                 */}
      {/* ================================================================== */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#222] flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display">
            What This Means For You
          </h2>
        </div>
        <div className="p-6 space-y-5">
          {/* Allergens In Product */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
                Allergens Found In This Product
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                (FDA FALCPA & FSSAI 8/9 Major Groups)
              </span>
            </div>

            {detectedAllergenList.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {detectedAllergenList.map((alg) => {
                    const isUserConflict = conflicts.some(
                      (c) => c.type === 'ALLERGEN_CONFLICT' && String(c.allergen || '').toLowerCase() === String(alg).toLowerCase()
                    );
                    return (
                      <div
                        key={alg}
                        className={`relative px-4 py-2.5 rounded-xl text-sm font-black uppercase flex items-center gap-2 border-2 transition-all ${
                          isUserConflict
                            ? 'bg-rose-500/20 text-rose-100 border-rose-500/70 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/30'
                            : 'bg-neutral-800/80 text-neutral-300 border-neutral-600/60'
                        }`}
                      >
                        {isUserConflict ? (
                          <OctagonX className="w-4.5 h-4.5 text-rose-400" />
                        ) : (
                          <Info className="w-4 h-4 text-neutral-400" />
                        )}
                        <span className="font-mono">{alg}</span>
                        {isUserConflict ? (
                          <span className="text-[10px] bg-rose-500 text-black px-2 py-0.5 rounded-md font-black tracking-tight animate-pulse">
                            ⚠ YOUR ALLERGY
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-mono font-normal">
                            present
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!conflicts.some((c) => c.type === 'ALLERGEN_CONFLICT') && (
                  <p className="text-xs font-mono text-emerald-400/90 flex items-center gap-2 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      These allergens are present in the recipe but do NOT conflict with your current profile.
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">No major allergens detected in the declared ingredient list.</span>
              </div>
            )}
          </div>

          {/* Dietary Compatibility — Larger & Clearer */}
          <div className="pt-4 border-t border-[#222]">
            <span className="text-[11px] font-mono uppercase font-bold text-neutral-400 tracking-wider block mb-3">
              Dietary Compatibility
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Vegan', icon: Leaf, ok: isVegan },
                { label: 'Vegetarian', icon: Heart, ok: isVegetarian },
                { label: 'Gluten-Free', icon: Wheat, ok: isGlutenFree },
                { label: 'Halal', icon: ShieldCheck, ok: isHalal }
              ].map((diet) => (
                <div
                  key={diet.label}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-all ${
                    diet.ok
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <diet.icon className={`w-4 h-4 ${diet.ok ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span className="text-sm font-bold">{diet.label}</span>
                  </div>
                  {diet.ok ? (
                    <CircleCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <CircleX className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unknown Ingredients Alert */}
          {unresolved_ingredients.length > 0 && (
            <div className="mt-3 p-4 bg-amber-500/15 border-2 border-amber-500/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold font-mono uppercase text-amber-300 text-sm">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>⚠ {unresolved_ingredients.length} Unidentified Ingredient{unresolved_ingredients.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {unresolved_ingredients.map((u, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-mono font-bold">
                    {u}
                  </span>
                ))}
              </div>
              <p className="text-amber-300/80 text-xs leading-relaxed mt-1">
                These ingredients could not be matched in our regulatory database. Safety score has been suppressed. Please verify on the physical packaging.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. AI EXPLANATION — Moved UP for visibility                         */}
      {/* ================================================================== */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>AI Safety Summary</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
            Evidence-Grounded · Strict RAG
          </span>
        </div>
        <div className="p-6">
          <div className="bg-[#0a0a0a] rounded-xl p-5 border border-[#222] text-neutral-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium font-sans">
            {explanation}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 5. NORMALIZED INGREDIENTS — Clearer visual coding                   */}
      {/* ================================================================== */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest flex items-center gap-2 font-display">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>All Ingredients ({normalized_ingredients.length})</span>
          </h2>
          <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Allergen</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Unknown</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-600 inline-block" /> Safe</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {normalized_ingredients.map((norm, idx) => {
              const hasAllergen = norm.allergens && norm.allergens.length > 0;
              const isUnresolved = !norm.isResolved;
              const isConflicting = conflicts.some(c =>
                (c.canonicalName || c.ingredient).toLowerCase() === norm.canonicalName.toLowerCase()
              );

              return (
                <button
                  key={idx}
                  onClick={() => handleOpenIngredient(norm)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 flex items-center gap-2 transition-all hover:scale-[1.03] cursor-pointer ${
                    isConflicting
                      ? 'bg-rose-500/25 border-rose-500/60 text-rose-200 hover:bg-rose-500/35 ring-1 ring-rose-500/30 shadow-sm shadow-rose-500/20'
                      : isUnresolved
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 font-mono'
                      : hasAllergen
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20'
                      : 'bg-[#0a0a0a] border-[#2a2a2a] text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span className="capitalize">{norm.canonicalName}</span>
                  {isConflicting && (
                    <span className="text-[9px] font-mono bg-rose-500 text-black font-extrabold px-2 py-0.5 rounded-md animate-pulse">
                      ⚠ CONFLICT
                    </span>
                  )}
                  {isUnresolved && !isConflicting && (
                    <span className="text-[9px] font-mono bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded-md">
                      UNKNOWN
                    </span>
                  )}
                  {hasAllergen && !isConflicting && (
                    <span className="text-[9px] font-mono bg-rose-500/80 text-white font-extrabold px-2 py-0.5 rounded-md">
                      {norm.allergens.join(', ')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 6. REGULATORY EVIDENCE                                              */}
      {/* ================================================================== */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display">
              Regulatory Evidence
            </h2>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">FDA · EFSA · FSSAI Indexed Corpus</span>
        </div>

        <div className="p-6">
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
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Source: {ev.organization}
                    </span>
                    <span className="text-[10px] text-neutral-400">{ev.publicationDate}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-display">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-neutral-300 italic mt-1 font-serif line-clamp-2">
                      "{ev.excerpt}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs text-emerald-400 font-mono">
                    <span className="truncate max-w-md text-[11px] text-neutral-400">{ev.url}</span>
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
      </div>

      {/* ================================================================== */}
      {/* 7. HOW SAFESCAN DECIDED — Collapsed by default                     */}
      {/* ================================================================== */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => setShowFullAudit(!showFullAudit)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#161616] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display">
              How SafeScan Decided
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-[#181818] text-neutral-400 px-2 py-0.5 rounded border border-[#2a2a2a]">
              Auditable Pipeline
            </span>
            <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${showFullAudit ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {showFullAudit && (
          <div className="px-6 pb-6 space-y-2 text-xs font-mono text-neutral-300 border-t border-[#222] pt-4">
            {[
              `Input processed (Method: ${assessment.scanned_method?.toUpperCase() || 'MANUAL'})`,
              `Ingredients normalized (${normalized_ingredients.length} tokens resolved & taxonomy mapped)`,
              `Safety rules evaluated (FDA 9 allergens + active dietary profiles)`,
              `Unknown ingredients checked (${unresolved_ingredients.length} quarantined tokens)`,
              `Regulatory evidence retrieved (${evidence.length} FDA / EFSA chunks linked)`,
              `Final deterministic assessment generated (${status.category})`
            ].map((step, i) => (
              <div key={i} className="p-2.5 bg-[#0a0a0a] rounded-xl border border-[#222] flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* 8. MANDATORY DISCLAIMER                                             */}
      {/* ================================================================== */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-xs text-amber-300 flex items-start gap-3">
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
