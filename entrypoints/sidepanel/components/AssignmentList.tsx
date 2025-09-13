import { CourseAssignmentData } from '@/side-panel/types/courseAssignmentData';
import { getDday } from '@/side-panel/libs/getDday';
import CourseItem from '@/side-panel/components/common/CourseItem';
import { IoDocumentTextOutline } from 'react-icons/io5';

function parseDatetime(datetimeStr: string | null): string | null {
  if (!datetimeStr || datetimeStr === '-') return null;
  const isoLikeStr = datetimeStr.replace(/\//g, '-').replace(' ', 'T');
  const date = new Date(isoLikeStr);

  return isNaN(date.getTime()) ? null : date.toISOString();
}

export default function AssignmentList({
  courses,
  maxShow = 0,
}: {
  courses: CourseAssignmentData[];
  maxShow?: number;
}) {
  const coursesWithAssignments = courses
    .flatMap(c =>
      (c.assignments ?? []).map(assignment => ({
        ...assignment,
        courseTitle: c.courseTitle,
      })),
    )
    .filter(assignment => getDday(parseDatetime(assignment.due) ?? '') >= 0)
    .sort((a, b) => getDday(parseDatetime(a.due) ?? '') - getDday(parseDatetime(b.due) ?? ''));

  // 과제 목록을 최대 maxShow개만 보여줌
  if (maxShow > 0) {
    coursesWithAssignments.splice(maxShow);
  }

  console.log('과제 목록:', coursesWithAssignments);
  console.log(courses);

  if (coursesWithAssignments.length === 0)
    return <div className="text-sm text-gray-400">남은 과제가 없습니다 🎉</div>;

  return (
    <div className="w-full">
      <ul className="space-y-3 w-full">
        {coursesWithAssignments.map(a => (
          <CourseItem
            key={`${a.courseTitle}-${a.title}`}
            icon={
              <IoDocumentTextOutline className="text-2xl text-white p-1.5 pl-2 bg-[#8d8884] rounded-full w-12 h-12" />
            }
            title={a.title}
            courseTitle={a.courseTitle}
            due={parseDatetime(a.due) ?? ''}
            completed={a.status === '제출 완료'}
            onClick={() => {
              if (a.url) window.open(a.url, '_blank');
              else alert('아직 과제 정보가 제공되지 않았습니다.');
            }}
          />
        ))}
      </ul>
    </div>
  );
}
