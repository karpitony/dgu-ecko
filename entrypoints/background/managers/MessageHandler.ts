/**
 * 메시지 라우팅 및 핸들링
 */

import type { IncomingMessage } from '@/types/messages';

type MessageHandlerFn = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void | boolean;

export class MessageHandler {
  private handlers: Map<string, MessageHandlerFn> = new Map();

  /**
   * 메시지 타입별 핸들러를 등록합니다.
   */
  register(type: string, handler: MessageHandlerFn): void {
    this.handlers.set(type, handler);
  }

  /**
   * 메시지를 처리합니다.
   */
  handle(
    message: IncomingMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ): boolean {
    // message.type 또는 message.action에서 타입 추출
    const type = message.type || (message as any).action;

    if (!type) {
      console.warn('[이코] 메시지 타입이 없습니다:', message);
      return false;
    }

    const handler = this.handlers.get(type);

    if (!handler) {
      // 핸들러가 없으면 조용히 무시 (다른 리스너가 처리할 수 있음)
      return false;
    }

    try {
      return handler(message, sender, sendResponse) === true;
    } catch (error) {
      console.error(`[이코] 메시지 핸들러 오류 (${type}):`, error);
      return false;
    }
  }

  /**
   * Chrome 런타임 메시지 리스너를 등록합니다.
   */
  listen(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      return this.handle(message, sender, sendResponse);
    });
  }
}
