/**
 * 사이드 패널 관리 서비스
 */

import type { ISidePanelService } from '../types/services';

export class SidePanelService implements ISidePanelService {
  /**
   * 사이드 패널을 엽니다.
   */
  async openSidePanel(): Promise<void> {
    try {
      const currentWindow = await chrome.windows.getCurrent();
      console.log('[이코] 현재 윈도우:', currentWindow);

      if (!currentWindow?.id) {
        throw new Error('현재 윈도우를 찾을 수 없습니다.');
      }

      console.log('[이코] 사이드패널 열기 시도, windowId:', currentWindow.id);
      await chrome.sidePanel.open({ windowId: currentWindow.id });
      console.log('[이코] 사이드패널 API 호출 완료');
    } catch (error) {
      console.error('[이코] 사이드패널 열기 오류:', error);
      throw error;
    }
  }

  /**
   * 사이드 패널 동작을 설정합니다. (확장 프로그램 아이콘 클릭 시 패널 열기)
   */
  setPanelBehavior(): void {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
      console.log('[이코] Side panel behavior set: open on action click.');
    });
  }
}
