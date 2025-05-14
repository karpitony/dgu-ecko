import { useState, useEffect } from 'react';
import { useCourseAssignments } from '@/hooks/useCourseAssignment';
import AssignmentList from '@/components/Assignment/AssignmentList';

export default function HomePage() {
  const { courses: assignmentData, loading: assignmentLoading } = useCourseAssignments();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  
  useEffect(() => {
    if (!assignmentLoading) {
      setIsDataLoaded(true);
    }
  }, [assignmentLoading]);

  if (!isDataLoaded) {
    return (
      <div className="p-4 text-center text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <div className="p-4 w-full h-screen overflow-y-auto flex flex-col items-start">
      <h2 className="text-xl font-bold mb-4">남은 과제</h2>
      <AssignmentList courses={assignmentData} />
    </div>
  );
}
