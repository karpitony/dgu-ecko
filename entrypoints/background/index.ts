/**
 * Background Script 진입점
 *
 * 이 파일은 확장 프로그램의 백그라운드 스크립트 진입점입니다.
 * 각 서비스와 매니저를 초기화하고 메시지 라우팅을 설정합니다.
 */

import { StorageRepository } from './repositories/StorageRepository';
import { CacheRepository } from './repositories/CacheRepository';
import { ContentScriptManager } from './managers/ContentScriptManager';
import { TabManager } from './managers/TabManager';
import { MessageHandler } from './managers/MessageHandler';
import { CourseService } from './services/CourseService';
import { VodService } from './services/VodService';
import { AssignmentService } from './services/AssignmentService';
import { SidePanelService } from './services/SidePanelService';

export default defineBackground({
  main() {
    // ============ 의존성 주입 ============

    const storageRepo = new StorageRepository();
    const cacheRepo = new CacheRepository(storageRepo);
    const contentScriptManager = new ContentScriptManager();
    const tabManager = new TabManager();
    const messageHandler = new MessageHandler();

    const courseService = new CourseService(cacheRepo, contentScriptManager);
    const vodService = new VodService(cacheRepo, contentScriptManager, tabManager, courseService);
    const assignmentService = new AssignmentService(
      cacheRepo,
      contentScriptManager,
      tabManager,
      courseService,
    );
    const sidePanelService = new SidePanelService();

    // ============ 사이드패널 설정 ============

    chrome.runtime.onInstalled.addListener(() => {
      sidePanelService.setPanelBehavior();
    });

    // ============ 메시지 핸들러 등록 ============

    // VOD 데이터 요청
    messageHandler.register('GET_COURSE_VOD_DATA', (message, sender, sendResponse) => {
      vodService
        .handleAllCourseVod(message.forceRefresh)
        .then(() => sendResponse({ triggered: true }))
        .catch(err => {
          console.error(err);
          sendResponse({ error: err.message });
        });
      return true; // 비동기 응답
    });

    // VOD 데이터 수신 (콘텐츠 스크립트로부터)
    messageHandler.register('COURSE_VOD_DATA', (message, sender, sendResponse) => {
      vodService.onVodDataReceived(message.data);
      return false;
    });

    // 과제 데이터 요청
    messageHandler.register('GET_COURSE_ASSIGNMENT_DATA', (message, sender, sendResponse) => {
      assignmentService
        .handleAllCourseAssignments(message.forceRefresh)
        .then(() => sendResponse({ triggered: true }))
        .catch(err => {
          console.error(err);
          sendResponse({ error: err.message });
        });
      return true; // 비동기 응답
    });

    // 과제 데이터 수신 (콘텐츠 스크립트로부터)
    messageHandler.register('COURSE_ASSIGNMENT_DATA', (message, sender, sendResponse) => {
      assignmentService.onAssignmentDataReceived(message.data);
      return false;
    });

    // 사이드패널 열기 (탭 기반)
    messageHandler.register('openSidePanel', (message, sender, sendResponse) => {
      console.log('[이코] openSidePanel 메시지 수신됨, sender:', sender);

      // 비동기 처리
      const handleOpen = async () => {
        try {
          // sender.tab이 있으면 해당 탭의 windowId 사용
          if (sender.tab?.windowId) {
            console.log('[이코] 탭 기반 사이드패널 열기, windowId:', sender.tab.windowId);
            await chrome.sidePanel.open({ windowId: sender.tab.windowId });
            console.log('[이코] 사이드패널 열기 성공');
            sendResponse({ success: true });
          } else {
            // 탭 정보 없으면 현재 활성 윈도우에서 열기
            console.log('[이코] 현재 윈도우 기반 사이드패널 열기');
            await sidePanelService.openSidePanel();
            sendResponse({ success: true });
          }
        } catch (err: any) {
          console.error('[이코] 사이드패널 열기 실패:', err);
          sendResponse({ success: false, error: err.message });
        }
      };

      handleOpen();
      return true; // 비동기 응답을 기다림
    });

    // ============ 메시지 리스너 시작 ============

    messageHandler.listen();

    console.log('[이코] Background script running...');
  },
});
