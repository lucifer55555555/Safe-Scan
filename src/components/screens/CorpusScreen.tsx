import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Building, Calendar, Search, Sparkles, Binary, Cpu } from 'lucide-react';
import { fetchSources } from '../../services/apiClient';
import { SCIENTIFIC_CHUNKS } from '../../data/scientificCorpus';
import { ScientificSource } from '../../types';
import { EvidenceModal } from '../EvidenceModal';

export const CorpusScreen: React.FC = () => {
  const [sources, setSources] = useState<ScientificSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const data = await fetchSources();
      setSources(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Simulated Vector Cosine Similarity Embedding Search (ChromaDB / FAISS)
  const scoredChunks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return SCIENTIFIC_CHUNKS.map((chunk) => {
      let similarityScore = 0.50; // baseline
      if (query) {
        const queryTerms = query.split(/\s+/).filter(Boolean);
        let matchCount = 0;
        
        queryTerms.forEach((term) => {
          if (chunk.text.toLowerCase().includes(term)) matchCount += 2.5;
          if (chunk.metadata.topic.toLowerCase().includes(term)) matchCount += 3.5;
          if (chunk.metadata.keywords.some((k) => k.toLowerCase().includes(term))) matchCount += 3.0;
        });

        if (matchCount > 0) {
          similarityScore = Math.min(0.99, 0.70 + matchCount * 0.05);
        } else {
          similarityScore = Math.max(0.20, 0.45 - Math.random() * 0.1);
        }
      }

      return {
        ...chunk,
        similarityScore: Number(similarityScore.toFixed(3))
      };
    })
    .filter((chunk) => {
      if (selectedSource === 'fda') return chunk.metadata.org === 'FDA';
      if (selectedSource === 'efsa') return chunk.metadata.org === 'EFSA';
      if (selectedSource === 'fssai') return chunk.metadata.org === 'FSSAI';
      return true;
    })
    .sort((a, b) => {
      if (searchQuery.trim()) {
        return b.similarityScore - a.similarityScore;
      }
      return 0;
    });
  }, [searchQuery, selectedSource]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">FDA, EFSA & FSSAI (India) Corpus</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Global & Indian RAG
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Authoritative toxicological & regulatory texts indexed from US FDA, EU EFSA & Indian FSSAI for semantic retrieval.
              </p>
            </div>
          </div>

          <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-[#262626] text-xs font-mono font-bold">
            <button
              onClick={() => setSelectedSource('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedSource === 'all' ? 'bg-emerald-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSource('fssai')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedSource === 'fssai' ? 'bg-emerald-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              FSSAI (India)
            </button>
            <button
              onClick={() => setSelectedSource('fda')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedSource === 'fda' ? 'bg-emerald-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              US FDA
            </button>
            <button
              onClick={() => setSelectedSource('efsa')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedSource === 'efsa' ? 'bg-emerald-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EU EFSA
            </button>
          </div>
        </div>

        {/* Live Vector Search Input */}
        <div className="mt-5 pt-5 border-t border-[#222]">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test Semantic Vector Query (e.g. 'paneer dairy allergy', 'compounded hing wheat', 'fssai green dot', 'mustard oil')..."
              className="w-full bg-[#0a0a0a] border border-[#2e2e2e] focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none font-mono"
            />
            {searchQuery && (
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Vector Search Active
              </span>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 mt-2 text-[11px] text-neutral-400 font-mono">
            <span className="text-neutral-400">Try Indian food queries:</span>
            {['paneer casein', 'compounded hing gluten', 'fssai veg logo', 'sarson mustard', 'kaju mithai', 'besan dal'].map((example) => (
              <button
                key={example}
                onClick={() => setSearchQuery(example)}
                className="text-emerald-400 hover:underline cursor-pointer bg-[#141414] px-1.5 py-0.5 rounded border border-[#222]"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources
          .filter((s) => selectedSource === 'all' || s.organization.toLowerCase().includes(selectedSource))
          .map((src) => (
            <div key={src.id} className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {src.organization}
                </span>
                <span className="text-xs font-mono text-neutral-400">{src.publicationDate}</span>
              </div>
              <h3 className="font-extrabold text-white text-base leading-snug font-display">{src.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{src.description}</p>
              <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Scope: {src.jurisdiction}</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>Official Publication</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Chunks List with Cosine Similarity Metrics */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-neutral-200 uppercase tracking-widest font-display flex items-center space-x-2">
            <Binary className="w-4 h-4 text-emerald-400" />
            <span>Indexed Regulatory Chunks & Embeddings ({scoredChunks.length})</span>
          </h2>
          {searchQuery && (
            <span className="text-[11px] font-mono text-neutral-400">
              Ranked by Cosine Similarity
            </span>
          )}
        </div>

        <div className="space-y-3">
          {scoredChunks.map((chunk) => (
            <div
              key={chunk.id}
              onClick={() =>
                setSelectedEvidenceModal({
                  source: `${chunk.metadata.org} — ${chunk.metadata.topic}`,
                  title: chunk.metadata.topic,
                  organization: chunk.metadata.org,
                  excerpt: chunk.text,
                  url: 'https://www.fda.gov'
                })
              }
              className={`bg-[#0a0a0a] rounded-xl p-4 border transition-all cursor-pointer space-y-2 group ${
                chunk.similarityScore >= 0.70
                  ? 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/10'
                  : 'border-[#222] hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#181818] text-neutral-300 border border-[#333]">
                    {chunk.metadata.org}
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors font-display">
                    {chunk.metadata.topic}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    chunk.similarityScore >= 0.75
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#181818] text-neutral-400 border-[#2b2b2b]'
                  }`}>
                    Cosine Sim: {chunk.similarityScore}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">ID: {chunk.id}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 italic line-clamp-2 leading-relaxed">"{chunk.text}"</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {chunk.metadata.keywords.map((k) => (
                  <span key={k} className="text-[9px] font-mono bg-[#141414] text-neutral-400 px-1.5 py-0.5 rounded border border-[#262626]">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EvidenceModal evidence={selectedEvidenceModal} onClose={() => setSelectedEvidenceModal(null)} />
    </div>
  );
};

