import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="w-full flex justify-start items-center gap-2.5 my-2">
      <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#00FFE0]/50 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(0,255,224,0.2)]">
        <Bot className="w-4 h-4 text-[#00FFE0]" />
      </div>

      <div className="rounded-[12px] bg-[#111111] border border-[#00FFE0]/30 px-4 py-3 shadow-[0_0_12px_rgba(0,255,224,0.06)] flex items-center gap-2">
        <span className="font-mono-cyber text-[13px] text-[#00FFE0] tracking-wider flex items-center">
          ARGON 4.8&nbsp;
          <span className="inline-block animate-pulse text-[#00FFE0] font-bold">▌</span>
        </span>
      </div>
    </div>
  );
};
