/**
 * "전역으로 타입 선언한 이유"
 * 타입을 import하면 tsc가 해당 ts파일을 모듈로 인식하고,
 * 컴파일 시 export를 끼워넣어서 브라우저가 컴파일된 js를 인식하지 못함
 */

import { 
  VodLecture as ImportVodLecture,
  CourseVodData as ImportCourseVodData
} from './types';

declare global {
  type VodLecture = ImportVodLecture;
  type CourseVodData = ImportCourseVodData;
}

export {};