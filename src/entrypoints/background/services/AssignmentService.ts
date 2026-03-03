/**
 * 과제 데이터 수집 및 관리 서비스
 */

import { CourseInfo } from '@/types';
import { CacheRepository } from '../repositories/CacheRepository';
import { ContentScriptManager } from '../managers/ContentScriptManager';
import { TabManager } from '../managers/TabManager';
import { CourseService } from './CourseService';
import { CONTENT_SCRIPTS, MARKER_IDS } from '@/constants/background';
import type { IAssignmentService } from '@/types/services';
import type { CourseAssignmentCache } from '@/types/storage';

export class AssignmentService implements IAssignmentService {
  private totalAssignmentCount = 0;
  private completedAssignmentCount = 0;

  constructor(
    private cacheRepo: CacheRepository,
    private contentScriptManager: ContentScriptManager,
    private tabManager: TabManager,
    private courseService: CourseService,
  ) {}

  /**
   * 모든 강의의 과제 데이터를 수집합니다.
   */
  async handleAllCourseAssignments(forceRefresh = false): Promise<void> {
    console.log('[이코] 과제 데이터 요청');
    this.completedAssignmentCount = 0;

    const tabId = await this.tabManager.getActiveTabId();
    const courseList = await this.courseService.getCourseIds(tabId);

    if (!courseList.length) {
      throw new Error('강의 목록을 불러올 수 없습니다.');
    }

    this.totalAssignmentCount = courseList.length;

    // 캐시 확인 및 만료된 강의 목록 추출
    const invalidCourseIds = await this.getInvalidCourses(courseList, forceRefresh);

    // 캐시된 데이터 카운트
    const cachedCount = courseList.length - invalidCourseIds.length;
    this.completedAssignmentCount = cachedCount;

    if (invalidCourseIds.length === 0) {
      console.log('[이코] 모든 과제 데이터가 캐시되어 있습니다.');
      await this.notifyAllAssignmentDataCollected(courseList);
      return;
    }

    // 콘텐츠 스크립트 삽입
    await this.contentScriptManager.ensureContentScript(
      tabId,
      MARKER_IDS.FETCH_AND_PARSE_ASSIGNMENT,
      CONTENT_SCRIPTS.FETCH_AND_PARSE_ASSIGNMENT,
    );

    // 병렬로 모든 강의 파싱 요청
    await Promise.all(
      invalidCourseIds.map(async course => {
        this.tabManager.sendMessageToTabNoWait(tabId, {
          type: 'PARSE_ASSIGNMENT_FOR_ID',
          courseId: course.id,
          courseTitle: course.title,
        });
        console.log(`[이코] PARSE_ASSIGNMENT_FOR_ID 요청 완료: ${course.title}(${course.id})`);
      }),
    );
  }

  /**
   * 캐시되지 않았거나 만료된 강의 목록을 반환합니다.
   */
  private async getInvalidCourses(
    courseList: CourseInfo[],
    forceRefresh: boolean,
  ): Promise<CourseInfo[]> {
    const invalidCourseIds: CourseInfo[] = [];

    for (const course of courseList) {
      const cached = await this.cacheRepo.getAssignmentCache(course.id);

      if (!forceRefresh && cached) {
        console.log(`[이코] 과제 캐시 사용: ${course.title}(${course.id})`);
      } else {
        console.log(`[이코] 과제 캐시 만료: ${course.title}(${course.id})`);
        invalidCourseIds.push(course);
      }
    }

    return invalidCourseIds;
  }

  /**
   * 과제 데이터 수신 처리 (콘텐츠 스크립트로부터 받은 데이터)
   */
  async onAssignmentDataReceived(data: CourseAssignmentCache): Promise<void> {
    console.log(`[이코] ${data.courseTitle}(${data.courseId}) 과제 데이터 수신:`, data.assignments);

    await this.cacheRepo.setAssignmentCache(data);

    this.completedAssignmentCount++;
    await this.checkAndNotifyCompletion();
  }

  /**
   * 모든 과제 데이터 수집 완료 확인 및 알림
   */
  private async checkAndNotifyCompletion(): Promise<void> {
    if (this.completedAssignmentCount !== this.totalAssignmentCount) {
      return;
    }

    console.log('[이코] 전체 과제 데이터 수집 완료');

    try {
      const tabId = await this.tabManager.getActiveTabIdSafe();
      if (!tabId) {
        console.warn('[이코] 탭을 찾을 수 없어 courseIds 조회를 건너뜁니다.');
        // 탭 없이도 스토리지에서 직접 가져오기
        await this.notifyAllAssignmentDataCollectedWithoutTab();
        return;
      }

      const courseIds = await this.courseService.getCourseIds(tabId);
      await this.notifyAllAssignmentDataCollected(courseIds);
    } catch (error) {
      console.error('[이코] 과제 수집 완료 알림 실패:', error);
    }
  }

  /**
   * 탭 없이 스토리지에서 직접 과제 데이터를 가져와 알림
   */
  private async notifyAllAssignmentDataCollectedWithoutTab(): Promise<void> {
    // courseIds를 스토리지에서 직접 가져오기
    const cachedCourseIds = await this.cacheRepo.getCourseIdsCache();
    if (!cachedCourseIds) {
      console.warn('[이코] courseIds 캐시가 없어 과제 데이터 알림을 건너뜁니다.');
      return;
    }

    await this.notifyAllAssignmentDataCollected(cachedCourseIds);
  }

  /**
   * 전체 과제 데이터 수집 완료 메시지 전송
   */
  private async notifyAllAssignmentDataCollected(courseIds: CourseInfo[]): Promise<void> {
    const allAssignmentData = await this.cacheRepo.getAllAssignmentData(courseIds);

    chrome.runtime.sendMessage({
      type: 'ALL_COURSE_ASSIGNMENT_DATA',
      payload: allAssignmentData,
    });
  }

  /**
   * 특정 강의의 과제 데이터를 가져옵니다.
   */
  async getAssignmentDataByCourseId(courseId: string): Promise<CourseAssignmentCache | null> {
    return await this.cacheRepo.getAssignmentCache(courseId);
  }
}
