import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCourseVod } from '@/side-panel/hooks/useCourseVod';
import { useCourseAssignments } from '@/side-panel/hooks/useCourseAssignment';
import CourseVodList from '@/side-panel/components/VodList';
import AssignmentList from '@/side-panel/components/AssignmentList';
import { LuRefreshCcw } from 'react-icons/lu';
import { formatDateTime } from '@/side-panel/libs/formatDateTime';

export default function HomePage() {
  const navigate = useNavigate();
  const { courses: vodData, loading: vodLoading, refetch: vodRefetch } = useCourseVod();
  const {
    courses: assignmentData,
    loading: assignmentLoading,
    refetch: assignmentRefetch,
  } = useCourseAssignments();

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!vodLoading && !assignmentLoading) {
      setIsDataLoaded(true);
    }
  }, [vodLoading, assignmentLoading]);

  if (!isDataLoaded) {
    return <div className="p-4 text-center text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="p-4 w-full h-screen overflow-y-auto">
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-xl font-bold">남은 과제</h2>
        <button
          className="text-blue-500 hover:underline text-base"
          onClick={() => navigate('/assignment')}
        >
          전체 과제 보기
        </button>
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
      <AssignmentList courses={assignmentData} maxShow={4} />

      <div className="flex flex-row justify-between items-center mt-8 mb-2">
        <h2 className="text-xl font-bold">남은 VOD</h2>
        <button
          className="text-blue-500 hover:underline text-base"
          onClick={() => navigate('/vod')}
        >
          전체 VOD 보기
        </button>
      </div>
      <div className="w-full flex items-center justify-between mb-4">
        <p className="flex text-gray-500">
          Update: {formatDateTime(vodData[0]?.fetchedAt) ?? 'now'}
        </p>
        <button
          className="text-blue-500 hover:underline text-base"
          onClick={() => {
            vodRefetch();
          }}
        >
          <LuRefreshCcw className="w-4 h-4" />
        </button>
      </div>
      <CourseVodList courses={vodData} maxShow={4} />
    </div>
  );
}
