/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileFrame } from './components/MobileFrame';
import { ScanScreen } from './components/screens/ScanScreen';
import { AssessmentResultScreen } from './components/screens/AssessmentResultScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { KnowledgeBaseScreen } from './components/screens/KnowledgeBaseScreen';
import { CorpusScreen } from './components/screens/CorpusScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { EvaluationScreen } from './components/screens/EvaluationScreen';
import { ComparisonScreen } from './components/screens/ComparisonScreen';
import { SystemHealthPanel } from './components/SystemHealthPanel';
import { fetchProfile, fetchAdminStats, fetchUnresolvedLogs, addAdminIngredient } from './services/apiClient';
import { AssessmentResponse, UserProfile } from './types';
import { ShieldAlert, Database, Plus, RefreshCw, Layers, CheckCircle, AlertOctagon, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isSystemHealthOpen, setIsSystemHealthOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  // Admin state
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [unresolvedLogs, setUnresolvedLogs] = useState<any[]>([]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState('additive');
  const [newIngDesc, setNewIngDesc] = useState('');
  const [newIngAllergens, setNewIngAllergens] = useState('');
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInitialProfile();
  }, []);

  const loadInitialProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const p = await fetchProfile('usr_demo_walkthrough');
      setProfile(p);
    } catch (err) {
      console.warn('Backend profile fetch failed, using default profile', err);
      setProfile({
        id: 'prof_demo',
        userId: 'usr_demo_walkthrough',
        dietType: 'vegetarian',
        allergies: ['peanut'],
        avoidIngredients: ['titanium dioxide', 'palm oil']
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const stats = await fetchAdminStats();
      setAdminStats(stats);
      const logs = await fetchUnresolvedLogs();
      setUnresolvedLogs(logs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin') {
      loadAdminData();
    }
  }, [activeTab]);

  const handleAssessmentComplete = (assessment: AssessmentResponse) => {
    setLatestAssessment(assessment);
  };

  const handleAddIngredientAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;
    try {
      await addAdminIngredient({
        canonicalName: newIngName.trim().toLowerCase(),
        description: newIngDesc.trim() || `Food additive: ${newIngName}`,
        category: newIngCategory,
        allergens: newIngAllergens ? newIngAllergens.split(',').map((a) => a.trim().toLowerCase()) : []
      });
      setAdminSuccess(`Successfully registered "${newIngName}" in Knowledge Base.`);
      setNewIngName('');
      setNewIngDesc('');
      setNewIngAllergens('');
      loadAdminData();
      setTimeout(() => setAdminSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f2f2f2] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenSystemHealth={() => setIsSystemHealthOpen(true)}
      />

      {/* Main Body Content with Responsive Frame Container */}
      <main className="flex-1 w-full flex flex-col justify-start">
        <MobileFrame isMobileView={isMobileView}>
          {activeTab === 'scan' && (
            <ScanScreen
              profile={profile}
              onAssessmentComplete={handleAssessmentComplete}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentResultScreen
              assessment={latestAssessment}
              onRerunScan={() => setActiveTab('scan')}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'compare' && (
            <ComparisonScreen
              profile={profile}
              onSelectAssessment={(assessment) => {
                setLatestAssessment(assessment);
                setActiveTab('assessment');
              }}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              onSelectAssessment={(assessment) => {
                setLatestAssessment(assessment);
                setActiveTab('assessment');
              }}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'knowledge' && <KnowledgeBaseScreen />}

          {activeTab === 'corpus' && <CorpusScreen />}

          {activeTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
            />
          )}

          {activeTab === 'evaluation' && <EvaluationScreen />}

          {activeTab === 'admin' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Admin Header */}
              <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white tracking-tight">Admin & Safety Telemetry Panel</h1>
                      <p className="text-xs sm:text-sm text-neutral-400">
                        Inspect unresolved OCR ingredient tails, taxonomies, and database registries.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={loadAdminData}
                    className="px-3.5 py-2 bg-[#1c1c1c] hover:bg-[#262626] border border-[#333] text-neutral-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Telemetry</span>
                  </button>
                </div>
              </div>

              {/* Admin Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Ingredients
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {adminStats?.totalIngredients || '350+'}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Standardized Lexicon</span>
                </div>

                <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Allergen Links
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {adminStats?.totalAllergens || '9 Major'}
                  </div>
                  <span className="text-[11px] text-teal-400 font-medium">FDA / FALCPA Compliance</span>
                </div>

                <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Cached Products
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {adminStats?.totalProducts || '50+'}
                  </div>
                  <span className="text-[11px] text-cyan-400 font-medium">OFF & Verified Barcodes</span>
                </div>

                <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    RAG Chunks
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {adminStats?.totalScientificChunks || '12'}
                  </div>
                  <span className="text-[11px] text-indigo-400 font-medium">FDA/EFSA Indexed</span>
                </div>
              </div>

              {/* Unresolved Queue & Manual Registration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Manual Add Ingredient */}
                <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Register New Ingredient Rule</span>
                  </div>

                  {adminSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{adminSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddIngredientAdmin} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-400 block mb-1">
                        Canonical Ingredient Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. sodium caseinate"
                        value={newIngName}
                        onChange={(e) => setNewIngName(e.target.value)}
                        required
                        className="w-full bg-[#0d0d0d] border border-[#262626] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-400 block mb-1">Category</label>
                        <select
                          value={newIngCategory}
                          onChange={(e) => setNewIngCategory(e.target.value)}
                          className="w-full bg-[#0d0d0d] border border-[#262626] focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        >
                          <option value="additive">Additive / Emulsifier</option>
                          <option value="protein">Protein / Derivative</option>
                          <option value="sweetener">Sweetener</option>
                          <option value="color">Colorant / Dye</option>
                          <option value="preservative">Preservative</option>
                          <option value="fat">Fat / Oil</option>
                          <option value="flour">Cereal / Flour</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-400 block mb-1">
                          Allergens (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. milk, soy"
                          value={newIngAllergens}
                          onChange={(e) => setNewIngAllergens(e.target.value)}
                          className="w-full bg-[#0d0d0d] border border-[#262626] focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-400 block mb-1">Description / Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Brief regulatory or biochemical description"
                        value={newIngDesc}
                        onChange={(e) => setNewIngDesc(e.target.value)}
                        className="w-full bg-[#0d0d0d] border border-[#262626] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Deterministic Dictionary</span>
                    </button>
                  </form>
                </div>

                {/* Unresolved / Unknown Ingredient Queue */}
                <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider mb-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>Unresolved Ingredient Quarantine Queue</span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4">
                      Scanned items that failed exact or fuzzy lexicon matching are flagged here for human-in-the-loop review.
                    </p>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {unresolvedLogs && unresolvedLogs.length > 0 ? (
                        unresolvedLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0d0d0d] border border-[#262626] p-3 rounded-xl flex items-center justify-between text-xs"
                          >
                            <span className="font-mono text-amber-300 font-semibold">{log.rawText || log.ingredient}</span>
                            <span className="text-neutral-500 text-[10px] font-mono">
                              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-8 text-center text-xs text-neutral-400 space-y-2">
                          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                          <p className="font-medium text-neutral-300">Quarantine Clean</p>
                          <p className="text-[11px] text-neutral-500">
                            All scanned ingredients have successfully resolved to canonical dictionary terms.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[#171717] rounded-xl border border-[#262626] text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Safety Principle: </span>
                    Unresolved ingredients always downgrade an assessment to <strong className="text-neutral-200">UNKNOWN</strong> or <strong className="text-neutral-200">CAUTION</strong>, ensuring user safety is never compromised by ambiguity.
                  </div>
                </div>
              </div>
            </div>
          )}
        </MobileFrame>
      </main>

      {/* System Health & Telemetry Modal */}
      <SystemHealthPanel
        isOpen={isSystemHealthOpen}
        onClose={() => setIsSystemHealthOpen(false)}
      />
    </div>
  );
}

