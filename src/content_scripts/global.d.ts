import { 
  VodLecture as ImportVodLecture,
  CourseVodData as ImportCourseVodData
} from './types';

declare global {
  type VodLecture = ImportVodLecture;
  type CourseVodData = ImportCourseVodData;
}

export {};