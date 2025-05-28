import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCourseAssignments } from '@/side-panel/hooks/useCourseAssignment';
import AssignmentList from '@/side-panel/components/AssignmentList';

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
      <div className='w-full flex items-center justify-between mb-4'>
        <h2 className="text-xl font-bold">남은 과제</h2>
        <Link
          to="/index.html"
          className="text-blue-400 hover:underline text-base pr-1"
        >
          홈으로 이동
        </Link>
      </div>
      <AssignmentList courses={assignmentData} />
    </div>
  );
}
