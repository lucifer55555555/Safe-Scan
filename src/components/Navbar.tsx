import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Scan,
  History,
  User,
  Database,
  BookOpen,
  ShieldAlert,
  Cpu,
  Smartphone,
  Monitor,
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
  Shield
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
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
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      dietType: 'dairy-free' as const,
      allergies: ['milk'],
      avoidIngredients: ['casein', 'whey', 'lactose']
    },
    {
      id: 'clean',
      name: 'Clean (No Restrictions)',
      subtitle: 'Standard Diet / No Active Rules',
      icon: Shield,
      color: 'text-neutral-300 bg-neutral-800 border-neutral-700',
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

  // Primary Consumer Tabs
  const primaryTabs = [
    { id: 'scan', label: 'Scanner', icon: Scan },
    { id: 'assessment', label: 'Safety Result', icon: ShieldCheck },
    { id: 'compare', label: 'Compare Brands', icon: Scale },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'profile', label: 'My Health Profile', icon: User }
  ];

  // Secondary Regulatory / Lab Tabs
  const labTabs = [
    { id: 'knowledge', label: 'Ingredient KB', icon: Database, desc: 'Curated 1,200+ food additives & taxonomy' },
    { id: 'corpus', label: 'FDA / EFSA Corpus', icon: BookOpen, desc: 'Regulatory safety evidence & FALCPA' },
    { id: 'evaluation', label: 'Audits & Eval', icon: Cpu, desc: 'Model benchmarks & deterministic checks' },
    { id: 'admin', label: 'Admin Telemetry', icon: ShieldAlert, desc: 'Quarantine tail & unresolved review' }
  ];

  const isLabTabActive = labTabs.some((t) => t.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#222222] text-[#f2f2f2] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('scan')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-black stroke-[2.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">
                  SafeScan <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#181818] text-emerald-400 border border-emerald-500/40">
                  v1.0 Beta
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 tracking-wide hidden sm:block font-medium">
                Deterministic Label & Allergen Safety
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher in Header */}
          {profile && (
            <div className="relative" ref={personaRef}>
              <button
                type="button"
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="hidden md:flex items-center space-x-2 bg-[#121212] hover:bg-[#181818] px-3.5 py-1.5 rounded-xl border border-[#2a2a2a] text-xs transition-all cursor-pointer group"
                title="Click to quickly switch test personas (Allergies & Diet)"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-400 uppercase font-bold text-[10px] tracking-wider">
                  Profile:
                </span>
                {profile.allergies.length > 0 ? (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md font-mono font-bold uppercase text-[10px]">
                    {profile.allergies.join(', ')}
                  </span>
                ) : (
                  <span className="text-neutral-300 text-[11px]">No allergies</span>
                )}
                {profile.dietType !== 'none' && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
                    {profile.dietType}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
              </button>

              {/* Persona Switcher Dropdown */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121212] border border-[#2c2c2c] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[#222]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Quick Switch Persona
                      </span>
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Test product assessments under different health profiles:
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
                              ? 'bg-emerald-500/15 border border-emerald-500/40'
                              : 'hover:bg-[#1a1a1a]'
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
                              <p className="text-[10px] text-neutral-400 leading-tight">
                                {preset.subtitle}
                              </p>
                            </div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 mt-1 border-t border-[#222]">
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
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

        {/* Navigation Tabs Bar — Clean & Non-Overflowing */}
        <nav className="flex items-center justify-between pb-2.5 text-xs border-t border-[#1c1c1c] pt-2 gap-2 overflow-x-auto scrollbar-none">
          {/* Primary Consumer Tabs */}
          <div className="flex items-center space-x-1.5">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all cursor-pointer ${
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
          </div>

          {/* Regulatory & Lab Dropdown Menu (Prevents overflow truncation) */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs border transition-all cursor-pointer ${
                isLabTabActive
                  ? 'bg-[#1c1c1c] text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-[#141414]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden md:inline">Regulatory & Lab</span>
              <span className="md:hidden">Lab</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#121212] border border-[#2c2c2c] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-[#222]">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                    Scientific & Regulatory Tools
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {labTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'hover:bg-[#1a1a1a] text-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {tab.label}
                          </p>
                          <p className="text-[10px] text-neutral-400 leading-tight">
                            {tab.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
