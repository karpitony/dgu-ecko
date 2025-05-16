import { CourseAssignmentData } from '@/types/courseAssignmentData';
import { getDday } from '@/libs/getDday';
import AssignmentItem from './AssignmentItem';

export default function AssignmentList({ 
  courses,
  maxShow = 0
}: {
  courses: CourseAssignmentData[];
  maxShow?: number
}) {
  const coursesWithAssignments = courses
    .flatMap((c) =>
      (c.assignments ?? []).map((assignment) => ({
        ...assignment,
        courseTitle: c.courseTitle,
      })),
    )
    .filter((assignment) => getDday(assignment.due ?? '') >= 0)
    .sort((a, b) => getDday(a.due ?? '') - getDday(b.due ?? ''));

  // 과제 목록을 최대 maxShow개만 보여줌
  if (maxShow > 0) {
    coursesWithAssignments.splice(maxShow);
  }
  
  console.log('과제 목록:', coursesWithAssignments);
  console.log(courses);

  if (coursesWithAssignments.length === 0)
    return (
      <div className="text-sm text-gray-400">
        남은 과제가 없습니다 🎉
      </div>
    );

  return (
    <div className='w-full'>
      <ul className="space-y-3 w-full">
        {coursesWithAssignments.map((assignment) => (
          <AssignmentItem 
            key={`${assignment.courseTitle}-${assignment.title}`}
            assignment={assignment}
          />
        ))}
      </ul>
    </div>
  );
}
