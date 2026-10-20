import React, { useState } from 'react';
import { KeyRound, RotateCcw, ShieldCheck, Terminal, MoreVertical, Smartphone, Play } from 'lucide-react';

interface StatusHeaderProps {
  badge: string;
  onOpenApiKeyModal: () => void;
  onResetQuota: () => void;
  onClearApiKey: () => void;
  onOpenApkModal: () => void;
  onReplayBoot: () => void;
  hasUserKey: boolean;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  badge,
  onOpenApiKeyModal,
  onResetQuota,
  onClearApiKey,
  onOpenApkModal,
  onReplayBoot,
  hasUserKey,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full bg-[#111111] border-b border-[#00FFE0]/30 px-3 sm:px-4 py-3 select-none z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FFE0] shadow-[0_0_8px_#00FFE0] animate-pulse" />
          <div className="flex items-baseline gap-2">
            <span className="font-mono-cyber font-bold text-sm tracking-wider text-[#00FFE0]">
              PH03N!X
            </span>
            <span className="text-[10px] tracking-widest font-mono-cyber text-[#8A8A8A] hidden sm:inline">
              ARGON 4.8 CORE
            </span>
          </div>
        </div>

        {/* Right Badge, APK Install button & Quick Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK / Install Button */}
          <button
            onClick={onOpenApkModal}
            title="Download APK or Install App"
            className="group cursor-pointer font-mono-cyber text-[11px] tracking-wide text-[#050505] bg-[#00FFE0] hover:bg-[#33ffe6] font-bold px-2.5 py-1 rounded transition-all shadow-[0_0_8px_rgba(0,255,224,0.3)] flex items-center gap-1.5 active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#050505]" />
            <span>APK // INSTALL</span>
          </button>

          {/* Main Status Badge */}
          <button
            onClick={onOpenApiKeyModal}
            title="Click to configure API Key"
            className="group cursor-pointer font-mono-cyber text-[11px] tracking-wide text-[#00FFE0] bg-[#050505]/70 border border-[#00FFE0]/30 hover:border-[#00FFE0] px-2.5 py-1 rounded transition-colors hidden xs:flex items-center gap-1.5"
          >
            <span>{badge}</span>
            <KeyRound className="w-3 h-3 text-[#00FFE0]/70 group-hover:text-[#00FFE0] transition-colors" />
          </button>

          {/* Quick Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded text-[#8A8A8A] hover:text-[#00FFE0] hover:bg-[#1A2332]/60 transition-colors cursor-pointer"
              title="System Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#00FFE0]/40 rounded-lg shadow-2xl shadow-black p-1.5 font-mono-cyber text-xs z-30"
                onClick={() => setMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] text-[#8A8A8A] border-b border-[#00FFE0]/15 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#00FFE0]" />
                  System Diagnostics
                </div>

                <button
                  onClick={onOpenApkModal}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#1A2332] rounded text-[#00FFE0] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Get Android APK</span>
                </button>

                <button
                  onClick={onOpenApiKeyModal}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#1A2332] rounded text-[#E0E0E0] hover:text-[#00FFE0] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#00FFE0]" />
                  <span>Configure API Key</span>
                </button>

                <button
                  onClick={onReplayBoot}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#1A2332] rounded text-[#E0E0E0] hover:text-[#00FFE0] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#00FFE0]" />
                  <span>Replay Boot Sequence</span>
                </button>

                {hasUserKey && (
                  <button
                    onClick={onClearApiKey}
                    className="w-full text-left px-2.5 py-2 hover:bg-[#1A2332] rounded text-[#FF4D6A] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Clear Custom Key</span>
                  </button>
                )}

                <button
                  onClick={onResetQuota}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#1A2332] rounded text-[#8A8A8A] hover:text-[#E0E0E0] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Reset Free Quota (0/20)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
