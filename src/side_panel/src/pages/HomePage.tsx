import { useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  professor: string;
}

export default function HomePage() {
  const getCourseIds = async () => {
    chrome.runtime.sendMessage({ type: 'REQUEST_COURSE_IDS' }, (response) => {
      if (response?.courseIds) {
        response.courseIds.forEach((course: Course) => {
          console.log(`${course.title} (${course.id}) - 교수: ${course.professor}`);
        });
      } else {
        console.warn('과목 데이터를 받아오지 못했습니다.');
      }
    });
  };

  useEffect(() => {
    getCourseIds();
  }, []);

  return (
    <div className="font-bold text-2xl text-center p-4">
      Welcome to the Side Panel!
    </div>
  );
}
