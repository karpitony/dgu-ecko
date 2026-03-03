/**
 * 서비스 인터페이스 정의
 */

import { CourseInfo, CourseVodData } from '@/types';
import { CourseAssignmentCache } from '@/types/storage';

// ============ Course Service ============

export interface ICourseService {
  getCourseIds(tabId: number): Promise<CourseInfo[]>;
  invalidateCourseIdsCache(): Promise<void>;
}

// ============ VOD Service ============

export interface IVodService {
  handleAllCourseVod(forceRefresh?: boolean): Promise<void>;
  getVodDataByCourseId(courseId: string): Promise<CourseVodData | null>;
}

// ============ Assignment Service ============

export interface IAssignmentService {
  handleAllCourseAssignments(forceRefresh?: boolean): Promise<void>;
  getAssignmentDataByCourseId(courseId: string): Promise<CourseAssignmentCache | null>;
}

// ============ Side Panel Service ============

export interface ISidePanelService {
  openSidePanel(): Promise<void>;
  setPanelBehavior(): void;
}
