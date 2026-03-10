import { useEffect, useState, useCallback } from 'react';
import type { CourseVodData } from '@/types';
import type { GetCourseVodDataMessage, AllCourseVodDataMessage } from '@/types/messages';

export function useCourseVod() {
  const [courses, setCourses] = useState<CourseVodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isChromeRuntime = typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;

  // 공통 fetch 함수
  const fetchVodData = useCallback(
    (forceRefresh = false) => {
      if (!isChromeRuntime) return;

      setLoading(true);
      setError(null);

      const message: GetCourseVodDataMessage = {
        type: 'GET_COURSE_VOD_DATA',
        forceRefresh,
      };

      chrome.runtime.sendMessage(message, res => {
        const vodData: CourseVodData | undefined = res?.data;
        if (!vodData) {
          setError('데이터를 불러오지 못했습니다.');
          setLoading(false);
          return;
        }

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
    },
    [isChromeRuntime],
  );

  useEffect(() => {
    if (!isChromeRuntime) {
      const setupDummyData = async () => {
        try {
          const res = await fetch('/dummy-vod.json');
          const data = await res.json();
          const lectures = data.lectures || [];

          setCourses([
            {
              courseId: 'dummy',
              courseTitle: 'Dummy Course',
              fetchedAt: 'dummy fetchedAt',
              lectures: lectures,
            },
          ]);
        } catch (error) {
          console.error('더미 데이터를 불러오는데 실패했습니다.', error);
        } finally {
          setLoading(false);
        }
      };

      setupDummyData();
      return;
    }

    fetchVodData(false); // 캐시 허용
  }, [fetchVodData, isChromeRuntime]);

  useEffect(() => {
    if (!isChromeRuntime) return;

    const handleMessage = (msg: AllCourseVodDataMessage) => {
      if (msg.type !== 'ALL_COURSE_VOD_DATA') return;

      const next = msg.payload.map<CourseVodData>(d => ({
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

  const refetch = useCallback(() => {
    fetchVodData(true); // 강제 새로고침
  }, [fetchVodData]);

  return { courses, loading, error, refetch };
}
