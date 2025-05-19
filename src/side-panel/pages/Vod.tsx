import { useState, useEffect } from 'react';
import { useCourseVod } from '@/side-panel/hooks/useCourseVod';
import CourseVodList from '@/side-panel/components/VodList';

export default function Vod() {
  const { courses: vodData, loading: vodLoading } = useCourseVod();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!vodLoading) {
      setIsDataLoaded(true);
    }
  }, [vodLoading]);

  if (!isDataLoaded) {
    return (
      <div className="p-4 text-center text-gray-500">불러오는 중...</div>
    );
  }
  
  return (
    <div className="p-4 w-full h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mt-8 mb-4">남은 VOD</h2>
      <CourseVodList courses={vodData} />
    </div>
  );
}

