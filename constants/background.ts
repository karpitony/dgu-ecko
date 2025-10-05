/**
 * Background Script 상수 정의
 */

// ============ 캐시 만료 시간 ============

/** VOD/과제 캐시 만료 시간: 4시간 */
export const MAX_CACHE_AGE_MS = 1000 * 60 * 60 * 4;

/** 강의 ID 캐시 만료 시간: 1주일 */
export const MAX_COURSE_ID_CACHE_AGE_MS = 1000 * 60 * 60 * 24 * 7;

// ============ 타임아웃 설정 ============

/** 콘텐츠 스크립트 응답 대기 타임아웃: 5초 */
export const CONTENT_SCRIPT_TIMEOUT_MS = 5000;

/** 콘텐츠 스크립트 로딩 재시도 최대 횟수 */
export const MAX_RETRY_ATTEMPTS = 5;

/** 콘텐츠 스크립트 로딩 재시도 간격: 100ms */
export const RETRY_INTERVAL_MS = 100;

// ============ 콘텐츠 스크립트 경로 ============

export const CONTENT_SCRIPTS = {
  GET_COURSE_ID: 'content-scripts/getCourseId.js',
  FETCH_AND_PARSE_VOD: 'content-scripts/fetchAndParseVod.js',
  FETCH_AND_PARSE_ASSIGNMENT: 'content-scripts/fetchAndParseAssignment.js',
} as const;

// ============ 마커 ID ============

export const MARKER_IDS = {
  GET_COURSE_ID: 'getCourseId',
  FETCH_AND_PARSE_VOD: 'fetchAndParseVod',
  FETCH_AND_PARSE_ASSIGNMENT: 'fetchAndParseAssignment',
} as const;

// ============ 스토리지 키 생성 함수 ============

export const STORAGE_KEYS = {
  COURSE_IDS: 'courseIds',
  courseVod: (courseId: string) => `course_${courseId}_vod` as const,
  courseAssignment: (courseId: string) => `course_${courseId}_assignment` as const,
} as const;
