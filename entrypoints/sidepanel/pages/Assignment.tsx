import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCourseAssignments } from '@sidepanel/hooks/useCourseAssignment';
import AssignmentList from '@sidepanel/components/AssignmentList';
import { LuRefreshCcw } from 'react-icons/lu';
import { formatDateTime } from '@/libs/formatDateTime';

export default function HomePage() {
  const {
    courses: assignmentData,
    loading: assignmentLoading,
    refetch: assignmentRefetch,
  } = useCourseAssignments();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!assignmentLoading) {
      setIsDataLoaded(true);
    }
  }, [assignmentLoading]);

  if (!isDataLoaded) {
    return <div className="p-4 text-center text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="p-4 w-full h-screen overflow-y-auto flex flex-col items-start">
      <div className="w-full flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">남은 과제</h2>
        <Link to="/index.html" className="text-blue-400 hover:underline text-base pr-1">
          홈으로 이동
        </Link>
      </div>
      <div className="w-full flex items-center justify-between h-6 mb-4">
        <p className="flex text-gray-500">
          Update: {formatDateTime(assignmentData[0]?.fetchedAt) ?? 'now'}
        </p>
        <button
          className="text-blue-500 hover:underline text-base"
          onClick={() => {
            assignmentRefetch();
          }}
        >
          <LuRefreshCcw className="w-4 h-4" />
        </button>
      </div>
      <AssignmentList courses={assignmentData} />
    </div>
  );
}
