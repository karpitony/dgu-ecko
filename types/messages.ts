/**
 * 메시지 타입 정의
 * Chrome Extension 메시지 패싱에 사용되는 모든 메시지 타입
 */

// ============ 요청 메시지 타입 ============

export interface GetCourseVodDataMessage {
  type: 'GET_COURSE_VOD_DATA';
  forceRefresh?: boolean;
}

export interface GetCourseAssignmentDataMessage {
  type: 'GET_COURSE_ASSIGNMENT_DATA';
  forceRefresh?: boolean;
}

export interface ParseVodForIdMessage {
  type: 'PARSE_VOD_FOR_ID';
  courseId: string;
  courseTitle: string;
}

export interface ParseAssignmentForIdMessage {
  type: 'PARSE_ASSIGNMENT_FOR_ID';
  courseId: string;
  courseTitle: string;
}

export interface OpenSidePanelMessage {
  type?: 'openSidePanel'; // type은 없고 action만 있음
  action: 'openSidePanel';
}

// ============ 응답 메시지 타입 ============

export interface CourseIdsMessage {
  type: 'COURSE_IDS';
  data: Array<{
    id: string;
    title: string;
    professor: string;
  }>;
}

export interface CourseVodDataMessage {
  type: 'COURSE_VOD_DATA';
  data: {
    courseId: string;
    courseTitle: string;
    fetchedAt: string;
    lectures: any[];
  };
}

export interface CourseAssignmentDataMessage {
  type: 'COURSE_ASSIGNMENT_DATA';
  data: {
    courseId: string;
    courseTitle: string;
    fetchedAt: string;
    assignments: any[];
  };
}

export interface AllCourseVodDataMessage {
  type: 'ALL_COURSE_VOD_DATA';
  payload: any[];
}

export interface AllCourseAssignmentDataMessage {
  type: 'ALL_COURSE_ASSIGNMENT_DATA';
  payload: any[];
}

// ============ 통합 메시지 타입 ============

export type IncomingMessage =
  | GetCourseVodDataMessage
  | GetCourseAssignmentDataMessage
  | CourseIdsMessage
  | CourseVodDataMessage
  | CourseAssignmentDataMessage
  | OpenSidePanelMessage;

export type OutgoingMessage =
  | ParseVodForIdMessage
  | ParseAssignmentForIdMessage
  | AllCourseVodDataMessage
  | AllCourseAssignmentDataMessage;

export type MessagePayload = IncomingMessage | OutgoingMessage;
