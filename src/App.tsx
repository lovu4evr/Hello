import React, { useState, useRef, useEffect } from 'react';
import { useChatViewModel } from './hooks/useChatViewModel';
import { StatusHeader } from './components/StatusHeader';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { InputBar } from './components/InputBar';
import { ApiKeyModalDialog } from './components/ApiKeyModalDialog';
import { BootSequence } from './components/BootSequence';
import { ApkModal } from './components/ApkModal';
import { Terminal, Cpu, Zap, Shield, Smartphone, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    messages,
    uiState,
    quotaBadge,
    showApiKeyDialog,
    sendMessage,
    retryLastFailedMessage,
    lastFailedText,
    submitApiKey,
    dismissApiKeyDialog,
    forceShowApiKeyDialog,
    resetQuotaForTesting,
    clearApiKey,
    hasUserKey,
  } = useChatViewModel();

  const [inputText, setInputText] = useState('');
  const [showBootSequence, setShowBootSequence] = useState<boolean>(() => {
    // Check if user has already seen the boot animation in this tab session
    const seen = sessionStorage.getItem('ph03n1x_boot_seen');
    return !seen;
  });
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, uiState]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleBootComplete = () => {
    sessionStorage.setItem('ph03n1x_boot_seen', 'true');
    setShowBootSequence(false);
  };

  const handleReplayBoot = () => {
    setShowBootSequence(true);
  };

  const isInputEnabled =
    uiState.status !== 'loading' && uiState.status !== 'apiKeyRequired';

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-[#E0E0E0] overflow-hidden select-text relative">
      {/* High-Fidelity Cyberpunk Entry Boot Sequence */}
      {showBootSequence && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Status Bar / Top Header */}
      <StatusHeader
        badge={quotaBadge}
        onOpenApiKeyModal={forceShowApiKeyDialog}
        onResetQuota={resetQuotaForTesting}
        onClearApiKey={clearApiKey}
        onOpenApkModal={() => setShowApkModal(true)}
        onReplayBoot={handleReplayBoot}
        hasUserKey={hasUserKey}
      />

      {/* Main Chat Stream Container */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 w-full">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
          {/* Empty State / Terminal Intro */}
          {messages.length === 0 && (
            <div className="my-auto py-8 sm:py-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#00FFE0]/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,255,224,0.2)]">
                  <Terminal className="w-8 h-8 text-[#00FFE0]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#050505] border border-[#00FFE0] flex items-center justify-center">
                  <Cpu className="w-3 h-3 text-[#00FFE0]" />
                </div>
              </div>

              <h1 className="font-mono-cyber font-bold text-lg sm:text-xl text-[#00FFE0] tracking-wider mb-2">
                PH03N!X // ARGON 4.8
              </h1>
              <p className="font-mono-cyber text-xs text-[#8A8A8A] max-w-md leading-relaxed mb-6">
                Neural cognitive synthesis online. 20 free tier transmission units active per session. Enter your custom Argon API key for continuous throughput.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left font-mono-cyber text-xs">
                <button
                  onClick={() => sendMessage('apk')}
                  className="p-3 bg-[#111111] border border-[#00FFE0]/30 hover:border-[#00FFE0] rounded-xl hover:bg-[#1A2332]/50 transition-colors text-[#00FFE0] flex items-start gap-2 cursor-pointer group"
                >
                  <Smartphone className="w-4 h-4 text-[#00FFE0] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">&gt; apk <span className="font-normal text-[#8A8A8A] text-[11px] block sm:inline">(Package & Download Android APK)</span></span>
                </button>

                <button
                  onClick={() => sendMessage('Run neural diagnostic on Argon 4.8 core capabilities.')}
                  className="p-3 bg-[#111111] border border-[#00FFE0]/20 hover:border-[#00FFE0] rounded-xl hover:bg-[#1A2332]/50 transition-colors text-[#E0E0E0] flex items-start gap-2 cursor-pointer group"
                >
                  <Zap className="w-4 h-4 text-[#00FFE0] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>"Run neural diagnostic on Argon 4.8"</span>
                </button>

                <button
                  onClick={() => setShowApkModal(true)}
                  className="sm:col-span-2 p-3 bg-[#111111] border border-[#00FFE0]/40 hover:border-[#00FFE0] rounded-xl hover:bg-[#00FFE0]/10 transition-colors text-[#00FFE0] flex items-center justify-center gap-2 cursor-pointer group font-bold shadow-[0_0_15px_rgba(0,255,224,0.1)]"
                >
                  <Smartphone className="w-4 h-4 text-[#00FFE0] group-hover:scale-110 transition-transform" />
                  <span>Open Android APK & WebAPK Installation Center</span>
                </button>
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="flex flex-col gap-2.5 w-full">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onOpenApkModal={() => setShowApkModal(true)}
              />
            ))}

            {/* Typing Indicator when Bot is Processing */}
            {uiState.status === 'loading' && <TypingIndicator />}
          </div>

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Error Banner with Working Retry */}
      {uiState.status === 'error' && (
        <div className="bg-[#111111] border-t border-[#FF4D6A]/40 px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-mono-cyber text-[#FF4D6A]">
            <span className="truncate pr-2">{uiState.message}</span>
            <button
              onClick={() => retryLastFailedMessage()}
              className="text-[11px] font-bold text-[#00FFE0] hover:text-white shrink-0 flex items-center gap-1.5 cursor-pointer bg-[#1A2332] px-2.5 py-1 rounded border border-[#00FFE0]/30 hover:border-[#00FFE0] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Input Bar */}
      <InputBar
        value={inputText}
        onValueChange={setInputText}
        enabled={isInputEnabled}
        onSend={handleSend}
        onUnlockRequest={forceShowApiKeyDialog}
      />

      {/* Modal Dialog for API Key */}
      {showApiKeyDialog && (
        <ApiKeyModalDialog
          onSubmit={submitApiKey}
          onDismiss={dismissApiKeyDialog}
          canDismiss={hasUserKey || uiState.status !== 'apiKeyRequired'}
        />
      )}

      {/* Modal Dialog for APK & Android Installation */}
      {showApkModal && (
        <ApkModal onDismiss={() => setShowApkModal(false)} />
      )}
    </div>
  );
}
