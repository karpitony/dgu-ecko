import { useEffect, useState, useCallback } from 'react';
import type { CourseAssignmentData } from '@/types/courseAssignmentData';

export function useCourseAssignments() {
  const [courses, setCourses] = useState<CourseAssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isChromeRuntime =
    typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;

  const fetchAssignments = useCallback((forceRefresh = false) => {
    if (!isChromeRuntime) return;

    setLoading(true);
    setError(null);

    chrome.runtime.sendMessage({ type: 'GET_COURSE_ASSIGNMENT_DATA', forceRefresh }, (res) => {
      if (res?.error) {
        console.error('백그라운드 요청 오류:', res.error);
        setError(res.error);
        setLoading(false);
      }
    });
  }, [isChromeRuntime]);

  useEffect(() => {
    fetchAssignments(false); // 최초 요청 시 캐시 사용
  }, [fetchAssignments]);

  useEffect(() => {
    if (!isChromeRuntime) return;

    const handleMessage = (msg: {
      type: string;
      payload: CourseAssignmentData[];
    }) => {
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
