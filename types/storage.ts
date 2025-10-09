/**
 * Chrome Storage 데이터 타입 정의
 */

import { CourseInfo, CourseVodData } from '@/types';

// ============ 스토리지 키 타입 ============

export type StorageKey = 'courseIds' | `course_${string}_vod` | `course_${string}_assignment`;

// ============ 캐시 데이터 래퍼 ============

export interface CachedData<T> {
  data: T;
  fetchedAt: string; // ISO 8601 format
}

// ============ 스토리지 데이터 구조 ============

export interface CourseIdsCache extends CachedData<CourseInfo[]> {}

export interface CourseVodCache extends CachedData<CourseVodData> {
  courseId: string;
  courseTitle: string;
  lectures: any[];
}

export interface CourseAssignmentCache {
  courseId: string;
  courseTitle: string;
  fetchedAt: string;
  assignments: any[];
}

// ============ 스토리지 전체 구조 ============

export interface StorageSchema {
  courseIds?: CourseIdsCache;
  [key: `course_${string}_vod`]: CourseVodCache;
  [key: `course_${string}_assignment`]: CourseAssignmentCache;
}
