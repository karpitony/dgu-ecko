import { useEffect, useState, useCallback } from 'react';
import type { CourseAssignmentCache } from '@/types/storage';
import type {
  GetCourseAssignmentDataMessage,
  AllCourseAssignmentDataMessage,
} from '@/types/messages';

export function useCourseAssignments() {
  const [courses, setCourses] = useState<CourseAssignmentCache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isChromeRuntime = typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;

  const fetchAssignments = useCallback(
    (forceRefresh = false) => {
      if (!isChromeRuntime) return;

      setLoading(true);
      setError(null);

      const message: GetCourseAssignmentDataMessage = {
        type: 'GET_COURSE_ASSIGNMENT_DATA',
        forceRefresh,
      };

      chrome.runtime.sendMessage(message, res => {
        if (res?.error) {
          console.error('백그라운드 요청 오류:', res.error);
          setError(res.error);
          setLoading(false);
        }
      });
    },
    [isChromeRuntime],
  );

  useEffect(() => {
    fetchAssignments(false); // 최초 요청 시 캐시 사용
  }, [fetchAssignments]);

  useEffect(() => {
    if (!isChromeRuntime) return;

    const handleMessage = (msg: AllCourseAssignmentDataMessage) => {
      if (msg.type !== 'ALL_COURSE_ASSIGNMENT_DATA') return;
      setCourses(msg.payload);
      setLoading(false);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [isChromeRuntime]);

  const refetch = useCallback(() => {
    fetchAssignments(true); // 강제 새로고침
  }, [fetchAssignments]);

  return { courses, loading, error, refetch };
}
