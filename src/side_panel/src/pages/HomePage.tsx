import CourseVodList from '@/components/Vod/VodList';
import { useCourseVod } from '@/hooks/useCourseVod';

export default function HomePage() {
  const { courses, loading } = useCourseVod();

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <div className="p-4">
      <CourseVodList courses={courses} />
    </div>
  );
}
