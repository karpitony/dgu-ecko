import type { VodLecture } from '@/types/courseVodData';
import { getDday } from '@/libs/getDday';
import cn from '@yeahx4/cn';

interface VodItemProps {
  vod: VodLecture & { courseTitle: string; professor: string };
}

export default function VodItem({ vod }: VodItemProps) {
  const dday = getDday(vod.period.end);

  // 색상 규칙
  const badgeColor =
    dday === 0
      ? 'bg-red-500'
      : dday <= 3
      ? 'bg-orange-500'
      : 'bg-slate-500';

  const ddayLabel =
    dday > 0 ? `D‑${dday}` : dday === 0 ? 'D‑day' : `마감+${Math.abs(dday)}`;

  // 완료된 VOD 는 옅은 회색, 미완료는 흰색 배경
  const rowStyle = vod.completed
    ? 'bg-slate-100 text-slate-400 line-through'
    : 'bg-white hover:bg-slate-50';

  // 클릭 시 viewerUrl 새 탭
  const handleClick = () => {
    if (vod.viewerUrl) window.open(vod.viewerUrl, '_blank');
  };

  return (
    <li
      onClick={handleClick}
      className={cn(
        "*:cursor-pointer p-4 rounded-xl border flex justify-between items-center", 
        rowStyle, "transition"
      )}
    >
      {/* 왼쪽 정보 */}
      <div>
        <div className="font-semibold">{vod.title}</div>
        <div className="text-xs text-gray-500">
          {vod.courseTitle} · {vod.week}
        </div>
      </div>

      {/* 오른쪽 상태 영역 */}
      <div className="flex items-center space-x-2">
        {/* D‑day 배지 */}
        {!vod.completed && (
          <span
            className={`${badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full`}
          >
            {ddayLabel}
          </span>
        )}

        {/* 완료/미완료 아이콘 */}
        {vod.completed ? (
          <span className="text-green-600 text-xs">✔</span>
        ) : (
          <span className="text-red-500 text-xs">❗</span>
        )}
      </div>
    </li>
  );
}
