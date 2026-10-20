import React, { useState } from 'react';
import { X, Key, ShieldAlert } from 'lucide-react';

interface ApiKeyModalDialogProps {
  onSubmit: (key: string) => void;
  onDismiss: () => void;
  canDismiss?: boolean;
}

export const ApiKeyModalDialog: React.FC<ApiKeyModalDialogProps> = ({
  onSubmit,
  onDismiss,
  canDismiss = true,
}) => {
  const [keyInput, setKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSubmit(keyInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#111111] border border-[#00FFE0] rounded-[16px] p-6 shadow-[0_0_30px_rgba(0,255,224,0.25)] relative text-left"
        role="dialog"
        aria-modal="true"
      >
        {canDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#00FFE0] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-[#00FFE0]" />
          <h2 className="font-mono-cyber font-bold text-sm text-[#00FFE0] tracking-wide">
            FREE TIER EXHAUSTED (20/20)
          </h2>
        </div>

        <p className="font-mono-cyber text-xs text-[#E0E0E0] mb-5 tracking-wide">
          ENTER ARGON 4.8 API KEY
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-argon-••••••••"
              className="w-full bg-[#050505] border border-[#00FFE0]/50 focus:border-[#00FFE0] rounded-[8px] p-3.5 font-mono-cyber text-[13px] text-[#E0E0E0] placeholder-[#8A8A8A] outline-none caret-[#00FFE0] transition-all shadow-inner"
            />
            <Key className="w-4 h-4 text-[#8A8A8A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <p className="text-[11px] font-mono-cyber text-[#8A8A8A] leading-normal">
            Your key will be securely saved locally to bypass standard free pool rate limits.
          </p>

          <button
            type="submit"
            disabled={!keyInput.trim()}
            className={`w-full py-3 px-4 rounded-[8px] font-mono-cyber font-bold text-[13px] tracking-wider transition-all select-none ${
              keyInput.trim()
                ? 'bg-[#00FFE0] text-[#050505] hover:bg-[#33ffe6] active:scale-[0.99] shadow-[0_0_15px_rgba(0,255,224,0.35)] cursor-pointer'
                : 'bg-[#00FFE0]/30 text-[#050505]/60 cursor-not-allowed'
            }`}
          >
            ACTIVATE KEY
          </button>
        </form>
      </div>
    </div>
  );
};
