import type { CourseWithAssignment } from '@/hooks/useCourseAssignment';
import { getDday } from '@/libs/getDday';
import AssignmentItem from './AssignmentItem';

export default function AssignmentList({ courses }: { courses: CourseWithAssignment[] }) {
  const coursesWithAssignments = courses
    .flatMap((c) =>
      c.assignments.map((assignment) => ({
        ...assignment,
        courseTitle: c.title,
        professor: c.professor,
      })),
    )
    .filter((assignment) => getDday(assignment.due ?? '') >= 0)
    .sort((a, b) => getDday(a.due ?? '') - getDday(b.due ?? ''));

  if (coursesWithAssignments.length === 0)
    return (
      <div className="text-sm text-gray-400">
        남은 과제가 없습니다 🎉
      </div>
    );

  return (
    <ul className="space-y-3 w-full">
      {coursesWithAssignments.map((assignment) => (
        <AssignmentItem key={`${assignment.courseTitle}-${assignment.title}`} assignment={assignment} />
      ))}
    </ul>
  );
}
