export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
  isApkAction?: boolean;
}

export type ChatUiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; messages: ChatMessage[] }
  | { status: 'error'; message: string }
  | { status: 'apiKeyRequired' };
