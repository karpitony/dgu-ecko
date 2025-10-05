/**
 * 강의 목록 관리 서비스
 */

import { CourseInfo } from '@/types';
import { CacheRepository } from '../repositories/CacheRepository';
import { ContentScriptManager } from '../managers/ContentScriptManager';
import { CONTENT_SCRIPTS, MARKER_IDS, CONTENT_SCRIPT_TIMEOUT_MS } from '@/constants/background';
import type { ICourseService } from '../types/services';

export class CourseService implements ICourseService {
  private courseIdsPromise: Promise<CourseInfo[]> | null = null;

  constructor(
    private cacheRepo: CacheRepository,
    private contentScriptManager: ContentScriptManager,
  ) {}

  /**
   * 강의 목록을 가져옵니다. (캐시 우선, 없으면 콘텐츠 스크립트 실행)
   */
  async getCourseIds(tabId: number): Promise<CourseInfo[]> {
    // 이미 요청 중이면 기존 Promise 반환
    if (this.courseIdsPromise) {
      return this.courseIdsPromise;
    }

    this.courseIdsPromise = this.fetchCourseIds(tabId);

    try {
      return await this.courseIdsPromise;
    } finally {
      this.courseIdsPromise = null;
    }
  }

  /**
   * 실제 강의 ID 가져오기 로직
   */
  private async fetchCourseIds(tabId: number): Promise<CourseInfo[]> {
    // 캐시 확인
    const cachedCourseIds = await this.cacheRepo.getCourseIdsCache();
    if (cachedCourseIds) {
      return cachedCourseIds;
    }

    // 캐시 없으면 콘텐츠 스크립트 실행
    console.warn('[이코] courseIds 캐시 만료 → 다시 가져옴');

    await this.contentScriptManager.ensureContentScript(
      tabId,
      MARKER_IDS.GET_COURSE_ID,
      CONTENT_SCRIPTS.GET_COURSE_ID,
    );

    // 콘텐츠 스크립트로부터 응답 대기
    const courseIds = await this.waitForCourseIdsMessage();

    // 캐시에 저장
    await this.cacheRepo.setCourseIdsCache(courseIds);

    return courseIds;
  }

  /**
   * 콘텐츠 스크립트로부터 COURSE_IDS 메시지를 기다립니다.
   */
  private waitForCourseIdsMessage(): Promise<CourseInfo[]> {
    return new Promise<CourseInfo[]>((resolve, reject) => {
      const timeout = setTimeout(() => {
        chrome.runtime.onMessage.removeListener(listener);
        console.error('[이코] courseIds 응답 시간 초과');
        reject(new Error('강의 목록을 가져오지 못했습니다.'));
      }, CONTENT_SCRIPT_TIMEOUT_MS);

      const listener = (message: any) => {
        if (message.type === 'COURSE_IDS') {
          clearTimeout(timeout);
          chrome.runtime.onMessage.removeListener(listener);
          console.log('[이코] 수신된 courseIds:', message.data);
          resolve(message.data);
        }
      };

      chrome.runtime.onMessage.addListener(listener);
    });
  }

  /**
   * 강의 ID 캐시를 무효화합니다.
   */
  async invalidateCourseIdsCache(): Promise<void> {
    await this.cacheRepo.invalidateCourseIdsCache();
    this.courseIdsPromise = null;
  }
}
