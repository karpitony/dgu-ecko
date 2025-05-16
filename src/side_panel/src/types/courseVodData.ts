export interface VodLecture {
  week: string;
  title: string;
  vodId: string;
  viewUrl: string;
  viewerUrl: string;
  period: {
    start: string;
    end: string;
    lateEnd: string;
  };
  completed: boolean;
}

export interface CourseVodData {
  courseId: string;
  courseTitle: string;
  fetchedAt: string;
  lectures: VodLecture[];
}
