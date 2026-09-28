import React from 'react';
import { ShieldCheck, Scan, History, User, Database, BookOpen, ShieldAlert, Cpu, Smartphone, Monitor, Scale, Activity } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile | null;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenSystemHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isMobileView,
  setIsMobileView,
  onOpenSystemHealth
}) => {
  const tabs = [
    { id: 'scan', label: 'Scanner', icon: Scan },
    { id: 'assessment', label: 'Safety Result', icon: ShieldCheck },
    { id: 'compare', label: 'Compare Products', icon: Scale },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'knowledge', label: 'Ingredient KB', icon: Database },
    { id: 'corpus', label: 'FDA / EFSA Corpus', icon: BookOpen },
    { id: 'profile', label: 'Allergies & Profile', icon: User },
    { id: 'evaluation', label: 'Evaluation & Transparency', icon: Cpu },
    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur border-b border-[#222222] text-[#f2f2f2] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Positioning */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('scan')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-black stroke-[2.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">SafeScan AI</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#181818] text-emerald-400 border border-emerald-500/40">
                  v1.0 Beta
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 tracking-wide hidden sm:block font-medium">Deterministic Label & Allergen Safety</p>
            </div>
          </div>

          {/* Active Profile Quick Summary */}
          {profile && (
            <div className="hidden md:flex items-center space-x-2 bg-[#121212] px-3.5 py-1.5 rounded-xl border border-[#262626] text-xs">
              <span className="text-neutral-400 uppercase font-bold text-[10px] tracking-wider">Active Rules:</span>
              {profile.allergies.length > 0 ? (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md font-mono font-bold uppercase text-[11px]">
                  {profile.allergies.join(', ')}
                </span>
              ) : (
                <span className="text-neutral-300 font-medium">No declared allergies</span>
              )}
              {profile.dietType !== 'none' && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase text-[11px] tracking-wide">
                  {profile.dietType}
                </span>
              )}
            </div>
          )}

          {/* Controls: Health Panel & View Mode Switcher */}
          <div className="flex items-center space-x-2">
            <button
              id="system-status-btn"
              onClick={onOpenSystemHealth}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-all cursor-pointer"
              title="View system status and service health"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">System Health</span>
            </button>

            <button
              id="view-toggle-btn"
              onClick={() => setIsMobileView(!isMobileView)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isMobileView
                  ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-md'
                  : 'bg-[#141414] text-neutral-300 border-[#2b2b2b] hover:bg-[#222222] hover:text-white'
              }`}
              title="Toggle between Mobile App mockup and Full Desktop layout"
            >
              {isMobileView ? (
                <>
                  <Smartphone className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Mobile Preview</span>
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Expanded View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto pb-2.5 scrollbar-none text-xs border-t border-[#1c1c1c] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
