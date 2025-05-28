import { getDday } from "@/side-panel/libs/getDday";
import cn from "@yeahx4/cn";

interface CourseItemCardProps {
  icon: React.ReactNode;
  title: string;
  courseTitle: string;
  due: string;
  completed: boolean;
  onClick?: () => void;
}

export default function CourseItem({
  icon,
  title,
  courseTitle,
  due,
  completed,
  onClick,
}: CourseItemCardProps) {
  const dday = getDday(due);
  const endDate = new Date(due);
  const formattedDue = endDate.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const badgeColor = completed
    ? 'bg-green-500'
    : dday < 0
    ? 'bg-slate-500'
    : dday <= 1
    ? 'bg-red-500'
    : dday <= 3
    ? 'bg-orange-500'
    : dday <= 5
    ? 'bg-yellow-500'
    : 'bg-slate-500';

  const ddayLabel =
    dday > 0 ? `D‑${dday}` : dday === 0 ? 'D‑day' : `마감+${Math.abs(dday)}`;

  const rowStyle = completed
    ? 'bg-slate-100 text-slate-400 line-through'
    : 'bg-white hover:bg-slate-100';

  return (
    <li
      onClick={onClick}
      className={cn(
        'p-2 rounded-xl border grid grid-cols-4 gap-2 items-center w-full cursor-pointer transition',
        rowStyle
      )}
    >
      <div className="col-span-1 flex items-center justify-center w-full">
        {icon}
      </div>

      <div className="col-span-3 flex flex-col items-start justify-between w-full space-y-1 py-2">
        <div className="text-sm text-gray-500">
          <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-lg mr-2 font-semibold`}>
            {ddayLabel}
          </span>
          {courseTitle.split('-')[0]}
        </div>
        <h2 className="font-semibold text-base">{title}</h2>
        <div className="text-xs text-gray-500">
          {formattedDue} 까지
        </div>
      </div>
    </li>
  );
}
