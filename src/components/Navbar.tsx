import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Scan,
  History,
  User,
  Scale,
  Activity,
  ChevronDown,
  Sparkles,
  Check,
  FlaskConical,
  Flame,
  Leaf,
  Wheat,
  Milk,
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenSystemHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onUpdateProfile,
  isMobileView,
  setIsMobileView,
  onOpenSystemHealth
}) => {
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  // Close persona dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Persona Presets for testing & demoing
  const personaPresets = [
    {
      id: 'peanut-veg',
      name: 'Peanut Allergy + Vegetarian',
      subtitle: 'Default Demo Profile',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      dietType: 'vegetarian' as const,
      allergies: ['peanut'],
      avoidIngredients: ['titanium dioxide', 'palm oil']
    },
    {
      id: 'vegan',
      name: 'Strict Vegan (Plant-Based)',
      subtitle: 'Zero Dairy, Gelatin or Animal Fats',
      icon: Leaf,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      dietType: 'vegan' as const,
      allergies: [],
      avoidIngredients: ['gelatin', 'carmine', 'lard']
    },
    {
      id: 'gluten-free',
      name: 'Celiac / Gluten-Free',
      subtitle: 'Strict Wheat, Barley & Rye Avoidance',
      icon: Wheat,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      dietType: 'gluten-free' as const,
      allergies: ['wheat'],
      avoidIngredients: ['barley', 'rye', 'malt']
    },
    {
      id: 'dairy-free',
      name: 'Lactose / Dairy Intolerant',
      subtitle: 'Milk, Whey & Casein Free',
      icon: Milk,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      dietType: 'dairy-free' as const,
      allergies: ['milk'],
      avoidIngredients: ['casein', 'whey', 'lactose']
    },
    {
      id: 'clean',
      name: 'Clean (No Restrictions)',
      subtitle: 'Standard Diet / No Active Rules',
      icon: Shield,
      color: 'text-slate-300 bg-slate-800 border-slate-700',
      dietType: 'none' as const,
      allergies: [],
      avoidIngredients: []
    }
  ];

  const handleSelectPersona = (preset: typeof personaPresets[0]) => {
    if (onUpdateProfile && profile) {
      onUpdateProfile({
        ...profile,
        dietType: preset.dietType,
        allergies: preset.allergies,
        avoidIngredients: preset.avoidIngredients
      });
    }
    setIsPersonaMenuOpen(false);
  };

  // First-Class Tabs: All 6 are directly clickable with 0 clipping bugs!
  const navTabs = [
    { id: 'scan', label: 'Scanner', icon: Scan },
    { id: 'assessment', label: 'Safety Result', icon: ShieldCheck },
    { id: 'compare', label: 'Compare Brands', icon: Scale },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'profile', label: 'Health Profile', icon: User },
    { id: 'lab', label: 'Regulatory & Lab', icon: FlaskConical, isLab: true }
  ];

  const isLabActive =
    activeTab === 'lab' ||
    activeTab === 'knowledge' ||
    activeTab === 'corpus' ||
    activeTab === 'evaluation' ||
    activeTab === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#060911]/95 backdrop-blur-md border-b border-[#1e293b] text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Glowing Gradient */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('scan')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-black stroke-[2.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">
                  SafeScan <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0f172a] text-cyan-400 border border-cyan-500/30">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block font-medium">
                Deterministic Allergen & Regulatory Safety
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher in Header */}
          {profile && (
            <div className="relative" ref={personaRef}>
              <button
                type="button"
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="hidden md:flex items-center space-x-2 bg-[#0c1427] hover:bg-[#111c38] px-3.5 py-1.5 rounded-xl border border-[#1e293b] hover:border-cyan-500/40 text-xs transition-all cursor-pointer group shadow-inner"
                title="Click to quickly switch test personas (Allergies & Diet)"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  Profile:
                </span>
                {profile.allergies.length > 0 ? (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md font-mono font-bold uppercase text-[10px]">
                    {profile.allergies.join(', ')}
                  </span>
                ) : (
                  <span className="text-slate-300 text-[11px]">No allergies</span>
                )}
                {profile.dietType !== 'none' && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
                    {profile.dietType}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Persona Switcher Dropdown */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0c1427] border border-[#1e293b] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        Quick Switch Persona
                      </span>
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Simulate safety assessments under different health profiles:
                    </p>
                  </div>
                  <div className="space-y-1 mt-1">
                    {personaPresets.map((preset) => {
                      const Icon = preset.icon;
                      const isCurrent =
                        profile.dietType === preset.dietType &&
                        JSON.stringify(profile.allergies.sort()) === JSON.stringify(preset.allergies.sort());
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleSelectPersona(preset)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-cyan-500/15 border border-cyan-500/40'
                              : 'hover:bg-[#121c33]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${preset.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">
                                {preset.name}
                              </p>
                              <p className="text-[10px] text-slate-400 leading-tight">
                                {preset.subtitle}
                              </p>
                            </div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      Customize Exact Allergies & Rules →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls: Health Panel & View Mode Switcher */}
          <div className="flex items-center space-x-2">
            <button
              id="system-status-btn"
              onClick={onOpenSystemHealth}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
              title="View system status and service health"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">System Health</span>
            </button>

            <button
              id="view-toggle-btn"
              onClick={() => setIsMobileView(!isMobileView)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isMobileView
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black border-cyan-400 font-extrabold shadow-md'
                  : 'bg-[#0c1427] text-slate-300 border-[#1e293b] hover:bg-[#141f38] hover:text-white'
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

        {/* Navigation Tabs Bar — All Tabs Directly Clickable with 0 Overflow Clipping! */}
        <nav className="flex items-center space-x-1.5 overflow-x-auto pb-2.5 scrollbar-none text-xs border-t border-slate-800/80 pt-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.isLab ? isLabActive : activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#0c1427] border border-transparent hover:border-[#1e293b]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 stroke-[2.5] ${isActive ? 'text-black' : tab.isLab ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.isLab && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-black/20 text-black' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    Suite
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
