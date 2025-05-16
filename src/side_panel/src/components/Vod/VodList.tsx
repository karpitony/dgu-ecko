import { CourseVodData} from '@/types/courseVodData';
import { getDday } from '@/libs/getDday';
import VodItem from './VodItem';

export default function CourseList({
  courses,
  maxShow = 0
}: {
  courses: CourseVodData[];
  maxShow?: number;
}) {
  const vods = courses
    .flatMap((c) =>
      c.lectures.map((lec) => ({
        ...lec,
        courseTitle: c.courseTitle,
      })),
    )
    .filter((v) => getDday(v.period.end) >= 0)
    .sort((a, b) => getDday(a.period.end) - getDday(b.period.end));
  
  if (maxShow > 0) {
    vods.splice(maxShow);
  }

  if (vods.length === 0)
    return (
      <div className="text-sm text-gray-400">
        남은 VOD(사이버강의)가 없습니다 🎉
      </div>
    );

  return (
    <ul className="space-y-3 w-full">
      {vods.map((vod) => (
        <VodItem key={vod.vodId ?? `${vod.courseTitle}-${vod.week}`} vod={vod} />
      ))}
    </ul>
  );
}

