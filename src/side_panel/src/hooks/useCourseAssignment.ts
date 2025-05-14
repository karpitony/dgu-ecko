import { useEffect, useState } from 'react';
// import dummyAssignment from '@/assets/dummyAssignment.json';
import type { Assignment, CourseAssignmentData } from '@/types/courseAssignmentData';

export function useCourseAssignments() {
  const [courses, setCourses] = useState<CourseAssignmentData[]>([]);
  const [loading, setLoading] = useState(true);

  const isChromeRuntime =
    typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage;

  useEffect(() => {
    if (!isChromeRuntime) {
      // setCourses([
      //   {
      //     id: 'dummy',
      //     title: 'Dummy Course',
      //     professor: 'Dummy Professor',
      //     assignments: dummyAssignment.assignments,
      //   },
      // ]);
      // setLoading(false);
      return;
    }

    chrome.runtime.sendMessage({ type: 'GET_COURSE_ASSIGNMENT_DATA' }, (res) => {
      if (res?.error) {
        console.error('백그라운드 요청 오류:', res.error);
        setLoading(false);
      }
    });
  }, [isChromeRuntime]);

  useEffect(() => {
    if (!isChromeRuntime) return;

    const handleMessage = (msg: {
      type: string;
      payload: {
        courseId: string;
        courseTitle: string;
        fetchedAt: string;
        assignments: Assignment[];
      }[];
    }) => {
      if (msg.type !== 'ALL_COURSE_ASSIGNMENT_DATA') return;
      setCourses(msg.payload);
      setLoading(false);
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [isChromeRuntime]);

  return { courses, loading };
}
