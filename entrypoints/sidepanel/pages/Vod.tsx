import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCourseVod } from '@sidepanel/hooks/useCourseVod';
import CourseVodList from '@sidepanel/components/VodList';
import { LuRefreshCcw } from 'react-icons/lu';
import { formatDateTime } from '@/libs/formatDateTime';

export default function Vod() {
  const { courses: vodData, loading: vodLoading, refetch: vodRefetch } = useCourseVod();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!vodLoading) {
      setIsDataLoaded(true);
    }
  }, [vodLoading]);

  if (!isDataLoaded) {
    return <div className="p-4 text-center text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="p-4 w-full h-screen overflow-y-auto flex flex-col items-start">
      <div className="w-full flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">남은 VOD</h2>
        <Link to="/index.html" className="text-blue-400 hover:underline text-base pr-1">
          홈으로 이동
        </Link>
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
      <CourseVodList courses={vodData} />
    </div>
  );
}
