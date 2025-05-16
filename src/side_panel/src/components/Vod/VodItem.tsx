import type { VodLecture } from '@/types/courseVodData';
import { getDday } from '@/libs/getDday';
import cn from '@yeahx4/cn';
import { IoPlayOutline } from "react-icons/io5";

interface VodItemProps {
  vod: VodLecture & { courseTitle: string; };
}

export default function VodItem({ vod }: VodItemProps) {
  const dday = getDday(vod.period.end);
  // const startDate = new Date(vod.period.start);
  const endDate = new Date(vod.period.end);

  // 색상 규칙
  const badgeColor =
    vod.completed
    ? 'bg-green-500'
    : dday < 0
      ? 'bg-slate-500'
      : dday <= 3
        ? 'bg-red-500'
        : dday <= 5
          ? 'bg-orange-500'
          : 'bg-slate-500';

  const ddayLabel =
    dday > 0 ? `D‑${dday}` : dday === 0 ? 'D‑day' : `마감+${Math.abs(dday)}`;

  // 완료된 VOD 는 옅은 회색, 미완료는 흰색 배경
  const rowStyle = vod.completed
    ? 'bg-slate-100 text-slate-400 line-through'
    : 'bg-white hover:bg-slate-100';

  // 클릭 시 viewerUrl 새 탭
  const handleClick = () => {
    if (vod.viewerUrl) window.open(vod.viewerUrl, '_blank');
    else if (vod.viewUrl) window.open(vod.viewUrl, '_blank');
    else alert('아직 수업이 시작되지 않았거나, 강의 시청 URL이 제공되지 않았습니다.');
  };

  return (
    <li
      onClick={handleClick}
      className={cn(
        "p-2 rounded-xl border grid grid-cols-4 gap-2 items-center w-full cursor-pointer transition", 
        rowStyle
      )}
    >
      {/* 아이콘 - 1칸 */}
      <div className="col-span-1 flex items-center justify-center w-full">
        <IoPlayOutline className="flex text-2xl text-white p-1.5 pl-2 bg-[#8d8884] rounded-full w-12 h-12" />
      </div>

      {/* 텍스트 정보 - 3칸 */}
      <div className="col-span-3 flex flex-col items-start justify-between w-full space-y-1 py-2">
        <div className="text-sm text-gray-500">
          <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-lg mr-2`}>
            {ddayLabel}
          </span>
          {vod.courseTitle.split('-')[0]}
        </div>
        <h2 className="font-semibold text-base">{vod.title}</h2>
        <div className="text-xs text-gray-500">
          {endDate.toLocaleDateString()} 까지
        </div>
      </div>
    </li>
  );
}
