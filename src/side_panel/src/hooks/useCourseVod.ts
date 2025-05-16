import { useEffect, useState } from 'react';
import type { CourseVodData } from '@/types/courseVodData';
import dummyData from '@/assets/dummyVod.json';


export function useCourseVod() {
  const [courses, setCourses] = useState<CourseVodData[]>([]);
  const [loading, setLoading] = useState(true);

  // helper ─ 크롬 환경이 아닌 dev 서버에서 오류 방지
  const isChromeRuntime =
    typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;
  
  useEffect(() => {
    if (!isChromeRuntime) {
      setLoading(false);
      setCourses([
        {
          courseId: 'dummy',
          courseTitle: 'Dummy Course',
          fetchedAt: 'dummy fetchedAt',
          lectures: dummyData.lectures,
        },
      ]);
      return;
    }

    chrome.runtime.sendMessage({ type: 'GET_COURSE_VOD_DATA' }, (res) => {
      const vodData: CourseVodData | undefined = res?.data;
      if (!vodData) return;

      setCourses([
        {
          courseId: vodData.courseId,
          courseTitle: vodData.courseTitle,
          fetchedAt: vodData.fetchedAt,
          lectures: vodData.lectures ?? [],
        },
      ]);
      setLoading(false);
    });
  }, [isChromeRuntime]);

  /** 백그라운드 → 패널 수신 */
  useEffect(() => {
    if (!isChromeRuntime) {
      return ;
    }

    const handleMessage = (msg: { type: string; payload: CourseVodData[] }) => {
      if (msg.type !== 'ALL_COURSE_VOD_DATA') return;

      const next = msg.payload.map<CourseVodData>((d) => ({
        courseId: d.courseId,
        courseTitle: d.courseTitle,
        fetchedAt: d.fetchedAt,
        lectures: d.lectures ?? [],
      }));
      setCourses(next);
      setLoading(false);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [isChromeRuntime]);

  return { courses, loading };
}
