/**
 * 탭 관리 및 메시지 전송
 */

export class TabManager {
  /**
   * 현재 활성 탭의 ID를 가져옵니다.
   */
  async getActiveTabId(): Promise<number> {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tabs[0]?.id;

      if (!tabId) {
        throw new Error('탭 ID를 찾을 수 없습니다.');
      }

      return tabId;
    } catch (error) {
      console.error('[이코] TabId 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 활성 탭 ID를 안전하게 가져옵니다 (실패 시 null 반환).
   */
  async getActiveTabIdSafe(): Promise<number | null> {
    try {
      return await this.getActiveTabId();
    } catch {
      return null;
    }
  }

  /**
   * 탭에 메시지를 보내고 응답을 기다립니다.
   */
  async sendMessageToTab<T = void>(tabId: number, message: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, response => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * 탭에 메시지를 보내고 응답을 기다리지 않습니다 (Fire and forget).
   */
  sendMessageToTabNoWait(tabId: number, message: any): void {
    chrome.tabs.sendMessage(tabId, message, () => {
      // 에러 무시
      chrome.runtime.lastError;
    });
  }
}
