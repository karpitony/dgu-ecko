import { useEffect, useState } from 'react';

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

export interface CourseInfo {
  id: string;
  title: string;
  professor: string;
}

type CourseWithVod = CourseInfo & {
  lectures: VodLecture[];
};

export default function HomePage() {
  const [courses, setCourses] = useState<CourseWithVod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstCourseWithVod = async () => {
      chrome.runtime.sendMessage({ type: 'GET_COURSE_VOD_DATA' }, (res) => {
        const vodData: CourseVodData | undefined = res?.data;
        if (!vodData) return;
  
        const singleCourse: CourseWithVod = {
          id: vodData.courseId,
          title: vodData.courseTitle,
          professor: '알 수 없음', // 정보가 없으니 표시만 보완
          lectures: vodData.lectures ?? [],
        };
  
        setCourses([singleCourse]);
        setLoading(false);
      });
    };
  
    fetchFirstCourseWithVod();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="p-4 rounded-xl border shadow-sm">
          <div className="text-lg font-semibold">{course.title}</div>
          <div className="text-sm text-gray-500 mb-2">교수: {course.professor}</div>

          {course.lectures.length === 0 ? (
            <div className="text-sm text-gray-400">사이버 강의 없음</div>
          ) : (
            <ul className="space-y-1 text-sm">
              {course.lectures.map((lec, idx) => (
                <li key={lec.vodId ?? idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{lec.title}</span>{' '}
                    <span className="text-xs text-gray-400">({lec.week})</span>
                  </div>
                  {lec.completed ? (
                    <span className="text-green-600 text-xs">✔ 완료</span>
                  ) : (
                    <span className="text-red-500 text-xs">❗미완료</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
