import { useState, useEffect, useCallback } from 'react';
import { argonRepository, RepositoryResult } from '../data/ArgonRepository';
import { quotaManager } from '../data/QuotaManager';
import { ChatMessage, ChatUiState } from '../data/types';

function generateId(): string {
  return `\( {Date.now()}- \){Math.random().toString(36).slice(2, 9)}`;
}

export function useChatViewModel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uiState, setUiState] = useState<ChatUiState>({ status: 'idle' });
  const [quotaBadge, setQuotaBadge] = useState<string>(() => argonRepository.getQuotaBadge());
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [lastFailedText, setLastFailedText] = useState<string>('');
  const [hasUserKey, setHasUserKey] = useState<boolean>(() => argonRepository.hasUserKey());

  const updateBadge = useCallback(() => {
    setQuotaBadge(argonRepository.getQuotaBadge());
    setHasUserKey(argonRepository.hasUserKey());
  }, []);

  useEffect(() => {
    const unsubscribe = quotaManager.subscribe(updateBadge);
    if (argonRepository.isApiKeyRequired()) {
      setUiState({ status: 'apiKeyRequired' });
      setShowApiKeyDialog(true);
    }
    return unsubscribe;
  }, [updateBadge]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (argonRepository.isApiKeyRequired()) {
        setUiState({ status: 'apiKeyRequired' });
        setShowApiKeyDialog(true);
        return;
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        text: trimmed,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setUiState({ status: 'loading' });
      setLastFailedText('');

      try {
        const result: RepositoryResult = await argonRepository.sendMessage(trimmed);
        updateBadge();

        if (result.type === 'Success') {
          const isApk =
            trimmed.toLowerCase().includes('apk') ||
            result.reply.includes('APK PACKAGING SYSTEM') ||
            result.reply.includes('PH03N!X-Argon-4.8.apk');

          const botMsg: ChatMessage = {
            id: generateId(),
            text: result.reply,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isApkAction: isApk,
          };
          setMessages((prev) => [...prev, botMsg]);
          setUiState({ status: 'idle' });
        } else if (result.type === 'Error') {
          setLastFailedText(trimmed);
          setUiState({ status: 'error', message: result.message });
        } else if (result.type === 'ApiKeyRequired') {
          setLastFailedText(trimmed);
          setUiState({ status: 'apiKeyRequired' });
          setShowApiKeyDialog(true);
        }
      } catch (err: unknown) {
        setLastFailedText(trimmed);
        const msg = err instanceof Error ? err.message : 'Unknown communication error';
        setUiState({ status: 'error', message: msg });
      }
    },
    [updateBadge]
  );

  const retryLastFailedMessage = useCallback(() => {
    if (lastFailedText) {
      sendMessage(lastFailedText);
    }
  }, [lastFailedText, sendMessage]);

  const submitApiKey = useCallback(
    (key: string) => {
      if (!key.trim()) return;
      argonRepository.saveApiKey(key);
      setShowApiKeyDialog(false);
      updateBadge(); // this also updates hasUserKey
      setUiState({ status: 'idle' });

      if (lastFailedText) {
        sendMessage(lastFailedText);
      }
    },
    [updateBadge, lastFailedText, sendMessage]
  );

  const dismissApiKeyDialog = useCallback(() => {
    if (argonRepository.hasUserKey() || !argonRepository.isApiKeyRequired()) {
      setShowApiKeyDialog(false);
    }
  }, []);

  const forceShowApiKeyDialog = useCallback(() => {
    setShowApiKeyDialog(true);
  }, []);

  const resetQuotaForTesting = useCallback(() => {
    argonRepository.resetQuota();
    updateBadge();
    setUiState({ status: 'idle' });
  }, [updateBadge]);

  const clearApiKey = useCallback(() => {
    argonRepository.clearApiKey();
    updateBadge();
    if (argonRepository.isApiKeyRequired()) {
      setUiState({ status: 'apiKeyRequired' });
      setShowApiKeyDialog(true);
    } else {
      setUiState({ status: 'idle' });
    }
  }, [updateBadge]);

  return {
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
    hasUserKey, // now reactive
  };
}