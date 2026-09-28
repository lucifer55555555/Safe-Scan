import React, { useEffect, useState } from 'react';
import { History, Search, Calendar, ChevronRight, AlertOctagon, CheckCircle2, AlertTriangle, HelpCircle, RotateCcw } from 'lucide-react';
import { fetchScanHistory } from '../../services/apiClient';
import { AssessmentResponse, ScanRecord } from '../../types';

interface HistoryScreenProps {
  onSelectAssessment: (assessment: AssessmentResponse) => void;
  setActiveTab: (tab: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onSelectAssessment,
  setActiveTab
}) => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const records = await fetchScanHistory('usr_demo_walkthrough');
      setHistory(records);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = history.filter(
    (h) =>
      h.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.brand && h.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRiskIcon = (risk: string) => {
    if (risk === 'CRITICAL') return <AlertOctagon className="w-4 h-4 text-rose-400" />;
    if (risk === 'WARNING' || risk === 'CAUTION') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (risk === 'UNKNOWN') return <HelpCircle className="w-4 h-4 text-slate-400" />;
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">Scan History & Assessment Log</h1>
            <p className="text-xs sm:text-sm text-neutral-400">Review past scans, detected allergen flags, and RAG citations.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scans..."
            className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-neutral-500 text-sm font-mono">Loading scan history...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <History className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-neutral-200 font-bold font-display">No scan records found</p>
          <p className="text-xs text-neutral-500">Scan any product from the Scanner tab to record safety assessments here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const risk = record.assessment.risk_level;
            const isCritical = risk === 'CRITICAL';
            return (
              <div
                key={record.id}
                onClick={() => {
                  onSelectAssessment(record.assessment);
                  setActiveTab('assessment');
                }}
                className={`p-4 rounded-xl border bg-[#121212] hover:bg-[#181818] transition-all cursor-pointer flex items-center justify-between group ${
                  isCritical ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-[#262626] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] flex items-center justify-center border border-[#262626]">
                    {getRiskIcon(risk)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors font-display">
                        {record.productName}
                      </h3>
                      {record.brand && <span className="text-xs text-neutral-400 font-mono uppercase">• {record.brand}</span>}
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-neutral-400 mt-1">
                      <span className="flex items-center space-x-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="capitalize text-neutral-500 font-mono text-[10px]">via {record.scanMethod}</span>
                      {record.assessment.conflicts.length > 0 && (
                        <span className="text-rose-400 font-bold font-mono">
                          {record.assessment.conflicts.length} conflict(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : risk === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {risk}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
