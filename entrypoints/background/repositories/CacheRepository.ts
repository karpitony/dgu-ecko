/**
 * 캐시 관리 전담 레포지토리
 */

import { CourseInfo, CourseVodData } from '@/types';
import { StorageRepository } from './StorageRepository';
import { STORAGE_KEYS } from '@/constants/background';
import type { CourseIdsCache, CourseAssignmentCache } from '@/types/storage';

export class CacheRepository {
  constructor(private storage: StorageRepository) {}

  // ============ Course IDs 캐시 ============

  async getCourseIdsCache(): Promise<CourseInfo[] | null> {
    const cache = await this.storage.get<CourseIdsCache>(STORAGE_KEYS.COURSE_IDS);

    if (!cache || !cache.data) return null;

    if (!this.storage.isCourseIdCacheValid(cache.fetchedAt)) {
      console.log('[이코] courseIds 캐시 만료');
      return null;
    }

    console.log('[이코] 스토리지에서 courseIds 불러옴');
    return cache.data;
  }

  async setCourseIdsCache(courseIds: CourseInfo[]): Promise<void> {
    const cache: CourseIdsCache = {
      data: courseIds,
      fetchedAt: new Date().toISOString(),
    };

    await this.storage.set(STORAGE_KEYS.COURSE_IDS, cache);
  }

  async invalidateCourseIdsCache(): Promise<void> {
    await this.storage.remove(STORAGE_KEYS.COURSE_IDS);
  }

  // ============ VOD 캐시 ============

  async getVodCache(courseId: string): Promise<CourseVodData | null> {
    const key = STORAGE_KEYS.courseVod(courseId);
    const cache = await this.storage.get<CourseVodData>(key);

    if (!cache) return null;

    if (!this.storage.isDataCacheValid(cache.fetchedAt)) {
      console.log(`[이코] VOD 캐시 만료: ${courseId}`);
      return null;
    }

    return cache;
  }

  async setVodCache(data: CourseVodData): Promise<void> {
    const key = STORAGE_KEYS.courseVod(data.courseId);
    await this.storage.set(key, data);
    console.log(`[이코] VOD 저장 완료: ${data.courseTitle}(${data.courseId})`);
  }

  // ============ Assignment 캐시 ============

  async getAssignmentCache(courseId: string): Promise<CourseAssignmentCache | null> {
    const key = STORAGE_KEYS.courseAssignment(courseId);
    const cache = await this.storage.get<CourseAssignmentCache>(key);

    if (!cache) return null;

    if (!this.storage.isDataCacheValid(cache.fetchedAt)) {
      console.log(`[이코] 과제 캐시 만료: ${courseId}`);
      return null;
    }

    return cache;
  }

  async setAssignmentCache(data: CourseAssignmentCache): Promise<void> {
    const key = STORAGE_KEYS.courseAssignment(data.courseId);
    await this.storage.set(key, data);
    console.log(`[이코] 과제 저장 완료: ${data.courseTitle}(${data.courseId})`);
  }

  // ============ 전체 데이터 조회 ============

  async getAllVodData(courseIds: CourseInfo[]): Promise<CourseVodData[]> {
    const allVodData: CourseVodData[] = [];

    for (const course of courseIds) {
      const data = await this.getVodCache(course.id);
      if (data) {
        allVodData.push(data);
      }
    }

    return allVodData;
  }

  async getAllAssignmentData(courseIds: CourseInfo[]): Promise<CourseAssignmentCache[]> {
    const allAssignmentData: CourseAssignmentCache[] = [];

    for (const course of courseIds) {
      const data = await this.getAssignmentCache(course.id);
      if (data) {
        allAssignmentData.push(data);
      }
    }

    return allAssignmentData;
  }
}
