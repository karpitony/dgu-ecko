import type { Assignment } from '@/types/courseAssignmentData';
import { getDday } from '@/libs/getDday';
import cn from '@yeahx4/cn';
import { IoBookOutline } from 'react-icons/io5';

interface AssignmentItemProps {
  assignment: Assignment & { courseTitle: string; professor: string };
}

export default function AssignmentItem({ assignment }: AssignmentItemProps) {
  const dday = getDday(assignment.due ?? '');
  const endDate = new Date(assignment.due ?? '');
  const completed = assignment.status === '제출 완료';
  // 색상 규칙
  const badgeColor =
    dday < 0
      ? 'bg-slate-500'
      : dday <= 3
      ? 'bg-red-500'
      : dday <= 5
      ? 'bg-orange-500'
      : 'bg-slate-500';

  const ddayLabel =
    dday > 0 ? `D‑${dday}` : dday === 0 ? 'D‑day' : `마감+${Math.abs(dday)}`;

  // 완료된 과제는 옅은 회색, 미완료는 흰색 배경
  const rowStyle = completed
    ? 'bg-slate-100 text-slate-400 line-through'
    : 'bg-white hover:bg-slate-100';

  // 클릭 시 과제 링크 또는 세부사항 페이지로 이동
  const handleClick = () => {
    if (assignment.url) window.open(assignment.url, '_blank');
    alert('아직 과제 정보가 제공되지 않았습니다.');
  };

  return (
    <li
      onClick={handleClick}
      className={cn(
        'p-4 rounded-xl border grid grid-cols-4 gap-4 items-center w-full cursor-pointer transition',
        rowStyle
      )}
    >
      {/* 아이콘 - 1칸 */}
      <div className="col-span-1 flex items-center justify-center w-full">
        <IoBookOutline className="flex text-2xl text-white p-1.5 pl-2 bg-[#8d8884] rounded-full w-14 h-14" />
      </div>

      {/* 텍스트 정보 - 3칸 */}
      <div className="col-span-3 flex flex-col items-start justify-between w-full space-y-1 py-2">
        <div className="flex items-center space-x-2">
          <span className={`${badgeColor} text-white text-sm px-2 py-0.5 rounded-lg`}>
            {ddayLabel}
          </span>
          <div className="font-semibold text-lg">{assignment.title}</div>
        </div>
        <div className="text text-gray-500">
          {assignment.courseTitle} · {assignment.professor}
        </div>
        <div className="text text-gray-500">
          {endDate.toLocaleDateString()} 까지
        </div>
      </div>
    </li>
  );
}
