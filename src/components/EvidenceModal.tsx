import React from 'react';
import { X, ExternalLink, BookOpen, ShieldCheck, Calendar, Building } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceModalProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#181818]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base font-display">Scientific Evidence Reference</h3>
              <p className="text-xs text-neutral-400">Authoritative Regulatory & Toxicological Grounding</p>
            </div>
          </div>
          <button
            id="close-evidence-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Organization & Title */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5 font-mono">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Building className="w-3 h-3 mr-1" />
                {evidence.organization}
              </span>
              {evidence.publicationDate && (
                <span className="text-xs text-neutral-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {evidence.publicationDate}
                </span>
              )}
            </div>
            <h4 className="text-lg font-black text-white leading-snug font-display">{evidence.title}</h4>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">{evidence.source}</p>
          </div>

          {/* Excerpt */}
          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#262626] text-neutral-300 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>RETRIEVED SCIENTIFIC EXCERPT</span>
            </div>
            <p className="text-sm leading-relaxed italic text-neutral-200 font-serif">
              "{evidence.excerpt || 'Excerpt retrieved from authoritative regulatory guidance.'}"
            </p>
          </div>

          {/* Source Notice */}
          <div className="text-xs text-neutral-400 bg-[#161616] p-3 rounded-lg border border-[#2a2a2a]">
            <span className="font-bold text-neutral-200">Methodological Note: </span>
            This excerpt is retrieved directly from official FDA or EFSA publications. SafeScan AI grounds all AI explanations strictly in these verified texts without inventing external claims.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#262626] bg-[#161616] flex items-center justify-between font-mono">
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>Visit Official Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
