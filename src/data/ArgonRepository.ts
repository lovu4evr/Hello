import { ArgonApiService, argonApiService } from './ArgonApiService';
import { QuotaManager, quotaManager } from './QuotaManager';

export type RepositoryResult =
  | { type: 'Success'; reply: string }
  | { type: 'Error'; message: string }
  | { type: 'ApiKeyRequired' };

export class ArgonRepository {
  constructor(
    private quota: QuotaManager = quotaManager,
    private api: ArgonApiService = argonApiService
  ) {}

  async sendMessage(userPrompt: string): Promise<RepositoryResult> {
    const bearer = this.quota.resolveBearerToken();
    if (!bearer) {
      return { type: 'ApiKeyRequired' };
    }

    try {
      const response = await this.api.chatCompletions(bearer, {
        prompt: userPrompt,
      });

      if (response.error) {
        return {
          type: 'Error',
          message: response.error.message || 'Unknown API error',
        };
      }

      const text = response.choices?.[0]?.text?.trim();
      if (!text) {
        return {
          type: 'Error',
          message: 'Empty response from Argon 4.8',
        };
      }

      // If user does not have a custom API key, increment their free tier message count
      if (!this.quota.hasUserApiKey()) {
        this.quota.incrementMessageCount();
      }

      return {
        type: 'Success',
        reply: text,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network failure';
      return {
        type: 'Error',
        message: msg,
      };
    }
  }

  getQuotaBadge(): string {
    return this.quota.getQuotaBadgeText();
  }

  isApiKeyRequired(): boolean {
    return this.quota.resolveBearerToken() === null;
  }

  saveApiKey(key: string): void {
    this.quota.saveUserApiKey(key);
  }

  clearApiKey(): void {
    this.quota.clearUserApiKey();
  }

  hasUserKey(): boolean {
    return this.quota.hasUserApiKey();
  }

  getUserKey(): string | null {
    return this.quota.getUserApiKey();
  }

  resetQuota(): void {
    this.quota.resetQuotaForTesting();
  }

  getMessageCount(): number {
    return this.quota.getMessageCount();
  }

  getLimit(): number {
    return this.quota.getLimit();
  }
}

export const argonRepository = new ArgonRepository();
