import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, CheckCircle2 } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'BOOTSTRAP: Initializing PH03N!X Kernel v4.8.0-PROD',
  'SUBSYSTEM: Calibrating Neural Attention Weights (1024 Layers)',
  'SECURITY: Mounting Local Secure Quota Vault (AES-256-GCM)',
  'TRANSMISSION: Binding Argon 4.8 Bearer Protocol Uplink',
  'SYSTEM: All nodes synchronized. Terminal ready for input.',
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Log index step
    const stepInterval = setInterval(() => {
      setLogIndex((prev) => {
        if (prev < BOOT_LOGS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 400);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Allow ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFadingOut(true);
        setTimeout(onComplete, 200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-4 select-none overflow-hidden transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cyber Grid & CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 224, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 224, 0.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/25 via-black/80 to-[#050505]" />

      {/* Cyber Scanning Laser Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFE0] to-transparent shadow-[0_0_15px_#00FFE0] animate-[scanline_3s_ease-in-out_infinite]" />

      {/* Main Terminal Emblem & Sequence Card */}
      <div className="relative z-10 w-full max-w-md bg-[#111111]/90 border border-[#00FFE0]/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,224,0.15)] flex flex-col items-center text-center">
        {/* Pulsing Holographic Icon */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-[#050505] border-2 border-[#00FFE0] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,224,0.35)] relative overflow-hidden">
            <Terminal className="w-10 h-10 text-[#00FFE0] animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFE0]/20 to-transparent pointer-events-none" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#050505] border border-[#00FFE0] flex items-center justify-center shadow-[0_0_8px_#00FFE0]">
            <Zap className="w-3.5 h-3.5 text-[#00FFE0]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-mono-cyber font-extrabold text-xl sm:text-2xl tracking-widest text-[#00FFE0] mb-1">
          PH03N!X // ARGON 4.8
        </h1>
        <p className="font-mono-cyber text-[11px] text-[#8A8A8A] tracking-wider uppercase mb-6 flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-[#00FFE0]" />
          NEURAL TERMINAL INTERFACE SYSTEM
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <div className="flex justify-between font-mono-cyber text-[11px] text-[#00FFE0] mb-1.5">
            <span>SYNCHRONIZING MATRIX</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#050505] border border-[#00FFE0]/30 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-[#00FFE0] to-[#38bdf8] rounded-full transition-all duration-100 shadow-[0_0_10px_#00FFE0]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Telemetry Log Terminal Stream */}
        <div className="w-full bg-[#050505] border border-[#00FFE0]/25 rounded-lg p-3 text-left font-mono-cyber text-[11px] h-24 overflow-hidden flex flex-col justify-end space-y-1">
          {BOOT_LOGS.slice(0, logIndex + 1).map((log, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 truncate ${
                i === logIndex ? 'text-[#00FFE0] font-bold' : 'text-[#8A8A8A]'
              }`}
            >
              {i === logIndex ? (
                <span className="animate-pulse">►</span>
              ) : (
                <CheckCircle2 className="w-2.5 h-2.5 text-[#00FFE0]/70 shrink-0" />
              )}
              <span className="truncate">{log}</span>
            </div>
          ))}
        </div>

        {/* Bypass Button */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 200);
          }}
          className="mt-6 font-mono-cyber text-xs tracking-wider text-[#8A8A8A] hover:text-[#00FFE0] border border-transparent hover:border-[#00FFE0]/30 px-4 py-1.5 rounded transition-all cursor-pointer select-none"
        >
          [ BYPASS INITIALIZATION // ESC ]
        </button>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
