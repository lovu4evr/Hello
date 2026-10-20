import React, { useRef, useEffect } from 'react';
import { Send, Lock } from 'lucide-react';

interface InputBarProps {
  value: string;
  onValueChange: (val: string) => void;
  enabled: boolean;
  onSend: () => void;
  onUnlockRequest?: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({
  value,
  onValueChange,
  enabled,
  onSend,
  onUnlockRequest,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (enabled) {
      inputRef.current?.focus();
    }
  }, [enabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (enabled && value.trim()) {
        onSend();
      } else if (!enabled && onUnlockRequest) {
        onUnlockRequest();
      }
    }
  };

  const isLocked = !enabled;

  return (
    <div className="w-full bg-[#111111] border-t border-[#00FFE0]/25 p-3 sm:p-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
        <div
          onClick={() => {
            if (isLocked && onUnlockRequest) {
              onUnlockRequest();
            }
          }}
          className={`relative flex-1 flex items-center rounded-lg ${
            isLocked ? 'cursor-pointer hover:bg-white/[0.02]' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={!enabled}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              enabled ? "Transmit to Argon 4.8 (or enter 'apk')…" : 'FREE TIER LOCKED (Click to enter API key)'
            }
            className={`w-full bg-transparent px-3 py-2 text-[15px] text-[#E0E0E0] placeholder-[#8A8A8A] outline-none caret-[#00FFE0] transition-opacity ${
              !enabled ? 'opacity-70 cursor-pointer text-[#FF4D6A]' : ''
            }`}
          />
          {isLocked && (
            <button
              type="button"
              onClick={onUnlockRequest}
              className="text-xs font-mono-cyber text-[#00FFE0] flex items-center gap-1.5 px-2 py-1 bg-[#1A2332] rounded border border-[#00FFE0]/30 hover:border-[#00FFE0] mr-2 shrink-0 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#00FFE0]" />
              <span className="hidden sm:inline">UNLOCK KEY</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (enabled && value.trim()) {
              onSend();
            } else if (isLocked && onUnlockRequest) {
              onUnlockRequest();
            }
          }}
          disabled={enabled && !value.trim()}
          className={`font-mono-cyber font-bold text-xs px-4 py-2.5 rounded-[8px] transition-all flex items-center gap-1.5 select-none ${
            enabled && value.trim()
              ? 'bg-[#00FFE0] text-[#050505] hover:bg-[#33ffe6] active:scale-95 shadow-[0_0_12px_rgba(0,255,224,0.4)] cursor-pointer'
              : isLocked
              ? 'bg-[#FF4D6A]/20 text-[#FF4D6A] border border-[#FF4D6A]/40 hover:bg-[#FF4D6A]/30 cursor-pointer'
              : 'bg-[#00FFE0]/30 text-[#050505]/70 cursor-not-allowed'
          }`}
        >
          <span>{isLocked ? 'LOCKED' : 'SEND'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
