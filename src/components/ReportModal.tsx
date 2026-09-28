import React from 'react';
import { X, Printer, Download, Copy, Check, ShieldCheck, AlertOctagon, AlertTriangle, BookOpen, Layers, Workflow, Info } from 'lucide-react';
import { AssessmentResponse } from '../types';

interface ReportModalProps {
  assessment: AssessmentResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ assessment, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !assessment) return null;

  const { product, risk_level, score, conflicts, unresolved_ingredients, normalized_ingredients, evidence, explanation } = assessment;

  const isNotSuitable = risk_level === 'CRITICAL' || risk_level === 'WARNING';
  const isCaution = risk_level === 'CAUTION' || risk_level === 'UNKNOWN';
  const isSafe = risk_level === 'NO_MATCH';

  const detectedAllergens: string[] = Array.from(
    new Set(normalized_ingredients.flatMap((n) => n.allergens || []).filter(Boolean))
  ) as string[];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textReport = `
SAFESCAN AI — FOOD LABEL ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
Product: ${product?.name || 'Scanned Food Item'}
Brand: ${product?.brand || 'N/A'}
Barcode (EAN/UPC): ${product?.barcode || 'N/A'}

OVERALL ASSESSMENT: ${isNotSuitable ? 'NOT SUITABLE' : isCaution ? 'CAUTION' : 'SAFE'}
Suitability Score: ${score !== null ? `${score} / 100` : 'N/A (Score Suppressed due to Unknown Ingredient)'}

DETECTED ALLERGENS:
${detectedAllergens.length > 0 ? detectedAllergens.map((a) => `• ${a.toUpperCase()}`).join('\n') : '• None detected'}

CONFLICTS:
${conflicts.length > 0 ? conflicts.map((c) => `• [${c.severity}] ${c.canonicalName || c.ingredient}: ${c.reason}`).join('\n') : '• No direct conflicts detected'}

NORMALIZED INGREDIENTS (${normalized_ingredients.length}):
${normalized_ingredients.map((n) => `• ${n.canonicalName}${!n.isResolved ? ' [UNKNOWN]' : ''}${n.allergens.length ? ` (Allergens: ${n.allergens.join(', ')})` : ''}`).join('\n')}

UNKNOWN INGREDIENTS (${unresolved_ingredients.length}):
${unresolved_ingredients.length > 0 ? unresolved_ingredients.map((u) => `• ${u}`).join('\n') : '• None'}

HOW SAFESCAN DECIDED:
1. Ingestion: ${String(assessment.scanned_method || 'manual').toUpperCase()} input processed
2. Normalization: ${normalized_ingredients.length} tokens parsed & alias-mapped
3. Deterministic Safety Engine: Evaluated 9 FDA allergens & dietary rules
4. Unknown Quarantine: ${unresolved_ingredients.length > 0 ? 'Active (Score Nullified)' : 'Passed'}
5. RAG Retrieval: ${evidence.length} FDA/EFSA regulatory chunks linked
6. Final Output: Deterministic risk verdict generated

REGULATORY EVIDENCE (${evidence.length} citations):
${evidence.map((e) => `• [${e.organization}] ${e.title}\n  Excerpt: "${e.excerpt}"\n  Source: ${e.url}`).join('\n\n')}

DISCLAIMER:
This document is an informational Food Label Analysis Report and is NOT a medical certificate or clinical diagnosis. Verify physical packaging before consumption.
    `.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Food Label Analysis Report</h2>
              <p className="text-xs text-neutral-400 font-mono">Document ID: SSR-{Date.now().toString().slice(-6)} · SafeScan AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl bg-[#222] hover:bg-[#2a2a2a] text-neutral-300 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Copy text summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer border border-emerald-500/30"
              title="Print report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#222] hover:bg-[#333] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300 print:text-black print:bg-white">
          {/* Header section */}
          <div className="flex justify-between items-start border-b border-[#262626] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">Product Information</span>
              <h3 className="text-xl font-black text-white print:text-black font-display">{product?.name || 'Scanned Product'}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Brand: {product?.brand || 'N/A'} · Barcode: {product?.barcode || 'N/A'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-500 block">Assessment Date</span>
              <span className="text-xs font-mono font-bold text-white print:text-black">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Result Hierarchy Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isNotSuitable
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : isCaution
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center space-x-3">
              {isNotSuitable ? <AlertOctagon className="w-6 h-6 shrink-0 text-rose-400" /> : isCaution ? <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" /> : <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />}
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest block">Overall Classification</span>
                <span className="text-base font-black uppercase font-display">
                  {isNotSuitable ? 'NOT SUITABLE' : isCaution ? 'CAUTION ADVISED' : 'SAFE & COMPLIANT'}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] uppercase block text-neutral-400">Suitability Score</span>
              <span className="text-lg font-black text-white print:text-black">
                {score !== null ? `${score} / 100` : 'Score Suppressed'}
              </span>
            </div>
          </div>

          {/* Detected Allergens */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">1. Detected Major Allergens</span>
            <div className="flex flex-wrap gap-2">
              {detectedAllergens.length > 0 ? (
                detectedAllergens.map((alg) => (
                  <span key={alg} className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono font-bold uppercase">
                    ✕ {alg}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-400 font-mono">✓ Zero FDA major allergens detected</span>
              )}
            </div>
          </div>

          {/* Ingredient Normalization */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">2. Ingredient Normalization & Taxonomy Mapping</span>
            <div className="flex flex-wrap gap-1.5">
              {normalized_ingredients.map((norm, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-md text-xs font-mono ${
                  !norm.isResolved
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : norm.allergens.length > 0
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-[#1a1a1a] text-neutral-300 border border-[#2a2a2a]'
                }`}>
                  {norm.canonicalName} {!norm.isResolved && '⚠ [UNKNOWN]'}
                </span>
              ))}
            </div>
          </div>

          {/* Unknown Ingredients */}
          {unresolved_ingredients.length > 0 && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs text-amber-300">
              <span className="font-bold uppercase font-mono block">⚠ Quarantined Unknown Ingredients ({unresolved_ingredients.length}):</span>
              <p className="font-mono">{unresolved_ingredients.join(', ')}</p>
              <p className="text-[11px] text-amber-400 mt-1">Per SafeScan AI quarantine policy, unverified ingredients suppress numeric suitability scores.</p>
            </div>
          )}

          {/* Decision Evidence Trail */}
          <div className="space-y-2 border-t border-[#222] pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block flex items-center space-x-1.5">
              <Workflow className="w-4 h-4 text-emerald-400" />
              <span>3. How SafeScan Decided (Audit Trail)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ Input processed via {String(assessment.scanned_method || 'manual').toUpperCase()}</div>
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ {normalized_ingredients.length} ingredients normalized</div>
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ Safety rules evaluated against active profile</div>
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ Unknown ingredients checked ({unresolved_ingredients.length} quarantined)</div>
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ {evidence.length} regulatory citations retrieved</div>
              <div className="p-2 bg-[#161616] rounded-lg border border-[#262626]">✓ Final deterministic assessment generated</div>
            </div>
          </div>

          {/* Regulatory Evidence */}
          <div className="space-y-2 border-t border-[#222] pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>4. Regulatory Evidence Citations</span>
            </span>
            {evidence.length > 0 ? (
              <div className="space-y-2 text-xs">
                {evidence.map((ev, i) => (
                  <div key={i} className="p-3 bg-[#161616] rounded-xl border border-[#262626] space-y-1">
                    <div className="flex justify-between font-mono font-bold text-emerald-400">
                      <span>[{ev.organization}] {ev.title}</span>
                      <span className="text-neutral-500 text-[10px]">{ev.publicationDate}</span>
                    </div>
                    <p className="italic text-neutral-400 font-serif">"{ev.excerpt}"</p>
                    <p className="text-[10px] text-neutral-500 font-mono truncate">Source: {ev.url}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">No specific regulatory warning chunks linked for standard benign ingredients.</p>
            )}
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
            <span className="font-bold uppercase font-mono block">Important Notice:</span>
            <p className="leading-relaxed">
              This document is an informational <strong>Food Label Analysis Report</strong> and is NOT a medical certificate or clinical prescription. Users with severe allergies or underlying metabolic conditions must verify product packaging and consult healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
