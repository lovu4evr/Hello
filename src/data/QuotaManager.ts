/**
 * QuotaManager for PH03N!X Argon 4.8
 * Manages message quotas and API key persistence in localStorage.
 */

const KEY_MESSAGE_COUNT = 'argon_quota_message_count';
const KEY_USER_API_KEY = 'argon_quota_user_api_key';
const FREE_TIER_LIMIT = 20;
const FREE_BEARER = 'Bearer ARGON_INTERNAL_FREE_POOL';

export class QuotaManager {
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getMessageCount(): number {
    try {
      const val = localStorage.getItem(KEY_MESSAGE_COUNT);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  incrementMessageCount(): void {
    const current = this.getMessageCount();
    try {
      localStorage.setItem(KEY_MESSAGE_COUNT, (current + 1).toString());
    } catch (e) {
      console.warn('Failed to save message count to localStorage', e);
    }
    this.notify();
  }

  isFreeTierExhausted(): boolean {
    return this.getMessageCount() >= FREE_TIER_LIMIT;
  }

  hasUserApiKey(): boolean {
    const key = this.getUserApiKey();
    return !!key && key.trim().length > 0;
  }

  getUserApiKey(): string | null {
    try {
      return localStorage.getItem(KEY_USER_API_KEY);
    } catch {
      return null;
    }
  }

  saveUserApiKey(apiKey: string): void {
    try {
      localStorage.setItem(KEY_USER_API_KEY, apiKey.trim());
    } catch (e) {
      console.warn('Failed to save API key to localStorage', e);
    }
    this.notify();
  }

  clearUserApiKey(): void {
    try {
      localStorage.removeItem(KEY_USER_API_KEY);
    } catch (e) {
      console.warn('Failed to clear API key from localStorage', e);
    }
    this.notify();
  }

  resolveBearerToken(): string | null {
    if (this.hasUserApiKey()) {
      return `Bearer ${this.getUserApiKey()}`;
    }
    return !this.isFreeTierExhausted() ? FREE_BEARER : null;
  }

  getQuotaBadgeText(): string {
    if (this.hasUserApiKey()) {
      return '[ LOCKED // CUSTOM API KEY ACTIVE ]';
    } else if (this.isFreeTierExhausted()) {
      return '[ LOCKED // CUSTOM API KEY REQUIRED ]';
    } else {
      return `[ ${this.getMessageCount()} / ${FREE_TIER_LIMIT} FREE TIER ACTIVE ]`;
    }
  }

  resetQuotaForTesting(): void {
    try {
      localStorage.setItem(KEY_MESSAGE_COUNT, '0');
    } catch (e) {
      console.warn('Failed to reset message count in localStorage', e);
    }
    this.notify();
  }

  getLimit(): number {
    return FREE_TIER_LIMIT;
  }
}

export const quotaManager = new QuotaManager();
