import React, { useEffect, useState } from 'react';
import { Database, Search, Tag, AlertTriangle, CheckCircle, HelpCircle, Layers } from 'lucide-react';
import { fetchIngredients } from '../../services/apiClient';
import { Ingredient } from '../../types';
import { IngredientModal } from '../IngredientModal';

export const KnowledgeBaseScreen: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeIngredient, setActiveIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    loadData(query);
  }, [query]);

  const loadData = async (q: string) => {
    setIsLoading(true);
    try {
      const data = await fetchIngredients(q);
      setIngredients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'cereal', 'dairy', 'legume', 'nut', 'additive', 'colorant', 'sweetener', 'oil'];

  const filtered = ingredients.filter((ing) => {
    if (selectedCategory !== 'all' && ing.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">Ingredient Knowledge Base & Alias Dictionary</h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Curated taxonomy of 350+ ingredients, international E-numbers, and allergen linkages.
              </p>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ingredient or E-number..."
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-1.5 overflow-x-auto pt-4 mt-4 border-t border-[#222] scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-mono font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'bg-[#0a0a0a] text-neutral-400 hover:text-white border border-[#222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-neutral-500 text-sm font-mono">Searching knowledge base...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center text-neutral-400 font-mono">
          No ingredients matched your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((ing) => {
            const hasAllergen = ing.allergens && ing.allergens.length > 0;
            return (
              <div
                key={ing.id}
                onClick={() => setActiveIngredient(ing)}
                className="bg-[#121212] rounded-xl p-4 border border-[#262626] hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.01]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-white text-sm capitalize group-hover:text-emerald-400 transition-colors font-display">
                      {ing.canonicalName}
                    </h3>
                    {ing.eNumber && (
                      <span className="text-[10px] font-mono bg-[#1a1a1a] text-neutral-300 px-1.5 py-0.5 rounded border border-[#333]">
                        {ing.eNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{ing.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-neutral-500 capitalize">{ing.category}</span>
                  {hasAllergen ? (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                      {ing.allergens.join(', ')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Standard</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <IngredientModal ingredient={activeIngredient} onClose={() => setActiveIngredient(null)} />
    </div>
  );
};
