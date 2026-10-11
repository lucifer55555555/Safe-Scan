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
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ComparisonScreen } from './components/screens/ComparisonScreen';
import { RegulatoryLabScreen } from './components/screens/RegulatoryLabScreen';
import { SystemHealthPanel } from './components/SystemHealthPanel';
import { fetchProfile, fetchAdminStats, fetchUnresolvedLogs, addAdminIngredient } from './services/apiClient';
import { AssessmentResponse, UserProfile } from './types';

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

  const [comparePair, setComparePair] = useState<{ prodAId?: string; prodBId?: string } | null>(null);

  return (
    <div className="min-h-screen bg-[#080808] text-[#f2f2f2] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
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
              onStartBrandComparison={(prodAId, prodBId) => {
                setComparePair({ prodAId, prodBId });
                setActiveTab('compare');
              }}
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
              initialPair={comparePair}
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

          {activeTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
            />
          )}

          {(activeTab === 'lab' || activeTab === 'knowledge' || activeTab === 'corpus' || activeTab === 'evaluation' || activeTab === 'admin') && (
            <RegulatoryLabScreen
              initialSubTab={
                activeTab === 'knowledge' ? 'knowledge' :
                activeTab === 'corpus' ? 'corpus' :
                activeTab === 'evaluation' ? 'evaluation' :
                activeTab === 'admin' ? 'admin' :
                'knowledge'
              }
              adminStats={adminStats}
              unresolvedLogs={unresolvedLogs}
              onRefreshAdmin={loadAdminData}
              onAddIngredientAdmin={handleAddIngredientAdmin}
              newIngName={newIngName}
              setNewIngName={setNewIngName}
              newIngCategory={newIngCategory}
              setNewIngCategory={setNewIngCategory}
              newIngDesc={newIngDesc}
              setNewIngDesc={setNewIngDesc}
              newIngAllergens={newIngAllergens}
              setNewIngAllergens={setNewIngAllergens}
              adminSuccess={adminSuccess}
            />
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

