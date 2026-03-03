/**
 * 콘텐츠 스크립트 삽입 및 관리
 */

export class ContentScriptManager {
  private readonly MARKER_PREFIX = '_ekco_marker_';

  /**
   * 콘텐츠 스크립트가 이미 삽입되었는지 확인합니다.
   */
  async hasContentScript(tabId: number, markerId: string): Promise<boolean> {
    const markerTemplate = `${this.MARKER_PREFIX}${markerId}`;

    return new Promise(resolve => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: (id: string) => {
            return !!document.getElementById(id);
          },
          args: [markerTemplate],
        },
        results => {
          if (chrome.runtime.lastError || !results?.[0]?.result) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });
  }

  /**
   * 콘텐츠 스크립트를 탭에 동적으로 삽입합니다.
   */
  async injectContentScript(tabId: number, filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: [filePath],
        },
        results => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.error(`콘텐츠 스크립트 삽입 실패 [${filePath}]`, lastError);
            reject(lastError);
            return;
          }

          console.log(`콘텐츠 스크립트 삽입 성공 [${filePath}]`, results);
          resolve();
        },
      );
    });
  }

  /**
   * 콘텐츠 스크립트가 없으면 삽입합니다.
   */
  async ensureContentScript(tabId: number, markerId: string, filePath: string): Promise<void> {
    if (!(await this.hasContentScript(tabId, markerId))) {
      console.log(`[이코] 콘텐츠 스크립트(${markerId}) 삽입 시작`);
      await this.injectContentScript(tabId, filePath);
    } else {
      console.log(`[이코] 콘텐츠 스크립트(${markerId}) 이미 삽입됨`);
    }
  }
}
