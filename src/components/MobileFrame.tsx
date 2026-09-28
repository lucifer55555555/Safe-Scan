import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileView: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isMobileView, children }) => {
  if (!isMobileView) {
    return <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-6 px-2 bg-[#040404]">
      <div className="relative w-full max-w-[420px] h-[840px] bg-[#0c0c0c] rounded-[44px] shadow-2xl border-[8px] border-[#1f1f1f] flex flex-col overflow-hidden ring-1 ring-[#333]/50">
        {/* Phone Notch & Status Bar */}
        <div className="h-10 bg-[#0c0c0c] border-b border-[#1f1f1f] px-6 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0 z-30 font-mono font-bold">
          <span className="text-white">9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5 text-neutral-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-6 bg-[#0c0c0c] flex items-center justify-center shrink-0 border-t border-[#1a1a1a]">
          <div className="w-32 h-1 bg-neutral-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

