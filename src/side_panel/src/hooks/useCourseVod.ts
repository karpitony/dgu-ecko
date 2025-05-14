import { useEffect, useState } from 'react';
import type { CourseVodData, VodLecture } from '@/types/courseVodData';
import dummyData from '@/assets/dummyVod.json';

/** UI 에서 바로 쓰기 좋은 형태 */
export interface CourseWithVod {
  id: string;
  title: string;
  professor: string;
  lectures: VodLecture[];
}

export function useCourseVod() {
  const [courses, setCourses] = useState<CourseWithVod[]>([]);
  const [loading, setLoading] = useState(true);

  // helper ─ 크롬 환경이 아닌 dev 서버에서 오류 방지
  const isChromeRuntime =
    typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;
  
  useEffect(() => {
    if (!isChromeRuntime) {
      setLoading(false);
      setCourses([
        {
          id: 'dummy',
          title: 'Dummy Course',
          professor: 'Dummy Professor',
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
          id: vodData.courseId,
          title: vodData.courseTitle,
          professor: '알 수 없음',
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

      const next = msg.payload.map<CourseWithVod>((d) => ({
        id: d.courseId,
        title: d.courseTitle,
        professor: '확인 필요',
        lectures: d.lectures,
      }));
      setCourses(next);
      setLoading(false);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [isChromeRuntime]);

  return { courses, loading };
}
