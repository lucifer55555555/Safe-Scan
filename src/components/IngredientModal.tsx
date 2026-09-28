import React from 'react';
import { X, Tag, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { Ingredient } from '../types';

interface IngredientModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient, onClose }) => {
  if (!ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#181818]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base capitalize font-display">{ingredient.canonicalName}</h3>
              <p className="text-xs text-neutral-400 capitalize font-mono">{ingredient.category} {ingredient.eNumber ? `(${ingredient.eNumber})` : ''}</p>
            </div>
          </div>
          <button
            id="close-ingredient-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Description */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-1">Description</h4>
            <p className="text-neutral-300 leading-relaxed bg-[#0a0a0a] p-3.5 rounded-xl border border-[#262626]">
              {ingredient.description}
            </p>
          </div>

          {/* Allergens Linkage */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Allergen Classification</h4>
            {ingredient.allergens && ingredient.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredient.allergens.map((alg) => (
                  <span
                    key={alg}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Major FDA Allergen: {alg.toUpperCase()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 bg-[#161616] p-2.5 rounded-lg font-mono">
                Not classified as one of the 9 major FDA food allergens.
              </p>
            )}
          </div>

          {/* Dietary Suitability */}
          {ingredient.dietaryConflicts && (
            <div>
              <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-2">Dietary Suitability</h4>
              <div className="grid grid-cols-2 gap-2 font-mono font-bold text-xs">
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  ingredient.dietaryConflicts.isVeganSafe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <span>Vegan</span>
                  {ingredient.dietaryConflicts.isVeganSafe ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  ingredient.dietaryConflicts.isVegetarianSafe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <span>Vegetarian</span>
                  {ingredient.dietaryConflicts.isVegetarianSafe ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  ingredient.dietaryConflicts.isGlutenFreeSafe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <span>Gluten-Free</span>
                  {ingredient.dietaryConflicts.isGlutenFreeSafe ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  ingredient.dietaryConflicts.isHalalSafe !== false ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <span>Halal Standard</span>
                  {ingredient.dietaryConflicts.isHalalSafe !== false ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#262626] bg-[#161616] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
