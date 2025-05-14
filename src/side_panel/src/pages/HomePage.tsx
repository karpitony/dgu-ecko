import { useEffect, useState } from 'react';
import { useCourseVod } from '@/hooks/useCourseVod';
import { useCourseAssignments } from '@/hooks/useCourseAssignment';
import CourseVodList from '@/components/Vod/VodList';
import AssignmentList from '@/components/Assignment/AssignmentList';
import type { PageList } from '@/App';

export default function HomePage({
  setCurrentPage,
}: {
  setCurrentPage: (currentPage: PageList) => void;
}) {
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
      <div className='flex flex-row justify-between items-center'>
        <h2 className="text-xl font-bold mb-4">남은 과제</h2>
        <button
          className="text-blue-500 hover:underline mb-4 text-base"
          onClick={() => setCurrentPage('assignment')}
        >
          전체 과제 보기
        </button>
      </div>
      <AssignmentList courses={assignmentData} maxShow={4}/>
      <div className='flex flex-row justify-between items-center mt-8'>
        <h2 className="text-xl font-bold mb-4">남은 VOD</h2>
        <button
          className="text-blue-500 hover:underline mb-4 text-base"
          onClick={() => setCurrentPage('vod')}
        >
          전체 VOD 보기
        </button>
      </div>
      <CourseVodList courses={vodData} maxShow={4}/>
    </div>
  );
}
