import { useEffect, useState } from 'react';
import { useCourseVod } from '@/hooks/useCourseVod';
import { useCourseAssignments } from '@/hooks/useCourseAssignment';
import CourseVodList from '@/components/Vod/VodList';
import AssignmentList from '@/components/Assignment/AssignmentList';

export default function HomePage() {
  const { courses: vodData, loading: vodLoading } = useCourseVod();
  const { courses: assignmentData, loading: assignmentLoading } = useCourseAssignments();
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!vodLoading && !assignmentLoading) {
      setIsDataLoaded(true);
    }
  }, [vodLoading, assignmentLoading]);

  if (!isDataLoaded) {
    return (
      <div className="p-4 text-center text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <div className="p-4 w-full h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">남은 과제</h2>
      <AssignmentList courses={assignmentData} />
      <h2 className="text-xl font-bold mt-8 mb-4">남은 VOD</h2>
      <CourseVodList courses={vodData} />
    </div>
  );
}
