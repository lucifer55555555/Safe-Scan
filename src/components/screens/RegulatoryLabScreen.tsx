import React, { useState } from 'react';
import {
  Database,
  BookOpen,
  Cpu,
  ShieldAlert,
  FlaskConical,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { KnowledgeBaseScreen } from './KnowledgeBaseScreen';
import { CorpusScreen } from './CorpusScreen';
import { EvaluationScreen } from './EvaluationScreen';

interface RegulatoryLabScreenProps {
  initialSubTab?: 'knowledge' | 'corpus' | 'evaluation' | 'admin';
  adminStats?: any;
  unresolvedLogs?: any[];
  onRefreshAdmin?: () => void;
  onAddIngredientAdmin?: (e: React.FormEvent) => void;
  newIngName?: string;
  setNewIngName?: (v: string) => void;
  newIngCategory?: string;
  setNewIngCategory?: (v: string) => void;
  newIngDesc?: string;
  setNewIngDesc?: (v: string) => void;
  newIngAllergens?: string;
  setNewIngAllergens?: (v: string) => void;
  adminSuccess?: string | null;
}

export const RegulatoryLabScreen: React.FC<RegulatoryLabScreenProps> = ({
  initialSubTab = 'knowledge',
  adminStats,
  unresolvedLogs = [],
  onRefreshAdmin,
  onAddIngredientAdmin,
  newIngName = '',
  setNewIngName,
  newIngCategory = 'additive',
  setNewIngCategory,
  newIngDesc = '',
  setNewIngDesc,
  newIngAllergens = '',
  setNewIngAllergens,
  adminSuccess
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'knowledge' | 'corpus' | 'evaluation' | 'admin'>(initialSubTab);

  const subTabs = [
    {
      id: 'knowledge' as const,
      label: 'Ingredient KB',
      icon: Database,
      badge: '1,200+ Lexicon',
      desc: 'Standardized botanical & additive classifications'
    },
    {
      id: 'corpus' as const,
      label: 'FDA / EFSA Corpus',
      icon: BookOpen,
      badge: 'FALCPA & EU 1169',
      desc: 'Regulatory monographs & vector cosine similarity search'
    },
    {
      id: 'evaluation' as const,
      label: 'Safety Benchmarks & Eval',
      icon: Cpu,
      badge: 'Zero Hallucination',
      desc: 'Auditable deterministic rule benchmarks & metrics'
    },
    {
      id: 'admin' as const,
      label: 'Admin Telemetry & Logs',
      icon: ShieldAlert,
      badge: 'Quarantine Review',
      desc: 'Unresolved OCR ingredient tails & manual curation'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Lab Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1427] via-[#0f1b33] to-[#0c1427] border border-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Regulatory Science & Research Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Evidence Grounding & Regulatory Corpus
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Explore the regulatory guidelines (FDA FALCPA, EFSA, FSSAI), vector knowledge base, deterministic rules engine benchmarks, and quarantine audit logs that power SafeScan AI.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#090d19] text-emerald-400 border border-emerald-500/30 shadow-sm">
              ● Deterministic Engine Online
            </span>
          </div>
        </div>

        {/* Sub-Tabs Navigation Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-[#080d19] text-slate-400 hover:text-white hover:bg-[#121c33] border border-[#1e293b]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-black/20 text-black' : 'bg-[#141f38] text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab View Rendering */}
      <div>
        {activeSubTab === 'knowledge' && <KnowledgeBaseScreen />}
        {activeSubTab === 'corpus' && <CorpusScreen />}
        {activeSubTab === 'evaluation' && <EvaluationScreen />}
        {activeSubTab === 'admin' && (
          <div className="space-y-6">
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0c1427] border border-[#1e293b] p-5 rounded-2xl shadow-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Curated Ingredients
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {adminStats?.totalIngredients || '350+'}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Standardized Lexicon</span>
              </div>

              <div className="bg-[#0c1427] border border-[#1e293b] p-5 rounded-2xl shadow-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Allergen Links
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {adminStats?.totalAllergens || '9 Major Groups'}
                </div>
                <span className="text-[11px] text-cyan-400 font-medium">FDA / FALCPA Compliance</span>
              </div>

              <div className="bg-[#0c1427] border border-[#1e293b] p-5 rounded-2xl shadow-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Verified Barcodes
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {adminStats?.totalProducts || '50+'}
                </div>
                <span className="text-[11px] text-teal-400 font-medium">Indian Retail Catalog</span>
              </div>

              <div className="bg-[#0c1427] border border-[#1e293b] p-5 rounded-2xl shadow-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Quarantine Tail
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {adminStats?.unresolvedCount || unresolvedLogs.length || 0}
                </div>
                <span className="text-[11px] text-amber-400 font-medium">Under Review</span>
              </div>
            </div>

            {/* Register New Additive */}
            {onAddIngredientAdmin && (
              <div className="bg-[#0c1427] border border-[#1e293b] p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Register New Ingredient</h3>
                    <p className="text-xs text-slate-400">Add verified food additive or botanical to the local knowledge base.</p>
                  </div>
                  {adminSuccess && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold">
                      {adminSuccess}
                    </span>
                  )}
                </div>

                <form onSubmit={onAddIngredientAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Canonical Name</label>
                      <input
                        type="text"
                        value={newIngName}
                        onChange={(e) => setNewIngName?.(e.target.value)}
                        placeholder="e.g. titanium dioxide"
                        className="w-full bg-[#080d19] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Category</label>
                      <select
                        value={newIngCategory}
                        onChange={(e) => setNewIngCategory?.(e.target.value)}
                        className="w-full bg-[#080d19] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="additive">Food Additive</option>
                        <option value="preservative">Preservative</option>
                        <option value="colorant">Colorant</option>
                        <option value="sweetener">Sweetener</option>
                        <option value="allergen">Major Allergen</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Description / INS Number</label>
                    <input
                      type="text"
                      value={newIngDesc}
                      onChange={(e) => setNewIngDesc?.(e.target.value)}
                      placeholder="e.g. E171 / White mineral pigment banned by EFSA in 2022"
                      className="w-full bg-[#080d19] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Associated Allergens (Comma-separated)</label>
                    <input
                      type="text"
                      value={newIngAllergens}
                      onChange={(e) => setNewIngAllergens?.(e.target.value)}
                      placeholder="e.g. peanut, soy (optional)"
                      className="w-full bg-[#080d19] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    Add to Regulatory Knowledge Base
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
