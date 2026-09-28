import React, { useState } from 'react';
import { User, AlertTriangle, Check, Plus, X, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { FDA_ALLERGENS } from '../../data/seedIngredients';
import { updateProfile } from '../../services/apiClient';
import { DietType, UserProfile } from '../../types';

interface ProfileScreenProps {
  profile: UserProfile | null;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onProfileUpdated }) => {
  const [dietType, setDietType] = useState<DietType>(profile?.dietType || 'vegetarian');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(profile?.allergies || ['peanut']);
  const [avoidList, setAvoidList] = useState<string[]>(profile?.avoidIngredients || ['titanium dioxide', 'palm oil']);
  const [newAvoidItem, setNewAvoidItem] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleAllergen = (allergenName: string) => {
    const clean = allergenName.toLowerCase();
    if (selectedAllergies.includes(clean)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== clean));
    } else {
      setSelectedAllergies([...selectedAllergies, clean]);
    }
  };

  const handleAddAvoidItem = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newAvoidItem.trim().toLowerCase();
    if (clean && !avoidList.includes(clean)) {
      setAvoidList([...avoidList, clean]);
      setNewAvoidItem('');
    }
  };

  const handleRemoveAvoidItem = (itemToRemove: string) => {
    setAvoidList(avoidList.filter((item) => item !== itemToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      const updated = await updateProfile(profile?.userId || 'usr_demo_walkthrough', {
        dietType,
        allergies: selectedAllergies,
        avoidIngredients: avoidList
      });
      onProfileUpdated(updated);
      setSuccessMessage('Profile and dietary safety rules saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const diets: { id: DietType; label: string; desc: string }[] = [
    { id: 'vegetarian', label: 'Vegetarian', desc: 'Strictly excludes meat, poultry, fish, gelatin, and carmine' },
    { id: 'vegan', label: 'Vegan (Plant-Based)', desc: 'Excludes all animal-derived foods (dairy, egg, honey, gelatin)' },
    { id: 'gluten-free', label: 'Gluten-Free', desc: 'Restricts wheat, barley, rye, semolina, and spelt' },
    { id: 'halal', label: 'Halal Standards', desc: 'Excludes porcine gelatin, lard, non-halal meat derivatives' },
    { id: 'kosher', label: 'Kosher Standards', desc: 'Complies with kosher dietary restrictions' },
    { id: 'dairy-free', label: 'Dairy-Free', desc: 'Excludes all lactose, casein, whey, and bovine milk proteins' },
    { id: 'none', label: 'No Strict Diet', desc: 'Standard omnivorous diet with no general restrictions' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">Allergy & Dietary Safety Profile</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Deterministic safety rules evaluate products directly against these active preferences.
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs sm:text-sm text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* 1. FDA 9 MAJOR ALLERGENS SELECTION */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center space-x-2 font-display">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>FDA 9 Major Food Allergens</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select any declared food allergies. The engine triggers a CRITICAL safety alert on any direct or derivative match.
            </p>
          </div>
          <span className="text-xs bg-rose-500/10 text-rose-300 font-mono font-bold px-2.5 py-0.5 rounded-md border border-rose-500/30">
            {selectedAllergies.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FDA_ALLERGENS.map((alg) => {
            const isSelected = selectedAllergies.includes(alg.name.toLowerCase());
            return (
              <div
                key={alg.id}
                onClick={() => toggleAllergen(alg.name)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/60 text-white shadow-md shadow-rose-500/10'
                    : 'bg-[#0a0a0a] border-[#222] text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm capitalize font-display">{alg.name}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-rose-500 border-rose-500 text-black' : 'border-[#333] bg-[#141414]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2">{alg.description}</p>
                <span className="text-[10px] text-neutral-500 mt-2 block font-mono">
                  e.g. {alg.commonDerivatives.slice(0, 2).join(', ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DIETARY LIFESTYLE / PREFERENCES */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">Dietary Lifestyle / Restriction</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {diets.map((d) => {
            const isSelected = dietType === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setDietType(d.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 select-none ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-[#0a0a0a] border-[#222] text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 ${
                    isSelected ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-[#333] bg-[#141414]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-display">{d.label}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{d.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FREE-TEXT INGREDIENTS TO AVOID */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">Custom Ingredients to Avoid</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Add specific additives, preservatives, sweeteners, or colors you wish to restrict (e.g. "titanium dioxide", "aspartame", "palm oil").
            </p>
          </div>
        </div>

        <form onSubmit={handleAddAvoidItem} className="flex gap-2">
          <input
            type="text"
            value={newAvoidItem}
            onChange={(e) => setNewAvoidItem(e.target.value)}
            placeholder="Type ingredient name and press Add..."
            className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-neutral-600 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-neutral-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 border border-[#333] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {avoidList.map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveAvoidItem(item)}
                className="ml-2 text-amber-400 hover:text-amber-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {avoidList.length === 0 && (
            <span className="text-xs text-neutral-500 italic">No custom avoid ingredients added.</span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Profile...' : 'Save Safety Profile'}</span>
        </button>
      </div>
    </div>
  );
};
